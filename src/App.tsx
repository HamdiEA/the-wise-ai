import React, { useEffect } from "react";
import Index from "./pages/Index";
import MenuIndex from "./pages/MenuIndex";
import MenuAppetizers from "./pages/MenuAppetizers";
import MenuMainCourses from "./pages/MenuMainCourses";
import MenuPasta from "./pages/MenuPasta";
import MenuPizzas from "./pages/MenuPizzas";
import MenuSandwiches from "./pages/MenuSandwiches";
import MenuSpecials from "./pages/MenuSpecials";
import MenuSnacks from "./pages/MenuSnacks";
import MenuDrinks from "./pages/MenuDrinks";
import NotFound from "./pages/NotFound";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FloatingChat from "./components/FloatingChat";
import PageTransition from "./components/PageTransition";
import GlobalBackground from "./components/GlobalBackground";

const App: React.FC = () => {
  // Optimize performance for mobile
  useEffect(() => {
    // Prevent pinch zoom on desktop-like devices
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventZoom, { passive: false });

    // Disable double-tap zoom on iOS (optional, can affect accessibility)
    // let lastTouchEnd = 0;
    // document.addEventListener('touchend', (e) => {
    //   const now = Date.now();
    //   if (now - lastTouchEnd <= 300) {
    //     e.preventDefault();
    //   }
    //   lastTouchEnd = now;
    // }, false);

    return () => {
      document.removeEventListener("touchmove", preventZoom);
    };
  }, []);

  return (
    <div>
      <BrowserRouter>
        <GlobalBackground>
          <PageTransition>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/menu" element={<MenuIndex />} />
              <Route path="/menu/appetizers" element={<MenuAppetizers />} />
              <Route path="/menu/main-courses" element={<MenuMainCourses />} />
              <Route path="/menu/pasta" element={<MenuPasta />} />
              <Route path="/menu/pizzas" element={<MenuPizzas />} />
              <Route path="/menu/sandwiches" element={<MenuSandwiches />} />
              <Route path="/menu/specials" element={<MenuSpecials />} />
              <Route path="/menu/snacks" element={<MenuSnacks />} />
              <Route path="/menu/drinks" element={<MenuDrinks />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTransition>
        </GlobalBackground>
      </BrowserRouter>

      {/* Floating assistant available on all pages */}
      <FloatingChat />
    </div>
  );
};

export default App;
