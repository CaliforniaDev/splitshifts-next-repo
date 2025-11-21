# Agent Working Guide for This Repo

## Scope

- This file applies to the entire repository. Nested AGENTS.md files may override rules for their subtree.

## Core Principles

- Be precise and minimal: change only what's needed for the task.
- Preserve existing patterns: match code style, naming, and folder structure.
- Favor clarity and safety: explicit types, predictable control flow, and defensive checks for auth and data access.
- Keep performance in mind: avoid unnecessary DB round-trips and cache stale data carefully.
- **Documentation**: Do NOT create new markdown files to document changes unless explicitly requested. Prefer updating existing documentation or consolidating related docs.
- **Consolidation**: When you find duplicate or overlapping documentation, merge them into a single authoritative source.

## Tech Stack

### Core Technologies

- **Next.js 15 App Router** with server components and server actions
- **NextAuth.js v5** for authentication; JWT carries `id` and `orgId`
- **Drizzle ORM** for database access; prefer composable queries with `select` projections
- **TypeScript** everywhere. Avoid `any`. Use `unknown` and refine when necessary
- **Tailwind CSS** with Material Design 3 colors and custom design tokens
- **Zod** for schema validation and type safety
- **React Hook Form** for form state management

### Route Structure

- `app/(logged-in)/` - Protected routes requiring authentication
- `app/(public)/` - Public routes (landing, auth pages)
- `app/(public)/(auth)/` - Authentication flows (login, signup, password reset)
- Route protection handled by NextAuth.js middleware in `middleware.ts`

### Database Architecture (Critical)

- **UUID Primary Keys**: All tables use UUIDv7 (`uuid.v7()`) - never use serial/auto-increment
- **Multi-tenant**: Organization-scoped data isolation via `organization_id` foreign keys
- **Schema Location**: `db/schema/` with individual files exported through `index.ts`
- **20+ Tables**: Users, organizations, employees, shifts, work sites, roles, certifications, etc.
- **Migration Commands**: `pnpm db:generate && pnpm db:push` (Drizzle Kit)

#### Neon Database Configuration

- **Database Name**: `splitshifts` (NOT the default `neondb`)
- **Project ID**: `blue-heart-80946792` (splitshifts_db)
- **Organization**: CaliforniaDev (`org-polished-king-88815294`) - Vercel-managed
- **Branch**: `br-hidden-haze-a64oddd1` (main)

**CRITICAL for Neon MCP queries:**
Always specify `databaseName: "splitshifts"` when using Neon MCP tools. The default database will only show legacy tables (accounts, sessions, users, verification_token). To see all 20 tables, you MUST include the database name parameter.

**Example:**
\`\`\`typescript
// ❌ WRONG - Shows only 4 legacy tables
mcp_neon_get_database_tables({ projectId: "blue-heart-80946792" })

// ✅ CORRECT - Shows all 20 tables
mcp_neon_run_sql({ 
  projectId: "blue-heart-80946792", 
  databaseName: "splitshifts",
  sql: "SELECT tablename FROM pg_tables WHERE schemaname = 'public';"
})
\`\`\`

## Authentication & Session Management

### Auth Guard Boundaries

Use the appropriate guard function based on context:

1. **Layout Level** (`app/(logged-in)/layout.tsx`): 
   - Uses `requireSession()` for fast JWT-only validation
   - Performance: < 1ms (no DB query)

2. **Page Level** (pages rendering user data):
   - MUST call `validateUserSession()` at the top to ensure user exists in DB
   - Performance: 50-100ms (includes DB check)

3. **Server Actions** (data-mutating actions):
   - MUST use `requireAuth()` for authentication check
   - Redirects if not authenticated

4. **Organization Actions**:
   - Use `authorizeOrganizationAction()` from `dashboard/actions/organization/organization-auth-utils.ts`
   - Provides full authentication + authorization checks

### Pattern Examples

\`\`\`typescript
// Fast layout protection (no DB check)
export default async function Layout() {
  await requireSession(); // < 1ms
  // ...
}

// Page with user data (DB validation required)
export default async function UserPage() {
  await validateUserSession(); // Checks DB, ~50-100ms
  // ...
}

// Server action (authentication required)
export async function updateData(data) {
  'use server';
  const session = await requireAuth(); // Redirects if not authenticated
  // ... mutation logic
}

// Organization action (full authorization)
export async function editOrg(orgId, data) {
  'use server';
  const session = await requireAuth();
  const isAdmin = await isOrganizationAdmin(session.user.id, orgId);
  if (!isAdmin) return { error: 'Unauthorized' };
  // ... mutation logic
}
\`\`\`

### Security Trade-off

Deleted users with valid JWT can navigate between pages until hitting a \`validateUserSession()\` boundary (typically < 5 seconds). This is acceptable for performance (4-10x faster navigation) and follows industry standards (GitHub, Google, Auth0, Clerk).

## Component Architecture

### Navigation System (\`app/components/ui/nav/dashboard/\`)

- Configuration-driven navigation in \`nav-config.tsx\`
- CVA (Class Variance Authority) variants for styling states
- Active state detection via \`usePathname()\` comparison
- Material Design 3 compliant with proper ARIA labels

### Icon System (\`app/components/ui/icons/dashboard/\`)

- HeroIcons-based components with solid/outline variants
- Unified picker: \`<DashboardIcon name="home" variant="solid" />\`
- Always use \`currentColor\` for theme integration
- Available icons: home, calendar, employees, locations, settings

### Form Patterns

**Standard form setup:**
\`\`\`typescript
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { /* ... */ }
});
\`\`\`

**Always follow this exact pattern for forms:**
\`\`\`tsx
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
\`\`\`

### Card Layout Pattern
\`\`\`tsx
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
\`\`\`

### Onboarding Wizard Pattern

**Multi-step forms with progress persistence:**
\`\`\`tsx
// 1. Add onboardingStep column to user schema (varchar 50)
onboardingStep: varchar('onboarding_step', { length: 50 })

// 2. Create server action to save progress
export async function saveOnboardingProgress(step: string | null) {
  'use server';
  const session = await requireAuth();
  await db.update(users)
    .set({ onboardingStep: step })
    .where(eq(users.id, session.user.id!));
}

// 3. Dashboard checks for incomplete onboarding
const [user] = await db.select({ onboardingStep: users.onboardingStep })
  .from(users)
  .where(eq(users.id, session.user.id!));

if (!userOrg || user?.onboardingStep) {
  return <OnboardingWizard initialStep={user?.onboardingStep} />;
}

// 4. Wizard component auto-saves on step change
const handleStepChange = async (newStep: number) => {
  setCurrentStep(newStep);
  await saveOnboardingProgress(OnboardingStep[newStep]);
};
\`\`\`

**Button hierarchy for multi-action forms:**
- Primary action: `variant="filled"` (Save & Continue)
- Secondary action: `variant="outlined"` or `"tonal"` (Add Another)
- Navigation/Skip: `variant="text"` in horizontal layout (Back | Skip for Now)

## Database Best Practices

### Query Patterns
\`\`\`typescript
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
\`\`\`

### Data Integrity
- Filter out soft-deleted records (e.g., \`deletedAt IS NULL\`) in queries that surface user-visible data
- Wrap multi-step mutations in a single server action when possible
- Never expose secrets, tokens, or internal IDs to the client beyond what's already used

## Styling Standards

- **Tailwind CSS** with Material Design 3 colors (\`bg-surface-container\`, \`text-on-surface\`)
- **CVA for variants**: Use \`cva()\` for component state styling
- **Typography**: Custom scale (\`typescale-title-large\`, \`typescale-body-medium\`)
- **Animations**: Custom keyframes in \`tailwind.config.ts\` (\`animate-fade-in-up\`)
- **Semantic colors**: Always use design tokens, not arbitrary colors

## Routing & Files

- Keep pages within existing route groupings: \`(public)\`, \`(logged-in)\`, etc.
- Loading states should live in colocated \`loading.tsx\` files with skeletons that match the page layout
- Prefer server components by default. Use client components only when interactivity or hooks require them
- Prefer colocated components under the route directory when they're only used there

## Security

- Enforce 2FA checks where applicable; use \`otplib\` and store \`twoFactorSecret\` securely
- When disabling 2FA, also null out \`twoFactorSecret\` for security (prevents secret reuse)
- Validate input on server actions; do not trust client values
- Use Zod schemas for both client and server-side validation

## Performance

- Respect \`next.config.mjs\` experimental \`staleTimes\` configuration
- Avoid duplicate DB queries—reuse values from validated session where possible
- Batch queries or use joins when it reduces round-trips and keeps logic simple
- Use \`requireSession()\` in layouts for fast JWT-only checks (< 1ms)
- Use \`validateUserSession()\` only on pages that need to confirm user existence

## TypeScript & Code Style

- No \`any\`. Prefer \`zod\` or similar for schema validation when introducing new inputs
- Use clear names (no single-letter vars). Follow existing import alias patterns like \`@/db/...\`
- Keep functions small and focused. Extract utilities to \`app/lib\` or existing util modules when reused
- Include proper TypeScript types for all database queries
- Don't forget \`session.user.id!\` non-null assertion after auth checks

## Testing & Validation

- When changing auth/session flows, verify affected pages under \`(logged-in)\` still render with a valid session and redirect otherwise
- For server actions, include minimal happy-path and error-path checks
- Test 2FA flows - OTP validation requires proper secret handling

## Documentation

### Code Comments
- Update or add short comments near changed code only when it improves understanding
- If a change affects security or performance, add a note to \`docs/security/NAVIGATION_PERFORMANCE_FIX.md\` or a relevant doc under \`docs/\`
- **Do NOT create summary documents** for each change unless specifically requested by the user
- **Consolidate existing docs** when you find duplicate or overlapping content

### README Updates (Critical)
**ALWAYS update README.md files when:**
- Adding new features or components
- Changing authentication flows or APIs
- Adding new dependencies or technologies
- Modifying environment variables
- Changing project structure

**README files to maintain:**
- \`/README.md\` - Main project README with features, setup, and documentation links
- \`/docs/README.md\` - Documentation index
- Component-specific READMEs in their directories

**Update process:**
1. Read the existing README to understand current structure
2. Add new content in the appropriate section
3. Update table of contents if present
4. Keep formatting consistent with existing style
5. Commit README updates separately with descriptive message

### CHANGELOG Updates (Critical)
**ALWAYS update CHANGELOG.MD when:**
- Adding new features (### Added)
- Changing existing functionality (### Changed)
- Deprecating features (### Deprecated)
- Removing features (### Removed)
- Fixing bugs (### Fixed)
- Addressing security issues (### Security)

**CHANGELOG format:**
\`\`\`markdown
## [Unreleased]

### Added
- New feature description with issue reference if applicable

### Changed
- Description of changes to existing functionality

### Fixed
- Bug fix description with issue reference

### Security
- Security improvement description
\`\`\`

**Update process:**
1. Add entries to \`[Unreleased]\` section at the top
2. Use present tense ("Add" not "Added")
3. Include enough detail for users to understand impact
4. Link to relevant documentation or issues
5. Commit CHANGELOG with semantic commit message

## Commit Guidance

### Atomic Commits (Critical)
**NEVER commit everything at once.** Each commit should represent ONE logical change.

**How to create atomic commits:**

1. **Make changes across multiple files**
2. **Stage files by logical grouping:**
   \`\`\`bash
   # Stage only files related to one change
   git add path/to/file1.ts path/to/file2.ts
   git commit -m "feat: descriptive message"
   
   # Repeat for each logical change
   git add path/to/file3.ts
   git commit -m "fix: another change"
   \`\`\`

3. **If you accidentally stage everything:**
   \`\`\`bash
   # Unstage all files
   git reset HEAD
   
   # Stage and commit one change at a time
   git add specific/files
   git commit -m "specific change message"
   \`\`\`

**Example workflow (from recent work):**
\`\`\`bash
# 1. Add new utility file first
git add app/lib/auth-utils.ts
git commit -m "auth: add central authentication utility functions"

# 2. Then update session callback
git add auth.ts next.config.mjs
git commit -m "perf: remove database query from session callback"

# 3. Update layout
git add app/(logged-in)/layout.tsx
git commit -m "auth: use requireSession() in layout"

# 4. Update pages
git add app/(logged-in)/dashboard/page.tsx app/(logged-in)/settings/*/page.tsx
git commit -m "auth: add validateUserSession() to pages"

# 5. Fix lint issues
git add components/modal.tsx
git commit -m "fix: escape quotes in JSX"

# 6. Update documentation
git add README.md CHANGELOG.MD
git commit -m "docs: update README and CHANGELOG for auth changes"
\`\`\`

### Commit Message Format
**Use conventional commits format:**

\`\`\`
<type>(<scope>): <subject>

<body>
\`\`\`

**Types:**
- \`feat\`: New feature
- \`fix\`: Bug fix
- \`perf\`: Performance improvement
- \`refactor\`: Code refactoring
- \`docs\`: Documentation changes
- \`style\`: Code style changes (formatting, no logic change)
- \`test\`: Adding or updating tests
- \`chore\`: Maintenance tasks
- \`security\`: Security improvements
- \`auth\`: Authentication/authorization changes
- \`db\`: Database schema or query changes

**Examples:**
\`\`\`bash
git commit -m "feat: add employee shift swapping functionality"
git commit -m "fix: resolve timezone bug in calendar view"
git commit -m "perf: optimize organization query with column projection"
git commit -m "docs: update README with new deployment instructions"
git commit -m "security: null out 2FA secret when disabling"
git commit -m "auth: implement four-layer authentication boundaries"
\`\`\`

**Multi-line commits for complex changes:**
\`\`\`bash
git commit -m "auth: implement four-layer authentication boundaries

- Add requireSession() for layout (< 1ms)
- Add validateUserSession() for page-level validation
- Add requireAuth() for server actions
- Remove DB query from session callback

Performance: 4-10x faster navigation (200-500ms → <50ms)"
\`\`\`

### When to Combine Commits
**Only combine commits if:**
- They are truly inseparable (e.g., adding a file and its test)
- The change is trivial (< 5 lines in one file)
- You're fixing a typo in comments/docs

**Never combine:**
- Feature additions with bug fixes
- Multiple feature additions
- Code changes with documentation updates
- Different subsystems (auth + UI + database)

### Commit Review Checklist
Before committing, verify:
- ✅ Only related files are staged
- ✅ Commit message follows conventional format
- ✅ No debug code, console.logs, or commented code
- ✅ README.md updated if public-facing change
- ✅ CHANGELOG.MD updated if user-visible change
- ✅ No lint errors (\`pnpm lint\`)
- ✅ TypeScript compiles (\`pnpm build\` or check for errors)

### Commit Message Generation for Multi-File Changes
When an agent is asked to "review code for commit" or "generate commit messages," follow this process:

**User Preference: Use GitHub Plugin format by default (no git commands)**

**Step 1: Review Changed Files**
\`\`\`bash
# Review all changes
git status
git diff
\`\`\`

**Step 2: Group Changes Logically**
Group files into atomic commits by:
- **Feature boundary**: UI changes separate from database changes
- **Layer separation**: Schema → Migration → Server Action → Component
- **Dependency order**: Database changes before code that uses them
- **Subsystem**: Auth changes separate from onboarding changes

**Step 3: Generate Commit Message Groups**
Format output for easy copy-paste into GitHub plugin or terminal:

**For GitHub Plugin Users (VS Code Source Control):**
\`\`\`markdown
### Commit 1: [Descriptive Name]

**Files to stage:**
- path/to/file1.ts
- path/to/file2.ts

**Commit Message:**
type(scope): subject line

- Bullet point detail 1
- Bullet point detail 2
- Bullet point detail 3

Impact: [Performance/UX/Security improvement description]
\`\`\`

**For Terminal Users:**
\`\`\`bash
git add path/to/file1.ts path/to/file2.ts
git commit -m "type(scope): subject line

- Bullet point detail 1
- Bullet point detail 2"
\`\`\`

**Step 4: Provide Context**
After commit groups, explain:
- Why changes were grouped this way
- What each commit accomplishes
- Dependencies between commits (if any)
- Recommended commit order

**Example Grouping Strategy:**
For a feature with DB changes, server actions, and UI components:
1. **Database schema** (e.g., add column to table)
2. **Database migration** (generated SQL + metadata)
3. **Server action** (new API endpoint using schema)
4. **UI component** (form/page using server action)
5. **Integration** (connect components together)
6. **Documentation** (README, CHANGELOG updates)

**Never Generate:**
- Single mega-commit with all changes
- Commits mixing unrelated features
- Commits with both code and docs (separate them)

## Repository Conventions

- Use \`TwoFactorAuthForm\` naming (not "From"); fix typos when touching related files
- Keep onboarding logic on the dashboard when the user lacks an organization
- Use \`redirect()\` for auth failures, not \`throw new Error()\`

## Environment & Setup

### Required Environment Variables
\`\`\`bash
DATABASE_URL="postgresql://..."           # Neon serverless PostgreSQL
NEXTAUTH_SECRET="your-secret"             # Cryptographically secure secret
NEXTAUTH_URL="http://localhost:3000"      # Auth callback URL
RESEND_API_KEY="re_..."                   # For email verification
SITE_BASE_URL="http://localhost:3000"     # Required for email links
\`\`\`

### Development Commands
\`\`\`bash
pnpm dev              # Start development server with Turbopack
pnpm lint             # Run ESLint
pnpm db:generate      # Generate migrations from schema changes
pnpm db:push          # Push schema to database
pnpm db:studio        # Open Drizzle Studio (database GUI)
\`\`\`

## Key Files Reference

### Schema & Database
- \`db/schema/index.ts\` - All table exports and relationships
- \`db/schema/usersSchema.ts\` - User auth table with UUID primary key
- \`db/schema/organizationsSchema.ts\` - Multi-tenant organization structure

### Authentication
- \`auth.ts\` - NextAuth configuration with 2FA support
- \`app/lib/auth-utils.ts\` - Authentication utility functions (\`validateUserSession\`, \`requireSession\`, \`requireAuth\`)
- \`middleware.ts\` - Route protection configuration
- \`app/(public)/(auth)/login/page.tsx\` - Multi-step login with OTP

### Components
- \`app/components/ui/nav/dashboard/nav-drawer.tsx\` - Navigation implementation
- \`app/components/ui/icons/dashboard/dashboard-icon-picker.tsx\` - Icon system usage
- \`app/(logged-in)/settings/security/page.tsx\` - Example: Database query pattern with auth

## Common Pitfalls to Avoid

- ❌ Never use serial/auto-increment IDs - always UUID
- ❌ Never forget to scope queries by \`organization_id\` for multi-tenancy
- ❌ Don't create new documentation files for every change
- ❌ Don't use \`any\` type in TypeScript
- ❌ Don't trust client-side validation alone - always validate on server
- ❌ Don't query the database in the session callback (performance)
- ❌ Don't forget to filter soft-deleted records with \`isNull(deletedAt)\`
- ❌ Don't use \`git add .\` or commit all files at once - use atomic commits
- ❌ Don't check only \`!userOrg\` for onboarding - also check \`user?.onboardingStep\` to handle in-progress state
