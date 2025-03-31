import { LandingNav } from '@/app/components/ui/nav/landing';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingNav />
      <main>{children}</main>
    </>
  );
}
