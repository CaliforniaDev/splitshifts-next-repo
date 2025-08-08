import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/app/lib/utils';
import { listItemLinkVariants } from './list-variants';

/**
 * Navigation List Container
 * 
 * Semantic navigation wrapper with proper ARIA roles and spacing
 */
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

/**
 * Navigation List Item Container
 * 
 * Clean list item wrapper - all styling handled by child Link component
 */
export function ListItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <li className={className}>{children}</li>;
}

interface ListLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
}

/**
 * Navigation List Item Link
 * 
 * Accessible navigation link with:
 * - Automatic active state detection via pathname matching
 * - Dynamic styling via CVA variants 
 * - Keyboard navigation support
 * - Screen reader friendly with aria-current
 * - Icon + label layout
 */
export function ListItemLink({ href, icon, label, className }: ListLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <ListItem className={className}>
      <Link
        href={href}
        aria-current={isActive ? 'page' : undefined}
        aria-label={`Navigate to ${label}`}
        className={listItemLinkVariants({
          active: isActive,
          overlay: isActive ? 'active' : 'default'
        })}
      >
        {icon}
        <span>{label}</span>
      </Link>
    </ListItem>
  );
}
