import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import OrderDialog from "./OrderDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Food images
import saladImg from "@/assets/salad.jpg";
import platsImg from "@/assets/plats.jpg";
import pizza1Img from "@/assets/pizza1.jpg";
import pizza2Img from "@/assets/pizza2.jpg";
import burgerImg from "@/assets/burger.jpg";
import drinkImg from "@/assets/drink.jpg";

interface OrderItem {
  name: string;
  size?: string;
  price: number;
  cheeseCrust?: boolean;
}

const MenuSection = () => {
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem & { quantity: number }>>({});
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [pizzaSizes, setPizzaSizes] = useState<Record<string, string>>({});
  const [quarterMeterPizzas, setQuarterMeterPizzas] = useState<string[]>([]);
  const [cheeseCrust, setCheeseCrust] = useState<Record<string, boolean>>({});
  const { toast } = useToast();

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
      // Check if this pizza is already selected
      if (quarterMeterPizzas.includes(pizzaName)) {
        toast({
          title: "Déjà ajouté",
          description: `${pizzaName} est déjà dans votre sélection`,
          variant: "destructive",
        });
        return;
      }
      
      // Add to selection (max 4 for 1m, or max 2 for 1/2m)
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
        description: `${pizzaName} ajouté. Vous pouvez maintenant créer une pizza 1/2m (${remainingForHalf >= 0 ? remainingForHalf : 0} restante) ou 1m (${remainingForFull >= 0 ? remainingForFull : 0} restantes)`,
      });
      return;
    }
    
    // Handle regular pizza sizes
    const basePrice = sizes[selectedSize];
    const hasCheeseCrust = cheeseCrust[`${pizzaName} (${selectedSize})`] || false;
    const cheeseCrustPrice = hasCheeseCrust ? cheeseCrustPrices[selectedSize as keyof typeof cheeseCrustPrices] || 0 : 0;
    const price = basePrice + cheeseCrustPrice;
    
    const itemKey = `${pizzaName} (${selectedSize})${hasCheeseCrust ? ' - with cheese crust' : ''}`;
    
    // Check if there's a similar pizza with different options
    const similarPizzaKey = Object.keys(orderItems).find(key => 
      key.startsWith(pizzaName) && 
      key !== itemKey && 
      (key.includes(selectedSize) || key.includes('cheese crust'))
    );
    
    if (similarPizzaKey) {
      const similarPizza = orderItems[similarPizzaKey];
      const similarSize = similarPizza.size;
      const similarHasCheeseCrust = similarPizza.cheeseCrust || false;
      
      toast({
        title: "Similar pizza detected",
        description: `You already have a ${pizzaName} (${similarSize})${similarHasCheeseCrust ? ' with cheese crust' : ''} in your cart.`,
        action: (
          <div className="flex gap-2 mt-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Remove the existing pizza
                setOrderItems(prev => {
                  const { [similarPizzaKey]: _, ...rest } = prev;
                  return rest;
                });
                
                // Add the new pizza
                setOrderItems(prev => ({
                  ...prev,
                  [itemKey]: { 
                    name: pizzaName, 
                    size: selectedSize, 
                    price, 
                    quantity: 1,
                    cheeseCrust: hasCheeseCrust 
                  }
                }));
                
                toast({
                  title: "Pizza replaced",
                  description: `${pizzaName} (${selectedSize})${hasCheeseCrust ? ' with cheese crust' : ''} has been added`,
                });
              }}
            >
              Replace
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Add cheese crust to the existing pizza if it doesn't have it
                if (!similarHasCheeseCrust && hasCheeseCrust) {
                  const updatedKey = `${pizzaName} (${similarSize}) - with cheese crust`;
                  const updatedPrice = similarPizza.price + cheeseCrustPrices[similarSize as keyof typeof cheeseCrustPrices];
                  
                  setOrderItems(prev => ({
                    ...prev,
                    [updatedKey]: { 
                      ...similarPizza, 
                      price: updatedPrice,
                      cheeseCrust: true
                    }
                  }));
                  
                  // Remove the old key
                  const { [similarPizzaKey]: _, ...rest } = prev;
                  return rest;
                }
                
                toast({
                  title: "Supplement added",
                  description: `Cheese crust has been added to your ${pizzaName}`,
                });
              }}
            >
              Add supplement
            </Button>
          </div>
        ),
        duration: 10000,
      });
      return;
    }
    
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
      title: "Added to cart",
      description: `${pizzaName} added${hasCheeseCrust ? ' with cheese crust' : ''}`,
    });
  };

  const handleQuantityChange = (itemKey: string, item: any, delta: number, isDirectPrice: boolean = false) => {
    if (!isDirectPrice) return; // Only allow direct price items for now
    
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

  const handleCommander = () => {
    // Check if we have any 1/4m pizzas selected
    if (quarterMeterPizzas.length > 0) {
      // Check if we can make a 1/2m pizza (exactly 2 selections)
      if (quarterMeterPizzas.length === 2) {
        const halfMeterKey = `Pizza 1/2 Mètre (${quarterMeterPizzas.join(", ")})`;
        // Calculate total price by summing the 1/4m prices of each pizza
        let totalPrice = quarterMeterPizzas.reduce((sum, pizzaName) => {
          return sum + (pizzaSizesData[pizzaName]["1/4 m"] || 12);
        }, 0);
        
        // Add cheese crust price if any of the pizzas has it selected
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
        
        // Clear the selection
        setQuarterMeterPizzas([]);
      }
      // Check if we can make a 1m pizza (exactly 4 selections)
      else if (quarterMeterPizzas.length === 4) {
        const fullMeterKey = `Pizza 1 Mètre (${quarterMeterPizzas.join(", ")})`;
        // Calculate total price by summing the 1/4m prices of each pizza (1/4m * 4)
        let totalPrice = quarterMeterPizzas.reduce((sum, pizzaName) => {
          return sum + (pizzaSizesData[pizzaName]["1/4 m"] || 12);
        }, 0);
        
        // Add cheese crust price if any of the pizzas has it selected
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
        
        // Clear the selection
        setQuarterMeterPizzas([]);
      }
      // Invalid number of selections
      else {
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

  const menuCategories = [
    {
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
    },
    {
      title: "🥩 Plats Principaux",
      sections: [
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
      ],
      image: platsImg
    },
    {
      title: "🦞 Fruits de Mer",
      items: [
        { name: "Poisson Grillé", description: "(Loup ou Bourride)", price: "25dt" },
        { name: "Loup", description: "Garniture du chef", price: "29dt" },
        { name: "à l'Ail", description: "Garniture du chef", price: "35dt" },
        { name: "Fruits de Mer", description: "Garniture du chef", price: "37dt" },
        { name: "Oja Fruits de Mer", price: "43dt" },
        { name: "Délice The Wise", description: "Fruits de Mer / Filet de Poisson / Garniture du chef", price: "48dt" },
        { name: "Gratin Fruits de Mer", description: "Garniture du chef", price: "59dt" }
      ]
    },
    {
      title: "🍝 Pasta",
      subtitle: "Spaghetti, Pennes, Tagliatelles",
      items: [
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
      ]
    },
    {
      title: "🍕 Pizzas",
      isPizza: true,
      pizzas: Object.keys(pizzaSizesData),
      images: [pizza1Img, pizza2Img]
    },
    {
      title: "🥪 Sandwiches",
      sections: [
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
        },
        {
          subtitle: "Supplements Sandwich/Bowls",
          items: [
            { name: "Portion Frites", price: "4dt" },
            { name: "Thon", price: "4.5dt" },
            { name: "Nuggets", price: "4.5dt" },
            { name: "Esc. Poulet Grillé", price: "4.5dt" },
            { name: "Esc. Poulet Panée", price: "4.5dt" },
            { name: "Jambon", price: "2.5dt" },
            { name: "Œuf", price: "1dt" },
            { name: "Champignons", price: "2.5dt" },
            { name: "Gruyère", price: "3.5dt" },
            { name: "Cheddar", price: "3dt" },
            { name: "Mozzarella", price: "3dt" },
            { name: "Cordon Bleu", price: "5dt" },
            { name: "Chich Taouk", price: "6dt" },
            { name: "Kabeb", price: "6dt" }
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
      ],
      image: burgerImg
    },
    {
      title: "🍗 Chicken Box",
      items: [
        { name: "Chicken Fingers", description: "Bâtonnets de poulet Panés (9 pièces)", price: "17dt" },
        { name: "Hot Chicken Legs", description: "Cuisses de Poulet Épicées (6 pièces)", price: "22dt" },
        { name: "Fried Chicken Cheese", description: "Poulet Pané Farci au Fromage (6 pièces)", price: "25dt" },
        { name: "Fried Chicken Legs", description: "Cuisses de Poulet Panées (6 pièces)", price: "22dt" },
        { name: "Hot Chicken Wings", description: "Ailes de Poulet Épicées (8 pièces)", price: "16dt" },
        { name: "Chicken Mix", description: "3 fingers + 2 wings + 3 legs (8 pièces)", price: "28dt" }
      ]
    },
    {
      title: "🥗 Bowls",
      description: "Nos Bowls sont Garnis d'une Sauce Maison, Frites, Mozzarella + Viande Au Choix",
      items: [
        { name: "Esc. Grillé", price: "14.5dt" },
        { name: "Esc. Panée", price: "15dt" },
        { name: "Steak de Bœuf Haché", price: "16dt" },
        { name: "Pepperoni", price: "14.5dt" },
        { name: "Crevettes Sautées ou Panées", price: "19dt" }
      ]
    },
    {
      title: "⭐ Special The Wise",
      items: [
        { name: "Symphonie Fruits de Mer", price: "98dt" },
        { name: "Paella (1 pers.)", price: "39dt" },
        { name: "Paella (2 pers.)", price: "85dt" },
        { name: "Symphonie Mixte (Terre, Mer)", price: "160dt" }
      ]
    },
    {
      title: "🍫 Snacks",
      sections: [
        {
          subtitle: "Les Crêpes Sucrées",
          items: [
            { name: "Simple Nutella, Garniture", price: "9dt" },
            { name: "Thon Fromage, Thon, Fromage", price: "8.5dt" },
            { name: "Nutella Banane, Nutella, Banane, Garniture", price: "12dt" },
            { name: "Jambon Fromage, Jambon, Fromage", price: "9dt" },
            { name: "Dolce, Nutella, Speculoos", price: "11dt" },
            { name: "Puttanesca, Sauce Puttanesca, Sauce Napolitaine, Câpre, Piment de Cayenne, Thon, Olive", price: "11.5dt" },
            { name: "Ecubana, Banane, Miel", price: "14dt" },
            { name: "Complet, Œuf, Harissa, Jambon, Thon, Mozzarella", price: "11dt" },
            { name: "The Wise, Nutella, Chocolat Blanc, m&m's, Twix, Speculoos, Crème Cheese", price: "16dt" },
            { name: "The Wise, Harissa, mozzarella, ricotta jambon fumée, emincé de poulet champignon sauté", price: "18dt" }
          ]
        },
        {
          subtitle: "Les Crêpes Salées",
          items: [
            { name: "Thon Fromage", price: "10dt" },
            { name: "Jambon Fromage", price: "10.5dt" },
            { name: "Puttanesca", price: "11.5dt" },
            { name: "The Wise", price: "18dt" }
          ]
        },
        {
          subtitle: "Gaufres",
          items: [
            { name: "Nutella", price: "9.5dt" },
            { name: "Tropicale, Nutella, Kiwi, Banane, Chantilly", price: "11dt" },
            { name: "Big Dolce, Nutella, Oreo, Speculoos, Fruit sec, garnitures", price: "13dt" },
            { name: "The Wise, Nutella, Oreo, Speculoos, Fruit sec, garnitures", price: "16dt" }
          ]
        }
      ]
    },
    {
      title: "👶 Menu Enfants",
      items: [
        { name: "Chapletta", description: "(Mini Pizza ou Frites + Soda)", price: "13.8dt" },
        { name: "Calico", description: "(Nuggets + Frites + Soda)", price: "13.8dt" }
      ]
    },
    {
      title: "🥤 Boissons",
      sections: [
        {
          subtitle: "Hot Drinks",
          items: [
            { name: "Express", price: "2.5dt" },
            { name: "Direct", price: "3dt" },
            { name: "Cappuccin", price: "2.8dt" },
            { name: "Crème", price: "5.5dt" },
            { name: "Cappuccino", price: "4.5dt" },
            { name: "Crème Nutella", price: "5.4dt" },
            { name: "Chocolat au lait", price: "3dt" },
            { name: "Thé à la menthe", price: "1.8dt" },
            { name: "Thé aux amandes", price: "4.8dt" },
            { name: "Thé pignon", price: "7.8dt" },
            { name: "Verveine", price: "2.8dt" }
          ]
        },
        {
          subtitle: "Cocktails",
          items: [
            { name: "Amoureux, Fraise, banane", price: "9.2dt" },
            { name: "Scandinave, kiwi, Banane", price: "9.8dt" },
            { name: "Black & white, Banane, Nutella", price: "10.5dt" },
            { name: "Palmier, Dattes, Banane", price: "10.5dt" },
            { name: "The wise, Banane, Datte, Miel, Fruits Secs+Garnitures", price: "12.8dt" }
          ]
        },
        {
          subtitle: "Mojito",
          items: [
            { name: "Virgin Mojito", price: "7.8dt" },
            { name: "Healthy Mojito", price: "7.8dt" },
            { name: "Blue Mojito", price: "8.8dt" },
            { name: "Red Mojito", price: "8.8dt" },
            { name: "Fruit de Passion", price: "8.8dt" },
            { name: "Energetic Mojito", price: "12.8dt" }
          ]
        },
        {
          subtitle: "Smoothies",
          items: [
            { name: "Red Frutti", price: "9.8dt" },
            { name: "Pina Colada", price: "10.5dt" },
            { name: "Blue Berry", price: "9.8dt" },
            { name: "Passion kiwi", price: "11.5dt" },
            { name: "The Wise", price: "13.5dt" }
          ]
        },
        {
          subtitle: "Les Jus",
          items: [
            { name: "Citron", price: "3.8dt" },
            { name: "Citron aux amandes", price: "7.2dt" },
            { name: "Banane", price: "7.8dt" },
            { name: "Orange", price: "4.2dt" },
            { name: "Fraise", price: "6.5dt" },
            { name: "Jus Fruits", price: "9.8dt" }
          ]
        },
        {
          subtitle: "Frappuccino",
          items: [
            { name: "Nutella", price: "9.8dt" },
            { name: "Spéculoos", price: "9.8dt" },
            { name: "Oreo", price: "9.8dt" },
            { name: "Twix", price: "9.8dt" },
            { name: "Snickers", price: "9.8dt" },
            { name: "The wise, Banane, Nutella, Oreo, Garnitures", price: "13.8dt" }
          ]
        },
        {
          subtitle: "Jwajem",
          items: [
            { name: "Mini The Wise", price: "12dt" },
            { name: "Spécial The Wise", price: "17dt" }
          ]
        },
        {
          subtitle: "Desserts",
          items: [
            { name: "Tiramisu", price: "6.8dt" },
            { name: "Cheese Cake", price: "6.8dt" },
            { name: "American Chocolate", price: "9.8dt" }
          ]
        },
        {
          subtitle: "Suppléments",
          items: [
            { name: "Dose arôme", price: "2.8dt" },
            { name: "Chantilly", price: "1.8dt" },
            { name: "Nutella", price: "3.8dt" },
            { name: "Amande", price: "3.2dt" }
          ]
        },
        {
          subtitle: "Boissons",
          items: [
            { name: "Eau Minérale 0.5L", price: "1.3dt" },
            { name: "Eau Minérale 1L", price: "2.5dt" },
            { name: "Soda", price: "2.8dt" },
            { name: "Orangina", price: "3.2dt" },
            { name: "Energy Drink", price: "8.8dt" }
          ]
        }
      ],
      image: drinkImg
    }
  ];

  const getOrderList = () => {
    return Object.entries(orderItems).map(([key, item]) => ({
      name: key,
      quantity: item.quantity,
      price: `${item.price}dt`
    }));
  };

  return (
    <section id="menu" className="py-24 bg-noise grain relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-card/20 to-background/40 pointer-events-none"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="ornament mb-5 text-xs uppercase tracking-[0.4em]">Carte complète</div>
          <h2 className="font-display text-6xl md:text-7xl leading-none text-gradient-gold mb-5">
            Notre Menu Complet
          </h2>
          <p className="text-muted-foreground text-lg">
            Découvrez notre sélection de plats délicieux
          </p>
        </div>

        {/* Floating Order Button */}
        {(totalItems > 0 || quarterMeterPizzas.length > 0) && (
          <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:bottom-8 md:left-auto md:right-8 md:translate-x-0 z-50 w-[90%] md:w-auto">
            <Button
              onClick={handleCommander}
              size="lg"
              className="w-full md:w-auto rounded-full shadow-2xl bg-gradient-to-r from-primary to-primary-glow text-primary-foreground hover:brightness-110 shadow-elegant hover:shadow-glow h-16 px-6 md:px-8 text-sm md:text-base"
            >
              <ShoppingCart className="mr-2 h-5 w-5 flex-shrink-0" />
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

        <div className="grid gap-8">
          {menuCategories.map((category, index) => {
            // Create a scroll reveal hook for each card
            const cardReveal = useScrollReveal({ threshold: 0.1, delay: index * 50 });
            
            return (
              <div
                key={index}
                ref={cardReveal.ref}
                className={`scroll-reveal ${cardReveal.isVisible ? 'revealed' : ''}`}
              >
                <Card className="glass glass-hover rounded-3xl shadow-elegant overflow-hidden">
              <CardHeader className="bg-card/50 text-foreground border-b border-border/60">
                <CardTitle className="font-display text-3xl text-center text-gradient-gold">
                  {category.title}
                </CardTitle>
                {category.subtitle && (
                  <p className="text-center text-white/90 text-sm mt-2">{category.subtitle}</p>
                )}
              </CardHeader>
              <CardContent className="p-6">
                {category.isPizza ? (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {category.pizzas?.map((pizzaName: string, pizzaIndex: number) => (
                        <div key={pizzaIndex} className="p-4 border border-border/50 hover:border-primary/40 hover:bg-primary/8 transition-smooth rounded-2xl">
                          <h4 className="font-display text-2xl text-foreground mb-1">
                            {pizzaName}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-3">
                            {pizzaDescriptions[pizzaName as keyof typeof pizzaDescriptions]}
                          </p>
                          <div className="flex flex-col gap-3">
                            <div className="flex gap-2 items-center flex-wrap">
                              <Select
                                value={pizzaSizes[pizzaName] || ""}
                                onValueChange={(value) => setPizzaSizes(prev => ({ ...prev, [pizzaName]: value }))}
                              >
                                <SelectTrigger className="w-[180px] glass text-foreground">
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
                                className="rounded border-primary/40 bg-card/60 text-primary focus:ring-primary"
                              />
                              <label htmlFor={`cheese-crust-${pizzaIndex}`} className="text-sm text-muted-foreground">
                                Cheese crust
                                {pizzaSizes[pizzaName] && (
                                  <span> (+{cheeseCrustPrices[pizzaSizes[pizzaName] as keyof typeof cheeseCrustPrices] || 0}dt)</span>
                                )}
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {category.images && (
                      <div className="hidden lg:flex flex-col gap-4 items-center justify-center">
                        {category.images.map((img: string, imgIndex: number) => (
                          <img 
                            key={imgIndex}
                            src={img} 
                            alt={`${category.title} ${imgIndex + 1}`}
                            className="max-w-2xl w-full h-auto object-contain rounded-2xl shadow-elegant border border-border/50 transition-smooth hover:scale-[1.03]"
                            style={{
                              filter: 'contrast(1.1) saturate(1.15) brightness(1.05)',
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {category.description && (
                        <p className="text-sm text-muted-foreground italic mb-4">{category.description}</p>
                      )}
                      {category.items && category.items.map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className="flex justify-between items-start p-4 border border-border/50 hover:border-primary/40 hover:bg-primary/8 transition-smooth rounded-2xl">
                          <div className="flex-1">
                            <h4 className="font-display text-2xl text-foreground">
                              {item.name}
                            </h4>
                            {item.description && (
                              <p className="text-muted-foreground text-sm mt-1">
                                {item.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {item.price && (
                              <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/30">
                                {item.price}
                              </Badge>
                            )}
                            <div className="flex items-center gap-1 bg-card/60 rounded-full p-1 border border-border/60">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 rounded-full hover:bg-primary hover:text-primary-foreground"
                                onClick={() => handleQuantityChange(item.name, item, -1, true)}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-semibold">
                                {orderItems[item.name]?.quantity || 0}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 rounded-full hover:bg-primary hover:text-primary-foreground"
                                onClick={() => handleQuantityChange(item.name, item, 1, true)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {category.sections && category.sections.map((section: any, sectionIndex: number) => (
                        <div key={sectionIndex} className="space-y-3">
                          <h3 className="font-display text-2xl text-gradient-gold mt-5 flex items-center gap-2">
                            <span className="h-px w-10 bg-gradient-to-r from-primary to-transparent"></span>
                            {section.subtitle}
                          </h3>
                          {section.items.map((item: any, itemIndex: number) => (
                            <div key={itemIndex} className="flex justify-between items-start p-4 border border-border/50 hover:border-primary/40 hover:bg-primary/8 transition-smooth rounded-2xl">
                              <div className="flex-1">
                                <h4 className="font-display text-2xl text-foreground">
                                  {item.name}
                                </h4>
                                {item.description && (
                                  <p className="text-muted-foreground text-sm mt-1">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                {item.price && (
                                  <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/30">
                                    {item.price}
                                  </Badge>
                                )}
                                <div className="flex items-center gap-1 bg-card/60 rounded-full p-1 border border-border/60">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 rounded-full hover:bg-primary hover:text-primary-foreground"
                                    onClick={() => handleQuantityChange(item.name, item, -1, true)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="w-8 text-center text-sm font-semibold">
                                    {orderItems[item.name]?.quantity || 0}
                                  </span>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 rounded-full hover:bg-primary hover:text-primary-foreground"
                                    onClick={() => handleQuantityChange(item.name, item, 1, true)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                    {/* Single image */}
                    {category.image && (
                      <div className="hidden lg:flex items-center justify-center">
                        <img 
                          src={category.image} 
                          alt={category.title}
                          className="max-w-md w-full h-auto object-contain rounded-2xl shadow-elegant border border-border/50 transition-smooth hover:scale-[1.03]"
                          style={{
                            filter: 'contrast(1.1) saturate(1.15) brightness(1.05)',
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          );
        })}
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

export default MenuSection;
