# Implementation Plan: SplitShifts MVP

**Status:** Phase 1 In Progress  
**Timeline:** 5-6 weeks (Phase 1-4), +2-3 weeks (Phase 5)  
**Last Updated:** November 21, 2025

---

## Phase 1: Foundation & Core CRUD (Week 1-2)

**Goal:** Build shift creation, employee management, and location management with database integration.

### Steps

1. Build validation schemas in `app/lib/validation/` for shifts, employees (edit), worksites (edit) using Zod — reference existing `organizationSchemas.ts` pattern
2. Create shift server actions in `app/(logged-in)/dashboard/actions/shift/`: `create-shift.ts`, `update-shift.ts`, `delete-shift.ts`, `get-shifts.ts` — follow pattern from `actions/organization/create-organization.ts`
3. Implement employee CRUD actions in `app/(logged-in)/dashboard/actions/employee/`: `get-employees.ts`, `update-employee.ts`, `delete-employee.ts` — reuse onboarding's `add-employee.ts`, add soft delete via `deletedAt`
4. Implement worksite CRUD actions in `app/(logged-in)/dashboard/actions/worksite/`: `get-worksites.ts`, `update-worksite.ts`, `delete-worksite.ts` — validate no active shifts before deletion
5. Build date/time picker components in `app/components/ui/inputs/` using react-datepicker + date-fns — match existing `input.tsx` Material Design style
6. Replace mock data in employees page (`dashboard/employees/page.tsx`) with real query using `get-employees` action — add `validateUserSession()` at page top
7. Replace mock data in locations page (`dashboard/locations/page.tsx`) with real query using `get-worksites` action
8. Create shift creation modal in `app/components/sections/dashboard/shift-form-modal.tsx` — use React Hook Form + Card + new date/time pickers, follow `onboarding/add-organization-form.tsx` pattern
9. Build basic calendar week view in `dashboard/calendar/page.tsx` — grid layout with shifts queried via `get-shifts`, add "Create Shift" button triggering modal

### Acceptance Criteria

- ✅ Create shift with worksite, role, date, time range, notes via modal
- ✅ View shifts in calendar week view (Mon-Sun based on org `weekStartDay`)
- ✅ Edit/delete shifts with validation (only draft/published shifts)
- ✅ CRUD employees with role assignments and certifications
- ✅ CRUD worksites with timezone, contact info, access instructions
- ✅ All queries org-scoped and filter `deletedAt IS NULL`
- ✅ All forms use Zod validation client + server

### Key Risks

- **Date/time picker integration:** Material Design styling may conflict with library defaults — _Mitigation: Wrap library components, override CSS with Tailwind tokens_
- **Calendar performance:** Large shift lists may slow initial render — _Mitigation: Use date range filter (e.g., current week only) in initial query_

### Suggestion: Data Table Component

Consider building reusable `data-table.tsx` component with sort/filter/pagination for employee/worksite lists. Improves UX and reduces duplication. Optional — can use simple lists in Phase 1 and add table in Phase 2.

### Current Progress (as of Nov 21, 2025)

**Completed:**

- ✅ Database schema complete (20 tables with UUIDv7 primary keys)
- ✅ Database driver migrated to neon-serverless with transaction support
- ✅ Shift creation modal implemented (`shift-form-modal.tsx`)
- ✅ Calendar controls component (`calendar-controls.tsx`)
- ✅ Calendar page fetching shifts, worksites, roles
- ✅ Basic server actions: `get-shifts.ts`, `get-worksites.ts`, `get-roles.ts`
- ✅ Organization cascade soft-delete with transactions
- ✅ Onboarding wizard with employee/worksite/role creation

**In Progress:**

- ⏳ Fix datetime-local validation schema (accepts `YYYY-MM-DDTHH:MM` format)
- ⏳ Add empty state to shift form when no roles/worksites exist
- ⏳ Disable shift creation button without prerequisites
- ⏳ Test shift creation end-to-end flow

**Pending:**

- Date/time picker component with Material Design styling
- Complete shift CRUD actions (`update-shift.ts`, `delete-shift.ts`)
- Employee CRUD actions (edit/delete with soft delete)
- Worksite CRUD actions (edit/delete with validation)
- Replace mock data in employees/locations pages
- Calendar week view grid layout with shift display

---

## Phase 2: Shift Assignment & Notifications (Week 3)

**Goal:** Assign shifts to employees, manage shift lifecycle, send email notifications.

### Steps

1. Create shift assignment actions in `app/(logged-in)/dashboard/actions/shift/`: `assign-shift.ts`, `unassign-shift.ts` — insert into `shift_assignments` table with pending status
2. Build employee availability query in `app/(logged-in)/dashboard/actions/employee/get-employee-availability.ts` — read `employee_availability` table for conflict detection
3. Add conflict detection logic in `assign-shift.ts` — check overlapping shifts and availability patterns before assignment
4. Create shift assignment UI in shift modal — multi-select dropdown for employees, show availability conflicts, save assignments with shift
5. Build email templates in `app/lib/email-templates/`: `shift-assigned.tsx`, `shift-cancelled.tsx`, `shift-reminder.tsx` using react-email — reference existing `email.ts` `sendEmail` pattern
6. Add notification triggers in shift actions — after successful assignment/cancellation, queue email in `notifications_outbox` table
7. Implement shift status transitions in `update-shift.ts` — validate state machine (draft → published → cancelled), prevent edits to published shifts without admin override
8. Add shift list view in `dashboard/calendar/shifts-list.tsx` — filterable table showing all shifts with status badges, edit/delete actions

### Acceptance Criteria

- ✅ Assign multiple employees to a shift
- ✅ System detects scheduling conflicts (overlapping shifts, availability violations)
- ✅ Email sent on shift assignment with shift details + worksite info
- ✅ Email sent on shift cancellation with reason
- ✅ Shift status workflow enforced (draft → published, published → cancelled)
- ✅ Admins can override conflict warnings with explicit flag

### Key Risks

- **Email deliverability:** Transactional emails may be rate-limited or land in spam — _Mitigation: Configure Resend DNS (SPF/DKIM), implement basic rate limiting (max 100 emails/hour per org)_
- **Conflict detection complexity:** Multi-timezone orgs with overlapping availability — _Mitigation: Normalize all times to UTC in DB, convert to worksite timezone for display_

### Suggestion: Async Email Queue Processing

Instead of sending emails synchronously in server actions, insert into `notifications_outbox` and process via cron job (`/api/cron/process-notifications`). Improves action response time and enables retry logic. **Recommended** — prevents timeout issues.

---

## Phase 3: Dashboard Home & Advanced Calendar (Week 4)

**Goal:** Populate dashboard home with at-a-glance cards, add month view to calendar, improve UX.

### Steps

1. Create dashboard summary queries in `app/(logged-in)/dashboard/actions/dashboard/`: `get-upcoming-shifts.ts`, `get-unassigned-shifts.ts`, `get-coverage-alerts.ts` — aggregate data for next 7 days
2. Build dashboard home cards in `dashboard/page.tsx` — replace basic email display with 3-4 cards: Upcoming Shifts, Unassigned Shifts, Recent Activity, Coverage Alerts
3. Add calendar month view in `dashboard/calendar/page.tsx` — grid with mini shift indicators, click to see day detail
4. Implement shift search/filter in calendar page — filter by worksite, role, employee, status using URL params + server-side filtering
5. Add loading states via `loading.tsx` files in dashboard routes — skeleton components matching card/table layouts, follow existing `(auth)/login/loading.tsx` pattern
6. Build shift detail modal — view shift details, assignments, history (created/updated timestamps), edit/delete actions
7. Create organization settings page in `dashboard/organization/page.tsx` — edit org details from `actions/organization/edit-organization.ts`, add org deletion flow

### Acceptance Criteria

- ✅ Dashboard shows upcoming shifts (next 7 days) with employee names
- ✅ Unassigned shift count displayed with link to filtered calendar
- ✅ Calendar supports week + month views with toggle
- ✅ Filter shifts by worksite/role/employee/status
- ✅ All pages have loading skeletons using `loading.tsx`
- ✅ Organization settings page with edit/delete functionality
- ✅ Navigation between dashboard/calendar/employees/locations is fast (<50ms layout load via `requireSession`)

### Key Risks

- **Dashboard query performance:** Multiple aggregations may slow page load — _Mitigation: Use column projections in Drizzle queries, consider caching summary data in org settings (updated on shift changes)_
- **Month view complexity:** Many shifts in one day may overflow UI — _Mitigation: Show count badge, expand on click_

### Suggestion: Skeleton Components Library

Create reusable skeletons in `app/components/ui/skeleton/` (`card-skeleton`, `table-skeleton`, etc.) to standardize loading states. Optional — basic `skeleton.tsx` already exists, can extend as needed.

---

## Phase 4: Security, Authz & Polish (Week 5)

**Goal:** Harden security boundaries, add org admin controls, improve UX edge cases.

### Steps

1. Audit all server actions for `requireAuth()` + org scoping — verify every action checks `session.user.orgId` matches resource org
2. Implement org admin authorization for sensitive actions (delete org, change org settings, delete employees) using `isOrganizationAdmin()` check from `organization-auth-utils.ts`
3. Add 2FA management in settings — move existing 2FA form from dashboard to `settings/security/page.tsx`, add disable 2FA flow with password confirmation
4. Create audit log viewer in `settings/audit-log/page.tsx` — query `audit_log` table filtered by org, paginated table with entity/action/user/timestamp
5. Improve onboarding validation — add backend check that org/worksite/roles actually created before marking step complete (prevent skip manipulation)
6. Add soft delete confirmation modals — before deleting employee/worksite/org, show warning about related data (shifts, assignments)
7. Implement rate limiting for emails via `notifications_outbox` — track send count per org per hour, block if exceeds threshold
8. Add error boundaries in dashboard routes — catch unexpected errors, show user-friendly message, log to console

### Acceptance Criteria

- ✅ All server actions enforce org scoping and filter soft-deleted records
- ✅ Only org admins can delete org, change org-wide settings
- ✅ 2FA can be disabled from settings with password verification
- ✅ Audit log shows all org-level changes with user attribution
- ✅ Onboarding cannot be bypassed by skipping steps without data
- ✅ Deleting org requires admin role + confirmation modal warning data loss
- ✅ Email rate limiting prevents spam (100 emails/hour per org)
- ✅ Error boundaries catch crashes in dashboard, show fallback UI

### Key Risks

- **Authorization bypass:** Missing org admin check could allow privilege escalation — _Mitigation: Code review all actions, add integration test suite checking authz_
- **Audit log volume:** Large orgs may generate thousands of log entries — _Mitigation: Implement pagination, archive old logs (>90 days) via cron_

---

## Phase 5: Advanced Scheduling Features (Week 6+, Beyond MVP)

**Goal:** Add shift swaps, recurring shifts, templates, coverage view.

### Steps (High-Level)

1. **Shift swap requests** — new `shift_swap_requests` table, UI for employees to request swap, admin approval flow
2. **Recurring shifts** — pattern builder (weekly, bi-weekly), generate shifts in bulk via server action
3. **Schedule templates** — save week/month as template, copy to new period with date offset
4. **Coverage view** — grid showing employees × time slots, highlight gaps (no one assigned)
5. **Shift swap notifications** — emails to involved employees + admins when swap requested/approved

### Dependencies

- Requires Phase 1-4 complete
- Shift swap needs employee availability queries from Phase 2

### Suggestion: Real-Time Updates

For shift changes, consider Next.js revalidation (`revalidatePath`) or polling for near-real-time updates. WebSockets/SSE are overkill for admin-only app. Optional — manual refresh acceptable for MVP.

---

## Implementation Order & Migration Strategy

### Order (Minimizes Rework)

1. Validation schemas (no dependencies)
2. Database migrations (only if schema changes needed — current schema is complete)
3. Server actions (depend on schemas)
4. UI components (depend on actions)
5. Integration (wire components to actions)
6. Testing/polish

### Migration Plan

**No migrations needed for Phase 1-4** — all tables exist. If schema changes required:

1. Edit schema file in `db/schema/`
2. Run `pnpm db:generate` (creates migration SQL)
3. Review generated SQL in `drizzle/`
4. Run `pnpm db:push` (applies to Neon DB)
5. Commit schema + migration files together

**Example scenarios needing migrations:**

- Add `notificationPreferences` JSONB column to `users` (Phase 2 enhancement)
- Add `templateId` column to `shifts` for recurring patterns (Phase 5)

---

## Testing & Validation

### Per-Phase Checklist

- ✅ `pnpm lint` passes (no ESLint errors)
- ✅ `pnpm build` succeeds (TypeScript compilation clean)
- ✅ All server actions have try/catch with user-friendly errors
- ✅ Forms show validation errors from Zod schemas
- ✅ Auth boundaries enforced: `validateUserSession()` on pages, `requireAuth()` in actions
- ✅ Org scoping verified: All queries filter by `session.user.orgId`
- ✅ Soft delete respected: Queries include `isNull(deletedAt)` where applicable

### Manual Testing Scenarios

**Happy Path:**

- Complete onboarding → see dashboard
- Create shift → appears in calendar
- Assign employee → employee list shows assignment
- Receive email notification

**Error Path:**

- Create shift with past date → validation error
- Assign employee with conflict → warning shown
- Delete worksite with active shifts → blocked with message
- Non-admin tries to delete org → unauthorized error

### Suggestion: Integration Test Suite

Add Playwright tests for critical flows (onboarding, shift creation, assignment). Optional — manual testing sufficient for MVP, automate in post-MVP phase.

---

## Further Considerations

### 1. Timezone Handling Strategy

Each worksite has `timezone` field. Display times in worksite timezone, store in UTC. Use `date-fns-tz` for conversions. Should we add user timezone preference separate from worksite?

- **Option A:** Always use worksite timezone (simpler)
- **Option B:** Add user timezone preference (better for multi-location admins)

**Recommendation:** Option A for MVP, Option B in Phase 5

### 2. Calendar Library Choice

Build custom calendar or use library?

- **Option A:** `react-big-calendar` (mature, feature-rich, heavier bundle)
- **Option B:** Custom build with CSS Grid (lighter, full control, more dev time)
- **Option C:** FullCalendar (commercial license needed for some features)

**Recommendation:** Option B for MVP (week view is manageable), consider Option A if month view proves complex

### 3. Data Table Component

See Phase 1 suggestion. Build now or defer?

**Recommendation:** Build basic version in Phase 1 (employee list), enhance in Phase 3 (sorting/filtering)

### 4. Employee-User Account Linking

`employees` table has optional `userId` foreign key. When do we link?

- **Current:** Employees are data-only entities
- **Future:** Admin invites employee, employee creates account, links automatically

**Recommendation:** Keep unlinkable in Phase 1-4, add invite flow in separate "Employee Portal" epic (post-MVP)

---

## Dependencies Between Phases

- **Phase 2** depends on **Phase 1** (shift CRUD must exist before assignment)
- **Phase 3** can partially parallelize with **Phase 2** (dashboard home doesn't need notifications)
- **Phase 4** depends on **Phase 1-3** (audit/security layer over existing features)
- **Phase 5** depends on **Phase 1-4** complete

**Critical path:** Phase 1 → Phase 2 → Phase 4 (core scheduling + security)  
**Parallel track:** Phase 3 can start after Phase 1, doesn't block Phase 2

---

## Risk Summary

### High Risk

- **Calendar UI complexity:** Week/month views with dynamic shifts — _Mitigate with phased rollout (week first, month in Phase 3)_

### Medium Risk

- **Email deliverability:** Transactional emails to spam — _Mitigate with Resend configuration + async queue_
- **Conflict detection edge cases:** Multi-timezone, partial availability — _Mitigate with comprehensive test scenarios_

### Low Risk

- **Performance:** DB queries slow with large datasets — _Mitigate with column projections, date range filters_
- **TypeScript compilation:** Large codebase build time — _Already fast with Next.js 15 Turbopack_

---

## Timeline Summary

**Total Estimated Timeline:** 5-6 weeks to production-ready MVP (Phase 1-4). Phase 5 is post-MVP enhancement (2-3 additional weeks).

| Phase                                       | Duration | Status                        |
| ------------------------------------------- | -------- | ----------------------------- |
| Phase 1: Foundation & Core CRUD             | Week 1-2 | 🟡 In Progress (60% complete) |
| Phase 2: Shift Assignment & Notifications   | Week 3   | ⚪ Not Started                |
| Phase 3: Dashboard Home & Advanced Calendar | Week 4   | ⚪ Not Started                |
| Phase 4: Security, Authz & Polish           | Week 5   | ⚪ Not Started                |
| Phase 5: Advanced Scheduling Features       | Week 6+  | ⚪ Post-MVP                   |

---

## Related Documentation

- [Project Overview](./PROJECT_OVERVIEW.md) - High-level features and architecture
- [Architecture](./ARCHITECTURE.md) - Technical implementation details
- [Database Schema](./database/complete-erd.md) - Full ERD and table definitions
- [Security Documentation](./security/SECURITY.md) - Authentication and authorization patterns
- [UI Components Guide](./ui/UI_COMPONENTS.md) - Component library and patterns
- [Organization Management](./ORGANIZATION_MANAGEMENT_COMPLETE.md) - Cascade delete implementation
- [AGENTS.md](../AGENTS.md) - Development guidelines and conventions
