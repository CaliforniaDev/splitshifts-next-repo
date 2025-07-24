import Link from 'next/link';
import { cn } from '@/app/lib/utils';

export function List({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ul role='navigation' className={cn('space-y-2', className)}>
      {children}
    </ul>
  );
}

export function ListItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <li className={cn('flex h-14 items-center justify-center rounded-full p-4', className)}>
      {children}
    </li>
  );
}

interface ListLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

export function ListItemLink({ href, icon, label, className }: ListLinkProps) {
  return (
    <ListItem className={className}>
      <Link
        href={href}
        className='flex h-full w-full items-center gap-3 rounded-lg px-3 py-2 transition hover:bg-surface-container'
      >
        {icon}
        <span>{label}</span>
      </Link>
    </ListItem>
  );
}
