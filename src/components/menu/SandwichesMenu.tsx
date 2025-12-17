import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Minus, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import OrderDialog from "../OrderDialog";
import burgerImg from "@/assets/burger.jpg";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

const SandwichesMenu = () => {
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem>>({});
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const { toast } = useToast();
  const categoryName = "🥪 Sandwiches & 🍔 Burgers";

  const handleQuantityChange = (itemKey: string, item: any, delta: number) => {
    setOrderItems(prev => {
      const existing = prev[itemKey];
      if (existing) {
        const newQuantity = existing.quantity + delta;
        if (newQuantity <= 0) {
          const { [itemKey]: _, ...rest } = prev;
          setTimeout(() => {
            const newTotal = Object.values(rest).reduce((sum, i) => sum + (i.price * i.quantity), 0);
            window.dispatchEvent(new CustomEvent("orderUpdated", {
              detail: {
                items: Object.entries(rest).map(([key, item]) => ({
                  name: key,
                  quantity: item.quantity,
                  price: `${item.price}dt`,
                  category: categoryName,
                })),
                total: newTotal,
              }
            }));
          }, 0);
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

  const menuSections = [
    {
      title: "🥪 Sandwiches",
      categories: [
        {
          subtitle: "Ciabata",
          items: [
            { name: "Jambon Dinde", price: "8.5dt" },
            { name: "Esc. Poulet Grillé", price: "9.5dt" },
            { name: "Esc. Poulet Panée", price: "10dt" },
            { name: "Chich Taouk", price: "10dt" },
            { name: "Cordon Bleu", price: "11dt" },
            { name: "Kabeb", price: "12dt" }
          ]
        },
        {
          subtitle: "Special The Wise",
          items: [
            { name: "Mariotte", price: "12dt" },
            { name: "Wilson", price: "13dt" },
            { name: "Savored", price: "13dt" },
            { name: "TacoWise", price: "14dt" }
          ]
        },
        {
          subtitle: "Baguette Farcie / Makloub The Wise",
          items: [
            { name: "Thon", price: "12dt" },
            { name: "Pepperoni", price: "12dt" },
            { name: "Oriental", price: "12dt" },
            { name: "Corleone", price: "13dt" },
            { name: "Kentucky", price: "12dt" },
            { name: "Cheesy Wise", price: "14dt" },
            { name: "Chicken Wise", price: "13dt" },
            { name: "The Wise", price: "14dt" }
          ]
        }
      ]
    },
    {
      title: "🍔 Burgers",
      items: [
        { name: "Chicken Burger", price: "13dt" },
        { name: "Big Chicken Burger", price: "18dt" },
        { name: "Cheese Burger", price: "15dt" },
        { name: "Big Cheese Burger", price: "21dt" },
        { name: "Americain Burger", price: "19dt" },
        { name: "The Wise Burger", price: "22dt" }
      ]
    }
  ];

  const getOrderList = () => {
    return Object.entries(orderItems).map(([key, item]) => ({
      name: key,
      quantity: item.quantity,
      price: `${item.price}dt`,
      category: categoryName,
    }));
  };

  // Emit order updates to FloatingChat
  React.useEffect(() => {
    if (Object.keys(orderItems).length > 0) {
      const totalPrice = Object.values(orderItems).reduce((sum, item) => sum + (item.price * item.quantity), 0);
      window.dispatchEvent(new CustomEvent("orderUpdated", {
        detail: {
          items: getOrderList(),
          total: totalPrice,
        }
      }));
    }
  }, [orderItems]);

  return (
    <section className="py-20 bg-black/20 backdrop-blur-sm relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-900/20 via-transparent to-amber-900/20 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Back button */}
        <div className="mb-8">
          <Link to="/menu">
            <Button variant="outline" size="lg" className="flex items-center gap-3 bg-black/40 backdrop-blur-md border-amber-400/50 text-white hover:bg-amber-600/80 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
              Back to Menu
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            🥪 Sandwiches & 🍔 Burgers
          </h1>
          <p className="text-gray-200 text-xl max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Ciabata, baguette et burgers faits maison
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
              <ShoppingCart className="mr-3 h-6 w-6 flex-shrink-0" />
              <div className="flex flex-col items-start md:flex-row md:items-center gap-1 md:gap-2">
                <span>Order ({totalItems})</span>
                {totalPrice > 0 && <span className="font-bold">{totalPrice.toFixed(2)}dt</span>}
              </div>
            </Button>
          </div>
        )}

        <div className="grid gap-8">
          {menuSections.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="shadow-2xl border border-amber-400/30 bg-black/40 backdrop-blur-md">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                <CardTitle className="text-3xl font-bold text-center drop-shadow-lg">
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-3 md:space-y-4">
                    {section.categories ? (
                      section.categories.map((category: any, catIndex: number) => (
                        <div key={catIndex} className="space-y-3 md:space-y-4">
                          <h3 className="font-bold text-xl md:text-2xl text-amber-400 mt-4 md:mt-6 flex items-center gap-2 md:gap-3">
                            <span className="h-1 w-8 md:w-12 bg-amber-400 rounded"></span>
                            {category.subtitle}
                          </h3>
                          {category.items.map((item: any, itemIndex: number) => (
                            <div key={itemIndex} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 p-3 md:p-5 border border-amber-400/20 last:border-b-0 hover:bg-amber-600/20 backdrop-blur-sm transition-all duration-300 rounded-xl">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-lg md:text-xl text-white leading-relaxed">
                                  {item.name}
                                </h4>
                              </div>
                              <div className="flex items-center gap-2 sm:gap-3 sm:ml-4 flex-shrink-0">
                                {item.price && (
                                  <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 border-amber-400/50 text-sm md:text-lg px-2 md:px-3 py-0.5 md:py-1">
                                    {item.price}
                                  </Badge>
                                )}
                                <div className="flex items-center gap-1 md:gap-2 bg-black/40 rounded-full p-1 md:p-1.5 border border-amber-400/30">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-amber-500/20 text-amber-100 border border-amber-400/50 hover:bg-amber-500/40 hover:text-white"
                                    onClick={() => handleQuantityChange(item.name, item, -1)}
                                  >
                                    <Minus className="h-3 w-3 md:h-4 md:w-4" />
                                  </Button>
                                  <span className="w-8 md:w-10 text-center text-sm md:text-base font-semibold text-white">
                                    {orderItems[item.name]?.quantity || 0}
                                  </span>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-amber-500/20 text-amber-100 border border-amber-400/50 hover:bg-amber-500/40 hover:text-white"
                                    onClick={() => handleQuantityChange(item.name, item, 1)}
                                  >
                                    <Plus className="h-3 w-3 md:h-4 md:w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      section.items?.map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 p-3 md:p-5 border border-amber-400/20 last:border-b-0 hover:bg-amber-600/20 backdrop-blur-sm transition-all duration-300 rounded-xl">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-lg md:text-xl text-white leading-relaxed">
                              {item.name}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 sm:ml-4 flex-shrink-0">
                            {item.price && (
                              <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 border-amber-400/50 text-sm md:text-lg px-2 md:px-3 py-0.5 md:py-1">
                                {item.price}
                              </Badge>
                            )}
                            <div className="flex items-center gap-1 md:gap-2 bg-black/40 rounded-full p-1 md:p-1.5 border border-amber-400/30">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-amber-500/20 text-amber-100 border border-amber-400/50 hover:bg-amber-500/40 hover:text-white"
                                onClick={() => handleQuantityChange(item.name, item, -1)}
                              >
                                <Minus className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                              <span className="w-8 md:w-10 text-center text-sm md:text-base font-semibold text-white">
                                {orderItems[item.name]?.quantity || 0}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-amber-500/20 text-amber-100 border border-amber-400/50 hover:bg-amber-500/40 hover:text-white"
                                onClick={() => handleQuantityChange(item.name, item, 1)}
                              >
                                <Plus className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Single image for burgers section */}
                  {sectionIndex === 1 && (
                    <div className="hidden lg:flex items-center justify-center">
                      <img 
                        src={burgerImg} 
                        alt="Burgers"
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

export default SandwichesMenu;