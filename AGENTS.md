# Agent Working Guide for This RepoAgent Working Guide for This Repo



## ScopeScope

- This file applies to the entire repository. Nested AGENTS.md files may override rules for their subtree.- This file applies to the entire repository. Nested AGENTS.md files may override rules for their subtree.



## Core PrinciplesCore Principles

- Be precise and minimal: change only what's needed for the task.- Be precise and minimal: change only what’s needed for the task.

- Preserve existing patterns: match code style, naming, and folder structure.- Preserve existing patterns: match code style, naming, and folder structure.

- Favor clarity and safety: explicit types, predictable control flow, and defensive checks for auth and data access.- Favor clarity and safety: explicit types, predictable control flow, and defensive checks for auth and data access.

- Keep performance in mind: avoid unnecessary DB round-trips and cache stale data carefully.- Keep performance in mind: avoid unnecessary DB round-trips and cache stale data carefully.

- **Documentation**: Do NOT create new markdown files to document changes unless explicitly requested. Prefer updating existing documentation or consolidating related docs.

- **Consolidation**: When you find duplicate or overlapping documentation, merge them into a single authoritative source.Tech Stack Notes

- Next.js App Router with server components and server actions.

## Tech Stack- next-auth for authentication; JWT carries `id` and `orgId`.

- Drizzle ORM for database access; prefer composable queries with `select` projections.

### Core Technologies- TypeScript everywhere. Avoid `any`. Use `unknown` and refine when necessary.

- **Next.js 15 App Router** with server components and server actions

- **NextAuth.js v5** for authentication; JWT carries `id` and `orgId`Auth & Session

- **Drizzle ORM** for database access; prefer composable queries with `select` projections- Use `validateUserSession()` to protect logged-in routes and ensure the user exists.

- **TypeScript** everywhere. Avoid `any`. Use `unknown` and refine when necessary- Do not re-check user existence on every request inside `session()` callback; rely on login/refresh validation.

- **Tailwind CSS** with Material Design 3 colors and custom design tokens- When adding pages under `(logged-in)`, always validate the session at the top of the server component/action.

- **Zod** for schema validation and type safety- For sign-out actions, use `signOut({ redirectTo: '/' })` unless a task requires a different redirect.

- **React Hook Form** for form state management

Authentication Guard Boundaries:

### Route Structure1. **Layout Level** (`app/(logged-in)/layout.tsx`): Uses `requireSession()` for fast JWT-only validation

- `app/(logged-in)/` - Protected routes requiring authentication2. **Page Level**: Pages rendering user data MUST call `validateUserSession()` at the top to ensure user exists in DB

- `app/(public)/` - Public routes (landing, auth pages)  3. **Server Actions**: All data-mutating actions MUST use `requireAuth()` for authentication check

- `app/(public)/(auth)/` - Authentication flows (login, signup, password reset)4. **Organization Actions**: Use `authorizeOrganizationAction()` from `dashboard/actions/organization/organization-auth-utils.ts` for full authN/authZ

- Route protection handled by NextAuth.js middleware in `middleware.ts`

Pattern Examples:

### Database Architecture (Critical)```typescript

- **UUID Primary Keys**: All tables use UUIDv7 (`uuid.v7()`) - never use serial/auto-increment// Fast layout protection (no DB check)

- **Multi-tenant**: Organization-scoped data isolation via `organization_id` foreign keysexport default async function Layout() {

- **Schema Location**: `db/schema/` with individual files exported through `index.ts`  await requireSession(); // < 1ms

- **20+ Tables**: Users, organizations, employees, shifts, work sites, roles, certifications, etc.  // ...

- **Migration Commands**: `pnpm db:generate && pnpm db:push` (Drizzle Kit)}



## Authentication & Session Management// Page with user data (DB validation required)

export default async function UserPage() {

### Auth Guard Boundaries  await validateUserSession(); // Checks DB, ~50-100ms

Use the appropriate guard function based on context:  // ...

}

1. **Layout Level** (`app/(logged-in)/layout.tsx`): 

   - Uses `requireSession()` for fast JWT-only validation// Server action (authentication required)

   - Performance: < 1ms (no DB query)export async function updateData(data) {

  'use server';

2. **Page Level** (pages rendering user data):  const session = await requireAuth(); // Redirects if not authenticated

   - MUST call `validateUserSession()` at the top to ensure user exists in DB  // ... mutation logic

   - Performance: 50-100ms (includes DB check)}



3. **Server Actions** (data-mutating actions):// Organization action (full authorization)

   - MUST use `requireAuth()` for authentication checkexport async function editOrg(orgId, data) {

   - Redirects if not authenticated  'use server';

  const session = await requireAuth();

4. **Organization Actions**:  const isAdmin = await isOrganizationAdmin(session.user.id, orgId);

   - Use `authorizeOrganizationAction()` from `dashboard/actions/organization/organization-auth-utils.ts`  if (!isAdmin) return { error: 'Unauthorized' };

   - Provides full authentication + authorization checks  // ... mutation logic

}

### Pattern Examples```



```typescriptTrade-off: Deleted users with valid JWT can navigate between pages until hitting a `validateUserSession()` boundary (typically < 5 seconds). This is acceptable for performance (4-10x faster navigation) and follows industry standards.

// Fast layout protection (no DB check)

export default async function Layout() {Routing & Files

  await requireSession(); // < 1ms- Keep pages within existing route groupings: `(public)`, `(logged-in)`, etc.

  // ...- Loading states should live in colocated `loading.tsx` files with skeletons that match the page layout.

}- Prefer server components by default. Use client components only when interactivity or hooks require them.



// Page with user data (DB validation required)Database

export default async function UserPage() {- Use explicit column projections in `select` to minimize data transfer.

  await validateUserSession(); // Checks DB, ~50-100ms- Filter out soft-deleted records (e.g., `deletedAt IS NULL`) in queries that surface user-visible data.

  // ...- Wrap multi-step mutations in a single server action when possible.

}

Security

// Server action (authentication required)- Enforce 2FA checks where applicable; use `otplib` and store `twoFactorSecret` securely.

export async function updateData(data) {- Never expose secrets, tokens, or internal IDs to the client beyond what’s already used in the codebase.

  'use server';- Validate input on server actions; do not trust client values.

  const session = await requireAuth(); // Redirects if not authenticated

  // ... mutation logicPerformance

}- Respect `next.config.mjs` experimental `staleTimes` configuration.

- Avoid duplicate DB queries—reuse values from validated session where possible.

// Organization action (full authorization)- Batch queries or use joins when it reduces round-trips and keeps logic simple.

export async function editOrg(orgId, data) {

  'use server';TypeScript & Style

  const session = await requireAuth();- No `any`. Prefer `zod` or similar for schema validation when introducing new inputs.

  const isAdmin = await isOrganizationAdmin(session.user.id, orgId);- Use clear names (no single-letter vars). Follow existing import alias patterns like `@/db/...`.

  if (!isAdmin) return { error: 'Unauthorized' };- Keep functions small and focused. Extract utilities to `app/lib` or existing util modules when reused.

  // ... mutation logic

}Testing & Validation

```- When changing auth/session flows, verify affected pages under `(logged-in)` still render with a valid session and redirect otherwise.

- For server actions, include minimal happy-path and error-path checks.

### Security Trade-off

Deleted users with valid JWT can navigate between pages until hitting a `validateUserSession()` boundary (typically < 5 seconds). This is acceptable for performance (4-10x faster navigation) and follows industry standards (GitHub, Google, Auth0, Clerk).Documentation

- Update or add short comments near changed code only when it improves understanding.

## Component Architecture- If a change affects security or performance, add a note to `docs/security/NAVIGATION_PERFORMANCE_FIX.md` or a relevant doc under `docs/`.



### Navigation System (`app/components/ui/nav/dashboard/`)Commit Guidance (if asked to commit)

- Configuration-driven navigation in `nav-config.tsx`- Atomic commits per logical change.

- CVA (Class Variance Authority) variants for styling states- Descriptive message: imperative mood, reference the area (e.g., "auth:", "db:", "settings:").

- Active state detection via `usePathname()` comparison

- Material Design 3 compliant with proper ARIA labelsRepository Conventions

- Use `TwoFactorAuthForm` naming (not "From"); fix typos when touching related files.

### Icon System (`app/components/ui/icons/dashboard/`)- Keep onboarding logic on the dashboard when the user lacks an organization.

- HeroIcons-based components with solid/outline variants- Prefer colocated components under the route directory when they’re only used there.

- Unified picker: `<DashboardIcon name="home" variant="solid" />`
- Always use `currentColor` for theme integration
- Available icons: home, calendar, employees, locations, settings

### Form Patterns

**Standard form setup:**
```typescript
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { /* ... */ }
});
```

**Always follow this exact pattern for forms:**
```tsx
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/app/components/ui/form';
import Input from '@/app/components/ui/inputs/input';
import Button from '@/app/components/ui/buttons/button';

<Form {...form}>
  <form onSubmit={form.handleSubmit(submitHandler)}>
    <fieldset disabled={isSubmitting} className='space-y-8'>
      <FormField
        name='fieldName'
        control={form.control}
        render={({ field, fieldState }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                label='Field Label *'
                type='text'
                onBlur={field.onBlur}
                error={!!fieldState.error}
                errorMessage={fieldState.error?.message}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <Button
        loading={isSubmitting}
        loadingText='Submitting...'
        type='submit'
        variant='filled'
      >
        Submit
      </Button>
    </fieldset>
  </form>
</Form>
```

### Card Layout Pattern
```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';

<Card className='w-full border-none shadow-elevation-0'>
  <CardHeader>
    <CardTitle>Form Title</CardTitle>
    <CardDescription className='typescale-body-large'>
      Description text
    </CardDescription>
  </CardHeader>
  <CardContent>
    {/* Form content */}
  </CardContent>
  <CardFooter>
    {/* Links or additional actions */}
  </CardFooter>
</Card>
```

## Database Best Practices

### Query Patterns
```typescript
// Always use UUID fields - never serial IDs
const [organization] = await db
  .select()
  .from(organizations) 
  .where(eq(organizations.id, organizationId)); // organizationId is UUID string

// Multi-tenant queries MUST include organization scope
const employees = await db
  .select()
  .from(employees)
  .where(eq(employees.organizationId, organizationId));

// Use explicit column projections to minimize data transfer
const [userOrg] = await db
  .select({
    orgId: organizationUsers.orgId,
    orgName: organizations.name,
  })
  .from(organizationUsers)
  .innerJoin(organizations, eq(organizationUsers.orgId, organizations.id))
  .where(eq(organizationUsers.userId, userId));
```

### Data Integrity
- Filter out soft-deleted records (e.g., `deletedAt IS NULL`) in queries that surface user-visible data
- Wrap multi-step mutations in a single server action when possible
- Never expose secrets, tokens, or internal IDs to the client beyond what's already used

## Styling Standards

- **Tailwind CSS** with Material Design 3 colors (`bg-surface-container`, `text-on-surface`)
- **CVA for variants**: Use `cva()` for component state styling
- **Typography**: Custom scale (`typescale-title-large`, `typescale-body-medium`)
- **Animations**: Custom keyframes in `tailwind.config.ts` (`animate-fade-in-up`)
- **Semantic colors**: Always use design tokens, not arbitrary colors

## Routing & Files

- Keep pages within existing route groupings: `(public)`, `(logged-in)`, etc.
- Loading states should live in colocated `loading.tsx` files with skeletons that match the page layout
- Prefer server components by default. Use client components only when interactivity or hooks require them
- Prefer colocated components under the route directory when they're only used there

## Security

- Enforce 2FA checks where applicable; use `otplib` and store `twoFactorSecret` securely
- When disabling 2FA, also null out `twoFactorSecret` for security (prevents secret reuse)
- Validate input on server actions; do not trust client values
- Use Zod schemas for both client and server-side validation

## Performance

- Respect `next.config.mjs` experimental `staleTimes` configuration
- Avoid duplicate DB queries—reuse values from validated session where possible
- Batch queries or use joins when it reduces round-trips and keeps logic simple
- Use `requireSession()` in layouts for fast JWT-only checks (< 1ms)
- Use `validateUserSession()` only on pages that need to confirm user existence

## TypeScript & Code Style

- No `any`. Prefer `zod` or similar for schema validation when introducing new inputs
- Use clear names (no single-letter vars). Follow existing import alias patterns like `@/db/...`
- Keep functions small and focused. Extract utilities to `app/lib` or existing util modules when reused
- Include proper TypeScript types for all database queries
- Don't forget `session.user.id!` non-null assertion after auth checks

## Testing & Validation

- When changing auth/session flows, verify affected pages under `(logged-in)` still render with a valid session and redirect otherwise
- For server actions, include minimal happy-path and error-path checks
- Test 2FA flows - OTP validation requires proper secret handling

## Documentation

- Update or add short comments near changed code only when it improves understanding
- If a change affects security or performance, add a note to `docs/security/NAVIGATION_PERFORMANCE_FIX.md` or a relevant doc under `docs/`
- **Do NOT create summary documents** for each change unless specifically requested by the user
- **Consolidate existing docs** when you find duplicate or overlapping content

## Commit Guidance

- Atomic commits per logical change
- Descriptive message: imperative mood, reference the area (e.g., "auth:", "db:", "settings:")
- Group related changes together (e.g., all auth boundary changes in one commit)

## Repository Conventions

- Use `TwoFactorAuthForm` naming (not "From"); fix typos when touching related files
- Keep onboarding logic on the dashboard when the user lacks an organization
- Use `redirect()` for auth failures, not `throw new Error()`

## Environment & Setup

### Required Environment Variables
```bash
DATABASE_URL="postgresql://..."           # Neon serverless PostgreSQL
NEXTAUTH_SECRET="your-secret"             # Cryptographically secure secret
NEXTAUTH_URL="http://localhost:3000"      # Auth callback URL
RESEND_API_KEY="re_..."                   # For email verification
SITE_BASE_URL="http://localhost:3000"     # Required for email links
```

### Development Commands
```bash
pnpm dev              # Start development server with Turbopack
pnpm lint             # Run ESLint
pnpm db:generate      # Generate migrations from schema changes
pnpm db:push          # Push schema to database
pnpm db:studio        # Open Drizzle Studio (database GUI)
```

## Key Files Reference

### Schema & Database
- `db/schema/index.ts` - All table exports and relationships
- `db/schema/usersSchema.ts` - User auth table with UUID primary key
- `db/schema/organizationsSchema.ts` - Multi-tenant organization structure

### Authentication
- `auth.ts` - NextAuth configuration with 2FA support
- `app/lib/auth-utils.ts` - Authentication utility functions (`validateUserSession`, `requireSession`, `requireAuth`)
- `middleware.ts` - Route protection configuration
- `app/(public)/(auth)/login/page.tsx` - Multi-step login with OTP

### Components
- `app/components/ui/nav/dashboard/nav-drawer.tsx` - Navigation implementation
- `app/components/ui/icons/dashboard/dashboard-icon-picker.tsx` - Icon system usage
- `app/(logged-in)/settings/security/page.tsx` - Example: Database query pattern with auth

## Common Pitfalls to Avoid

- ❌ Never use serial/auto-increment IDs - always UUID
- ❌ Never forget to scope queries by `organization_id` for multi-tenancy
- ❌ Don't create new documentation files for every change
- ❌ Don't use `any` type in TypeScript
- ❌ Don't trust client-side validation alone - always validate on server
- ❌ Don't query the database in the session callback (performance)
- ❌ Don't forget to filter soft-deleted records with `isNull(deletedAt)`
