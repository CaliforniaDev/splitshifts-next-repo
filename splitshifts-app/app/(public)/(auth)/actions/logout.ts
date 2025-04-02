// File: app/(public)/(auth)/actions/logout.ts

'use server';

import { signOut } from '@/auth';

export const logOut = async () => {
  await signOut();
};
