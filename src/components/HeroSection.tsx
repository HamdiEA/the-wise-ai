import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import t, { tr } from "@/data/translations";
import VideoCarousel from "@/components/VideoCarousel";

const HeroSection = () => {
  const { lang } = useLanguage();

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden md:min-h-[600px]">
      <div className="hero-video-wrap" aria-hidden="true">
        <VideoCarousel />
        <div className="hero-overlay" />
        <div className="hero-overlay-side" />
      </div>

      <div
        className="absolute top-1/3 -left-32 w-80 h-80 rounded-full bg-primary/8 blur-[100px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/3 -right-32 w-72 h-72 rounded-full bg-accent/8 blur-[90px] pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-4xl mx-auto">
        <div
          className="hero-ornament animate-luxe-fade-up"
          style={{ animationDelay: "0.1s" }}
        >
          {tr(t.hero.tagline, lang)}
        </div>

        <h1
          className="font-display hero-title animate-hero-text-in"
          style={{ animationDelay: "0.3s" }}
        >
          The Wise
        </h1>

        <p
          className="font-display hero-restaurant animate-hero-text-in"
          style={{ animationDelay: "0.5s" }}
        >
          ~ Restaurant ~
        </p>

        <p
          className="hero-desc animate-luxe-fade-up"
          style={{ animationDelay: "0.65s" }}
        >
          {tr(t.hero.subtitle, lang)}
        </p>

        <div
          className="animate-luxe-fade-up"
          style={{ animationDelay: "0.8s" }}
        >
          <Link to="/menu" className="hero-cta">
            {tr(t.hero.cta, lang)}
            <ArrowRight className="hero-cta__icon" />
          </Link>
        </div>

        <div
          className="hero-stats animate-luxe-fade-up"
          style={{ animationDelay: "1s" }}
        >
          <div className="hero-stat">
            <span className="hero-stat__num">50+</span>
            <span className="hero-stat__label">{tr(t.hero.stats.dishes, lang)}</span>
          </div>
          <div className="hero-stat__divider" aria-hidden="true" />
          <div className="hero-stat">
            <span className="hero-stat__num">3</span>
            <span className="hero-stat__label">{tr(t.hero.stats.locations, lang)}</span>
          </div>
          <div className="hero-stat__divider" aria-hidden="true" />
          <div className="hero-stat">
            <span className="hero-stat__num">5</span>
            <span className="hero-stat__label">{tr(t.hero.stats.years, lang)}</span>
          </div>
        </div>

      </div>
      <div className="hero-scroll-indicator">
        {tr(t.hero.scrollHint, lang)}
      </div>
    </section>
  );
};

export default HeroSection;
