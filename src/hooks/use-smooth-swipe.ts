import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface SmoothSwipeOptions {
  nextPage?: string;
  prevPage?: string;
  threshold?: number;
  minVelocity?: number;
}

const SWIPE_EASING = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';

export const useSmoothSwipe = ({ nextPage, prevPage, threshold = 80, minVelocity = 0.3 }: SmoothSwipeOptions) => {
  const navigate = useNavigate();
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchStartTime = useRef<number>(0);
  const currentX = useRef<number>(0);
  const lastVelocity = useRef<number>(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartTime.current = Date.now();
    currentX.current = e.touches[0].clientX;
    lastVelocity.current = 0;
    setIsSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isSwiping) return;
    
    const prevX = currentX.current;
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - touchStartX.current;
    
    // Calculate velocity (px/ms)
    const timeDiff = Date.now() - touchStartTime.current;
    lastVelocity.current = timeDiff > 0 ? (currentX.current - prevX) / timeDiff : 0;
    
    // Apply resistance at edges with smoother easing
    const resistance = 0.6;
    let offset = diff;
    
    // Only allow swipe in directions where pages exist
    if (diff > 0 && !prevPage) {
      offset = diff * resistance * 0.2; // Extra resistance when no prev page
    } else if (diff < 0 && !nextPage) {
      offset = diff * resistance * 0.2; // Extra resistance when no next page
    } else {
      offset = diff * resistance;
    }
    
    setSwipeOffset(offset);
  }, [isSwiping, nextPage, prevPage]);

  const handleTouchEnd = useCallback(() => {
    const diff = currentX.current - touchStartX.current;
    const velocity = lastVelocity.current;
    const timeDiff = Date.now() - touchStartTime.current;
    
    setIsSwiping(false);
    
    // Check if swipe meets threshold or has sufficient velocity
    const hasVelocity = Math.abs(velocity) > minVelocity;
    const meetsThreshold = Math.abs(diff) > threshold;
    
    if (meetsThreshold || (hasVelocity && Math.abs(diff) > 20)) {
      const nudge = 90;

      if ((diff > 0 || (diff > 0 && hasVelocity)) && prevPage) {
        setSwipeOffset(nudge);
        setTimeout(() => {
          navigate(prevPage);
          setSwipeOffset(0);
        }, 140);
        return;
      }

      if ((diff < 0 || (diff < 0 && hasVelocity)) && nextPage) {
        setSwipeOffset(-nudge);
        setTimeout(() => {
          navigate(nextPage);
          setSwipeOffset(0);
        }, 140);
        return;
      }
    }

    // Snap back when no navigation happens
    setSwipeOffset(0);
    
    touchStartX.current = 0;
    touchStartTime.current = 0;
    currentX.current = 0;
    lastVelocity.current = 0;
  }, [navigate, nextPage, prevPage, threshold, minVelocity]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true, cancelable: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    swipeOffset,
    isSwiping,
    getSwipeStyle: () => ({
      transform: `translateX(${swipeOffset}px)`,
      transition: isSwiping ? 'none' : `transform 0.4s ${SWIPE_EASING}`,
      willChange: 'transform',
      backfaceVisibility: 'hidden',
      perspective: 1000,
    }),
  };
};
