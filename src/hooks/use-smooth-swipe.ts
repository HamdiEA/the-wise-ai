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
  const currentX = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Cancel any pending animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    touchStartX.current = e.touches[0].clientX;
    currentX.current = e.touches[0].clientX;
    setIsSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isSwiping || !touchStartX.current) return;
    
    currentX.current = e.touches[0].clientX;
    const diff = currentX.current - touchStartX.current;
    
    // Apply resistance at edges
    const resistance = 0.5;
    let offset = diff;
    
    // Only allow swipe in directions where pages exist
    if (diff > 0 && !prevPage) {
      offset = diff * resistance * 0.3; // Extra resistance when no prev page
    } else if (diff < 0 && !nextPage) {
      offset = diff * resistance * 0.3; // Extra resistance when no next page
    } else {
      offset = diff * resistance;
    }
    
    // Use requestAnimationFrame for smoother touch tracking
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      setSwipeOffset(offset);
      animationFrameRef.current = null;
    });
  }, [isSwiping, nextPage, prevPage]);

  const handleTouchEnd = useCallback(() => {
    const diff = currentX.current - touchStartX.current;
    
    setIsSwiping(false);
    
    // Determine if swipe was significant enough
    if (Math.abs(diff) > threshold) {
      // Keep a small nudge animation so we do not slide the whole page off-screen
      // and expose the underlying Vercel background while routing.
      const nudge = 80;

      if (diff > 0 && prevPage) {
        setSwipeOffset(nudge);
        const timeoutId = setTimeout(() => {
          navigate(prevPage);
          setSwipeOffset(0);
        }, 100);
        return () => clearTimeout(timeoutId);
      }

      if (diff < 0 && nextPage) {
        setSwipeOffset(-nudge);
        const timeoutId = setTimeout(() => {
          navigate(nextPage);
          setSwipeOffset(0);
        }, 100);
        return () => clearTimeout(timeoutId);
      }
    }

    // Snap back when no navigation happens - use RAF for smooth snap
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    animationFrameRef.current = requestAnimationFrame(() => {
      setSwipeOffset(0);
      animationFrameRef.current = null;
    });
    
    touchStartX.current = 0;
    currentX.current = 0;
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
