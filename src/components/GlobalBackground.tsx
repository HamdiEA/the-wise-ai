import React, { useMemo } from "react";
import backgroundImg from "@/assets/aa.jpg";

const GlobalBackground = ({ children }: { children: React.ReactNode }) => {
  const lights = useMemo(() => {
    const count = typeof window !== "undefined" && window.innerWidth < 768 ? 12 : 24;
    return Array.from({ length: count }).map(() => {
      const size = 12 + Math.random() * 36; // 12px to 48px
      return {
        left: Math.random() * 100,
        top: Math.random() * 100,
        size,
        opacity: 0.15 + Math.random() * 0.25,
        delay: Math.random() * 6,
        duration: 3 + Math.random() * 6,
      };
    });
  }, []);
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Background image (kept behind content but above body) */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          // Slightly soften and darken to boost card legibility while keeping the photo visible
          filter: "blur(1.5px) brightness(0.82)",
          transform: "scale(1.02) translate3d(0, 0, 0)",
          willChange: "transform",
        }}
      />

      {/* Festive layers sit above the image */}
      <div className="snow-layer z-10" aria-hidden="true" />
      <div className="sparkle-layer z-10" aria-hidden="true" />
      {/* Amber lights: subtle glowing bubbles, randomized positions */}
      <div className="fixed inset-0 z-10 pointer-events-none" aria-hidden="true">
        {lights.map((l, i) => (
          <span
            key={i}
            className="amber-light"
            style={{
              left: `${l.left}%`,
              top: `${l.top}%`,
              width: `${l.size}px`,
              height: `${l.size}px`,
              opacity: l.opacity,
              animationDuration: `${l.duration}s`,
              animationDelay: `${l.delay}s`,
            }}
          />
        ))}
      </div>
      
      {/* Dark overlay for better readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/35 via-black/55 to-black/35 z-20" />
      
      {/* Content - grows to fill available space */}
      <div className="relative z-30 flex flex-col flex-1 w-full">
        {children}
      </div>
    </div>
  );
};

export default GlobalBackground;