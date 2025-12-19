import React, { useEffect, useState } from "react";
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
    // Scroll to top smoothly on page change
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Immediately swap to the new children to avoid black flashes, then fade in
    setDisplayChildren(children);
    setActiveKey(location.pathname);
    setIsTransitioning(true);

    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [location.pathname, children]);

  return (
    <div
      key={activeKey}
      style={{
        opacity: isTransitioning ? 0 : 1,
        transition: "opacity 0.28s ease-in-out",
        willChange: "opacity",
      }}
    >
      <style>{`
        /* Keep keyframes in case other parts reuse them */
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
      `}</style>
      {displayChildren}
    </div>
  );
};

export default PageTransition;
