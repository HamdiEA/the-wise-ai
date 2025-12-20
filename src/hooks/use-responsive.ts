import React, { useEffect, useState } from 'react';

interface ResponsiveConfig {
  xs: boolean; // < 640px
  sm: boolean; // >= 640px
  md: boolean; // >= 768px
  lg: boolean; // >= 1024px
  xl: boolean; // >= 1280px
  isMobile: boolean; // < 768px
  isTablet: boolean; // >= 768px && < 1024px
  isDesktop: boolean; // >= 1024px
}

/**
 * Hook to detect responsive breakpoints - optimized for mobile
 * Uses CSS media queries for better performance than window.matchMedia polling
 */
export const useResponsive = (): ResponsiveConfig => {
  const [config, setConfig] = useState<ResponsiveConfig>({
    xs: true,
    sm: false,
    md: false,
    lg: false,
    xl: false,
    isMobile: true,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    // Create media queries for each breakpoint
    const breakpoints = {
      xs: '(max-width: 639px)',
      sm: '(min-width: 640px)',
      md: '(min-width: 768px)',
      lg: '(min-width: 1024px)',
      xl: '(min-width: 1280px)',
    };

    const updateConfig = () => {
      const newConfig: ResponsiveConfig = {
        xs: window.matchMedia(breakpoints.xs).matches,
        sm: window.matchMedia(breakpoints.sm).matches,
        md: window.matchMedia(breakpoints.md).matches,
        lg: window.matchMedia(breakpoints.lg).matches,
        xl: window.matchMedia(breakpoints.xl).matches,
        isMobile: window.matchMedia('(max-width: 767px)').matches,
        isTablet: window.matchMedia('(min-width: 768px) and (max-width: 1023px)').matches,
        isDesktop: window.matchMedia('(min-width: 1024px)').matches,
      };
      setConfig(newConfig);
    };

    // Initial update
    updateConfig();

    // Listen for orientation changes and resize
    window.addEventListener('orientationchange', updateConfig, { passive: true });
    window.addEventListener('resize', updateConfig, { passive: true });

    return () => {
      window.removeEventListener('orientationchange', updateConfig);
      window.removeEventListener('resize', updateConfig);
    };
  }, []);

  return config;
};

/**
 * Component to conditionally render based on responsive breakpoints
 */
interface ResponsiveProps {
  children: React.ReactNode;
  show?: keyof Omit<ResponsiveConfig, 'xs' | 'sm' | 'md' | 'lg' | 'xl'>;
  hide?: keyof Omit<ResponsiveConfig, 'xs' | 'sm' | 'md' | 'lg' | 'xl'>;
  className?: string;
}

export const Responsive: React.FC<ResponsiveProps> = ({ 
  children, 
  show, 
  hide, 
  className = '' 
}) => {
  const config = useResponsive();

  let shouldShow = true;

  if (show) {
    shouldShow = config[show] as boolean;
  }

  if (hide) {
    shouldShow = !config[hide] as boolean;
  }

  if (!shouldShow) {
    return null;
  }

  return <div className={className}>{children}</div>;
};

/**
 * Hook to detect touch device capability
 */
export const useIsTouchDevice = (): boolean => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check multiple ways to detect touch capability
    const hasTouchCapability = () => {
      return (
        ('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        ('msMaxTouchPoints' in navigator && (navigator as any).msMaxTouchPoints > 0)
      );
    };

    setIsTouchDevice(hasTouchCapability());
  }, []);

  return isTouchDevice;
};
