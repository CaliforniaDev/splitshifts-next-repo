// File: app/(logged-in)/settings/change-password/page.tsx

import ChangePasswordForm from "./components/change-password-form";

export default function ChangePasswordPage() {
  return (
    <section className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-on-surface">Change Password</h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          Update your account password to keep your account secure.
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-md mx-auto">
        <ChangePasswordForm />
      </div>
    </section>
  );
}