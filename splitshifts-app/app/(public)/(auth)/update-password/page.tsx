import UpdatePasswordForm from './components/updatePasswordForm';

export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const searchParamsValues = await searchParams;
  const { token } = searchParamsValues;
  return (
    <main className='flex min-h-screen justify-center'>
      <UpdatePasswordForm token={token} />
    </main>
  );
}
