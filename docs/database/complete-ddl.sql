-- SplitShifts Database DDL with PostgreSQL Advanced Features
-- This file contains the complete database schema with RLS, constraints, and indexes

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE shift_status AS ENUM ('draft', 'published', 'cancelled');
CREATE TYPE assignment_status AS ENUM ('pending', 'accepted', 'declined', 'cancelled');
CREATE TYPE time_off_type AS ENUM ('vacation', 'sick', 'personal', 'emergency');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'denied', 'cancelled');
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'failed');
CREATE TYPE audit_operation AS ENUM ('INSERT', 'UPDATE', 'DELETE');

-- ============================================================================
-- CORE BUSINESS TABLES
-- ============================================================================

-- Organizations (Multi-tenant root)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    week_start_day VARCHAR(10) NOT NULL DEFAULT 'monday',
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT unique_org_name UNIQUE (name) WHERE deleted_at IS NULL
);

-- Users (Authentication layer - remains global for SSO potential)
-- Note: Keeping existing serial PKs for backward compatibility
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT true,
    two_fa_secret TEXT,
    two_fa_enabled BOOLEAN NOT NULL DEFAULT false,
    last_login TIMESTAMPTZ,
    email_verified BOOLEAN NOT NULL DEFAULT false,
    email_verified_at TIMESTAMPTZ
);

-- Organization Users (Links users to organizations with roles)
CREATE TABLE organization_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    is_active BOOLEAN NOT NULL DEFAULT true,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auth token tables (keeping existing structure)
CREATE TABLE email_verification_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    token_expiration TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    token TEXT,
    token_expiration TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Employees (Business layer)
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    hire_date DATE,
    termination_date DATE,
    emergency_contact JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Work Sites
CREATE TABLE work_sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    timezone VARCHAR(50) NOT NULL DEFAULT 'America/New_York',
    contact_info JSONB,
    is_24_7 BOOLEAN NOT NULL DEFAULT false,
    access_instructions JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT unique_site_name_per_org UNIQUE (org_id, name) WHERE deleted_at IS NULL
);

-- Roles
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    hourly_rate NUMERIC(10,2),
    requirements JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT unique_role_name_per_org UNIQUE (org_id, name) WHERE deleted_at IS NULL
);

-- ============================================================================
-- SCHEDULING TABLES
-- ============================================================================

-- Shift Groups (for modeling split shifts)
CREATE TABLE shift_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    shift_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Shifts
CREATE TABLE shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    work_site_id UUID NOT NULL REFERENCES work_sites(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    shift_group_id UUID REFERENCES shift_groups(id) ON DELETE SET NULL,
    shift_start TIMESTAMPTZ NOT NULL,
    shift_end TIMESTAMPTZ NOT NULL,
    hourly_rate NUMERIC(10,2),
    notes TEXT,
    status shift_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    -- Generated column for shift duration
    shift_duration_hours NUMERIC GENERATED ALWAYS AS (
        EXTRACT(epoch FROM shift_end - shift_start) / 3600
    ) STORED,
    
    -- Constraint to ensure shift end is after start
    CONSTRAINT valid_shift_times CHECK (shift_end > shift_start),
    
    -- Constraint to prevent shifts longer than 24 hours
    CONSTRAINT reasonable_shift_duration CHECK (
        EXTRACT(epoch FROM shift_end - shift_start) <= 86400 -- 24 hours
    )
);

-- Shift Assignments
CREATE TABLE shift_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    shift_id UUID NOT NULL UNIQUE REFERENCES shifts(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    status assignment_status NOT NULL DEFAULT 'pending',
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    responded_at TIMESTAMPTZ,
    response_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Exclusion constraint to prevent overlapping assignments per employee
    EXCLUDE USING gist (
        employee_id WITH =,
        tstzrange(
            (SELECT shift_start FROM shifts WHERE shifts.id = shift_id),
            (SELECT shift_end FROM shifts WHERE shifts.id = shift_id)
        ) WITH &&
    ) WHERE (
        status IN ('accepted', 'pending') AND
        EXISTS (SELECT 1 FROM shifts WHERE shifts.id = shift_id AND shifts.deleted_at IS NULL)
    )
);

-- ============================================================================
-- EMPLOYEE SUPPORT TABLES
-- ============================================================================

-- Certifications
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    validity_months INTEGER NOT NULL DEFAULT 12,
    is_required BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT unique_cert_name_per_org UNIQUE (org_id, name) WHERE deleted_at IS NULL
);

-- Employee Certifications
CREATE TABLE employee_certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    certification_id UUID NOT NULL REFERENCES certifications(id) ON DELETE CASCADE,
    certificate_number VARCHAR(255),
    issued_date DATE NOT NULL,
    expires_date DATE NOT NULL,
    issuing_authority VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT valid_cert_dates CHECK (expires_date > issued_date)
);

-- Employee Skills (roles they can perform)
CREATE TABLE employee_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    qualified_since DATE NOT NULL,
    expires_on DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT unique_employee_role UNIQUE (employee_id, role_id) WHERE deleted_at IS NULL
);

-- Employee Availability
CREATE TABLE employee_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    day_of_week day_of_week NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    effective_from DATE NOT NULL,
    effective_until DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT valid_availability_times CHECK (end_time > start_time)
);

-- Time Off Requests
CREATE TABLE time_off_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    request_type time_off_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status request_status NOT NULL DEFAULT 'pending',
    approved_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    approval_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT valid_time_off_dates CHECK (end_date >= start_date)
);

-- ============================================================================
-- SYSTEM TABLES
-- ============================================================================

-- Holiday Calendars
CREATE TABLE holiday_calendars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    holiday_date DATE NOT NULL,
    is_recurring BOOLEAN NOT NULL DEFAULT false,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Notifications Outbox
CREATE TABLE notifications_outbox (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    status notification_status NOT NULL DEFAULT 'pending',
    scheduled_for TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    retry_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit Log
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    table_name VARCHAR(100) NOT NULL,
    operation audit_operation NOT NULL,
    record_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Sessions (optional beyond NextAuth)
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL UNIQUE,
    refresh_token TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all multi-tenant tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_off_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE holiday_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Create a function to get current organization ID from session
CREATE OR REPLACE FUNCTION current_org_id() RETURNS UUID AS $$
BEGIN
    RETURN COALESCE(
        current_setting('app.current_org_id', true)::UUID,
        '00000000-0000-0000-0000-000000000000'::UUID
    );
END;
$$ LANGUAGE plpgsql STABLE;

-- Example RLS policies (organization isolation)
CREATE POLICY org_isolation ON organizations
    FOR ALL TO authenticated
    USING (id = current_org_id());

CREATE POLICY org_isolation ON organization_users
    FOR ALL TO authenticated
    USING (org_id = current_org_id());

CREATE POLICY org_isolation ON employees
    FOR ALL TO authenticated
    USING (org_id = current_org_id());

CREATE POLICY org_isolation ON work_sites
    FOR ALL TO authenticated
    USING (org_id = current_org_id());

CREATE POLICY org_isolation ON roles
    FOR ALL TO authenticated
    USING (org_id = current_org_id());

CREATE POLICY org_isolation ON shifts
    FOR ALL TO authenticated
    USING (org_id = current_org_id());

CREATE POLICY org_isolation ON shift_assignments
    FOR ALL TO authenticated
    USING (org_id = current_org_id());

-- Additional policies for other tables follow the same pattern...

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Composite indexes for multi-tenant queries
CREATE INDEX idx_employees_org_id ON employees(org_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_org_user ON employees(org_id, user_id) WHERE deleted_at IS NULL;

CREATE INDEX idx_organization_users_org_id ON organization_users(org_id);
CREATE INDEX idx_organization_users_user_id ON organization_users(user_id);
CREATE INDEX idx_organization_users_org_user ON organization_users(org_id, user_id);

CREATE INDEX idx_work_sites_org_id ON work_sites(org_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_roles_org_id ON roles(org_id) WHERE deleted_at IS NULL;

CREATE INDEX idx_shifts_org_site_date ON shifts(org_id, work_site_id, shift_start) WHERE deleted_at IS NULL;
CREATE INDEX idx_shifts_org_role_date ON shifts(org_id, role_id, shift_start) WHERE deleted_at IS NULL;

-- GiST index for shift time range queries
CREATE INDEX idx_shifts_time_range ON shifts USING gist(
    org_id,
    tstzrange(shift_start, shift_end)
) WHERE deleted_at IS NULL;

-- Indexes for shift assignments and overlaps
CREATE INDEX idx_shift_assignments_employee ON shift_assignments(employee_id, assigned_at);
CREATE INDEX idx_shift_assignments_org ON shift_assignments(org_id);

-- Indexes for certifications and expiry tracking
CREATE INDEX idx_employee_certs_expiry ON employee_certifications(expires_date, org_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_employee_certs_employee ON employee_certifications(employee_id) WHERE deleted_at IS NULL;

-- Indexes for availability queries
CREATE INDEX idx_employee_availability_org_employee ON employee_availability(org_id, employee_id) WHERE deleted_at IS NULL;

-- Indexes for audit and notifications
CREATE INDEX idx_audit_log_org_table ON audit_log(org_id, table_name, created_at);
CREATE INDEX idx_notifications_status_scheduled ON notifications_outbox(status, scheduled_for) WHERE status = 'pending';

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT MAINTENANCE
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at columns
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_sites_updated_at
    BEFORE UPDATE ON work_sites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_roles_updated_at
    BEFORE UPDATE ON roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shift_groups_updated_at
    BEFORE UPDATE ON shift_groups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shifts_updated_at
    BEFORE UPDATE ON shifts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shift_assignments_updated_at
    BEFORE UPDATE ON shift_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Continue for other tables...

-- ============================================================================
-- MATERIALIZED VIEWS FOR PERFORMANCE
-- ============================================================================

-- Weekly hours rollup per employee
CREATE MATERIALIZED VIEW employee_weekly_hours AS
SELECT 
    e.org_id,
    e.id as employee_id,
    e.first_name,
    e.last_name,
    DATE_TRUNC('week', s.shift_start) as week_start,
    SUM(s.shift_duration_hours) as total_hours,
    COUNT(sa.id) as shifts_worked
FROM employees e
JOIN shift_assignments sa ON sa.employee_id = e.id
JOIN shifts s ON s.id = sa.shift_id
WHERE sa.status = 'accepted'
    AND s.deleted_at IS NULL
    AND e.deleted_at IS NULL
GROUP BY e.org_id, e.id, e.first_name, e.last_name, DATE_TRUNC('week', s.shift_start);

CREATE UNIQUE INDEX idx_employee_weekly_hours_unique 
    ON employee_weekly_hours(org_id, employee_id, week_start);

-- Coverage analysis view
CREATE MATERIALIZED VIEW site_coverage_analysis AS
WITH required_coverage AS (
    SELECT 
        ws.org_id,
        ws.id as work_site_id,
        ws.name as site_name,
        r.id as role_id,
        r.name as role_name,
        generate_series(
            DATE_TRUNC('hour', NOW()),
            DATE_TRUNC('hour', NOW() + INTERVAL '7 days'),
            INTERVAL '1 hour'
        ) as hour_start
    FROM work_sites ws
    CROSS JOIN roles r
    WHERE ws.deleted_at IS NULL 
        AND r.deleted_at IS NULL
        AND ws.org_id = r.org_id
),
actual_coverage AS (
    SELECT 
        s.org_id,
        s.work_site_id,
        s.role_id,
        DATE_TRUNC('hour', s.shift_start) as hour_start,
        COUNT(sa.id) as assigned_count
    FROM shifts s
    LEFT JOIN shift_assignments sa ON sa.shift_id = s.id AND sa.status = 'accepted'
    WHERE s.deleted_at IS NULL
        AND s.shift_start >= DATE_TRUNC('hour', NOW())
        AND s.shift_start < DATE_TRUNC('hour', NOW() + INTERVAL '7 days')
    GROUP BY s.org_id, s.work_site_id, s.role_id, DATE_TRUNC('hour', s.shift_start)
)
SELECT 
    rc.org_id,
    rc.work_site_id,
    rc.site_name,
    rc.role_id,
    rc.role_name,
    rc.hour_start,
    COALESCE(ac.assigned_count, 0) as assigned_count
FROM required_coverage rc
LEFT JOIN actual_coverage ac ON (
    ac.org_id = rc.org_id AND
    ac.work_site_id = rc.work_site_id AND 
    ac.role_id = rc.role_id AND
    ac.hour_start = rc.hour_start
);

CREATE INDEX idx_site_coverage_analysis_org_site 
    ON site_coverage_analysis(org_id, work_site_id, hour_start);

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE organizations IS 'Multi-tenant root entity for security companies';
COMMENT ON TABLE employees IS 'Workers who can be scheduled (may or may not have user accounts)';
COMMENT ON TABLE shifts IS 'Individual work periods with start/end times, supports split shifts via shift_group_id';
COMMENT ON TABLE shift_assignments IS 'Links employees to shifts with acceptance/decline status';
COMMENT ON CONSTRAINT shift_assignments_employee_id_tstzrange_excl ON shift_assignments IS 'Prevents overlapping shift assignments per employee using PostgreSQL exclusion constraints';

COMMENT ON COLUMN shifts.shift_duration_hours IS 'Generated column calculating shift duration in hours';
COMMENT ON COLUMN work_sites.timezone IS 'Timezone for this site (e.g. America/New_York) for proper local time handling';
COMMENT ON COLUMN organizations.settings IS 'JSON settings including dashboard tint, pay periods, etc.';

-- ============================================================================
-- SEED DATA FUNCTIONS
-- ============================================================================

-- Function to create demo organization with basic setup
CREATE OR REPLACE FUNCTION create_demo_organization(
    org_name TEXT,
    admin_email TEXT,
    admin_password TEXT
) RETURNS UUID AS $$
DECLARE
    org_id UUID;
    user_id INTEGER;
    role_guard_id UUID;
    role_supervisor_id UUID;
    site_id UUID;
BEGIN
    -- Create organization
    INSERT INTO organizations (name, description, settings) 
    VALUES (
        org_name,
        'Demo security company for testing',
        '{"dashboardTint": "blue", "payPeriodType": "bi-weekly"}'
    ) RETURNING id INTO org_id;
    
    -- Create admin user
    INSERT INTO users (first_name, last_name, email, password, email_verified)
    VALUES ('Admin', 'User', admin_email, admin_password, true)
    RETURNING id INTO user_id;
    
    -- Create basic roles
    INSERT INTO roles (org_id, name, description, hourly_rate)
    VALUES 
        (org_id, 'Security Guard', 'Basic security patrol and monitoring', 18.00),
        (org_id, 'Supervisor', 'Site supervisor and team lead', 25.00)
    RETURNING id INTO role_guard_id;
    
    SELECT id INTO role_supervisor_id FROM roles 
    WHERE org_id = org_id AND name = 'Supervisor';
    
    -- Create demo work site
    INSERT INTO work_sites (org_id, name, address, timezone, is_24_7)
    VALUES (
        org_id,
        'Downtown Office Complex',
        '123 Business Ave, City, State 12345',
        'America/New_York',
        true
    ) RETURNING id INTO site_id;
    
    -- Create admin employee record
    INSERT INTO employees (org_id, user_id, first_name, last_name, email, hire_date)
    VALUES (org_id, user_id, 'Admin', 'User', admin_email, CURRENT_DATE);
    
    RETURN org_id;
END;
$$ LANGUAGE plpgsql;
