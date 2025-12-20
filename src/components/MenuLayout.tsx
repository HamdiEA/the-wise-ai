import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSmoothSwipe } from "@/hooks/use-smooth-swipe";
import { memo } from "react";

interface MenuLayoutProps {
  children: React.ReactNode;
}

const MenuLayout = memo(({ children }: MenuLayoutProps) => {
  // Enable swipe-left to return to the main menu list
  const { getSwipeStyle } = useSmoothSwipe({ prevPage: "/menu" });

  return (
    <div className="flex flex-col min-h-screen" style={getSwipeStyle()}>
      <Header />
      <div className="flex-1 flex flex-col pt-20">
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
});

MenuLayout.displayName = 'MenuLayout';

export default MenuLayout;