import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface SmoothSwipeOptions {
  nextPage?: string;
  prevPage?: string;
  threshold?: number;
}

export const useSmoothSwipe = ({ nextPage, prevPage, threshold = 100 }: SmoothSwipeOptions) => {
  const navigate = useNavigate();
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const currentX = useRef<number>(0);
  const currentY = useRef<number>(0);
  const hasHorizontalIntent = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length !== 1) return;

    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    currentX.current = e.touches[0].clientX;
    currentY.current = e.touches[0].clientY;
    hasHorizontalIntent.current = false;
    setIsSwiping(false);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStartX.current) return;

    currentX.current = e.touches[0].clientX;
    currentY.current = e.touches[0].clientY;

    const diffX = currentX.current - touchStartX.current;
    const diffY = currentY.current - touchStartY.current;

    // Establish horizontal intent before applying transforms
    if (!hasHorizontalIntent.current) {
      const minMove = 12; // deadzone
      if (Math.abs(diffX) < minMove && Math.abs(diffY) < minMove) return;

      // Require horizontal dominance to avoid vertical scroll jitter
      if (Math.abs(diffX) > Math.abs(diffY) * 1.25) {
        hasHorizontalIntent.current = true;
        setIsSwiping(true);
      } else {
        // Vertical scroll: do nothing
        return;
      }
    }

    // Apply resistance at edges
    const resistance = 0.5;
    let offset = diffX;

    if (diffX > 0 && !prevPage) {
      offset = diffX * resistance * 0.3;
    } else if (diffX < 0 && !nextPage) {
      offset = diffX * resistance * 0.3;
    } else {
      offset = diffX * resistance;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      setSwipeOffset(offset);
      animationFrameRef.current = null;
    });
  }, [nextPage, prevPage]);

  const handleTouchEnd = useCallback(() => {
    const diff = currentX.current - touchStartX.current;

    // Only react if we ever established horizontal intent
    const shouldHandle = hasHorizontalIntent.current;
    hasHorizontalIntent.current = false;
    setIsSwiping(false);

    if (shouldHandle && Math.abs(diff) > threshold) {
      const nudge = 80;

      if (diff > 0 && prevPage) {
        setSwipeOffset(nudge);
        const timeoutId = setTimeout(() => {
          navigate(prevPage);
          setSwipeOffset(0);
        }, 120);
        return () => clearTimeout(timeoutId);
      }

      if (diff < 0 && nextPage) {
        setSwipeOffset(-nudge);
        const timeoutId = setTimeout(() => {
          navigate(nextPage);
          setSwipeOffset(0);
        }, 120);
        return () => clearTimeout(timeoutId);
      }
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      setSwipeOffset(0);
      animationFrameRef.current = null;
    });
    
    touchStartX.current = 0;
    touchStartY.current = 0;
    currentX.current = 0;
    currentY.current = 0;
  }, [navigate, nextPage, prevPage, threshold]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    swipeOffset,
    isSwiping,
    getSwipeStyle: () => {
      return {
        transform: `translateX(${swipeOffset}px)`,
        transition: isSwiping
          ? 'none'
          : 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform',
      };
    },
  };
};
