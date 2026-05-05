import { MapPin, Phone, Clock, Star, Facebook, Instagram } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import t, { tr } from "@/data/translations";

const Footer = () => {
  const { lang } = useLanguage();

  const locations = [
    {
      name: "Bardo Tunis",
      phone: "52 555 414",
      address: "AV HABIB BOURGUIBA (RUE DES ORANGES) 2000, BARDO TUNIS",
      maps: "https://maps.app.goo.gl/9H9w18iWNMz9trQq8",
      facebook: "https://www.facebook.com/profile.php?id=100083865516162",
    },
    {
      name: "Ksar Hellal Monastir",
      phone: "52 555 400",
      address: "AV HAJ ALI SOUA KSAR HELLAL - MONASTIR",
      maps: "https://maps.app.goo.gl/wd9MgJQgfEfK6JiS6",
      facebook: "https://www.facebook.com/profile.php?id=100058908593379",
    },
    {
      name: "Teboulba",
      phone: "93 560 560",
      address: "RUE HABIB BOURGUIBA - TEBOULBA",
      instagram: "https://www.instagram.com/the.wise_teboulba/",
    },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-background/90 py-10 text-foreground backdrop-blur-xl">
      <div className="absolute inset-0 bg-noise opacity-70 pointer-events-none" aria-hidden="true" />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[520px] h-[1px] bg-gradient-to-r from-transparent via-primary/18 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid gap-6 lg:grid-cols-[1.15fr_2fr] lg:items-start">
          <div className="max-w-sm space-y-3">
            <div className="font-display text-4xl leading-none text-gradient-gold italic">The Wise</div>
            <p className="text-[10px] uppercase tracking-[0.42em] text-primary/90">Restaurant</p>
            <div className="h-px w-20 bg-gradient-to-r from-primary/40 to-transparent" />
            <p className="text-muted-foreground text-sm leading-relaxed">
              {tr(t.footer.tagline, lang)}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {locations.map((loc, i) => (
              <div key={i} className="rounded-2xl border border-border/70 bg-card/35 p-4">
                <h4 className="font-display text-xl leading-tight text-foreground/95">{loc.name}</h4>
                <div className="mt-2 h-px w-16 bg-gradient-to-r from-primary/35 to-transparent" />
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                    <span className="text-muted-foreground leading-relaxed">{loc.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                    <a
                      href={`tel:+216${loc.phone.replace(/\s/g, "")}`}
                      className="text-foreground/80 hover:text-primary transition-smooth"
                    >
                      {loc.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap pt-1">
                    {loc.maps && (
                      <a
                        href={loc.maps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-smooth text-xs"
                      >
                        <Star className="h-3.5 w-3.5" />
                        {tr(t.footer.reviews, lang)}
                      </a>
                    )}
                    {loc.facebook && (
                      <a
                        href={loc.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-smooth text-xs"
                      >
                        <Facebook className="h-3.5 w-3.5" />
                        Facebook
                      </a>
                    )}
                    {loc.instagram && (
                      <a
                        href={loc.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-primary transition-smooth text-xs"
                      >
                        <Instagram className="h-3.5 w-3.5" />
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-border/50 pt-5 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground text-xs sm:text-sm">{tr(t.footer.hours, lang)}</span>
          </div>
          <p className="text-muted-foreground/60 text-xs">{tr(t.footer.rights, lang)}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
