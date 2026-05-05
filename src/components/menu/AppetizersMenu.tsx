import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Minus, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import OrderDialog from "../OrderDialog";
import saladImg from "@/assets/salad.jpg";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

const AppetizersMenu = () => {
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem>>({});
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const { toast } = useToast();
  const categoryName = "🥗 Entrées";

  const handleQuantityChange = (itemKey: string, item: any, delta: number) => {
    setOrderItems(prev => {
      const existing = prev[itemKey];
      if (existing) {
        const newQuantity = existing.quantity + delta;
        if (newQuantity <= 0) {
          const { [itemKey]: _, ...rest } = prev;
          // Inform global state that this specific item was removed
          try {
            window.dispatchEvent(new CustomEvent("orderItemsRemoved", { detail: { names: [itemKey] } }));
          } catch {}
          // Emit update to FloatingChat
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

  const menuData = {
    title: "🥗 Entrées",
    sections: [
      {
        subtitle: "Entrées Froides",
        items: [
          { name: "César", price: "17dt" },
          { name: "Italienne", price: "19dt" },
          { name: "Fruits de Mer", price: "27dt" },
          { name: "The Wise", price: "24dt" }
        ]
      },
      {
        subtitle: "Entrées Chaudes",
        items: [
          { name: "Omelette Thon-Fromage", price: "13dt" },
          { name: "Omelette Jambon-Fromage", price: "18dt" },
          { name: "Moule Mariné", price: "24dt" },
          { name: "Calamars Dorés", price: "21dt" },
          { name: "Crevettes Sautées à l'Ail", price: "25dt" },
          { name: "Crevettes Sautées à la Crème", price: "27dt" },
          { name: "Crevettes Panées", price: "25dt" }
        ]
      }
    ],
    image: saladImg
  };

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
    <section className="menu-shell">
      <div className="container mx-auto px-4 relative z-10">
        {/* Back button */}
        <div className="mb-8">
          <Link to="/menu">
            <Button variant="outline" size="lg" className="menu-back">
              <ArrowLeft className="h-5 w-5" />
              Retour au menu
            </Button>
          </Link>
        </div>

        <div className="text-center mb-16">
          <h1 className="menu-heading mb-6">
            {menuData.title}
          </h1>
          <p className="menu-subheading">
            Start your meal with our delicious appetizers
          </p>
        </div>

        {/* Floating Order Button */}
        {totalItems > 0 && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:bottom-8 md:left-auto md:right-8 md:translate-x-0 z-50 w-[90%] md:w-auto">
            <Button
              onClick={handleOrder}
              variant="restaurant"
              size="xl"
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
          <Card className="menu-card">
            <CardHeader className="menu-card-header">
              <CardTitle className="menu-card-title">
                {menuData.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-4 md:space-y-6">
                  {menuData.sections.map((section: any, sectionIndex: number) => (
                    <div key={sectionIndex} className="space-y-3 md:space-y-4">
                      <h3 className="menu-section-title mt-4 md:mt-6">
                        <span className="h-1 w-8 md:w-12 bg-primary/50 rounded"></span>
                        {section.subtitle}
                      </h3>
                      {section.items.map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className="menu-item-row">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-lg md:text-xl text-foreground leading-relaxed">
                              {item.name}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 sm:ml-4 flex-shrink-0">
                            {item.price && (
                              <Badge variant="secondary" className="menu-price">
                                {item.price}
                              </Badge>
                            )}
                            <div className="menu-qty">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="menu-qty-btn"
                                onClick={() => handleQuantityChange(item.name, item, -1)}
                              >
                                <Minus className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                              <span className="w-8 md:w-10 text-center text-sm md:text-base font-semibold text-foreground">
                                {orderItems[item.name]?.quantity || 0}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="menu-qty-btn"
                                onClick={() => handleQuantityChange(item.name, item, 1)}
                              >
                                <Plus className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                
                {/* Single image */}
                {menuData.image && (
                  <div className="hidden lg:flex items-center justify-center">
                    <img 
                      src={menuData.image} 
                      alt={menuData.title}
                      className="max-w-md w-full h-auto object-contain rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-primary/20"
                      style={{
                        filter: 'contrast(1.15) saturate(1.2) brightness(1.1)',
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
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

export default AppetizersMenu;