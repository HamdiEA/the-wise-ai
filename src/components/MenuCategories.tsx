import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import saladImg from "@/assets/salad.jpg";
import platsImg from "@/assets/plats.jpg";
import pizza1Img from "@/assets/pizza1.jpg";
import burgerImg from "@/assets/burger.jpg";
import drinkImg from "@/assets/drink.jpg";
import { useLanguage } from "@/context/LanguageContext";
import t, { tr } from "@/data/translations";

const MenuCategories = () => {
  const { lang } = useLanguage();
  const cats = t.menu.categories;

  const categories = [
    { key: 'appetizers',  title: tr(cats.appetizers.title, lang),  desc: tr(cats.appetizers.desc, lang),  image: saladImg,  link: "/menu/appetizers"   },
    { key: 'mainCourses', title: tr(cats.mainCourses.title, lang), desc: tr(cats.mainCourses.desc, lang), image: platsImg,  link: "/menu/main-courses"  },
    { key: 'pasta',       title: tr(cats.pasta.title, lang),       desc: tr(cats.pasta.desc, lang),       image: undefined, link: "/menu/pasta"          },
    { key: 'pizzas',      title: tr(cats.pizzas.title, lang),      desc: tr(cats.pizzas.desc, lang),      image: pizza1Img, link: "/menu/pizzas"         },
    { key: 'sandwiches',  title: tr(cats.sandwiches.title, lang),  desc: tr(cats.sandwiches.desc, lang),  image: burgerImg, link: "/menu/sandwiches"     },
    { key: 'specials',    title: tr(cats.specials.title, lang),    desc: tr(cats.specials.desc, lang),    image: undefined, link: "/menu/specials"       },
    { key: 'snacks',      title: tr(cats.snacks.title, lang),      desc: tr(cats.snacks.desc, lang),      image: undefined, link: "/menu/snacks"         },
    { key: 'drinks',      title: tr(cats.drinks.title, lang),      desc: tr(cats.drinks.desc, lang),      image: drinkImg,  link: "/menu/drinks"         },
  ];

  return (
    <section className="relative overflow-hidden py-20 bg-noise grain rounded-[2rem]">
      <div className="absolute inset-0 bg-gradient-to-b from-background/25 via-transparent to-background/40 pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="ornament mb-5 text-xs uppercase tracking-[0.4em]">{tr(t.menu.label, lang)}</div>
          <h2 className="font-display text-6xl md:text-7xl leading-none text-gradient-gold mb-6">
            {tr(t.menu.title, lang)}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            {tr(t.menu.subtitle, lang)}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <Card
              key={cat.key}
              className="group relative overflow-hidden glass glass-hover rounded-3xl shadow-elegant"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" aria-hidden="true" />
              <CardHeader className="border-b border-border/55 bg-card/40 text-foreground">
                <CardTitle className="font-display text-3xl text-center leading-tight text-gradient-gold">
                  {cat.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {cat.image && (
                  <div className="mb-5 overflow-hidden rounded-2xl shadow-elegant border border-border/50">
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="w-full h-44 object-cover transition-transform duration-700 ease-luxe group-hover:scale-110"
                      style={{ filter: 'contrast(1.06) saturate(0.9) brightness(0.82)' }}
                    />
                  </div>
                )}
                <p className="text-muted-foreground mb-5 text-center leading-relaxed min-h-[2.8rem] text-sm">
                  {cat.desc}
                </p>
                <Link to={cat.link}>
                  <Button variant="restaurant" size="lg" className="w-full rounded-xl">
                    {tr(t.menu.viewCategory, lang)}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuCategories;
