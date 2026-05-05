import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Clock3, Lightbulb, MapPin, Phone, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useSmoothSwipe } from "@/hooks/use-smooth-swipe";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useLanguage } from "@/context/LanguageContext";
import t, { tr, trArr } from "@/data/translations";

const AiAvatar = () => (
  <div className="wise-ai-avatar" aria-hidden="true">
    <Sparkles size={13} />
  </div>
);

const Index = () => {
  const { getSwipeStyle } = useSmoothSwipe({ nextPage: "/menu" });
  const aiLeft = useScrollReveal({ threshold: 0.12 });
  const aiRight = useScrollReveal({ threshold: 0.12, delay: 140 });
  const { lang } = useLanguage();
  const isRTL = lang === "ar";

  const features = trArr(t.chat.features, lang);
  const locationIntro = {
    fr: "TROUVEZ-NOUS",
    en: "FIND US",
    ar: "اعثر علينا",
  }[lang];
  const locationTitleLead = {
    fr: "Nos",
    en: "Our",
    ar: "فروعنا",
  }[lang];
  const locationTitleAccent = {
    fr: "Emplacements",
    en: "Locations",
    ar: "المواقع",
  }[lang];
  const locationHours = {
    fr: "Lun-Dim : 12h00 - 00h00",
    en: "Mon-Sun : 12:00 - 00:00",
    ar: "الإثنين-الأحد: 12:00 - 00:00",
  }[lang];
  const locations = [
    {
      order: "01",
      city: "Bardo Tunis",
      phone: "52 555 414",
      address: "AV HABIB BOURGUIBA (RUE DES ORANGES) 2000, BARDO TUNIS",
    },
    {
      order: "02",
      city: "Teboulba",
      phone: "93 560 560",
      address: "RUE HABIB BOURGUIBA - TEBOULBA",
    },
    {
      order: "03",
      city: "Ksar Hellal Monastir",
      phone: "52 555 400",
      address: "AV HAJ ALI SOUA KSAR HELLAL - MONASTIR",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen" style={getSwipeStyle()}>
      <Header />

      <div className="flex-1">
        <HeroSection />

        <section className="relative overflow-hidden px-4 py-24">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-primary/6 blur-[120px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="container mx-auto max-w-6xl" dir={isRTL ? "rtl" : "ltr"}>
            <div className="mx-auto max-w-4xl text-center">
              <div className="flex items-center justify-center gap-4 text-primary/85">
                <span className="h-px w-10 bg-gradient-to-r from-transparent to-primary/60" />
                <p className="text-[11px] uppercase tracking-[0.42em]">{locationIntro}</p>
                <span className="h-px w-10 bg-gradient-to-l from-transparent to-primary/60" />
              </div>

              <h2 className="mt-5 font-display text-5xl leading-none md:text-7xl">
                <span className="text-foreground/92">{locationTitleLead} </span>
                <span className="text-gradient-gold">{locationTitleAccent}</span>
              </h2>

              <div className="mx-auto mt-6 flex items-center justify-center gap-3 text-primary/65" aria-hidden="true">
                <span className="h-px w-14 bg-gradient-to-r from-transparent to-primary/55" />
                <span className="text-sm">•</span>
                <span className="h-px w-14 bg-gradient-to-l from-transparent to-primary/55" />
              </div>

              <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {tr(t.info.subtitle, lang)}
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {locations.map((location) => (
                <article
                  key={location.order}
                  className={`rounded-[1.7rem] border border-border/70 bg-card/55 p-8 shadow-elegant backdrop-blur-xl transition-smooth hover:-translate-y-1.5 hover:border-primary/40 hover:bg-card/70 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  <p className="text-[10px] uppercase tracking-[0.34em] text-primary/75">N°{location.order}</p>

                  <h3 className="mt-3 font-display text-4xl leading-tight text-foreground/95">{location.city}</h3>

                  <div className={`mt-5 flex items-center gap-3 text-primary/70 ${isRTL ? "flex-row-reverse" : ""}`} aria-hidden="true">
                    <span className="h-px w-12 bg-gradient-to-r from-primary/55 to-transparent" />
                    <span className="text-sm">•</span>
                  </div>

                  <div className="mt-7 space-y-4 text-base">
                    <div className={`flex items-start gap-3 text-muted-foreground ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                      <Clock3 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span>{locationHours}</span>
                    </div>

                    <div className={`flex items-start gap-3 text-foreground/90 ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                      <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <a
                        href={`tel:+216${location.phone.replace(/\s/g, "")}`}
                        className="hover:text-primary transition-smooth"
                      >
                        {location.phone}
                      </a>
                    </div>

                    <div className={`flex items-start gap-3 text-muted-foreground ${isRTL ? "flex-row-reverse text-right" : ""}`}>
                      <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                      <span className="leading-relaxed">{location.address}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="assistant" className="relative overflow-hidden py-24 px-4">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -top-40 left-1/4 w-[480px] h-[480px] rounded-full bg-primary/6 blur-[120px] pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-40 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/6 blur-[100px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div
                ref={aiLeft.ref}
                className={`space-y-7 scroll-reveal-left ${aiLeft.isVisible ? "revealed" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <span className="h-px w-10 bg-gradient-to-r from-transparent to-primary/60" />
                  <p className="text-primary uppercase tracking-[0.4em] text-[10px] sm:text-xs">
                    {tr(t.chat.sectionLabel, lang)}
                  </p>
                </div>

                <h2 className="font-display text-5xl md:text-6xl leading-[1.05]">
                  {tr(t.chat.titleSuffix, lang)}{" "}
                  <span className="text-gradient-gold">The Wise</span>
                </h2>

                <p className="text-muted-foreground leading-relaxed">
                  {tr(t.chat.desc, lang)}
                </p>

                <ul className="space-y-4">
                  {features.map((item) => (
                    <li key={item} className="flex gap-3 items-start">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                      <span className="text-foreground/85 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="rounded-2xl glass p-5 flex gap-3 items-start">
                  <Lightbulb className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-foreground text-sm mb-1">{tr(t.chat.tip, lang)}</p>
                    <p className="text-muted-foreground text-sm leading-relaxed">{tr(t.chat.tipText, lang)}</p>
                  </div>
                </div>

                <Button
                  asChild
                  variant="outline"
                  className="w-fit rounded-full px-6 glass border-primary/30 hover:border-primary/65 hover:bg-primary/8 transition-smooth"
                >
                  <Link to="/menu">
                    {tr(t.info.viewMenu, lang)}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>

              <div
                ref={aiRight.ref}
                className={`scroll-reveal-right ${aiRight.isVisible ? "revealed" : ""}`}
              >
                <div className="wise-demo-chat glass rounded-[1.5rem] overflow-hidden shadow-elegant">
                  <div className="wise-demo-chat__header">
                    <AiAvatar />
                    <div>
                      <strong>Assistant The Wise</strong>
                      <span className="wise-chat-panel__online">
                        <span className="wise-status-dot" aria-hidden="true" />
                        {tr(t.chat.online, lang)}
                      </span>
                    </div>
                  </div>

                  <div className="wise-demo-chat__body">
                    <div className="wise-demo-msg wise-demo-msg--assistant">
                      <AiAvatar />
                      <div className="wise-demo-msg__bubble">{tr(t.chat.demoGreeting, lang)}</div>
                    </div>
                    <div className="wise-demo-msg wise-demo-msg--user">
                      <div className="wise-demo-msg__bubble">{tr(t.chat.demoUserMsg, lang)}</div>
                    </div>
                    <div className="wise-demo-msg wise-demo-msg--assistant">
                      <AiAvatar />
                      <div className="wise-demo-msg__bubble">{tr(t.chat.demoReply, lang)}</div>
                    </div>
                  </div>

                  <div className="wise-demo-chat__input">
                    <span>{tr(t.ai.placeholder, lang)}</span>
                    <button aria-label="send" className="wise-demo-send">→</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Index;
