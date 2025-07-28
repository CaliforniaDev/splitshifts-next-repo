import UpdatePasswordForm from './components/update-password-form';
import { validateResetToken } from './actions/update-password';

/**
 * This server component handles the password reset page.
 * It extracts the token from searchParams and validates it on the server.
 */
export default async function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  // Resolve searchParams (passed as a Promise in App Router)
  const searchParamsValues = await searchParams;
  const { token } = searchParamsValues;
  // Check token validity before rendering the form
  const isTokenValid = token ? await validateResetToken(token) : false;
  return (
    <UpdatePasswordForm token={token ?? ''} isTokenValid={isTokenValid} />
  );
}
