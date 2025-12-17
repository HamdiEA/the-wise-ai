import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Minus, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import OrderDialog from "../OrderDialog";
import platsImg from "@/assets/plats.jpg";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

const MainCoursesMenu = () => {
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem>>({});
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const { toast } = useToast();

  const handleQuantityChange = (itemKey: string, item: any, delta: number) => {
    setOrderItems(prev => {
      const existing = prev[itemKey];
      if (existing) {
        const newQuantity = existing.quantity + delta;
        if (newQuantity <= 0) {
          const { [itemKey]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [itemKey]: { ...existing, quantity: newQuantity } };
      } else if (delta > 0) {
        const newItem = { 
          name: item.name, 
          price: parseFloat(item.price.replace('dt', '')),
          quantity: 1 
        };
        
        toast({
          title: "Added to cart",
          description: `${item.name} added`,
        });
        
        return { 
          ...prev, 
          [itemKey]: newItem
        };
      }
      return prev;
    });
  };

  const handleOrder = () => {
    setShowOrderDialog(true);
  };

  const totalItems = Object.values(orderItems).reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = Object.values(orderItems).reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const menuData = {
    sections: [
      {
        title: "🥩 Plats Principaux",
        categories: [
          {
            subtitle: "Les Volailles",
            items: [
              { name: "Escalope Grillé", price: "20dt" },
              { name: "Escalope Panée", price: "21dt" },
              { name: "Cordon Bleu", price: "23dt" },
              { name: "French Chicken", price: "26dt" },
              { name: "Suprême de Poulet à l'Italien", price: "26dt" },
              { name: "Chich Taouk", price: "22dt" },
              { name: "Escalope Sauce Champignons", price: "27dt" }
            ]
          },
          {
            subtitle: "Les Viandes",
            items: [
              { name: "Grillade Mixte", price: "33dt" },
              { name: "Émincé de Bœuf à la Crème", price: "33dt" },
              { name: "Filet de Bœuf", price: "42dt" },
              { name: "Kabeb Viande", price: "28dt" },
              { name: "Steak Haché Fondant", price: "31dt" },
              { name: "Côte à l'Os", price: "35dt" }
            ]
          },
          {
            subtitle: "Supplément Sauce",
            items: [
              { name: "Poivre", price: "5dt" },
              { name: "Champignons", price: "6dt" },
              { name: "Roquefort", price: "7dt" }
            ]
          }
        ]
      },
      {
        title: "🦐 Fruits de Mer",
        items: [
          { name: "Poisson Grillé", description: "(Loup ou Bourride)", price: "25dt" },
          { name: "Loup", description: "Garniture du chef", price: "29dt" },
          { name: "à l'Ail", description: "Garniture du chef", price: "35dt" },
          { name: "Fruits de Mer", description: "Garniture du chef", price: "37dt" },
          { name: "Oja Fruits de Mer", price: "43dt" },
          { name: "Délice The Wise", description: "Fruits de Mer / Filet de Poisson / Garniture du chef", price: "48dt" },
          { name: "Gratin Fruits de Mer", description: "Garniture du chef", price: "59dt" }
        ]
      }
    ],
    image: platsImg
  };

  const getOrderList = () => {
    return Object.entries(orderItems).map(([key, item]) => ({
      name: key,
      quantity: item.quantity,
      price: `${item.price}dt`
    }));
  };

  return (
    <section className="py-20 bg-black/20 backdrop-blur-sm relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-transparent to-amber-900/20 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Back button */}
        <div className="mb-8">
          <Link to="/menu">
            <Button variant="outline" size="lg" className="flex items-center gap-3 bg-black/40 backdrop-blur-md border-amber-400/50 text-white hover:bg-amber-600/80 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Back to Menu
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Plats Principaux & Fruits de Mer
          </h1>
          <p className="text-gray-200 text-xl max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Nos spécialités de viandes, volailles et fruits de mer
          </p>
        </div>

        {/* Floating Order Button */}
        {totalItems > 0 && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:bottom-8 md:left-auto md:right-8 md:translate-x-0 z-50 w-[90%] md:w-auto">
            <Button
              onClick={handleOrder}
              size="xl"
              variant="restaurant"
              className="w-full md:w-auto shadow-2xl"
            >
              <ShoppingCart className="mr-2 h-5 w-5 flex-shrink-0" />
              <div className="flex flex-col items-start md:flex-row md:items-center gap-1 md:gap-2">
                <span>Order ({totalItems})</span>
                {totalPrice > 0 && <span className="font-bold">{totalPrice.toFixed(2)}dt</span>}
              </div>
            </Button>
          </div>
        )}

        <div className="grid gap-8">
          {menuData.sections.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="shadow-2xl border border-amber-400/30 bg-black/40 backdrop-blur-md">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                <CardTitle className="text-3xl font-bold text-center drop-shadow-lg">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    {section.categories ? (
                      section.categories.map((category: any, catIndex: number) => (
                        <div key={catIndex} className="space-y-4">
                          <h3 className="font-bold text-2xl text-amber-400 mt-6 flex items-center gap-3">
                            <span className="h-1 w-12 bg-amber-400 rounded"></span>
                            {category.subtitle}
                          </h3>
                          {category.items.map((item: any, itemIndex: number) => (
                            <div key={itemIndex} className="flex justify-between items-start p-5 border border-amber-400/20 last:border-b-0 hover:bg-amber-600/20 backdrop-blur-sm transition-all duration-300 rounded-xl">
                              <div className="flex-1">
                                <h4 className="font-semibold text-xl text-white leading-relaxed">
                                  {item.name}
                                </h4>
                                {item.description && (
                                  <p className="text-gray-200 text-sm mt-1">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-3 ml-4">
                                {item.price && (
                                  <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 border-amber-400/50 text-lg px-3 py-1">
                                    {item.price}
                                  </Badge>
                                )}
                                <div className="flex items-center gap-2 bg-black/40 rounded-full p-1.5 border border-amber-400/30">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-full bg-amber-500/20 text-amber-100 border border-amber-400/50 hover:bg-amber-500/40 hover:text-white"
                                    onClick={() => handleQuantityChange(item.name, item, -1)}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="w-10 text-center text-base font-semibold text-white">
                                    {orderItems[item.name]?.quantity || 0}
                                  </span>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-full bg-amber-500/20 text-amber-100 border border-amber-400/50 hover:bg-amber-500/40 hover:text-white"
                                    onClick={() => handleQuantityChange(item.name, item, 1)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      section.items?.map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className="flex justify-between items-start p-5 border border-amber-400/20 last:border-b-0 hover:bg-amber-600/20 backdrop-blur-sm transition-all duration-300 rounded-xl">
                          <div className="flex-1">
                            <h4 className="font-semibold text-xl text-white leading-relaxed">
                              {item.name}
                            </h4>
                            {item.description && (
                              <p className="text-gray-200 text-sm mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-3 ml-4">
                            {item.price && (
                              <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 border-amber-400/50 text-lg px-3 py-1">
                                {item.price}
                              </Badge>
                            )}
                            <div className="flex items-center gap-2 bg-black/40 rounded-full p-1.5 border border-amber-400/30">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-full bg-amber-500/20 text-amber-100 border border-amber-400/50 hover:bg-amber-500/40 hover:text-white"
                                onClick={() => handleQuantityChange(item.name, item, -1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-10 text-center text-base font-semibold text-white">
                                {orderItems[item.name]?.quantity || 0}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-full bg-amber-500/20 text-amber-100 border border-amber-400/50 hover:bg-amber-500/40 hover:text-white"
                                onClick={() => handleQuantityChange(item.name, item, 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Single image */}
                  {sectionIndex === 0 && menuData.image && (
                    <div className="hidden lg:flex items-center justify-center">
                      <img 
                        src={menuData.image} 
                        alt={section.title}
                        className="max-w-md w-full h-auto object-contain rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-amber-400/30"
                        style={{
                          filter: 'contrast(1.15) saturate(1.2) brightness(1.1)',
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {showOrderDialog && (
        <OrderDialog 
          open={showOrderDialog}
          onOpenChange={setShowOrderDialog}
          orderItems={getOrderList()}
          totalPrice={totalPrice}
        />
      )}
    </section>
  );
};

export default MainCoursesMenu;