import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import VideoCarousel from "./VideoCarousel";
import { memo } from "react";

const HeroSectionWithVideo = memo(() => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Vidéo en fond */}
      <div className="absolute inset-0 z-0">
        <VideoCarousel />
      </div>

      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 z-5 bg-black/40"></div>

      {/* Content overlay */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main headings */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
            The Wise
          </h1>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-8 leading-tight drop-shadow-lg">
            Restaurant
          </h2>
          
          {/* Tagline */}
          <p className="text-xl md:text-2xl text-gray-100 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md font-light">
            Choisissez votre plat avec sagesse — cuisine d'exception dans nos 3 adresses en Tunisie.
          </p>

          {/* Menu button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/menu">
              <Button 
                variant="restaurant"
                size="xl"
                className="text-white px-10 py-5 text-xl font-bold shadow-2xl"
              >
                Voir le menu
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </div>

          {/* Stats section */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-400 mb-2 drop-shadow-lg">50+</div>
              <div className="text-gray-200 drop-shadow-md">Plats uniques</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-400 mb-2 drop-shadow-lg">3</div>
              <div className="text-gray-200 drop-shadow-md">Adresses</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-400 mb-2 drop-shadow-lg">5</div>
              <div className="text-gray-200 drop-shadow-md">Années d'excellence</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionWithVideo;