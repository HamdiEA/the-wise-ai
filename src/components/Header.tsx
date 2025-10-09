import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Phone, MapPin, Menu } from "lucide-react";
import logo from "@/assets/wise-logo.jpg";

const Header = () => {
  const locations = [
    { name: "Bardo Tunis", phone: "52 555 414", address: "AV HABIB BOURGUIBA (RUE DES ORANGES) 2000, BARDO TUNIS" },
    { name: "Ben Arous Tunis", phone: "94 722 566", address: "COMPLEXE COMMERCIAL AV HABIB BOURGUIBA - BEN AROUS" },
    { name: "Ksar Hellal Monastir", phone: "52 555 400", address: "AV HAJ ALI SOUA KSAR HELLAL - MONASTIR" }
  ];

  return (
    <header className="bg-section-bg shadow-sm border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src={logo} alt="The Wise Restaurant" className="h-14 md:h-16 w-auto" />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#menu" className="text-foreground hover:text-restaurant-red transition-colors">
              Menu
            </a>
            
            {/* Contact Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>Contact</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {locations.map((location, index) => (
                  <DropdownMenuItem key={index} className="flex flex-col items-start p-3 hover:bg-restaurant-red hover:text-white cursor-pointer transition-all duration-300">
                    <div className="font-semibold">{location.name}</div>
                    <div className="text-sm opacity-90">📞 {location.phone}</div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Address Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Address</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                {locations.map((location, index) => (
                  <DropdownMenuItem key={index} className="flex flex-col items-start p-3 hover:bg-restaurant-red hover:text-white cursor-pointer transition-all duration-300">
                    <div className="font-semibold">{location.name}</div>
                    <div className="text-sm opacity-90">{location.address}</div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuItem>
                  <a href="#menu" className="w-full">Menu</a>
                </DropdownMenuItem>
                <DropdownMenuItem className="font-semibold text-restaurant-red">
                  Contact & Address
                </DropdownMenuItem>
                {locations.map((location, index) => (
                  <DropdownMenuItem key={index} className="flex flex-col items-start p-3 ml-4 hover:bg-restaurant-red hover:text-white cursor-pointer transition-all duration-300">
                    <div className="font-medium">{location.name}</div>
                    <div className="text-xs opacity-90">📞 {location.phone}</div>
                    <div className="text-xs opacity-90">{location.address}</div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;