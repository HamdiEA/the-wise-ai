import Header from "@/components/Header";
import MenuCategories from "@/components/MenuCategories";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useSmoothSwipe } from "@/hooks/use-smooth-swipe";
import { useLanguage } from "@/context/LanguageContext";
import t, { tr } from "@/data/translations";

const MenuIndex = () => {
  const { getSwipeStyle } = useSmoothSwipe({ prevPage: "/" });
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen site-background" style={getSwipeStyle()}>
      <Header />
      <div className="pt-28 pb-16 container mx-auto px-4">
        <div className="mb-6">
          <Button asChild variant="outline" className="menu-back">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {tr(t.nav.backHome, lang)}
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
