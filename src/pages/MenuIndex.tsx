import Header from "@/components/Header";
import MenuCategories from "@/components/MenuCategories";
import Footer from "@/components/Footer";
import GlobalBackground from "@/components/GlobalBackground";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSwipe } from "@/hooks/use-swipe";

const MenuIndex = () => {
  const navigate = useNavigate();
  
  useSwipe({
    onSwipeLeft: () => navigate("/"),
  });

  return (
    <GlobalBackground>
      <Header />
      <div className="pt-24 pb-12 container mx-auto px-4">
        <div className="mb-6">
          <Button asChild variant="outline" className="border-amber-400/60 text-white bg-black/40 hover:bg-amber-600/30">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Link>
          </Button>
        </div>

        <MenuCategories />
      </div>
      <Footer />
    </GlobalBackground>
  );
};

export default MenuIndex;