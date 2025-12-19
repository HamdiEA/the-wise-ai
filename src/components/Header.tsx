import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Phone, MapPin, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/wise-logo.png";

const Header = () => {
  const locations = [
    { name: "Bardo Tunis", phone: "52 555 414", address: "AV HABIB BOURGUIBA (RUE DES ORANGES) 2000, BARDO TUNIS" },
    { name: "Teboulba", phone: "93 560 560", address: "RUE HABIB BOURGUIBA - TEBOULBA" },
    { name: "Ksar Hellal Monastir", phone: "52 555 400", address: "AV HAJ ALI SOUA KSAR HELLAL - MONASTIR" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 via-black/60 to-black/40 backdrop-blur-xl shadow-2xl border-b border-amber-400/20 transition-all duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src={logo} 
                alt="The Wise Restaurant" 
                className="h-12 md:h-14 w-auto rounded-lg shadow-lg ring-2 ring-amber-400/30 hover:ring-amber-400/60 transition-all duration-300" 
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-400/20 to-restaurant-red/20 blur-xl -z-10"></div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/menu" 
              className="text-white font-medium hover:text-amber-400 transition-all duration-300 hover:scale-105 relative group"
            >
              Menu
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            {/* Contact Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 text-white hover:bg-amber-600/20 hover:text-amber-400 transition-all duration-300 rounded-full"
                >
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">Contact</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 bg-black/90 backdrop-blur-xl border border-amber-400/30">
                {locations.map((location, index) => (
                  <DropdownMenuItem 
                    key={index} 
                    className="flex flex-col items-start p-4 hover:bg-amber-600/80 hover:text-white cursor-pointer transition-all duration-300 text-white rounded-lg m-1"
                  >
                    <div className="font-semibold text-amber-400">{location.name}</div>
                    <div className="text-sm opacity-90">📞 {location.phone}</div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Address Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 text-white hover:bg-amber-600/20 hover:text-amber-400 transition-all duration-300 rounded-full"
                >
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium">Address</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-96 bg-black/90 backdrop-blur-xl border border-amber-400/30">
                {locations.map((location, index) => (
                  <DropdownMenuItem 
                    key={index} 
                    className="flex flex-col items-start p-4 hover:bg-amber-600/80 hover:text-white cursor-pointer transition-all duration-300 text-white rounded-lg m-1"
                  >
                    <div className="font-semibold text-amber-400">{location.name}</div>
                    <div className="text-sm opacity-90 leading-relaxed">{location.address}</div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-amber-600/20 hover:text-amber-400 rounded-full"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-black/90 backdrop-blur-xl border border-amber-400/30">
                <DropdownMenuItem asChild className="p-4">
                  <Link to="/menu" className="w-full text-white font-medium hover:text-amber-400 transition-colors">Menu</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="font-semibold text-amber-400 p-4">
                  Contact & Address
                </DropdownMenuItem>
                {locations.map((location, index) => (
                  <DropdownMenuItem 
                    key={index} 
                    className="flex flex-col items-start p-4 ml-4 hover:bg-amber-600/80 hover:text-white cursor-pointer transition-all duration-300 text-white rounded-lg m-1"
                  >
                    <div className="font-medium text-amber-400">{location.name}</div>
                    <div className="text-xs opacity-90">📞 {location.phone}</div>
                    <div className="text-xs opacity-90 leading-relaxed">{location.address}</div>
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