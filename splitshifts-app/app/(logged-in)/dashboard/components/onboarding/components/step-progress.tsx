
import clsx from 'clsx';
import { STEP_DISPLAY_CONFIG, stepIndicatorVariants } from '../constants';

export default function StepProgress({
  currentStepNumber,
}: {
  currentStepNumber: number;
}) {
  return (
    <div className='mb-6 px-4'>
      <nav aria-label='Progress'>
        <ol className='flex w-full items-center'>
          {STEP_DISPLAY_CONFIG.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = currentStepNumber > stepNumber;
            const isActive = currentStepNumber === stepNumber;
            const isLast = index === STEP_DISPLAY_CONFIG.length - 1;

            return (
              <li
                key={step.key}
                className='flex flex-1 items-center last:flex-none'
              >
                <div className='flex flex-shrink-0 items-center'>
                  <div
                    className={stepIndicatorVariants({
                      active: isActive || isCompleted,
                    })}
                  >
                    <span className='typescale-label-small'>{stepNumber}</span>
                  </div>
                  <span
                    className={clsx(
                      'typescale-body-small ml-2 whitespace-nowrap transition-colors duration-300',
                      isActive || isCompleted
                        ? 'text-on-surface'
                        : 'text-on-surface-variant',
                    )}
                  >
                    {step.title}
                  </span>
                </div>

                {!isLast && (
                  <div className='relative mx-4 h-1 min-w-8 flex-1 overflow-hidden rounded-full bg-outline/50'>
                    <div
                      className={clsx(
                        'absolute inset-0 h-full rounded-full bg-secondary transition-all duration-700 ease-out',
                        isCompleted ? 'w-full' : 'w-0',
                      )}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
