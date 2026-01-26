# pg_cron Setup Instructions for Neon (Single Database)

## Simple Single-Database Setup

Your Neon database (`splitshifts`) has pg_cron available. Everything happens in one database - much simpler!

## Step-by-Step Setup

### Step 1: Enable pg_cron

1. Go to Neon Console: <https://console.neon.tech>
2. Select your SplitShifts project
3. Click "SQL Editor"
4. Make sure `splitshifts` database is selected
5. Run this command:

```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
```

✅ You should see: "CREATE EXTENSION" success message

### Step 2: Create Functions & Tables

1. Still in SQL Editor (same `splitshifts` database)
2. Open `cleanup-soft-deletes.sql` in VS Code
3. Copy lines 37-110 (Steps 1-3: the CREATE FUNCTION and CREATE TABLE statements)
4. Paste into Neon SQL Editor
5. Click "Run"

This creates:

- `purge_old_soft_deleted_organizations()` function
- `cleanup_audit_log` table
- `purge_old_soft_deleted_with_audit()` wrapper function

✅ You should see: Multiple "CREATE FUNCTION" and "CREATE TABLE" success messages

### Step 3: Schedule the Cron Job

1. Still in SQL Editor (same `splitshifts` database)
2. Run these commands:

```sql
-- Remove any existing job (safe if it doesn't exist)
SELECT cron.unschedule('purge-soft-deleted-organizations');

-- Schedule the job to run daily at 2 AM UTC
SELECT cron.schedule(
  'purge-soft-deleted-organizations',
  '0 2 * * *',
  $$SELECT purge_old_soft_deleted_with_audit();$$
);
```

✅ You should see: A number returned (like `1` or `2`) - that's the job ID

### Step 4: Verify Setup

Run these in SQL Editor (in `splitshifts` database):

```sql
-- Check if extension is enabled
SELECT * FROM pg_extension WHERE extname = 'pg_cron';

-- Check if job is scheduled
SELECT * FROM cron.job WHERE jobname = 'purge-soft-deleted-organizations';

-- Check if functions exist
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_name LIKE '%purge%';

-- Check if audit table exists
SELECT * FROM cleanup_audit_log LIMIT 1;
```

You should see:

- pg_cron extension exists
- One job with `active = true` and schedule `0 2 * * *`
- Two functions: `purge_old_soft_deleted_organizations` and `purge_old_soft_deleted_with_audit`
- `cleanup_audit_log` table exists (may be empty)

## Testing the Setup

### Test Manual Execution

```sql
-- Run cleanup manually (safe - only deletes records >90 days old)
SELECT * FROM purge_old_soft_deleted_with_audit();
```

Expected result:

- Returns `purged_count: 0` and empty array (if no old deleted records exist)
- Adds entry to `cleanup_audit_log` table

```sql
-- Check audit log
SELECT * FROM cleanup_audit_log ORDER BY executed_at DESC LIMIT 1;
```

### Monitor Cron Execution

```sql
-- View execution history
SELECT 
  jobid,
  runid,
  start_time,
  end_time,
  status,
  return_message
FROM cron.job_run_details 
WHERE jobid = (
  SELECT jobid FROM cron.job 
  WHERE jobname = 'purge-soft-deleted-organizations'
)
ORDER BY start_time DESC 
LIMIT 10;
```

## Common Issues

### "relation cron.job does not exist"

- **Problem:** pg_cron not enabled
- **Solution:** Run `CREATE EXTENSION IF NOT EXISTS pg_cron;` in `splitshifts` database

### "function purge_old_soft_deleted_with_audit() does not exist"

- **Problem:** Functions not created yet
- **Solution:** Run Steps 1-3 from `cleanup-soft-deletes.sql`

### Job scheduled but not running

- **Problem:** Check for errors in execution log
- **Solution:** Run the monitoring query above to see error messages

## Done

The cron job will now run automatically every day at 2 AM UTC and permanently delete any organizations that were soft-deleted more than 90 days ago.
