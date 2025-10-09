import { MapPin, Phone, Clock, Star, Facebook } from "lucide-react";

const Footer = () => {
  const locations = [
    { 
      name: "Bardo Tunis", 
      phone: "52 555 414", 
      address: "AV HABIB BOURGUIBA (RUE DES ORANGES) 2000, BARDO TUNIS",
      maps: "https://maps.app.goo.gl/9H9w18iWNMz9trQq8",
      facebook: "https://www.facebook.com/profile.php?id=100083865516162"
    },
    { 
      name: "Ksar Hellal Monastir", 
      phone: "52 555 400", 
      address: "AV HAJ ALI SOUA KSAR HELLAL - MONASTIR",
      maps: "https://maps.app.goo.gl/wd9MgJQgfEfK6JiS6",
      facebook: "https://www.facebook.com/profile.php?id=100058908593379"
    },
    { 
      name: "Ben Arous Tunis", 
      phone: "94 722 566", 
      address: "COMPLEXE COMMERCIAL AV HABIB BOURGUIBA - BEN AROUS",
      maps: "https://maps.app.goo.gl/fVMVXqeftafH3LQz8",
      facebook: "https://www.facebook.com/profile.php?id=61570081937204"
    }
  ];

  return (
    <footer className="bg-warm-neutral text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-restaurant-red-light font-bold text-2xl">
              The Wise
            </h3>
            <p className="text-white/80 font-medium">
              Restaurant
            </p>
            <p className="text-white/70 text-sm">
              Choisissez Votre Nourriture Sagement - Découvrez une cuisine exceptionnelle dans nos trois emplacements en Tunisie.
            </p>
          </div>

          {/* Locations */}
          {locations.map((location, index) => (
            <div key={index} className="space-y-3">
              <h4 className="font-semibold text-restaurant-red-light text-lg">
                {location.name}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-restaurant-red-light flex-shrink-0" />
                  <span className="text-white/80">
                    {location.address}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-restaurant-red-light" />
                  <span className="text-white/80">
                    {location.phone}
                  </span>
                </div>
                <div className="flex items-center space-x-3 mt-2">
                  {location.maps && (
                    <a 
                      href={location.maps} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-white/80 hover:text-restaurant-red-light transition-colors"
                      title="Voir sur Google Maps"
                    >
                      <Star className="h-4 w-4" />
                      <span className="text-xs">Avis</span>
                    </a>
                  )}
                  {location.facebook && (
                    <a 
                      href={location.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-white/80 hover:text-restaurant-red-light transition-colors"
                      title="Page Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                      <span className="text-xs">Facebook</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Clock className="h-4 w-4 text-restaurant-red-light" />
            <span className="text-white/80 text-sm">
              Ouvert Tous les Jours | Les horaires peuvent varier selon l'emplacement
            </span>
          </div>
          <p className="text-white/60 text-sm">
            © 2024 The Wise Restaurant. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
