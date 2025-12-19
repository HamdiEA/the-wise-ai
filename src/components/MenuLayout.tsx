import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlobalBackground from "@/components/GlobalBackground";
import { useSmoothSwipe } from "@/hooks/use-smooth-swipe";

interface MenuLayoutProps {
  children: React.ReactNode;
}

const MenuLayout = ({ children }: MenuLayoutProps) => {
  // Enable swipe-left to return to the main menu list
  const { getSwipeStyle } = useSmoothSwipe({ prevPage: "/menu" });

  return (
    <GlobalBackground>
      <div className="flex flex-col flex-1" style={getSwipeStyle()}>
        <Header />
        <div className="flex-1 flex flex-col pt-20">
          <div className="flex-1">
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </GlobalBackground>
  );
};

export default MenuLayout;