import db from '@/db/drizzle';
import { eq } from 'drizzle-orm';

import { UpdatePasswordFormData } from '../types/update-password-from-data';
import { passwordResetTokenSchema } from '@/db/passwordResetTokenSchema';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/app/components/ui/card';
import Link from 'next/link';

export default async function UpdatePasswordForm({
  token,
}: {
  token?: string;
}) {
  let tokenIsValid = false;
  if (token) {
    const [passwordResetToken] = await db
      .select()
      .from(passwordResetTokenSchema)
      .where(eq(passwordResetTokenSchema.token, token));
    const now = Date.now();

    if (
      !!passwordResetToken?.tokenExpiration &&
      now < passwordResetToken.tokenExpiration.getTime()
    ) {
      tokenIsValid = true;
    }
  }

  return (
    <Card>
      <CardHeader className='w-[720px] shadow-elevation-0'>
        <CardTitle>
          {tokenIsValid
            ? 'Update Password'
            : 'Your password reset link is invalid or has expired'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tokenIsValid ? (
          <div>update password form</div>
        ) : (
          <Link className='underline' href='/password-reset'>
            Request a new password reset link
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
