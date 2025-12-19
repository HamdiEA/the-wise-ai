import { useEffect, useRef } from 'react';

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

export const useSwipe = (handlers: SwipeHandlers, threshold = 50) => {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchEnd.current = null;
      touchStart.current = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      };
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEnd.current = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      };
    };

    const handleTouchEnd = () => {
      if (!touchStart.current || !touchEnd.current) return;

      const diffX = touchStart.current.x - touchEnd.current.x;
      const diffY = touchStart.current.y - touchEnd.current.y;

      const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);

      if (isHorizontalSwipe) {
        if (Math.abs(diffX) > threshold) {
          if (diffX > 0) {
            // Swipe left
            handlers.onSwipeLeft?.();
          } else {
            // Swipe right
            handlers.onSwipeRight?.();
          }
        }
      } else {
        if (Math.abs(diffY) > threshold) {
          if (diffY > 0) {
            // Swipe up
            handlers.onSwipeUp?.();
          } else {
            // Swipe down
            handlers.onSwipeDown?.();
          }
        }
      }

      touchStart.current = null;
      touchEnd.current = null;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handlers, threshold]);
};
