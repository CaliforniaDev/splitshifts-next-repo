# SplitShifts Database Migration Plan

## Overview
This document outlines the step-by-step migration plan to transform the current authentication-only database into a full-featured multi-tenant scheduling system.

## Current State Analysis

### Existing Tables
- ✅ `users` - Authentication users (keeping as-is for backward compatibility)
- ✅ `email_verification_tokens` - Email verification (keeping structure)
- ✅ `password_reset_tokens` - Password reset flow (adding missing `created_at`)

### Migration Strategy
- **Additive approach**: Add new tables without breaking existing auth functionality
- **Backward compatibility**: Keep existing serial PKs for auth tables
- **Multi-tenancy**: Add `org_id` to all new business tables

## Migration Steps

### Phase 1: Core Infrastructure (Week 1)

#### Step 1.1: Database Extensions and Functions
```sql
-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Create helper functions for RLS
CREATE OR REPLACE FUNCTION current_org_id() RETURNS UUID AS $$
BEGIN
    RETURN COALESCE(
        current_setting('app.current_org_id', true)::UUID,
        '00000000-0000-0000-0000-000000000000'::UUID
    );
END;
$$ LANGUAGE plpgsql STABLE;
```

#### Step 1.2: Enums and Types
```sql
-- Create all enum types first
CREATE TYPE shift_status AS ENUM ('draft', 'published', 'cancelled');
CREATE TYPE assignment_status AS ENUM ('pending', 'accepted', 'declined', 'cancelled');
CREATE TYPE time_off_type AS ENUM ('vacation', 'sick', 'personal', 'emergency');
CREATE TYPE request_status AS ENUM ('pending', 'approved', 'denied', 'cancelled');
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'failed');
CREATE TYPE audit_operation AS ENUM ('INSERT', 'UPDATE', 'DELETE');
```

#### Step 1.3: Fix Existing Auth Tables
```sql
-- Add missing created_at to password_reset_tokens
ALTER TABLE password_reset_tokens 
ADD COLUMN created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
```

### Phase 2: Core Business Tables (Week 1-2)

#### Step 2.1: Organizations (Root Multi-tenant Entity)
```sql
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

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policy
CREATE POLICY org_isolation ON organizations
    FOR ALL TO authenticated
    USING (id = current_org_id());
```

#### Step 2.2: Employees and Work Sites
```sql
-- Create employees table
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

-- Create work_sites table
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

-- Create roles table
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
```

### Phase 3: Scheduling Core (Week 2-3)

#### Step 3.1: Shifts and Groups
```sql
-- Create shift groups for split-shift support
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

-- Create shifts table with constraints
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
    
    -- Generated column for duration
    shift_duration_hours NUMERIC GENERATED ALWAYS AS (
        EXTRACT(epoch FROM shift_end - shift_start) / 3600
    ) STORED,
    
    -- Business logic constraints
    CONSTRAINT valid_shift_times CHECK (shift_end > shift_start),
    CONSTRAINT reasonable_shift_duration CHECK (
        EXTRACT(epoch FROM shift_end - shift_start) <= 86400
    )
);
```

#### Step 3.2: Shift Assignments with Overlap Prevention
```sql
-- Create shift assignments with exclusion constraint
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
    
    -- Critical: Exclusion constraint prevents overlapping assignments
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
```

### Phase 4: Employee Support Tables (Week 3-4)

#### Step 4.1: Certifications and Skills
```sql
-- Certifications management
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

-- Employee certifications tracking
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

-- Employee skills (role qualifications)
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
```

#### Step 4.2: Availability and Time-Off
```sql
-- Employee availability windows
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

-- Time-off requests
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
```

### Phase 5: System Tables (Week 4)

#### Step 5.1: System Support Tables
```sql
-- Holiday calendars
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

-- Notifications outbox
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

-- Audit log
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
```

### Phase 6: Performance and Security (Week 5)

#### Step 6.1: Indexes for Performance
```sql
-- Multi-tenant indexes (org_id first for RLS performance)
CREATE INDEX idx_employees_org_id ON employees(org_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_work_sites_org_id ON work_sites(org_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_roles_org_id ON roles(org_id) WHERE deleted_at IS NULL;

-- Scheduling query indexes
CREATE INDEX idx_shifts_org_site_date ON shifts(org_id, work_site_id, shift_start) WHERE deleted_at IS NULL;
CREATE INDEX idx_shifts_org_role_date ON shifts(org_id, role_id, shift_start) WHERE deleted_at IS NULL;

-- Critical: GiST index for time range queries and overlap detection
CREATE INDEX idx_shifts_time_range ON shifts USING gist(
    org_id,
    tstzrange(shift_start, shift_end)
) WHERE deleted_at IS NULL;

-- Assignment and overlap indexes
CREATE INDEX idx_shift_assignments_employee ON shift_assignments(employee_id, assigned_at);
CREATE INDEX idx_shift_assignments_org ON shift_assignments(org_id);

-- Certification expiry tracking
CREATE INDEX idx_employee_certs_expiry ON employee_certifications(expires_date, org_id) WHERE deleted_at IS NULL;

-- Availability queries
CREATE INDEX idx_employee_availability_org_employee ON employee_availability(org_id, employee_id) WHERE deleted_at IS NULL;

-- System table indexes
CREATE INDEX idx_audit_log_org_table ON audit_log(org_id, table_name, created_at);
CREATE INDEX idx_notifications_status_scheduled ON notifications_outbox(status, scheduled_for) WHERE status = 'pending';
```

#### Step 6.2: Row Level Security Policies
```sql
-- Enable RLS on all business tables
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_assignments ENABLE ROW LEVEL SECURITY;
-- ... (enable for all business tables)

-- Create isolation policies
CREATE POLICY org_isolation ON employees FOR ALL TO authenticated USING (org_id = current_org_id());
CREATE POLICY org_isolation ON work_sites FOR ALL TO authenticated USING (org_id = current_org_id());
CREATE POLICY org_isolation ON roles FOR ALL TO authenticated USING (org_id = current_org_id());
CREATE POLICY org_isolation ON shifts FOR ALL TO authenticated USING (org_id = current_org_id());
CREATE POLICY org_isolation ON shift_assignments FOR ALL TO authenticated USING (org_id = current_org_id());
-- ... (create for all business tables)
```

#### Step 6.3: Triggers for Maintenance
```sql
-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ... (apply to all relevant tables)
```

### Phase 7: Materialized Views and Analytics (Week 6)

#### Step 7.1: Performance Views
```sql
-- Weekly hours materialized view
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
-- [Complex view definition from DDL file]
```

## Data Migration Plan

### Initial Seed Data

#### Create Demo Organization Function
```sql
-- Function to bootstrap a demo organization
CREATE OR REPLACE FUNCTION create_demo_organization(
    org_name TEXT,
    admin_email TEXT,
    admin_password TEXT
) RETURNS UUID AS $$
DECLARE
    org_id UUID;
    user_id INTEGER;
    role_guard_id UUID;
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
        (org_id, 'Supervisor', 'Site supervisor and team lead', 25.00);
    
    -- Create demo work site
    INSERT INTO work_sites (org_id, name, address, timezone, is_24_7)
    VALUES (
        org_id,
        'Downtown Office Complex',
        '123 Business Ave, City, State 12345',
        'America/New_York',
        true
    );
    
    -- Create admin employee record
    INSERT INTO employees (org_id, user_id, first_name, last_name, email, hire_date)
    VALUES (org_id, user_id, 'Admin', 'User', admin_email, CURRENT_DATE);
    
    RETURN org_id;
END;
$$ LANGUAGE plpgsql;
```

### Sample Data for Testing

#### Organizations
```sql
-- Create test organizations
SELECT create_demo_organization('Acme Security', 'admin@acme-security.com', 'hashed_password');
SELECT create_demo_organization('Elite Guard Services', 'admin@elite-guard.com', 'hashed_password');
```

#### Sample Employees per Organization
```sql
-- For each organization, create sample employees
INSERT INTO employees (org_id, first_name, last_name, email, phone, hire_date) VALUES
    ('{org_id}', 'John', 'Smith', 'john.smith@acme-security.com', '555-0101', '2024-01-15'),
    ('{org_id}', 'Sarah', 'Johnson', 'sarah.johnson@acme-security.com', '555-0102', '2024-02-01'),
    ('{org_id}', 'Mike', 'Davis', 'mike.davis@acme-security.com', '555-0103', '2024-02-15'),
    ('{org_id}', 'Lisa', 'Wilson', 'lisa.wilson@acme-security.com', '555-0104', '2024-03-01');
```

#### Sample Certifications
```sql
INSERT INTO certifications (org_id, name, description, validity_months, is_required) VALUES
    ('{org_id}', 'Security Guard License', 'State-required security guard license', 24, true),
    ('{org_id}', 'CPR Certification', 'Current CPR and First Aid certification', 12, true),
    ('{org_id}', 'Firearms Permit', 'Concealed carry permit for armed positions', 12, false),
    ('{org_id}', 'K9 Handler Certification', 'Dog handling and training certification', 36, false);
```

## Rollback Plan

### Rollback Strategy
1. **Phase-by-phase rollback**: Each phase can be rolled back independently
2. **Data preservation**: Auth tables remain untouched during rollback
3. **Dependency awareness**: Drop tables in reverse dependency order

### Rollback Scripts
```sql
-- Emergency rollback - remove all new tables
-- WARNING: This will destroy all business data!

-- Drop materialized views first
DROP MATERIALIZED VIEW IF EXISTS site_coverage_analysis;
DROP MATERIALIZED VIEW IF EXISTS employee_weekly_hours;

-- Drop system tables
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS notifications_outbox CASCADE;
DROP TABLE IF EXISTS holiday_calendars CASCADE;

-- Drop support tables
DROP TABLE IF EXISTS time_off_requests CASCADE;
DROP TABLE IF EXISTS employee_availability CASCADE;
DROP TABLE IF EXISTS employee_skills CASCADE;
DROP TABLE IF EXISTS employee_certifications CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;

-- Drop scheduling tables
DROP TABLE IF EXISTS shift_assignments CASCADE;
DROP TABLE IF EXISTS shifts CASCADE;
DROP TABLE IF EXISTS shift_groups CASCADE;

-- Drop core business tables
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS work_sites CASCADE;
DROP TABLE IF EXISTS employees CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS audit_operation;
DROP TYPE IF EXISTS notification_status;
DROP TYPE IF EXISTS day_of_week;
DROP TYPE IF EXISTS request_status;
DROP TYPE IF EXISTS time_off_type;
DROP TYPE IF EXISTS assignment_status;
DROP TYPE IF EXISTS shift_status;

-- Drop functions
DROP FUNCTION IF EXISTS current_org_id();
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS create_demo_organization(TEXT, TEXT, TEXT);

-- Rollback auth table changes
ALTER TABLE password_reset_tokens DROP COLUMN IF EXISTS created_at;
```

## Testing and Validation

### Testing Checklist
- [ ] All tables created successfully
- [ ] RLS policies working correctly
- [ ] Exclusion constraints prevent overlaps
- [ ] Indexes improve query performance
- [ ] Triggers maintain updated_at fields
- [ ] Materialized views refresh correctly
- [ ] Sample data loads without errors
- [ ] Foreign key constraints enforced
- [ ] Soft delete queries work properly
- [ ] Multi-tenant isolation verified

### Performance Validation
- [ ] Query plans use indexes efficiently
- [ ] RLS overhead is acceptable
- [ ] Materialized view refresh times reasonable
- [ ] Exclusion constraint performance adequate
- [ ] Complex queries complete under 1 second

## Post-Migration Tasks

### Application Updates Required
1. **Authentication middleware**: Set `app.current_org_id` session variable
2. **API endpoints**: Update to use new schema structure
3. **Business logic**: Implement shift assignment workflows
4. **UI components**: Create scheduling interfaces
5. **Background jobs**: Set up materialized view refresh schedule

### Monitoring Setup
1. **Performance monitoring**: Track query performance
2. **RLS policy effectiveness**: Monitor access patterns
3. **Constraint violations**: Alert on overlap attempts
4. **Certification expiry**: Automated reminder system
5. **Data integrity**: Regular consistency checks

### Documentation Updates
1. **API documentation**: Update with new endpoints
2. **Database schema docs**: Maintain ERD and table documentation
3. **Business process docs**: Document scheduling workflows
4. **Troubleshooting guides**: Common issues and solutions
