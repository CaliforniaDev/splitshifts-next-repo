# Database Cleanup Strategy - Soft Delete Management

## Overview

SplitShifts uses a **two-tier deletion strategy** to balance data safety with storage efficiency:

1. **Hard Delete** - Onboarding/incomplete data (immediate removal)
2. **Soft Delete** - Production organizations (90-day retention)

## Delete Strategy by Context

### Hard Delete (Immediate Removal)

**When to use:**
- User canceling during onboarding
- Organization has no business data
- User hasn't completed setup
- Session/temporary data

**Implementation:**
```typescript
// app/(logged-in)/dashboard/actions/hard-delete-organization.ts
await hardDeleteOrganization({ id: organizationId });
```

**Why hard delete for onboarding:**
- User expects "cancel" to fully undo setup
- No business value in keeping incomplete data
- No employees, shifts, or schedules exist yet
- Simpler UX - truly "gone"

### Soft Delete (90-Day Retention)

**When to use:**
- Production organizations with data
- Organizations with employees
- Organizations with shift history
- Any deletion requiring audit trail

**Implementation:**
```typescript
// app/(logged-in)/dashboard/actions/delete-organization.ts
await deleteOrganization({ id: organizationId });
// Sets deletedAt timestamp, preserves data for 90 days
```

**Why soft delete for production:**
- Audit compliance requirements
- Data recovery if accidental deletion
- Historical reporting and analytics
- Regulatory requirements (employment records, payroll)

## Automatic Cleanup System

### PostgreSQL Cron Job

**Setup:** Run the script in `db/cleanup-soft-deletes.sql`

```sql
-- Enable pg_cron extension (Neon supports this)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Run the entire cleanup-soft-deletes.sql script
-- This creates functions and schedules the job
```

**Schedule:**
- Runs daily at 2:00 AM UTC
- Purges records soft-deleted >90 days ago
- Logs all operations to `cleanup_audit_log` table

**What it does:**
```sql
-- Finds organizations deleted more than 90 days ago
DELETE FROM organizations
WHERE deleted_at IS NOT NULL 
  AND deleted_at < (NOW() - INTERVAL '90 days');
```

### Manual Operations

**View what would be deleted:**
```sql
SELECT id, name, deleted_at, 
       NOW() - deleted_at AS days_deleted
FROM organizations 
WHERE deleted_at IS NOT NULL 
  AND deleted_at < (NOW() - INTERVAL '90 days');
```

**Execute cleanup manually:**
```sql
SELECT * FROM purge_old_soft_deleted_with_audit();
```

**View cleanup history:**
```sql
SELECT * FROM cleanup_audit_log 
ORDER BY executed_at DESC 
LIMIT 10;
```

**Check cron job status:**
```sql
-- View scheduled jobs
SELECT * FROM cron.job 
WHERE jobname = 'purge-soft-deleted-organizations';

-- View execution history
SELECT * FROM cron.job_run_details 
WHERE jobid = (
  SELECT jobid FROM cron.job 
  WHERE jobname = 'purge-soft-deleted-organizations'
)
ORDER BY start_time DESC 
LIMIT 10;
```

## Database Schema Requirements

### Foreign Key Cascades

Ensure all related tables have `ON DELETE CASCADE` to prevent orphaned records:

```sql
-- Example: organizationUsers should cascade delete
ALTER TABLE organization_users
DROP CONSTRAINT IF EXISTS organization_users_org_id_fkey,
ADD CONSTRAINT organization_users_org_id_fkey 
  FOREIGN KEY (org_id) 
  REFERENCES organizations(id) 
  ON DELETE CASCADE;

-- Apply to all related tables:
-- - organization_users
-- - employees
-- - shifts
-- - work_sites
-- - roles
-- - certifications
-- etc.
```

### Audit Log Table

The cleanup system creates an audit table automatically:

```sql
CREATE TABLE cleanup_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation VARCHAR(100) NOT NULL,
  table_name VARCHAR(100) NOT NULL,
  records_purged INTEGER NOT NULL,
  purged_ids UUID[] NOT NULL,
  retention_days INTEGER NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Configuration

### Adjusting Retention Period

Edit the function in `db/cleanup-soft-deletes.sql`:

```sql
CREATE OR REPLACE FUNCTION purge_old_soft_deleted_organizations()
RETURNS TABLE(purged_count INTEGER, purged_ids UUID[]) AS $$
DECLARE
  retention_days INTEGER := 90; -- Change this value (e.g., 30, 60, 120)
  -- ... rest of function
```

Then re-run the script to update the function.

### Changing Schedule

Modify the cron schedule (uses standard cron syntax):

```sql
-- Daily at 2 AM UTC
'0 2 * * *'

-- Every Sunday at 3 AM UTC
'0 3 * * 0'

-- First day of month at midnight UTC
'0 0 1 * *'
```

Update the job:

```sql
SELECT cron.unschedule('purge-soft-deleted-organizations');

SELECT cron.schedule(
  'purge-soft-deleted-organizations',
  '0 3 * * 0',  -- New schedule
  'SELECT purge_old_soft_deleted_with_audit();'
);
```

## Monitoring & Maintenance

### Regular Checks

1. **Weekly:** Review audit logs
```sql
SELECT 
  executed_at,
  records_purged,
  retention_days
FROM cleanup_audit_log 
WHERE executed_at > NOW() - INTERVAL '7 days'
ORDER BY executed_at DESC;
```

2. **Monthly:** Verify cron job is running
```sql
SELECT 
  start_time,
  status,
  return_message
FROM cron.job_run_details 
WHERE jobid = (
  SELECT jobid FROM cron.job 
  WHERE jobname = 'purge-soft-deleted-organizations'
)
AND start_time > NOW() - INTERVAL '30 days'
ORDER BY start_time DESC;
```

3. **Quarterly:** Review retention policy effectiveness
```sql
-- How many soft-deleted records exist?
SELECT 
  COUNT(*) as soft_deleted_count,
  MIN(deleted_at) as oldest_deletion,
  MAX(deleted_at) as newest_deletion,
  AVG(NOW() - deleted_at) as avg_retention_time
FROM organizations 
WHERE deleted_at IS NOT NULL;
```

### Pause/Resume Cleanup

**Pause (e.g., during investigation):**
```sql
UPDATE cron.job 
SET active = FALSE 
WHERE jobname = 'purge-soft-deleted-organizations';
```

**Resume:**
```sql
UPDATE cron.job 
SET active = TRUE 
WHERE jobname = 'purge-soft-deleted-organizations';
```

## Backup Strategy

**Before enabling automatic cleanup:**

1. Verify Neon point-in-time recovery is configured
2. Test restoration process
3. Document backup retention policy (Neon default: 7 days for Pro plan)

**For compliance-heavy industries:**
- Archive soft-deleted records to cold storage before purge
- Export to S3/backup system
- Consider longer retention (180+ days)

## Neon-Specific Setup

### Enable pg_cron

1. Open Neon console: https://console.neon.tech
2. Select your project
3. Go to SQL Editor
4. Run:
```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
```

5. Run the entire `db/cleanup-soft-deletes.sql` script

### Verify Extension

```sql
SELECT * FROM pg_extension WHERE extname = 'pg_cron';
```

If not available, contact Neon support - it's available on all plans.

## Testing the System

### 1. Create test soft-deleted organization

```sql
-- Manually create a test organization with old deletedAt
INSERT INTO organizations (id, name, description, deleted_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Test Org - Delete Me',
  'This is a test organization for cleanup testing',
  NOW() - INTERVAL '100 days',  -- 100 days ago (past retention period)
  NOW() - INTERVAL '200 days',
  NOW() - INTERVAL '100 days'
);
```

### 2. Verify it would be purged

```sql
SELECT * FROM organizations 
WHERE name = 'Test Org - Delete Me'
  AND deleted_at < (NOW() - INTERVAL '90 days');
```

### 3. Run cleanup manually

```sql
SELECT * FROM purge_old_soft_deleted_with_audit();
```

### 4. Verify deletion

```sql
-- Should return 0 rows
SELECT * FROM organizations 
WHERE name = 'Test Org - Delete Me';

-- Should show in audit log
SELECT * FROM cleanup_audit_log 
ORDER BY executed_at DESC 
LIMIT 1;
```

## Troubleshooting

### Cron job not running

```sql
-- Check if job exists and is active
SELECT jobid, jobname, schedule, active 
FROM cron.job 
WHERE jobname = 'purge-soft-deleted-organizations';

-- Check for errors in execution log
SELECT * FROM cron.job_run_details 
WHERE status = 'failed'
ORDER BY start_time DESC 
LIMIT 5;
```

### Records not being purged

```sql
-- Verify deletedAt timestamps
SELECT id, name, deleted_at, NOW() - deleted_at AS age
FROM organizations 
WHERE deleted_at IS NOT NULL
ORDER BY deleted_at ASC;

-- Check if any are old enough (>90 days)
SELECT COUNT(*) 
FROM organizations 
WHERE deleted_at < (NOW() - INTERVAL '90 days');
```

### Foreign key constraint errors

```sql
-- Find tables with foreign keys to organizations
SELECT 
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  confdeltype AS delete_action
FROM pg_constraint 
WHERE confrelid = 'organizations'::regclass;

-- Delete actions should be 'c' (CASCADE)
-- If not, add CASCADE:
ALTER TABLE table_name
DROP CONSTRAINT constraint_name,
ADD CONSTRAINT constraint_name 
  FOREIGN KEY (org_id) 
  REFERENCES organizations(id) 
  ON DELETE CASCADE;
```

## Security Considerations

1. **Access Control:** Only database admin should modify cleanup functions
2. **Audit Trail:** All purges are logged with timestamps and IDs
3. **Immutability:** Once hard deleted, data cannot be recovered (by design)
4. **Compliance:** Verify retention period meets your legal requirements
5. **Testing:** Always test on staging before production deployment

## Related Files

- `app/(logged-in)/dashboard/actions/hard-delete-organization.ts` - Hard delete for onboarding
- `app/(logged-in)/dashboard/actions/delete-organization.ts` - Soft delete for production
- `db/cleanup-soft-deletes.sql` - PostgreSQL cron job setup
- `db/schema/organizationsSchema.ts` - Organization table definition
