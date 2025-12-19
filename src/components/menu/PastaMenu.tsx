import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Minus, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import OrderDialog from "../OrderDialog";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

const PastaMenu = () => {
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem>>({});
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const { toast } = useToast();
  const categoryName = "🍝 Pasta";

  const handleQuantityChange = (itemKey: string, item: any, delta: number) => {
    setOrderItems(prev => {
      const existing = prev[itemKey];
      if (existing) {
        const newQuantity = existing.quantity + delta;
        if (newQuantity <= 0) {
          const { [itemKey]: _, ...rest } = prev;
          try {
            window.dispatchEvent(new CustomEvent("orderItemsRemoved", { detail: { names: [itemKey] } }));
          } catch {}
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

  const pastaItems = [
    { name: "Fruits de Mer (Sauce Rouge)", price: "36dt" },
    { name: "Lasposa (Fruits de Mer, Sauce Blanche)", price: "39dt" },
    { name: "Pink (Viande Fumé, Sauce Pink, Oignon, Gruyère)", price: "31dt" },
    { name: "Carbonara (Jambon, Champignons, Jaune d'œuf, Sauce Blanche)", price: "22dt" },
    { name: "Bolognaise (Viande hachée, Sauce tomate)", price: "25dt" },
    { name: "Putanesca (Thon, Olive, Câpre, Piments de Cayenne)", price: "23dt" },
    { name: "Spinaci (Chevrettes, Champignons, Epinard, Tomates Cerises)", price: "33dt" },
    { name: "Alfredo (Poulet, Champignons, Sauce Blanche)", price: "26dt" },
    { name: "The Wise (Crevette, Saumon, Sauce Rosée)", price: "39dt" },
    { name: "Lasagne Bolognaise", price: "21dt" },
    { name: "4 Fromages", price: "25dt" }
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

  // Listen for global removals/clear to reset local quantities
  React.useEffect(() => {
    const handleRemoved = (e: any) => {
      const names: string[] = e.detail?.names || [];
      if (!names.length) return;
      setOrderItems(prev => {
        const next = { ...prev };
        names.forEach(n => { if (next[n]) delete next[n]; });
        return next;
      });
    };
    const handleDecremented = (e: any) => {
      const name: string = e.detail?.name;
      if (!name) return;
      setOrderItems(prev => {
        if (!prev[name]) return prev;
        const newQty = prev[name].quantity - 1;
        if (newQty <= 0) {
          const { [name]: _, ...rest } = prev;
          return rest;
        }
        return { ...prev, [name]: { ...prev[name], quantity: newQty } };
      });
    };
    const handleCleared = () => {
      setOrderItems({});
    };
    window.addEventListener('orderItemsRemoved', handleRemoved);
    window.addEventListener('orderItemDecremented', handleDecremented);
    window.addEventListener('orderCleared', handleCleared);
    return () => {
      window.removeEventListener('orderItemsRemoved', handleRemoved);
      window.removeEventListener('orderItemDecremented', handleDecremented);
      window.removeEventListener('orderCleared', handleCleared);
    };
  }, []);

  return (
    <section className="py-20 bg-black/20 backdrop-blur-sm relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Back button */}
        <div className="mb-8">
          <Link to="/menu">
            <Button variant="outline" size="lg" className="flex items-center gap-3 bg-black/40 backdrop-blur-md border-white/20 text-white hover:bg-white/20 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
              Back to Menu
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            🍝 Pasta
          </h1>
          <p className="text-gray-200 text-xl max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Spaghetti, Pennes, Tagliatelles - Pâtes italiennes et sauces maison
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

        <Card className="shadow-2xl border border-white/10 bg-black/40 backdrop-blur-md">
          <CardHeader className="bg-black/60 text-white border-b border-white/10">
            <CardTitle className="text-3xl font-bold text-center drop-shadow-lg">
              🍝 Pasta - Spaghetti, Pennes, Tagliatelles
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-3 md:space-y-4">
                {pastaItems.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 p-3 md:p-5 border border-white/10 last:border-b-0 hover:bg-white/5 backdrop-blur-sm transition-all duration-300 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-lg md:text-xl text-white leading-relaxed">
                        {item.name}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 sm:ml-4 flex-shrink-0">
                      <Badge variant="secondary" className="bg-white/10 text-white border-white/20 text-sm md:text-lg px-2 md:px-3 py-0.5 md:py-1">
                        {item.price}
                      </Badge>
                      <div className="flex items-center gap-1 md:gap-2 bg-black/40 rounded-full p-1 md:p-1.5 border border-white/20">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:text-white"
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
                          className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:text-white"
                          onClick={() => handleQuantityChange(item.name, item, 1)}
                        >
                          <Plus className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Placeholder for image or additional content */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="text-center p-10 bg-black/40 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-md">
                  <div className="text-6xl mb-4">🍝</div>
                  <h3 className="text-2xl font-semibold text-white mb-3">Pâtes Fraîches</h3>
                  <p className="text-gray-200 leading-relaxed">
                    Toutes nos pâtes sont préparées avec des ingrédients frais et des sauces maison authentiques.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {showOrderDialog && (
          <OrderDialog 
            open={showOrderDialog}
            onOpenChange={setShowOrderDialog}
            orderItems={getOrderList()}
            totalPrice={totalPrice}
          />
        )}
      </div>
    </section>
  );
};

export default PastaMenu;