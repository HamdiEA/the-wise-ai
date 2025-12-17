import backgroundImg from "@/assets/aa.jpg";

const GlobalBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen relative">
      {/* Background image */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat -z-10"
        style={{
          backgroundImage: `url(${backgroundImg})`,
          filter: "blur(3px) brightness(0.7)",
          transform: "scale(1.1)",
        }}
      />
      
      {/* Dark overlay for better readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-amber-900/20 via-black/30 to-amber-900/20 -z-10" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlobalBackground;