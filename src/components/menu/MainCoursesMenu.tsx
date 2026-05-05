import React, { useState } from "react";
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

interface MenuItem {
  name: string;
  price: string;
}

const MainCoursesMenu = () => {
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem>>({});
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const { toast } = useToast();
  const categoryName = "🥩 Plats Principaux & Fruits de Mer";

  const handleQuantityChange = (itemKey: string, item: MenuItem, delta: number) => {
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
            const newTotal = Object.values(rest).reduce((sum: number, i: OrderItem) => sum + (i.price * i.quantity), 0);
            window.dispatchEvent(new CustomEvent("orderUpdated", {
              detail: {
                items: Object.entries(rest).map(([key, item]: [string, OrderItem]) => ({
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
          price: parseFloat(item.price.replace("dt", "")),
          quantity: 1,
        };

        toast({
          title: "Ajouté au panier",
          description: `${item.name} a été ajouté`,
        });

        return {
          ...prev,
          [itemKey]: newItem,
        };
      }
      return prev;
    });
  };

  const handleOrder = () => {
    setShowOrderDialog(true);
  };

  const totalItems: number = (Object.values(orderItems) as OrderItem[]).reduce((sum: number, item: OrderItem) => sum + item.quantity, 0);
  const totalPrice: number = (Object.values(orderItems) as OrderItem[]).reduce((sum: number, item: OrderItem) => sum + (item.price * item.quantity), 0);

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
    return Object.entries(orderItems).map(([key, item]: [string, OrderItem]) => ({
      name: key,
      quantity: item.quantity,
      price: `${item.price}dt`,
      category: categoryName,
    }));
  };

  // Emit order updates to FloatingChat
  React.useEffect(() => {
    if (Object.keys(orderItems).length > 0) {
      const totalPrice = (Object.values(orderItems) as OrderItem[]).reduce((sum: number, item: OrderItem) => sum + (item.price * item.quantity), 0);
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
        <div className="mb-8">
          <Link to="/menu">
            <Button variant="outline" size="lg" className="menu-back">
              <ArrowLeft className="h-5 w-5" />
              Retour au menu
            </Button>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="menu-heading mb-6">Plats Principaux & Fruits de Mer</h1>
          <p className="menu-subheading">Nos specialites de viandes, volailles et fruits de mer</p>
        </div>

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
                <span>Commander ({totalItems})</span>
                {totalPrice > 0 && <span className="font-bold">{totalPrice.toFixed(2)}dt</span>}
              </div>
            </Button>
          </div>
        )}

        <div className="grid gap-8">
          {menuData.sections.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="menu-card">
              <CardHeader className="menu-card-header">
                <CardTitle className="menu-card-title">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-8">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-3 md:space-y-4">
                    {section.categories ? (
                      section.categories.map((category: any, catIndex: number) => (
                        <div key={catIndex} className="space-y-3 md:space-y-4">
                          <h3 className="menu-section-title mt-4 md:mt-6">
                            <span className="h-1 w-8 md:w-12 bg-primary/50 rounded"></span>
                            {category.subtitle}
                          </h3>
                          {category.items.map((item: any, itemIndex: number) => (
                            <div key={itemIndex} className="menu-item-row sm:items-start">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-lg md:text-xl text-foreground leading-relaxed">
                                  {item.name}
                                </h4>
                                {item.description && (
                                  <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                                )}
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
                      ))
                    ) : (
                      section.items?.map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className="menu-item-row sm:items-start">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-lg md:text-xl text-foreground leading-relaxed">
                              {item.name}
                            </h4>
                            {item.description && (
                              <p className="text-muted-foreground text-xs md:text-sm mt-1">{item.description}</p>
                            )}
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
                      ))
                    )}
                  </div>

                  {sectionIndex === 0 && menuData.image && (
                    <div className="hidden lg:flex items-center justify-center">
                      <img
                        src={menuData.image}
                        alt={section.title}
                        className="max-w-md w-full h-auto object-contain rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-primary/20"
                        style={{
                          filter: "contrast(1.15) saturate(1.2) brightness(1.1)",
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