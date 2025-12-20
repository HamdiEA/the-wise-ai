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
    // Use requestAnimationFrame to batch DOM updates
    const scrollPromise = new Promise<void>((resolve) => {
      // Scroll to top at next animation frame for smooth scroll
      if (location.pathname !== activeKey) {
        window.scrollTo({ top: 0, behavior: "auto" });
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
      transition: "opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
      willChange: isTransitioning ? "opacity" : "auto",
    }),
    [isTransitioning]
  );

  return (
    <div key={activeKey} style={transitionStyle}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
      `}</style>
      {displayChildren}
    </div>
  );
};

export default PageTransition;
