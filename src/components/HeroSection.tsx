import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import restaurantExterior from "@/assets/restaurant-exterior.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Enhanced Effects */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 animate-[scale-in_1s_ease-out]"
        style={{ backgroundImage: `url(${restaurantExterior})` }}
      >
        {/* Multi-layered overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-restaurant-red/20 via-transparent to-restaurant-red/10"></div>
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-restaurant-red/50 rounded-full animate-float"></div>
      <div className="absolute top-32 right-16 w-3 h-3 bg-restaurant-red-light/40 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-white/30 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      
      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 animate-fade-in">
        <div className="inline-flex items-center gap-3 bg-black/50 border border-amber-400/40 text-xs md:text-sm px-4 py-2 rounded-full mb-4 shadow-lg">
          <span className="text-amber-300 font-semibold">Festive Season</span>
          <span className="text-white opacity-80">Christmas · New Year’s Eve · Winter Warmers</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-bold mb-4 drop-shadow-2xl">
          The Wise
        </h1>
        <p className="text-2xl md:text-3xl mb-3 opacity-95 drop-shadow-lg">
          Restaurant
        </p>
        <p className="text-lg md:text-xl mb-8 opacity-85 max-w-2xl mx-auto drop-shadow-md">
          Celebrate with cozy dishes, sparkling drinks, and limited-time holiday delights across our three locations.
        </p>
        <Link to="/menu">
          <Button 
            size="lg" 
            variant="restaurant"
            className="text-white px-10 py-4 text-lg font-semibold shadow-2xl hover:shadow-restaurant-red/50 transition-all duration-300 transform hover:scale-105"
          >
            View Holiday Menu
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
