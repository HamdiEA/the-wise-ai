import { MapPin, Phone, Clock, Star, Facebook, Instagram } from "lucide-react";

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
      name: "Teboulba", 
      phone: "93 560 560", 
      address: "RUE HABIB BOURGUIBA - TEBOULBA",
      instagram: "https://www.instagram.com/the.wise_teboulba/"
    }
  ];

  return (
    <footer className="bg-warm-neutral text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-amber-400 font-bold text-2xl">
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
              <h4 className="font-semibold text-amber-400 text-lg">
                {location.name}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-amber-400 flex-shrink-0" />
                  <span className="text-white/80">
                    {location.address}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-amber-400" />
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
                      className="flex items-center space-x-1 text-white/80 hover:text-amber-400 transition-colors"
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
                      className="flex items-center space-x-1 text-white/80 hover:text-amber-400 transition-colors"
                      title="Page Facebook"
                    >
                      <Facebook className="h-4 w-4" />
                      <span className="text-xs">Facebook</span>
                    </a>
                  )}
                  {location.instagram && (
                    <a 
                      href={location.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-white/80 hover:text-amber-400 transition-colors"
                      title="Instagram"
                    >
                      <Instagram className="h-4 w-4" />
                      <span className="text-xs">Instagram</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Clock className="h-4 w-4 text-amber-400" />
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
