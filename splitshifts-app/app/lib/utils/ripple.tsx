'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export interface RipplePosition {
  x: number;
  y: number;
  id: number;
  isReleased: boolean;
  size: number;
}

export interface RippleConfig {
  expandDuration?: number;
  fadeDuration?: number;
  opacity?: number;
  color?: string;
  easing?: string;
  disabled?: boolean;
}

export interface UseRippleReturn {
  ripples: RipplePosition[];
  rippleRef: React.RefObject<HTMLElement | null>;
  handleMouseDown: (e: React.MouseEvent<HTMLElement>) => void;
  handleMouseUp: () => void;
  removeRipple: (id: number) => void;
}

export const RIPPLE_DEFAULTS = {
  expandDuration: 550,
  fadeDuration: 550,
  opacity: 0.1,
  color: 'currentColor',
  easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
  disabled: false,
} as const;

/**
 * Calculate ripple diameter to cover entire element edge-to-edge
 */
export const calculateRippleSize = (
  clickX: number,
  clickY: number,
  elementWidth: number,
  elementHeight: number
): number => {
  const distanceX = Math.max(clickX, elementWidth - clickX);
  const distanceY = Math.max(clickY, elementHeight - clickY);
  return Math.sqrt(distanceX ** 2 + distanceY ** 2) * 2;
};

interface RippleEffectProps extends RipplePosition {
  config: Required<RippleConfig>;
  keyframeName: string;
  onComplete: () => void;
}

/**
 * Renders a single ripple animation that expands on press and fades on release
 */
export const RippleEffect: React.FC<RippleEffectProps> = ({
  x,
  y,
  size,
  isReleased,
  config,
  keyframeName,
  onComplete,
}) => {
  useEffect(() => {
    if (isReleased) {
      const fadeTimer = setTimeout(onComplete, config.fadeDuration);
      return () => clearTimeout(fadeTimer);
    }
  }, [isReleased, config.fadeDuration, onComplete]);

  return (
    <span
      className='absolute pointer-events-none rounded-full'
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: config.color,
        opacity: config.opacity,
        transform: 'translate(-50%, -50%) scale(0)',
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        animation: isReleased
          ? `${keyframeName}Expand ${config.expandDuration}ms ${config.easing} forwards, ${keyframeName}Fade ${config.fadeDuration}ms ${config.easing} forwards`
          : `${keyframeName}Expand ${config.expandDuration}ms ${config.easing} forwards`,
      }}
    />
  );
};

/**
 * Hook for adding ripple effects to interactive components
 * Handles state management, event handlers, and cleanup
 */
export const useRipple = (config?: RippleConfig): UseRippleReturn => {
  const [ripples, setRipples] = useState<RipplePosition[]>([]);
  const rippleRef = useRef<HTMLElement | null>(null);
  const rippleIdRef = useRef(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (config?.disabled) return;

      const rect = rippleRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = calculateRippleSize(x, y, rect.width, rect.height);
      const id = rippleIdRef.current++;

      setRipples(prev => [...prev, { x, y, id, size, isReleased: false }]);
    },
    [config?.disabled],
  );

  const handleMouseUp = useCallback(() => {
    setRipples(prev => prev.map(ripple => ({ ...ripple, isReleased: true })));
  }, []);

  const removeRipple = useCallback((id: number) => {
    setRipples(prev => prev.filter(ripple => ripple.id !== id));
  }, []);

  return {
    ripples,
    rippleRef,
    handleMouseDown,
    handleMouseUp,
    removeRipple,
  };
};

interface RippleKeyframesProps {
  name: string;
  config: Required<RippleConfig>;
}

/**
 * Generates CSS keyframe animations for ripple effects
 * Each component must use a unique name to avoid conflicts
 */
export const RippleKeyframes: React.FC<RippleKeyframesProps> = ({
  name,
  config,
}) => (
  <style jsx>{`
    @keyframes ${name}Expand {
      0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: ${config.opacity};
      }
      100% {
        transform: translate(-50%, -50%) scale(1);
        opacity: ${config.opacity};
      }
    }
    @keyframes ${name}Fade {
      to {
        opacity: 0;
      }
    }
  `}</style>
);
