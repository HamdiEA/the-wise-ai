import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderItems: Array<{ name: string; quantity: number; price: string }>;
  totalPrice?: number;
}

const OrderDialog = ({ open, onOpenChange, orderItems, totalPrice }: OrderDialogProps) => {
  const locations = [
    { name: "Bardo Tunis", phone: "52 555 414" },
    { name: "Teboulba", phone: "93 560 560" },
    { name: "Ksar Hellal Monastir", phone: "52 555 400" }
  ];

  const orderText = orderItems
    .map(item => `${item.quantity}x ${item.name}`)
    .join(", ");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-restaurant-red">
            Passer votre commande
          </DialogTitle>
          <DialogDescription>
            Appelez l'un de nos restaurants pour commander
          </DialogDescription>
        </DialogHeader>
        
        {orderItems.length > 0 && (
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">Votre sélection:</h4>
            <ul className="space-y-1 text-sm">
              {orderItems.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{item.quantity}x {item.name}</span>
                  <span className="font-semibold">{item.price}</span>
                </li>
              ))}
            </ul>
            {totalPrice !== undefined && (
              <div className="mt-3 pt-3 border-t border-border flex justify-between font-bold text-lg text-restaurant-red">
                <span>Total:</span>
                <span>{totalPrice.toFixed(2)}dt</span>
              </div>
            )}
          </div>
        )}

        <div className="space-y-3">
          {locations.map((location, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start h-auto py-4 hover:bg-restaurant-red hover:text-white transition-all duration-300 glow-on-hover"
              onClick={() => {
                if (typeof window !== 'undefined' && 'ontouchstart' in window) {
                  window.location.href = `tel:${location.phone.replace(/\s/g, '')}`;
                } else {
                  navigator.clipboard.writeText(location.phone);
                }
              }}
            >
              <div className="flex items-center w-full">
                <Phone className="h-5 w-5 mr-3 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-semibold">{location.name}</div>
                  <div className="text-sm opacity-80">{location.phone}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Mentionnez votre sélection lors de l'appel
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
