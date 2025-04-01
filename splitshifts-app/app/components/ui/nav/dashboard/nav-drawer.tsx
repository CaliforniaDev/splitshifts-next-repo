'use client';

import Link from 'next/link';
import { Home, Settings, LogOut, Key } from 'lucide-react';
import { logOut } from '@/app/(public)/(auth)/actions/logout';

export default function NavDrawer() {
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  return (
    <aside className='h-screen w-64 bg-surface-container-low text-on-surface-variant'>
      <div className='flex h-full flex-col space-y-4 px-4 py-6'>
        <div className='text-xl font-semibold'>SplitShifts</div>

        <nav className='flex flex-col space-y-2'>
          <ul role='navigation' className='*:border *:border-red-300'>
            <li className='border border-red-300'>
              <Link
                href='/dashboard'
                className='flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-surface-container'
              >
                <Home className='h-5 w-5' />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href='/change-password'
                className='flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-surface-container'
              >
                <Key className='h-5 w-5' />
                <span>Change Password</span>
              </Link>
            </li>
            <li>
              <Link
                href='/settings'
                className='flex items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-surface-container'
              >
                <Settings className='h-5 w-5' />
                <span>Settings</span>
              </Link>
            </li>
            <li>
              <button
                className='mt-auto flex w-full items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-surface-container'
                onClick={handleLogout}
              >
                <LogOut className='h-5 w-5' />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
