import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GlobalBackground from "@/components/GlobalBackground";

interface MenuLayoutProps {
  children: React.ReactNode;
}

const MenuLayout = ({ children }: MenuLayoutProps) => {
  return (
    <GlobalBackground>
      <div className="flex flex-col flex-1">
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