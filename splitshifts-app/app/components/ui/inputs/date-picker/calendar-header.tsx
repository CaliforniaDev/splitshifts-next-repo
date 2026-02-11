import { IconButton } from '@/app/components/ui/buttons';
import { ChevronRightIcon } from '@/app/components/ui/icons';
import { cn } from '@/app/lib/utils';

interface CalendarHeaderProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
  className?: string;
}

export function CalendarHeader({
  label,
  onPrev,
  onNext,
  disablePrev = false,
  disableNext = false,
  className = '',
}: CalendarHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <p className='typescale-title-medium text-on-surface'>{label}</p>
      <div className='flex items-center gap-1'>
        <IconButton
          variant='standard'
          size='xs'
          aria-label='Previous month'
          disabled={disablePrev}
          onClick={onPrev}
          icon={<ChevronRightIcon className='rotate-180' />}
        />
        <IconButton
          variant='standard'
          size='xs'
          aria-label='Next month'
          disabled={disableNext}
          onClick={onNext}
          icon={<ChevronRightIcon />}
        />
      </div>
    </div>
  );
}
