// File: app/(logged-in)/settings/account/page.tsx

'use client';

export default function AccountSettingsPage() {
  return (
    <section className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-on-surface">Account Settings</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Manage your profile information and account preferences.
        </p>
      </div>

      {/* Content placeholder */}
      <div className="bg-surface-container rounded-xl p-6">
        <h2 className="text-lg font-medium text-on-surface mb-4">Profile Information</h2>
        <p className="text-on-surface-variant">
          Account settings content coming soon...
        </p>
      </div>
    </section>
  );
}
