import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeKey, setActiveKey] = useState(location.pathname);

  useEffect(() => {
    // Detect if mobile to adjust scroll behavior
    const isMobile = window.innerWidth <= 768;
    
    // Use requestAnimationFrame to batch DOM updates
    const scrollPromise = new Promise<void>((resolve) => {
      // Scroll to top instantly on mobile for better performance
      if (location.pathname !== activeKey) {
        window.scrollTo({ top: 0, behavior: isMobile ? "auto" : "smooth" });
      }
      resolve();
    });

    scrollPromise.then(() => {
      // Update all state changes together to reduce re-renders
      setDisplayChildren(children);
      setActiveKey(location.pathname);
      setIsTransitioning(true);

      // Use requestAnimationFrame to schedule the transition end
      const frameId = requestAnimationFrame(() => {
        setIsTransitioning(false);
      });

      return () => cancelAnimationFrame(frameId);
    });
  }, [location.pathname, children, activeKey]);

  const transitionStyle = useMemo(
    () => ({
      opacity: isTransitioning ? 0 : 1,
      // Shorter transition on mobile for snappier feel
      transition: window.innerWidth <= 768 
        ? "opacity 0.15s ease-out" 
        : "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      willChange: isTransitioning ? "opacity" : "auto",
      // Ensure content is ready before display
      minHeight: "100vh",
      contain: "layout style paint",
    }),
    [isTransitioning]
  );

  return (
    <div key={activeKey} style={transitionStyle}>
      {displayChildren}
    </div>
  );
};

export default PageTransition;
