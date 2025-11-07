// File: app/(logged-in)/settings/security/page.tsx

import { redirect } from 'next/navigation';

import db from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema/usersSchema';
import { validateUserSession } from '@/app/lib/auth-utils';



import TwoFactorAuthFrom from './two-factor-auth-form';





export default async function SecuritySettingsPage() {
  // Validate session and ensure user exists in database
  const session = await validateUserSession();

  const [user] = await db
    .select({
      twoFactorEnabled: users.twoFactorEnabled,
    })
    .from(users)
    .where(eq(users.id, session.user.id!));

  // Extra safety check (should never happen after validateUserSession)
  if (!user) {
    redirect('/api/auth/signout');
  }
  return (
    <section className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-on-surface">Security Settings</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Manage two-factor authentication and security options.
        </p>
      </div>

      {/* Content placeholder */}
      <div className="bg-surface-container rounded-xl p-6">
        <h2 className="text-lg font-medium text-on-surface mb-4">Two-Factor Authentication</h2>
        <TwoFactorAuthFrom twoFactorEnabled={user.twoFactorEnabled ?? false} />
      </div>
    </section>
  );
}
