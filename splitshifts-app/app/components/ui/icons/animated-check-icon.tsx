/**
 * AnimatedCheckIcon Component
 * 
 * A reusable animated checkmark icon with celebration effects.
 * Features multiple animation layers for a polished success state.
 */

interface AnimatedCheckIconProps {
  /** Size of the icon container (default: 'medium') */
  size?: 'small' | 'medium' | 'large';
  /** Custom className for additional styling */
  className?: string;
}

export default function AnimatedCheckIcon({ 
  size = 'medium', 
  className = '' 
}: AnimatedCheckIconProps) {
  // Size configurations
  const sizeConfig = {
    small: {
      container: 'h-12 w-12',
      icon: 'h-6 w-6',
      outerRing: '-inset-3',
      innerRing: '-inset-1.5'
    },
    medium: {
      container: 'h-16 w-16',
      icon: 'h-8 w-8',
      outerRing: '-inset-4',
      innerRing: '-inset-2'
    },
    large: {
      container: 'h-20 w-20',
      icon: 'h-10 w-10',
      outerRing: '-inset-5',
      innerRing: '-inset-2.5'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className={`flex justify-center ${className}`}>
      <div className="relative">
        {/* Celebration background animations */}
        <div className={`absolute ${config.outerRing} animate-ping rounded-full bg-green-400/20`}></div>
        <div className={`absolute ${config.innerRing} animate-pulse rounded-full bg-green-400/30`}></div>
        
        {/* Main checkmark container */}
        <div className={`relative mx-auto flex ${config.container} items-center justify-center rounded-full bg-green-100 shadow-lg`}>
          {/* Animated checkmark */}
          <svg
            className={`${config.icon} text-green-600 animate-bounce [animation-delay:0.2s] [animation-duration:0.6s] [animation-iteration-count:2]`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
              className="animate-draw [stroke-dasharray:20] [stroke-dashoffset:20]"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
