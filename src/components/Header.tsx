import { useEffect, useState } from "react";
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
import { useLanguage, Lang } from "@/context/LanguageContext";
import t, { tr } from "@/data/translations";

const LANGS: { code: Lang; label: string }[] = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'عر' },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang } = useLanguage();

  useEffect(() => {
    const root = document.getElementById("root");
    const target = root || window;
    const handleScroll = () => {
      const scrollTop = root ? root.scrollTop : window.scrollY;
      setScrolled(scrollTop > 20);
    };
    handleScroll();
    target.addEventListener("scroll", handleScroll, { passive: true });
    return () => target.removeEventListener("scroll", handleScroll);
  }, []);

  const locations = [
    { name: "Bardo Tunis",        phone: "52 555 414", address: "AV HABIB BOURGUIBA (RUE DES ORANGES) 2000, BARDO TUNIS" },
    { name: "Teboulba",           phone: "93 560 560", address: "RUE HABIB BOURGUIBA - TEBOULBA" },
    { name: "Ksar Hellal Monastir",phone: "52 555 400", address: "AV HAJ ALI SOUA KSAR HELLAL - MONASTIR" },
  ];

  const navLink = "relative text-xs uppercase tracking-[0.32em] text-foreground/80 hover:text-primary transition-smooth rounded-full px-4 py-2 group";

  return (
    <header className={`site-header ${scrolled ? "site-header--scrolled" : "site-header--top"}`}>
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">

          {/* Logo only — no text */}
          <Link to="/" className="flex items-center group" aria-label="The Wise Restaurant">
            <div className="relative">
              <img
                src={logo}
                alt="The Wise"
                className="h-11 md:h-13 w-auto rounded-xl ring-1 ring-primary/30 shadow-elegant transition-smooth group-hover:ring-primary/65 group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 blur-2xl -z-10 opacity-75" />
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-2 glass rounded-full px-3 py-2 shadow-elegant">
            <Link to="/menu" className={navLink}>
              {tr(t.nav.menu, lang)}
              <span className="absolute -bottom-2 left-1/2 h-px w-0 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary to-transparent transition-all duration-500 group-hover:w-full" />
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-xs uppercase tracking-[0.28em] rounded-full px-4">
                  <Phone className="h-3.5 w-3.5 mr-1" />
                  {tr(t.nav.contact, lang)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="glass w-72 rounded-2xl p-2 shadow-elegant">
                {locations.map((loc, i) => (
                  <DropdownMenuItem key={i} className="m-1 flex cursor-pointer flex-col items-start rounded-xl p-4 text-foreground hover:bg-primary/12 focus:bg-primary/12">
                    <div className="font-display text-lg text-gradient-gold">{loc.name}</div>
                    <div className="text-sm text-muted-foreground">📞 {loc.phone}</div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-xs uppercase tracking-[0.28em] rounded-full px-4">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {tr(t.nav.address, lang)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="glass w-96 rounded-2xl p-2 shadow-elegant">
                {locations.map((loc, i) => (
                  <DropdownMenuItem key={i} className="m-1 flex cursor-pointer flex-col items-start rounded-xl p-4 text-foreground hover:bg-primary/12 focus:bg-primary/12">
                    <div className="font-display text-lg text-gradient-gold">{loc.name}</div>
                    <div className="text-sm leading-relaxed text-muted-foreground">{loc.address}</div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language switcher */}
            <div className="flex items-center gap-0.5 glass rounded-full px-1.5 py-1 ml-1">
              {LANGS.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-smooth ${
                    lang === code
                      ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-sm'
                      : 'text-foreground/65 hover:text-primary'
                  }`}
                  aria-label={`Language: ${label}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </nav>

          {/* Mobile: lang + hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile language switcher */}
            <div className="flex items-center gap-0.5 glass rounded-full px-1.5 py-1">
              {LANGS.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={`rounded-full px-2 py-1 text-[10px] font-medium transition-smooth ${
                    lang === code
                      ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground'
                      : 'text-foreground/65 hover:text-primary'
                  }`}
                  aria-label={label}
                >
                  {label}
                </button>
              ))}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass w-80 rounded-2xl p-2 shadow-elegant">
                <DropdownMenuItem asChild className="rounded-xl p-4">
                  <Link to="/menu" className="w-full text-foreground hover:text-primary">
                    {tr(t.nav.menu, lang)}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-4 text-xs uppercase tracking-[0.32em] text-primary pointer-events-none">
                  {tr(t.nav.contact, lang)} & {tr(t.nav.address, lang)}
                </DropdownMenuItem>
                {locations.map((loc, i) => (
                  <DropdownMenuItem key={i} className="m-1 flex cursor-pointer flex-col items-start rounded-xl p-4 text-foreground hover:bg-primary/12 focus:bg-primary/12">
                    <div className="font-display text-lg text-gradient-gold">{loc.name}</div>
                    <div className="text-xs text-muted-foreground">📞 {loc.phone}</div>
                    <div className="text-xs leading-relaxed text-muted-foreground">{loc.address}</div>
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
