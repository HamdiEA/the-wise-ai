import backgroundImg from "@/assets/aa.jpg";

const GlobalBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Background image */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          filter: "blur(2px) brightness(0.7)",
          transform: "scale(1.05) translate3d(0, 0, 0)",
          willChange: "transform",
        }}
      />

      {/* Festive snow and sparkles */}
      <div className="snow-layer" aria-hidden="true" />
      <div className="sparkle-layer" aria-hidden="true" />
  <div className="holiday-lights" aria-hidden="true" />
      
      {/* Dark overlay for better readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-amber-900/20 via-black/30 to-amber-900/20 -z-10" />
      
      {/* Content - grows to fill available space */}
      <div className="relative z-10 flex flex-col flex-1 w-full">
        {children}
      </div>
    </div>
  );
};

export default GlobalBackground;