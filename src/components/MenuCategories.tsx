import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import saladImg from "@/assets/salad.jpg";
import platsImg from "@/assets/plats.jpg";
import pizza1Img from "@/assets/pizza1.jpg";
import burgerImg from "@/assets/burger.jpg";
import drinkImg from "@/assets/drink.jpg";

const MenuCategories = () => {
  const categories = [
    {
      title: "🥗 Entrées",
      description: "Salades et entrées chaudes",
      image: saladImg,
      link: "/menu/appetizers"
    },
    {
      title: "🥩 Plats Principaux",
      description: "Volailles, viandes et fruits de mer",
      image: platsImg,
      link: "/menu/main-courses"
    },
    {
      title: "🍝 Pâtes",
      description: "Pâtes italiennes et sauces maison",
      link: "/menu/pasta"
    },
    {
      title: "🍕 Pizzas",
      description: "Pizzas traditionnelles et spéciales",
      image: pizza1Img,
      link: "/menu/pizzas"
    },
    {
      title: "🥪 Sandwichs & Burgers",
      description: "Ciabata, baguette et burgers",
      image: burgerImg,
      link: "/menu/sandwiches"
    },
    {
      title: "🍗 Spécial The Wise",
      description: "Box chicken, bowls et menus enfants",
      link: "/menu/specials"
    },
    {
      title: "🧁 Snacks & Desserts",
      description: "Crêpes, gaufres et douceurs",
      link: "/menu/snacks"
    },
    {
      title: "🥤 Boissons",
      description: "Cocktails, jus et boissons chaudes",
      image: drinkImg,
      link: "/menu/drinks"
    }
  ];

  return (
    <section className="py-20 bg-black/20 backdrop-blur-sm relative overflow-hidden w-full">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none"></div>
      
      <div className="px-4 relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Notre Carte
          </h2>
          <p className="text-gray-200 text-xl max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Choisissez une catégorie pour découvrir nos plats
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Card key={index} className="shadow-2xl border border-amber-400/30 hover:shadow-3xl transition-all duration-500 hover:scale-105 group bg-black/40 backdrop-blur-md">
              <CardHeader className="bg-black/60 text-white border-b border-amber-400/30">
                <CardTitle className="text-2xl font-bold text-center drop-shadow-lg">
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {category.image && (
                  <div className="mb-6 overflow-hidden rounded-xl shadow-lg">
                    <img 
                      src={category.image} 
                      alt={category.title}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      style={{
                        filter: 'contrast(1.15) saturate(1.2) brightness(1.1)',
                      }}
                    />
                  </div>
                )}
                <p className="text-gray-200 mb-6 text-center leading-relaxed">
                  {category.description}
                </p>
                <Link to={category.link}>
                  <Button 
                    variant="restaurant"
                    size="lg"
                    className="w-full shadow-2xl group-hover:shadow-amber-500/50"
                  >
                    Voir la catégorie
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
};

export default MenuCategories;