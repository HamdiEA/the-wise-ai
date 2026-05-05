import React from "react";

const GlobalBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="site-background relative flex min-h-screen flex-col overflow-hidden bg-background">
      <div className="site-background__glow site-background__glow--one" aria-hidden="true" />
      <div className="site-background__glow site-background__glow--two" aria-hidden="true" />
      <div className="site-background__glow site-background__glow--three" aria-hidden="true" />
      <div className="site-background__veil" aria-hidden="true" />
      <div className="site-background__grain" aria-hidden="true" />
      <div className="relative z-10 flex min-h-screen flex-1 flex-col w-full">
        {children}
      </div>
    </div>
  );
};

export default GlobalBackground;
