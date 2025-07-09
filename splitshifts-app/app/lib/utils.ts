import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function maskEmail(email: string) {
  const [local, domain] = email.split('@');
  const maskedLocal = local[0] + '*'.repeat(Math.max(0, local.length - 1));
  const [domainName, domainExt] = domain.split('.');
  const maskedDomain =
    domainName[0] + '*'.repeat(Math.max(0, domainName.length - 1));

  return `${maskedLocal}@${maskedDomain}.${domainExt}`;
}

