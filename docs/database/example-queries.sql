-- ============================================================================
-- SPLITSHIFTS EXAMPLE QUERIES
-- ============================================================================

-- Set organization context for RLS (would be done by application)
-- SELECT set_config('app.current_org_id', 'your-org-uuid-here', true);

-- ============================================================================
-- 0. USER-ORGANIZATION RELATIONSHIP QUERIES
-- ============================================================================

-- Find all organizations a user belongs to (for user login/org selection)
SELECT 
    o.id as org_id,
    o.name as org_name,
    ou.role,
    ou.is_active,
    ou.joined_at
FROM organization_users ou
JOIN organizations o ON o.id = ou.org_id
WHERE ou.user_id = 123  -- User's ID from session
    AND ou.is_active = true
    AND o.deleted_at IS NULL
ORDER BY ou.joined_at DESC;

-- Find all admins for an organization (for permission checks)
SELECT 
    u.id as user_id,
    u.first_name,
    u.last_name,
    u.email,
    ou.role,
    ou.joined_at
FROM organization_users ou
JOIN users u ON u.id = ou.user_id
WHERE ou.org_id = current_org_id()
    AND ou.role = 'admin'
    AND ou.is_active = true
    AND u.is_active = true
ORDER BY u.last_name, u.first_name;

-- Check if user has admin access to organization (authorization query)
SELECT EXISTS (
    SELECT 1 
    FROM organization_users ou
    WHERE ou.org_id = current_org_id()
        AND ou.user_id = 123  -- Current user's ID
        AND ou.role = 'admin'
        AND ou.is_active = true
) as has_admin_access;

-- ============================================================================
-- 1. WEEKLY HOURS COMPUTATION PER EMPLOYEE
-- ============================================================================

-- Calculate weekly hours respecting organization's week_start_day
WITH org_settings AS (
    SELECT 
        id as org_id,
        CASE week_start_day
            WHEN 'monday' THEN 1
            WHEN 'tuesday' THEN 2
            WHEN 'wednesday' THEN 3
            WHEN 'thursday' THEN 4
            WHEN 'friday' THEN 5
            WHEN 'saturday' THEN 6
            WHEN 'sunday' THEN 0
        END as week_start_dow
    FROM organizations
    WHERE id = current_org_id()
),
weekly_boundaries AS (
    SELECT 
        org_id,
        week_start_dow,
        -- Calculate week start based on organization's week_start_day
        DATE_TRUNC('week', s.shift_start) + 
        (CASE 
            WHEN EXTRACT(dow FROM DATE_TRUNC('week', s.shift_start))::integer <= week_start_dow 
            THEN (week_start_dow - EXTRACT(dow FROM DATE_TRUNC('week', s.shift_start))::integer) * INTERVAL '1 day'
            ELSE (7 + week_start_dow - EXTRACT(dow FROM DATE_TRUNC('week', s.shift_start))::integer) * INTERVAL '1 day'
        END) as week_start,
        s.id as shift_id,
        s.shift_duration_hours,
        sa.employee_id
    FROM shifts s
    JOIN shift_assignments sa ON sa.shift_id = s.id
    CROSS JOIN org_settings os
    WHERE sa.status = 'accepted'
        AND s.deleted_at IS NULL
        AND s.shift_start >= CURRENT_DATE - INTERVAL '30 days'
)
SELECT 
    e.first_name,
    e.last_name,
    wb.week_start,
    wb.week_start + INTERVAL '6 days' as week_end,
    SUM(wb.shift_duration_hours) as total_hours,
    COUNT(wb.shift_id) as shifts_worked,
    -- Calculate overtime (if > 40 hours)
    GREATEST(SUM(wb.shift_duration_hours) - 40, 0) as overtime_hours
FROM weekly_boundaries wb
JOIN employees e ON e.id = wb.employee_id
GROUP BY e.id, e.first_name, e.last_name, wb.week_start
ORDER BY e.last_name, e.first_name, wb.week_start;

-- ============================================================================
-- 2. COVERAGE GAPS ANALYSIS
-- ============================================================================

-- Find coverage gaps for next 7 days vs site_coverage_rules
WITH time_slots AS (
    -- Generate hourly time slots for next 7 days
    SELECT 
        generate_series(
            DATE_TRUNC('hour', NOW()),
            DATE_TRUNC('hour', NOW() + INTERVAL '7 days'),
            INTERVAL '1 hour'
        ) as slot_start
),
site_requirements AS (
    -- Get coverage requirements for each site/role/time combination
    SELECT 
        ws.id as work_site_id,
        ws.name as site_name,
        r.id as role_id,
        r.name as role_name,
        ts.slot_start,
        -- This would need to be expanded based on actual coverage rules schema
        2 as required_count  -- Simplified - normally from site_coverage_rules
    FROM work_sites ws
    CROSS JOIN roles r
    CROSS JOIN time_slots ts
    WHERE ws.org_id = current_org_id()
        AND r.org_id = current_org_id()
        AND ws.deleted_at IS NULL
        AND r.deleted_at IS NULL
        -- Add time-of-day and day-of-week filtering based on coverage rules
        AND EXTRACT(hour FROM ts.slot_start) BETWEEN 6 AND 22  -- Example: 6 AM to 10 PM
),
actual_coverage AS (
    -- Count actual assignments for each slot
    SELECT 
        s.work_site_id,
        s.role_id,
        DATE_TRUNC('hour', s.shift_start) as slot_start,
        COUNT(sa.id) as assigned_count
    FROM shifts s
    LEFT JOIN shift_assignments sa ON sa.shift_id = s.id AND sa.status IN ('accepted', 'pending')
    WHERE s.org_id = current_org_id()
        AND s.deleted_at IS NULL
        AND s.shift_start >= DATE_TRUNC('hour', NOW())
        AND s.shift_start < DATE_TRUNC('hour', NOW() + INTERVAL '7 days')
    GROUP BY s.work_site_id, s.role_id, DATE_TRUNC('hour', s.shift_start)
)
SELECT 
    sr.site_name,
    sr.role_name,
    sr.slot_start,
    sr.required_count,
    COALESCE(ac.assigned_count, 0) as assigned_count,
    sr.required_count - COALESCE(ac.assigned_count, 0) as coverage_gap
FROM site_requirements sr
LEFT JOIN actual_coverage ac ON (
    ac.work_site_id = sr.work_site_id 
    AND ac.role_id = sr.role_id 
    AND ac.slot_start = sr.slot_start
)
WHERE sr.required_count > COALESCE(ac.assigned_count, 0)  -- Only gaps
ORDER BY sr.slot_start, sr.site_name, sr.role_name;

-- ============================================================================
-- 3. CERTIFICATION EXPIRATION TRACKING
-- ============================================================================

-- Find certifications expiring in next N days (parameterized)
WITH expiring_certs AS (
    SELECT 
        e.first_name,
        e.last_name,
        e.email,
        c.name as certification_name,
        ec.expires_date,
        ec.certificate_number,
        ec.expires_date - CURRENT_DATE as days_until_expiry
    FROM employee_certifications ec
    JOIN employees e ON e.id = ec.employee_id
    JOIN certifications c ON c.id = ec.certification_id
    WHERE ec.org_id = current_org_id()
        AND ec.deleted_at IS NULL
        AND e.deleted_at IS NULL
        AND c.deleted_at IS NULL
        AND ec.expires_date <= CURRENT_DATE + INTERVAL '30 days'  -- Next 30 days
        AND ec.expires_date >= CURRENT_DATE  -- Not already expired
)
SELECT 
    first_name,
    last_name,
    email,
    certification_name,
    expires_date,
    certificate_number,
    days_until_expiry,
    CASE 
        WHEN days_until_expiry <= 7 THEN 'URGENT'
        WHEN days_until_expiry <= 14 THEN 'HIGH'
        WHEN days_until_expiry <= 30 THEN 'MEDIUM'
    END as priority_level
FROM expiring_certs
ORDER BY expires_date, last_name, first_name;

-- ============================================================================
-- 4. EMPLOYEE AVAILABILITY MATCHING
-- ============================================================================

-- Find available employees for a specific shift time
-- Example: Find employees available for a shift on Monday 9 AM - 5 PM
WITH target_shift AS (
    SELECT 
        'monday'::day_of_week as target_day,
        '09:00'::time as shift_start_time,
        '17:00'::time as shift_end_time,
        '123e4567-e89b-12d3-a456-426614174000'::uuid as required_role_id  -- Example role ID
),
available_employees AS (
    SELECT DISTINCT
        e.id,
        e.first_name,
        e.last_name,
        e.email,
        ea.start_time,
        ea.end_time
    FROM employees e
    JOIN employee_availability ea ON ea.employee_id = e.id
    JOIN employee_skills es ON es.employee_id = e.id
    CROSS JOIN target_shift ts
    WHERE e.org_id = current_org_id()
        AND e.deleted_at IS NULL
        AND ea.deleted_at IS NULL
        AND es.deleted_at IS NULL
        AND ea.day_of_week = ts.target_day
        AND ea.start_time <= ts.shift_start_time
        AND ea.end_time >= ts.shift_end_time
        AND es.role_id = ts.required_role_id
        AND (ea.effective_until IS NULL OR ea.effective_until >= CURRENT_DATE)
        AND ea.effective_from <= CURRENT_DATE
),
conflicting_assignments AS (
    -- Check for existing assignments that would conflict
    SELECT DISTINCT sa.employee_id
    FROM shift_assignments sa
    JOIN shifts s ON s.id = sa.shift_id
    WHERE sa.status IN ('accepted', 'pending')
        AND s.deleted_at IS NULL
        -- This would need actual shift date/time parameters
        AND s.shift_start < TIMESTAMP '2024-12-16 17:00:00'  -- Example end time
        AND s.shift_end > TIMESTAMP '2024-12-16 09:00:00'    -- Example start time
)
SELECT 
    ae.id,
    ae.first_name,
    ae.last_name,
    ae.email,
    ae.start_time as available_from,
    ae.end_time as available_until
FROM available_employees ae
LEFT JOIN conflicting_assignments ca ON ca.employee_id = ae.id
WHERE ca.employee_id IS NULL  -- No conflicts
ORDER BY ae.last_name, ae.first_name;

-- ============================================================================
-- 5. SHIFT OVERLAP DETECTION
-- ============================================================================

-- Find potential shift overlaps (useful for debugging assignment issues)
SELECT 
    s1.id as shift1_id,
    s2.id as shift2_id,
    sa1.employee_id,
    e.first_name,
    e.last_name,
    s1.shift_start as shift1_start,
    s1.shift_end as shift1_end,
    s2.shift_start as shift2_start,
    s2.shift_end as shift2_end,
    tstzrange(s1.shift_start, s1.shift_end) * tstzrange(s2.shift_start, s2.shift_end) as overlap_period
FROM shifts s1
JOIN shift_assignments sa1 ON sa1.shift_id = s1.id
JOIN shifts s2 ON s2.org_id = s1.org_id AND s2.id != s1.id
JOIN shift_assignments sa2 ON sa2.shift_id = s2.id AND sa2.employee_id = sa1.employee_id
JOIN employees e ON e.id = sa1.employee_id
WHERE s1.org_id = current_org_id()
    AND s1.deleted_at IS NULL
    AND s2.deleted_at IS NULL
    AND sa1.status IN ('accepted', 'pending')
    AND sa2.status IN ('accepted', 'pending')
    AND tstzrange(s1.shift_start, s1.shift_end) && tstzrange(s2.shift_start, s2.shift_end)  -- Overlaps
ORDER BY sa1.employee_id, s1.shift_start;

-- ============================================================================
-- 6. SCHEDULING ANALYTICS
-- ============================================================================

-- Organization-wide scheduling metrics
SELECT 
    'Total Active Employees' as metric,
    COUNT(*)::text as value
FROM employees 
WHERE org_id = current_org_id() 
    AND deleted_at IS NULL 
    AND (termination_date IS NULL OR termination_date > CURRENT_DATE)

UNION ALL

SELECT 
    'Shifts This Week' as metric,
    COUNT(*)::text as value
FROM shifts 
WHERE org_id = current_org_id() 
    AND deleted_at IS NULL
    AND shift_start >= DATE_TRUNC('week', CURRENT_DATE)
    AND shift_start < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week'

UNION ALL

SELECT 
    'Unassigned Shifts' as metric,
    COUNT(*)::text as value
FROM shifts s
LEFT JOIN shift_assignments sa ON sa.shift_id = s.id
WHERE s.org_id = current_org_id() 
    AND s.deleted_at IS NULL
    AND s.status = 'published'
    AND sa.id IS NULL

UNION ALL

SELECT 
    'Pending Assignments' as metric,
    COUNT(*)::text as value
FROM shift_assignments sa
JOIN shifts s ON s.id = sa.shift_id
WHERE s.org_id = current_org_id()
    AND sa.status = 'pending'
    AND s.deleted_at IS NULL

UNION ALL

SELECT 
    'Expiring Certifications (30 days)' as metric,
    COUNT(*)::text as value
FROM employee_certifications ec
WHERE ec.org_id = current_org_id()
    AND ec.deleted_at IS NULL
    AND ec.expires_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days';

-- ============================================================================
-- 7. TIME-OFF IMPACT ANALYSIS
-- ============================================================================

-- Find shifts affected by approved time-off requests
SELECT 
    tor.employee_id,
    e.first_name,
    e.last_name,
    tor.start_date,
    tor.end_date,
    tor.request_type,
    s.id as affected_shift_id,
    s.shift_start,
    s.shift_end,
    ws.name as site_name,
    r.name as role_name,
    sa.status as assignment_status
FROM time_off_requests tor
JOIN employees e ON e.id = tor.employee_id
JOIN shift_assignments sa ON sa.employee_id = tor.employee_id
JOIN shifts s ON s.id = sa.shift_id
JOIN work_sites ws ON ws.id = s.work_site_id
JOIN roles r ON r.id = s.role_id
WHERE tor.org_id = current_org_id()
    AND tor.status = 'approved'
    AND tor.deleted_at IS NULL
    AND s.deleted_at IS NULL
    AND DATE(s.shift_start) BETWEEN tor.start_date AND tor.end_date
    AND sa.status IN ('accepted', 'pending')
ORDER BY tor.start_date, e.last_name, s.shift_start;

-- ============================================================================
-- 8. PERFORMANCE QUERIES USING MATERIALIZED VIEWS
-- ============================================================================

-- Quick weekly hours lookup (using materialized view)
SELECT 
    employee_id,
    first_name,
    last_name,
    week_start,
    total_hours,
    shifts_worked,
    CASE 
        WHEN total_hours > 40 THEN total_hours - 40 
        ELSE 0 
    END as overtime_hours
FROM employee_weekly_hours
WHERE org_id = current_org_id()
    AND week_start >= DATE_TRUNC('week', CURRENT_DATE - INTERVAL '4 weeks')
ORDER BY week_start DESC, last_name, first_name;

-- Site coverage overview (using materialized view)
SELECT 
    site_name,
    role_name,
    DATE(hour_start) as shift_date,
    COUNT(*) as hours_in_day,
    SUM(assigned_count) as total_assignments,
    AVG(assigned_count) as avg_hourly_coverage
FROM site_coverage_analysis
WHERE org_id = current_org_id()
    AND hour_start >= CURRENT_DATE
    AND hour_start < CURRENT_DATE + INTERVAL '7 days'
GROUP BY site_name, role_name, DATE(hour_start)
ORDER BY shift_date, site_name, role_name;

-- ============================================================================
-- 9. REFRESH MATERIALIZED VIEWS (Performance Maintenance)
-- ============================================================================

-- These should be run periodically (e.g., via cron job)
REFRESH MATERIALIZED VIEW CONCURRENTLY employee_weekly_hours;
REFRESH MATERIALIZED VIEW CONCURRENTLY site_coverage_analysis;

-- ============================================================================
-- 10. TESTING QUERIES FOR EXCLUSION CONSTRAINTS
-- ============================================================================

-- Test overlap prevention (these should fail due to exclusion constraint)
/*
-- This would work - non-overlapping shifts
INSERT INTO shifts (org_id, work_site_id, role_id, shift_start, shift_end, status) 
VALUES (current_org_id(), 'site-uuid', 'role-uuid', '2024-12-16 08:00:00', '2024-12-16 16:00:00', 'published');

INSERT INTO shift_assignments (org_id, shift_id, employee_id, status)
VALUES (current_org_id(), 'shift1-uuid', 'employee-uuid', 'accepted');

-- This should fail due to overlap constraint
INSERT INTO shifts (org_id, work_site_id, role_id, shift_start, shift_end, status) 
VALUES (current_org_id(), 'site-uuid', 'role-uuid', '2024-12-16 14:00:00', '2024-12-16 22:00:00', 'published');

INSERT INTO shift_assignments (org_id, shift_id, employee_id, status)
VALUES (current_org_id(), 'shift2-uuid', 'employee-uuid', 'accepted');  -- Should fail!
*/
