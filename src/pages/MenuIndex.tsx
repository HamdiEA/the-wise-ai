import Header from "@/components/Header";
import MenuCategories from "@/components/MenuCategories";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useSmoothSwipe } from "@/hooks/use-smooth-swipe";

const MenuIndex = () => {
  const { getSwipeStyle } = useSmoothSwipe({
    prevPage: "/",
  });

  return (
    <div className="min-h-screen" style={getSwipeStyle()}>
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
    </div>
  );
};

export default MenuIndex;