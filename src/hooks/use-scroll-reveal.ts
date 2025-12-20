import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    delay = 0,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  // On mobile, always show content immediately
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const [isVisible, setIsVisible] = useState(isMobile);

  useEffect(() => {
    // Skip intersection observer on mobile - everything is visible
    if (isMobile) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, delay, isMobile]);

  return { ref, isVisible };
}
