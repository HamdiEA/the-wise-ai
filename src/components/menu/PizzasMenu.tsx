import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Minus, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import OrderDialog from "../OrderDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import pizza1Img from "@/assets/pizza1.jpg";
import pizza2Img from "@/assets/pizza2.jpg";

interface OrderItem {
  name: string;
  size?: string;
  price: number;
  cheeseCrust?: boolean;
  quantity: number;
}

const PizzasMenu = () => {
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem>>({});
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [pizzaSizes, setPizzaSizes] = useState<Record<string, string>>({});
  const [quarterMeterPizzas, setQuarterMeterPizzas] = useState<string[]>([]);
  const [cheeseCrust, setCheeseCrust] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const categoryName = "🍕 Pizzas";

  // Cheese crust prices for different sizes
  const cheeseCrustPrices = {
    "Petite": 6,
    "Moyenne": 9,
    "Large": 13,
    "1/2 Moyenne": 4.5, // Half of Moyenne (9/2)
    "1/2 Large": 6.5,  // Half of Large (13/2)
    "1/4 m": 6,        // Same as Petite
    "1/2 mètre": 15,
    "1 mètre": 25
  };

  const handlePizzaOrder = (pizzaName: string, sizes: any) => {
    const selectedSize = pizzaSizes[pizzaName];
    
    if (!selectedSize) {
      toast({
        title: "Veuillez sélectionner une taille",
        description: "Choisissez la taille de votre pizza",
        variant: "destructive",
      });
      return;
    }

    // Handle 1/4m selections for meter pizzas
    if (selectedSize === "1/4 m") {
      if (quarterMeterPizzas.includes(pizzaName)) {
        toast({
          title: "Déjà ajouté",
          description: `${pizzaName} est déjà dans votre sélection`,
          variant: "destructive",
        });
        return;
      }
      
      if (quarterMeterPizzas.length >= 4) {
        toast({
          title: "Sélection complète",
          description: "Vous avez déjà sélectionné le maximum de pizzas pour une pizza 1m",
          variant: "destructive",
        });
        return;
      }
      
      setQuarterMeterPizzas(prev => [...prev, pizzaName]);
      
      const remainingForFull = 4 - quarterMeterPizzas.length - 1;
      const remainingForHalf = 2 - quarterMeterPizzas.length - 1;
      
      toast({
        title: "Pizza 1/4m ajoutée",
        description: `${pizzaName} ajoutée. Vous pouvez maintenant créer une pizza 1/2m (${remainingForHalf >= 0 ? remainingForHalf : 0} restante) ou 1m (${remainingForFull >= 0 ? remainingForFull : 0} restantes)`,
      });
      return;
    }
    
    // Handle regular pizza sizes
    const basePrice = sizes[selectedSize];
    const hasCheeseCrust = cheeseCrust[`${pizzaName} (${selectedSize})`] || false;
    const cheeseCrustPrice = hasCheeseCrust ? cheeseCrustPrices[selectedSize as keyof typeof cheeseCrustPrices] || 0 : 0;
    const price = basePrice + cheeseCrustPrice;
    
    const itemKey = `${pizzaName} (${selectedSize})${hasCheeseCrust ? " - croûte fromage" : ""}`;
    
    setOrderItems(prev => {
      const existing = prev[itemKey];
      if (existing) {
        return { ...prev, [itemKey]: { ...existing, quantity: existing.quantity + 1 } };
      }
      return { 
        ...prev, 
        [itemKey]: { 
          name: pizzaName, 
          size: selectedSize, 
          price, 
          quantity: 1,
          cheeseCrust: hasCheeseCrust 
        } 
      };
    });

    toast({
      title: "Ajouté au panier",
      description: `${pizzaName} ajouté${hasCheeseCrust ? " avec croûte fromage" : ""}`,
    });
  };

  const handleOrder = () => {
    if (quarterMeterPizzas.length > 0) {
      if (quarterMeterPizzas.length === 2) {
        const halfMeterKey = `Pizza 1/2 Mètre (${quarterMeterPizzas.join(", ")})`;
        let totalPrice = quarterMeterPizzas.reduce((sum, pizzaName) => {
          return sum + (pizzaSizesData[pizzaName]["1/4 m"] || 12);
        }, 0);
        
        const hasCheeseCrust = quarterMeterPizzas.some(pizzaName => 
          cheeseCrust[`${pizzaName} (1/4 m)`]
        );
        
        if (hasCheeseCrust) {
          totalPrice += cheeseCrustPrices["1/2 mètre"];
        }
        
        setOrderItems(prev => ({
          ...prev,
          [halfMeterKey]: {
            name: `Pizza 1/2 Mètre`,
            size: "1/2 Mètre",
            price: totalPrice,
            quantity: 1,
            cheeseCrust: hasCheeseCrust
          }
        }));
        
        setQuarterMeterPizzas([]);
      } else if (quarterMeterPizzas.length === 4) {
        const fullMeterKey = `Pizza 1 Mètre (${quarterMeterPizzas.join(", ")})`;
        let totalPrice = quarterMeterPizzas.reduce((sum, pizzaName) => {
          return sum + (pizzaSizesData[pizzaName]["1/4 m"] || 12);
        }, 0);
        
        const hasCheeseCrust = quarterMeterPizzas.some(pizzaName => 
          cheeseCrust[`${pizzaName} (1/4 m)`]
        );
        
        if (hasCheeseCrust) {
          totalPrice += cheeseCrustPrices["1 mètre"];
        }
        
        setOrderItems(prev => ({
          ...prev,
          [fullMeterKey]: {
            name: `Pizza 1 Mètre`,
            size: "1 Mètre",
            price: totalPrice,
            quantity: 1,
            cheeseCrust: hasCheeseCrust
          }
        }));
        
        setQuarterMeterPizzas([]);
      } else {
        toast({
          title: "Sélection incomplète",
          description: `Pour créer une pizza mètre, vous devez sélectionner soit 2 pizzas (pour 1/2m) soit 4 pizzas (pour 1m). Actuellement: ${quarterMeterPizzas.length} sélectionnée(s).`,
          variant: "destructive",
        });
        return;
      }
    }
    
    setShowOrderDialog(true);
  };

  const totalItems = Object.values(orderItems).reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = Object.values(orderItems).reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const pizzaSizesData = {
    "Margherita": { "Petite": 11, "Moyenne": 15, "1/2 Moyenne": 7.5, "Large": 19, "1/2 Large": 9.5, "1/4 m": 13, "1/2 mètre": 26, "1 mètre": 52 },
    "Tuna": { "Petite": 12.5, "Moyenne": 17.5, "1/2 Moyenne": 8.75, "Large": 26, "1/2 Large": 13, "1/4 m": 14.5, "1/2 mètre": 29, "1 mètre": 58 },
    "4 Seasons": { "Petite": 14.5, "Moyenne": 22, "1/2 Moyenne": 11, "Large": 32, "1/2 Large": 16, "1/4 m": 15, "1/2 mètre": 30, "1 mètre": 60 },
    "Vegetarien": { "Petite": 12.5, "Moyenne": 17.5, "1/2 Moyenne": 8.75, "Large": 28, "1/2 Large": 14, "1/4 m": 14.5, "1/2 mètre": 29, "1 mètre": 58 },
    "Queen": { "Petite": 12, "Moyenne": 17, "1/2 Moyenne": 8.5, "Large": 25, "1/2 Large": 12.5, "1/4 m": 14, "1/2 mètre": 28, "1 mètre": 56 },
    "Orientale": { "Petite": 12, "Moyenne": 17.5, "1/2 Moyenne": 8.75, "Large": 23, "1/2 Large": 11.5, "1/4 m": 14, "1/2 mètre": 28, "1 mètre": 56 },
    "Pepperoni": { "Petite": 12.5, "Moyenne": 17.5, "1/2 Moyenne": 8.75, "Large": 28, "1/2 Large": 14, "1/4 m": 14.5, "1/2 mètre": 29, "1 mètre": 58 },
    "Chicken Supreme": { "Petite": 15, "Moyenne": 22, "1/2 Moyenne": 11, "Large": 32, "1/2 Large": 16, "1/4 m": 16, "1/2 mètre": 32, "1 mètre": 64 },
    "4 Cheese": { "Petite": 12.5, "Moyenne": 17.5, "1/2 Moyenne": 8.75, "Large": 28, "1/2 Large": 14, "1/4 m": 14.5, "1/2 mètre": 29, "1 mètre": 58 },
    "Regina": { "Petite": 12, "Moyenne": 17, "1/2 Moyenne": 8.5, "Large": 25, "1/2 Large": 12.5, "1/4 m": 14, "1/2 mètre": 28, "1 mètre": 56 },
    "Chicken Grilli": { "Petite": 13, "Moyenne": 20, "1/2 Moyenne": 10, "Large": 29, "1/2 Large": 14.5, "1/4 m": 14, "1/2 mètre": 28, "1 mètre": 56 },
    "Mexicain": { "Petite": 13, "Moyenne": 20, "1/2 Moyenne": 10, "Large": 29, "1/2 Large": 14.5, "1/4 m": 15, "1/2 mètre": 30, "1 mètre": 60 },
    "Kentucky": { "Petite": 14, "Moyenne": 21, "1/2 Moyenne": 10.5, "Large": 30, "1/2 Large": 15, "1/4 m": 15, "1/2 mètre": 30, "1 mètre": 60 },
    "Norwegian": { "Petite": 17, "Moyenne": 27, "1/2 Moyenne": 13.5, "Large": 35, "1/2 Large": 17.5, "1/4 m": 19, "1/2 mètre": 38, "1 mètre": 76 },
    "Sea Food": { "Petite": 17, "Moyenne": 27, "1/2 Moyenne": 13.5, "Large": 35, "1/2 Large": 17.5, "1/4 m": 19, "1/2 mètre": 38, "1 mètre": 76 },
    "Newton": { "Petite": 18, "Moyenne": 29, "1/2 Moyenne": 14.5, "Large": 32, "1/2 Large": 16, "1/4 m": 15.5, "1/2 mètre": 31, "1 mètre": 62 },
    "Einstein": { "Petite": 18, "Moyenne": 29, "1/2 Moyenne": 14.5, "Large": 32, "1/2 Large": 16, "1/4 m": 15.5, "1/2 mètre": 31, "1 mètre": 62 },
    "Barlow": { "Petite": 18, "Moyenne": 29, "1/2 Moyenne": 14.5, "Large": 32, "1/2 Large": 16, "1/4 m": 15.5, "1/2 mètre": 31, "1 mètre": 62 },
    "Millikan": { "Petite": 18, "Moyenne": 29, "1/2 Moyenne": 14.5, "Large": 32, "1/2 Large": 16, "1/4 m": 16, "1/2 mètre": 32, "1 mètre": 64 },
    "Ampere": { "Petite": 18, "Moyenne": 29, "1/2 Moyenne": 14.5, "Large": 32, "1/2 Large": 16, "1/4 m": 17.5, "1/2 mètre": 35, "1 mètre": 70 },
    "Gauss": { "Petite": 13, "Moyenne": 22, "1/2 Moyenne": 11, "Large": 32, "1/2 Large": 16, "1/4 m": 16, "1/2 mètre": 32, "1 mètre": 64 },
    "John Locke": { "Petite": 13, "Moyenne": 22, "1/2 Moyenne": 11, "Large": 32, "1/2 Large": 16, "1/4 m": 16, "1/2 mètre": 32, "1 mètre": 64 },
    "Pesto": { "Petite": 13, "Moyenne": 22, "1/2 Moyenne": 11, "Large": 32, "1/2 Large": 16, "1/4 m": 16, "1/2 mètre": 32, "1 mètre": 64 },
    "Chicken Spicy": { "Petite": 13, "Moyenne": 22, "1/2 Moyenne": 11, "Large": 32, "1/2 Large": 16, "1/4 m": 16, "1/2 mètre": 32, "1 mètre": 64 },
    "Carnot": { "Petite": 15.5, "Moyenne": 22, "1/2 Moyenne": 11, "Large": 32, "1/2 Large": 16, "1/4 m": 17.5, "1/2 mètre": 35, "1 mètre": 70 },
    "Mariotte": { "Petite": 14.5, "Moyenne": 21, "1/2 Moyenne": 10.5, "Large": 32, "1/2 Large": 16, "1/4 m": 16.5, "1/2 mètre": 33, "1 mètre": 66 },
    "Kepler": { "Petite": 14, "Moyenne": 21, "1/2 Moyenne": 10.5, "Large": 32, "1/2 Large": 16, "1/4 m": 17, "1/2 mètre": 34, "1 mètre": 68 },
    "Van der waals": { "Petite": 13, "Moyenne": 21, "1/2 Moyenne": 10.5, "Large": 32, "1/2 Large": 16, "1/4 m": 16.5, "1/2 mètre": 33, "1 mètre": 66 },
    "Tesla": { "Petite": 13, "Moyenne": 21, "1/2 Moyenne": 10.5, "Large": 32, "1/2 Large": 16, "1/4 m": 17, "1/2 mètre": 34, "1 mètre": 68 },
    "The Wise": { "Petite": 13, "Moyenne": 21, "1/2 Moyenne": 10.5, "Large": 32, "1/2 Large": 16, "1/4 m": 17, "1/2 mètre": 34, "1 mètre": 68 }
  };

  // Pizza descriptions mapping
  const pizzaDescriptions = {
    "Margherita": "Sauce Tomate, Mozzarella",
    "Tuna": "Thon, Tomates Fraîches, Oignons, Olives, Sauce Tomate, Mozzarella",
    "4 Seasons": "Thon, Jambon de Dinde, Champignons, Poivrons, Oignons, Olives, Mozzarella, Sauce Tomate",
    "Vegetarien": "Champignons, Poivrons, Oignons, Olives, Tomates Fraîches, Mozzarella, Sauce Tomate",
    "Queen": "Jambon de Dinde, Champignons, Mozzarella, Sauce Tomate",
    "Orientale": "Merguez, Poivrons, Oignons, Champignons, Tomates Fraîches, Sauce Tomate, Mozzarella",
    "Pepperoni": "Pepperoni, Oignons, Sauce Tomate, Mozzarella",
    "Chicken Supreme": "Poulet, Champignons, Poivrons, Sauce Tomate, Mozzarella",
    "4 Cheese": "Sauce Tomate, Mozzarella, Fromage, Sauce Blanche",
    "Regina": "Jambon de Dinde, Champignons, Oignons, Olives, Sauce Tomate, Mozzarella",
    "Chicken Grilli": "Émincés de Poulet Grillés, Poivrons, Champignons, Oignons, Sauce Tomate, Mozzarella",
    "Mexicain": "Poivrons, Piments Jalapeños, Champignons, Oignons, Tomates, Sauce Tomate, Mozzarella",
    "Kentucky": "Poulet Kentucky, Champignons, Oignons, Poivrons, Tomates, Sauce Tomate, Mozzarella",
    "Norwegian": "Saumon Fumé, Crème Fraîche, Mozzarella",
    "Sea Food": "Fruits de Mer, Poivrons, Oignons, Olives, Sauce Tomate, Mozzarella",
    "Newton": "Poulet Grillé, Poulet Pané, Champignons, Poivrons, Oignons, Tomates, Sauce Tomate, Mozzarella",
    "Einstein": "Viande de Bœuf Hachée, Champignons, Tomates Fraîches, Oignons, Sauce Tomate, Mozzarella",
    "Barlow": "Viande de Bœuf Hachée, Jambon, Champignons, Poivrons, Oignons, Tomates, Sauce Tomate, Mozzarella",
    "Millikan": "Anchois, Filet de Sardine, Olives, Poivrons, Sauce Tomate, Mozzarella",
    "Ampere": "Pepperoni, Viande de Bœuf Hachée, Oignons, Poivrons, Olives, Sauce Tomate, Mozzarella",
    "Gauss": "Thon, Œuf, Roquefort, Gruyère, Oignons, Olives, Sauce Tomate, Mozzarella",
    "John Locke": "Poulet Pané, Sauce Piquante, Oignons, Poivrons, Olives, Sauce Tomate, Mozzarella",
    "Pesto": "Sauce Pesto, Mozzarella, Pepperoni",
    "Chicken Spicy": "Poulet Pané, Sauce Piquante, Poivrons, Oignons, Olives, Champignons, Sauce Tomate, Mozzarella",
    "Carnot": "Gruyère, Oignons, Poivrons, Champignons, Sauce Tomate, Mozzarella",
    "Mariotte": "Poulet Pané, Gruyère, Oignons, Olives, Sauce Tomate, Mozzarella",
    "Kepler": "Crevettes, Champignons, Oignons, Sauce Tomate, Mozzarella",
    "Van der waals": "Viande Hachée, Champignons, Oignons, Mozzarella, Sauce Barbecue",
    "Tesla": "Suprême de Poulet Fumé, Sauce Tomate, Mozzarella",
    "The Wise": "Saumon Fumé, Crevettes, Fruits de Mer, Mozzarella"
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

  const pizzas = Object.keys(pizzaSizesData);

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

        <div className="text-center mb-12">
          <h1 className="menu-heading mb-4">
            🍕 Pizzas
          </h1>
          <p className="menu-subheading">
            Nos pizzas avec ingrédients frais
          </p>
        </div>

        {/* Floating Order Button */}
        {(totalItems > 0 || quarterMeterPizzas.length > 0) && (
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
                {quarterMeterPizzas.length > 0 && (
                  <span className="text-xs opacity-90">
                    1/4m: {quarterMeterPizzas.length}/4
                  </span>
                )}
              </div>
            </Button>
          </div>
        )}

        <Card className="menu-card">
          <CardHeader className="menu-card-header">
            <CardTitle className="menu-card-title">
              🍕 Pizzas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                {pizzas.map((pizzaName: string, pizzaIndex: number) => (
                  <div key={pizzaIndex} className="menu-item-row flex-col items-start">
                    <h4 className="font-semibold text-xl text-foreground mb-1 leading-relaxed">
                      {pizzaName}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {pizzaDescriptions[pizzaName as keyof typeof pizzaDescriptions]}
                    </p>
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2 items-center flex-wrap">
                        <Select
                          value={pizzaSizes[pizzaName] || ""}
                          onValueChange={(value) => setPizzaSizes(prev => ({ ...prev, [pizzaName]: value }))}
                        >
                          <SelectTrigger className="w-[200px] glass border-primary/40 text-foreground">
                            <SelectValue placeholder="Sélectionnez la taille" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(pizzaSizesData[pizzaName] || {}).map(([size, price]: [string, number]) => (
                              <SelectItem key={size} value={size}>
                                {size} - {price}dt
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        
                        <Button
                          onClick={() => handlePizzaOrder(pizzaName, pizzaSizesData[pizzaName])}
                          size="sm"
                          variant="restaurant"
                          className="px-4"
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Ajouter
                        </Button>
                      </div>
                      
                      {/* Cheese crust supplement option */}
                      <div className="flex items-center space-x-2 mt-1">
                        <input
                          type="checkbox"
                          id={`cheese-crust-${pizzaIndex}`}
                          checked={cheeseCrust[`${pizzaName} (${pizzaSizes[pizzaName]})`] || false}
                          onChange={(e) => {
                            const size = pizzaSizes[pizzaName];
                            if (size) {
                              setCheeseCrust(prev => ({
                                ...prev,
                                [`${pizzaName} (${size})`]: e.target.checked
                              }));
                            }
                          }}
                          className="rounded border-primary/30 bg-card/70 text-foreground focus:ring-primary"
                        />
                        <label htmlFor={`cheese-crust-${pizzaIndex}`} className="text-sm text-muted-foreground">
                          Croûte fromage
                          {pizzaSizes[pizzaName] && (
                            <span> (+{cheeseCrustPrices[pizzaSizes[pizzaName] as keyof typeof cheeseCrustPrices] || 0}dt)</span>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pizza images */}
              <div className="hidden lg:flex flex-col gap-4 items-center justify-center">
                <img 
                  src={pizza1Img} 
                  alt="Pizza 1"
                  className="max-w-2xl w-full h-auto object-contain rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-primary/20"
                  style={{
                    filter: 'contrast(1.15) saturate(1.2) brightness(1.1)',
                  }}
                />
                <img 
                  src={pizza2Img} 
                  alt="Pizza 2"
                  className="max-w-2xl w-full h-auto object-contain rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-primary/20"
                  style={{
                    filter: 'contrast(1.15) saturate(1.2) brightness(1.1)',
                  }}
                />
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

export default PizzasMenu;