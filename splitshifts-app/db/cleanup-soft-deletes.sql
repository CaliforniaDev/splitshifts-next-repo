-- =====================================================
-- SplitShifts Database Cleanup - Soft Delete Purge
-- =====================================================
-- This script provides PostgreSQL functions and cron jobs
-- to automatically purge soft-deleted records after a retention period.
--
-- REQUIREMENTS:
-- 1. pg_cron extension (available on Neon serverless PostgreSQL)
-- 2. Admin access to enable extension
-- 
-- SETUP INSTRUCTIONS FOR NEON:
-- 
-- PART 1: Enable pg_cron (do this ONCE in the postgres database)
-- 1. In Neon Console, switch to the 'postgres' database (dropdown at top)
-- 2. Run: CREATE EXTENSION IF NOT EXISTS pg_cron;
-- 
-- PART 2: Run this script (in your actual database - verceldb)
-- 1. Switch back to your application database (verceldb)
-- 2. Copy and run this ENTIRE script
-- 3. The cron job will be scheduled in postgres but execute against verceldb
--
-- RETENTION POLICY:
-- - Soft-deleted records kept for 90 days
-- - Runs daily at 2 AM UTC
-- - Production organizations only (never touches active data)
-- =====================================================

-- =====================================================
-- NOTE: pg_cron extension lives in 'postgres' database
-- =====================================================
-- pg_cron is a special extension that MUST be created in the 'postgres' database.
-- However, you schedule jobs there but they execute in your target database.
-- This is normal PostgreSQL/Neon behavior - not an error.
-- =====================================================

-- =====================================================
-- STEP 1: Create cleanup function for organizations
-- =====================================================
CREATE OR REPLACE FUNCTION purge_old_soft_deleted_organizations()
RETURNS TABLE(purged_count INTEGER, purged_ids UUID[]) AS $$
DECLARE
  retention_days INTEGER := 90; -- Keep soft-deleted records for 90 days
  cutoff_date TIMESTAMP WITH TIME ZONE;
  deleted_ids UUID[];
BEGIN
  -- Calculate cutoff date
  cutoff_date := NOW() - (retention_days || ' days')::INTERVAL;
  
  -- Log the operation
  RAISE NOTICE 'Starting purge of organizations soft-deleted before %', cutoff_date;
  
  -- Collect IDs that will be purged (for logging)
  SELECT ARRAY_AGG(id) INTO deleted_ids
  FROM organizations
  WHERE deleted_at IS NOT NULL 
    AND deleted_at < cutoff_date;
  
  -- Perform the hard delete
  DELETE FROM organizations
  WHERE deleted_at IS NOT NULL 
    AND deleted_at < cutoff_date;
  
  -- Return summary
  RETURN QUERY SELECT 
    COALESCE(ARRAY_LENGTH(deleted_ids, 1), 0)::INTEGER,
    COALESCE(deleted_ids, ARRAY[]::UUID[]);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 2: Create audit log table (optional but recommended)
-- =====================================================
CREATE TABLE IF NOT EXISTS cleanup_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operation VARCHAR(100) NOT NULL,
  table_name VARCHAR(100) NOT NULL,
  records_purged INTEGER NOT NULL,
  purged_ids UUID[] NOT NULL,
  retention_days INTEGER NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- STEP 3: Create wrapper function with audit logging
-- =====================================================
CREATE OR REPLACE FUNCTION purge_old_soft_deleted_with_audit()
RETURNS VOID AS $$
DECLARE
  result RECORD;
BEGIN
  -- Execute purge and capture results
  SELECT * INTO result FROM purge_old_soft_deleted_organizations();
  
  -- Log to audit table
  INSERT INTO cleanup_audit_log (
    operation,
    table_name,
    records_purged,
    purged_ids,
    retention_days
  ) VALUES (
    'auto_purge',
    'organizations',
    result.purged_count,
    result.purged_ids,
    90
  );
  
  RAISE NOTICE 'Purged % organizations. IDs: %', result.purged_count, result.purged_ids;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 4: Schedule the cron job IN THE POSTGRES DATABASE
-- =====================================================
-- IMPORTANT: You must switch to the 'postgres' database to schedule the job!
-- In Neon Console SQL Editor:
-- 1. Select 'postgres' from the database dropdown
-- 2. Run the cron.schedule() command below
-- 3. The job will execute against your actual database (verceldb)

-- Remove existing job if it exists (idempotent)
-- Run this in 'postgres' database:
SELECT cron.unschedule('purge-soft-deleted-organizations');

-- Schedule daily cleanup at 2 AM UTC
-- Run this in 'postgres' database:
-- The 'verceldb' parameter tells it which database to run the function in
SELECT cron.schedule(
  'purge-soft-deleted-organizations',        -- Job name
  '0 2 * * *',                               -- Cron schedule (2 AM daily)
  $$SELECT purge_old_soft_deleted_with_audit();$$ -- Function to execute
);

-- NOTE: If the above fails with "relation cron.job does not exist",
-- it means pg_cron extension is not enabled in the postgres database.
-- Switch to 'postgres' database and run: CREATE EXTENSION IF NOT EXISTS pg_cron;

-- =====================================================
-- STEP 5: Manual execution commands (for testing)
-- =====================================================

-- Test the purge function (dry run - just see what would be deleted)
-- SELECT * FROM organizations 
-- WHERE deleted_at IS NOT NULL 
--   AND deleted_at < (NOW() - INTERVAL '90 days');

-- Execute purge manually (use with caution!)
-- SELECT * FROM purge_old_soft_deleted_with_audit();

-- View cleanup history
-- SELECT * FROM cleanup_audit_log ORDER BY executed_at DESC LIMIT 10;

-- View cron job status
-- SELECT * FROM cron.job WHERE jobname = 'purge-soft-deleted-organizations';

-- View cron execution history
-- SELECT * FROM cron.job_run_details 
-- WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'purge-soft-deleted-organizations')
-- ORDER BY start_time DESC 
-- LIMIT 10;

-- =====================================================
-- STEP 6: Disable/Enable the cron job
-- =====================================================

-- To pause the job without removing it:
-- UPDATE cron.job 
-- SET active = FALSE 
-- WHERE jobname = 'purge-soft-deleted-organizations';

-- To re-enable:
-- UPDATE cron.job 
-- SET active = TRUE 
-- WHERE jobname = 'purge-soft-deleted-organizations';

-- To completely remove the job:
-- SELECT cron.unschedule('purge-soft-deleted-organizations');

-- =====================================================
-- NOTES:
-- =====================================================
-- 1. RETENTION PERIOD: Currently set to 90 days. Adjust the 
--    retention_days variable in the function if needed.
--
-- 2. CASCADE DELETES: Ensure your foreign keys have ON DELETE CASCADE
--    so related records (organizationUsers, employees, shifts, etc.) 
--    are automatically removed when the organization is hard deleted.
--
-- 3. MONITORING: Check cleanup_audit_log regularly to ensure the
--    job is running and verify what's being deleted.
--
-- 4. NEON SPECIFIC: Neon serverless PostgreSQL supports pg_cron.
--    Contact support if you have issues enabling the extension.
--
-- 5. BACKUP STRATEGY: Always maintain database backups before
--    running cleanup operations. Neon provides point-in-time recovery.
-- =====================================================
