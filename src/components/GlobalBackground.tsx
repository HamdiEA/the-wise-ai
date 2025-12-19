import backgroundImg from "@/assets/aa.jpg";

const GlobalBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Background image (kept behind content but above body) */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          // Keep minimal processing so the photo stays bright and visible
          filter: "blur(1px) brightness(0.9)",
          transform: "scale(1.02) translate3d(0, 0, 0)",
          willChange: "transform",
        }}
      />

      {/* Festive layers sit above the image */}
      <div className="snow-layer z-10" aria-hidden="true" />
      <div className="sparkle-layer z-10" aria-hidden="true" />
      <div className="holiday-lights z-10" aria-hidden="true" />
      
      {/* Dark overlay for better readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-amber-900/12 via-black/18 to-amber-900/12 z-20" />
      
      {/* Content - grows to fill available space */}
      <div className="relative z-30 flex flex-col flex-1 w-full">
        {children}
      </div>
    </div>
  );
};

export default GlobalBackground;