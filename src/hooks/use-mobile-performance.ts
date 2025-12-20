import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  fps: number;
  isLowEndDevice: boolean;
  shouldReduceAnimations: boolean;
}

/**
 * Mobile performance optimization hook
 * - Detects low-end devices
 * - Respects prefers-reduced-motion preference
 * - Provides FPS monitoring for performance debugging
 */
export const useMobilePerformance = (): PerformanceMetrics => {
  const fpsRef = useRef<number>(60);
  const framesRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(Date.now());
  const rafRef = useRef<number | null>(null);

  // Detect low-end device
  const isLowEndDevice = (): boolean => {
    const device = navigator.userAgent.toLowerCase();
    const lowEndIndicators = ['iphone_6', 'iphone_5', 'android_4', 'android_5', 'sm-j2'];
    
    // Check device user agent for older devices
    const isOldDevice = lowEndIndicators.some(indicator => device.includes(indicator));
    
    // Check available memory (if available)
    const hasLowMemory = 'deviceMemory' in navigator && (navigator.deviceMemory as number) <= 4;
    
    // Check available cores
    const hasLowCores = 'hardwareConcurrency' in navigator && (navigator.hardwareConcurrency as number) <= 2;
    
    return isOldDevice || hasLowMemory || hasLowCores;
  };

  // Check for prefers-reduced-motion
  const shouldReduceMotion = (): boolean => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };

  // FPS monitoring for performance debugging
  useEffect(() => {
    const measureFPS = () => {
      framesRef.current++;
      const now = Date.now();
      const elapsed = now - lastTimeRef.current;

      if (elapsed >= 1000) {
        fpsRef.current = Math.round((framesRef.current * 1000) / elapsed);
        framesRef.current = 0;
        lastTimeRef.current = now;
      }

      rafRef.current = requestAnimationFrame(measureFPS);
    };

    rafRef.current = requestAnimationFrame(measureFPS);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const lowEndDevice = isLowEndDevice();
  const reduceMotion = shouldReduceMotion();

  return {
    fps: fpsRef.current,
    isLowEndDevice: lowEndDevice,
    shouldReduceAnimations: reduceMotion || lowEndDevice,
  };
};

/**
 * Utility function to apply performance-aware styles
 */
export const getPerformanceStyle = (
  defaultStyle: React.CSSProperties,
  reducedMotionStyle: React.CSSProperties,
  shouldReduceAnimations: boolean
): React.CSSProperties => {
  if (shouldReduceAnimations) {
    return { ...defaultStyle, ...reducedMotionStyle };
  }
  return defaultStyle;
};
