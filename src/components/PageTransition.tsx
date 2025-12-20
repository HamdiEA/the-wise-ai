import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeKey, setActiveKey] = useState(location.pathname);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // Clear any pending scroll timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Immediately swap to the new children to prevent visual flashing
    setDisplayChildren(children);
    setActiveKey(location.pathname);
    setIsTransitioning(true);

    // Fast transition - optimized for mobile
    const transitionTimer = setTimeout(() => {
      setIsTransitioning(false);
    }, 200);

    // Scroll to top after transition starts (non-blocking)
    scrollTimeoutRef.current = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "auto" });
    }, 100);

    return () => {
      clearTimeout(transitionTimer);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [location.pathname, children]);

  return (
    <div
      key={activeKey}
      style={{
        opacity: isTransitioning ? 0 : 1,
        transition: "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        willChange: "opacity",
        backfaceVisibility: "hidden",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(0); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(0); }
        }
      `}</style>
      {displayChildren}
    </div>
  );
};

export default PageTransition;
