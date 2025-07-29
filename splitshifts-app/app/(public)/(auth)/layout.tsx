import AuthLayout from '@/app/components/ui/auth/auth-layout';

export default function AuthPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthLayout>
      {children}
    </AuthLayout>
  );
}
