// File: app/components/ui/nav/dashboard/nav-drawer.tsx

'use client';

import Link from 'next/link';
import { Home, Settings, LogOut, Key } from 'lucide-react';
import { logOut } from '@/app/(public)/(auth)/actions/logout';

import Logo from '@/app/components/ui/logo';
import { List, ListItem, ListItemLink } from './nav-list';

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
      <div className='flex h-full flex-col space-y-4 px-3 py-[38px]'>
        <div className='flex h-14 text-xl font-semibold px-4'>
          <Logo width={38} height={38} textClassName='text-xl'/>
        </div>

        <nav className='flex h-full flex-col justify-between space-y-2'>
          <List>
            <ListItemLink
              href='/dashboard'
              label='Dashboard'
              icon={<Home className='h-5 w-5' />}
              className='bg-secondary-container text-on-secondary-container' // temporary styling
            />
            <ListItemLink
              href='/change-password'
              label='Change Password'
              icon={<Key className='h-5 w-5' />}
            />
            <ListItemLink
              href='/settings'
              label='Settings'
              icon={<Settings className='h-5 w-5' />}
            />
          </List>
          <div>
            <button
              className='mt-auto flex w-full items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-surface-container'
              onClick={handleLogout}
            >
              <LogOut className='h-5 w-5' />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
}
