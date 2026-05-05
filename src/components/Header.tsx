import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage, Lang } from "@/context/LanguageContext";
import t, { tr } from "@/data/translations";

const LANGS: { code: Lang; label: string }[] = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
  { code: "ar", label: "\u0639\u0631" },
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
    { name: "Bardo Tunis", phone: "52 555 414", address: "AV HABIB BOURGUIBA (RUE DES ORANGES) 2000, BARDO TUNIS" },
    { name: "Teboulba", phone: "93 560 560", address: "RUE HABIB BOURGUIBA - TEBOULBA" },
    { name: "Ksar Hellal Monastir", phone: "52 555 400", address: "AV HAJ ALI SOUA KSAR HELLAL - MONASTIR" },
  ];

  const navLink = "text-xs uppercase tracking-[0.30em] text-foreground/75 hover:text-primary transition-smooth";

  return (
    <header className={`site-header ${scrolled ? "site-header--scrolled" : "site-header--top"}`}>
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-end gap-2" aria-label="The Wise Restaurant">
            <span className="font-display text-4xl leading-none text-gradient-gold">The Wise</span>
            <span className="mb-0.5 text-sm italic text-foreground/55">Restaurant</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            <Link to="/menu" className={navLink}>
              {tr(t.nav.menu, lang).toUpperCase()}
            </Link>
            <a href="#assistant" className={navLink}>
              {tr(t.nav.contact, lang).toUpperCase()}
            </a>
            <a href="#locations" className={navLink}>
              {tr(t.nav.address, lang).toUpperCase()}
            </a>

            <div className="ml-1 flex items-center gap-0.5 rounded-full border border-border/70 bg-card/30 px-1.5 py-1">
              {LANGS.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-smooth ${
                    lang === code
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                      : "text-foreground/65 hover:text-primary"
                  }`}
                  aria-label={`Language: ${label}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex items-center gap-0.5 glass rounded-full px-1.5 py-1">
              {LANGS.map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  className={`rounded-full px-2 py-1 text-[10px] font-medium transition-smooth ${
                    lang === code
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                      : "text-foreground/65 hover:text-primary"
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
                <DropdownMenuItem asChild className="rounded-xl p-4">
                  <a href="#assistant" className="w-full text-foreground hover:text-primary">
                    {tr(t.nav.contact, lang)}
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-xl p-4">
                  <a href="#locations" className="w-full text-foreground hover:text-primary">
                    {tr(t.nav.address, lang)}
                  </a>
                </DropdownMenuItem>

                {locations.map((loc, i) => (
                  <DropdownMenuItem key={i} className="m-1 flex cursor-pointer flex-col items-start rounded-xl p-4 text-foreground hover:bg-primary/12 focus:bg-primary/12">
                    <div className="font-display text-lg text-gradient-gold">{loc.name}</div>
                    <div className="text-xs text-muted-foreground">{loc.phone}</div>
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
