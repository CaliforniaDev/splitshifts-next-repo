'use server'
import { signIn, signOut } from '@/lib/auth';

export async function handleSignIn() {
  await signIn("auth0");
}
export async function handleSignOut() {
  await signOut();
}