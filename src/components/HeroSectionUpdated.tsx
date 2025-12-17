import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSectionUpdated = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/src/assets/restaurant-exterior.jpg')",
            filter: "brightness(0.4)"
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Bienvenue à
            <br />
            <span className="text-red-500">The Wise</span>
            <br />
            Restaurant
          </h1>
          
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            Découvrez une expérience culinaire unique avec nos plats savoureux, 
            préparés avec des ingrédients frais et passion.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/menu">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Voir le Menu
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">50+</div>
              <div className="text-gray-300">Plats Uniques</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">3</div>
              <div className="text-gray-300">Locations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-500 mb-2">10+</div>
              <div className="text-gray-300">Années d'Expérience</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionUpdated;