import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlobalBackground from "@/components/GlobalBackground";

interface MenuLayoutProps {
  children: React.ReactNode;
}

const MenuLayout = ({ children }: MenuLayoutProps) => {
  return (
    <GlobalBackground>
      <Header />
      <div className="pt-20">
        {children}
      </div>
      <Footer />
    </GlobalBackground>
  );
};

export default MenuLayout;