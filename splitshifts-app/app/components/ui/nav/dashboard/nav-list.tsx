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
  isActive?: boolean;
  className?: string;
}

/**
 * Navigation List Item Link
 * 
 * Accessible navigation link with:
 * - Active state passed from parent (for flexible matching logic)
 * - Dynamic styling via CVA variants 
 * - Keyboard navigation support
 * - Screen reader friendly with aria-current
 * - Icon + label layout
 */
export function ListItemLink({ href, icon, label, isActive, className }: ListLinkProps) {
  const pathname = usePathname();
  // Use provided isActive prop, fallback to exact pathname matching
  const active = isActive !== undefined ? isActive : pathname === href;

  return (
    <ListItem className={className}>
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        aria-label={`Navigate to ${label}`}
        className={listItemLinkVariants({
          active: active,
          overlay: active ? 'active' : 'default'
        })}
      >
        {icon}
        <span>{label}</span>
      </Link>
    </ListItem>
  );
}
