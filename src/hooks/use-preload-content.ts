import { useEffect, useState } from 'react';

export function usePreloadContent() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for DOM to be interactive
    if (document.readyState === 'loading') {
      const handleReady = () => {
        setIsReady(true);
      };
      document.addEventListener('DOMContentLoaded', handleReady);
      return () => document.removeEventListener('DOMContentLoaded', handleReady);
    } else {
      setIsReady(true);
    }
  }, []);

  return isReady;
}

// Preload critical images
export function preloadImages(imageUrls: string[]) {
  return Promise.all(
    imageUrls.map((url) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      });
    })
  );
}
