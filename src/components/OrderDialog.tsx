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
  orderItems: Array<{ name: string; quantity: number; price: string; category?: string }>;
  totalPrice?: number;
}

const OrderDialog = ({ open, onOpenChange, orderItems, totalPrice }: OrderDialogProps) => {
  const locations = [
    { name: "Bardo Tunis", phone: "52555414", displayPhone: "52 555 414" },
    { name: "Teboulba", phone: "93560560", displayPhone: "93 560 560" },
    { name: "Ksar Hellal Monastir", phone: "52555400", displayPhone: "52 555 400" }
  ];

  const handlePhoneClick = (phoneNumber: string) => {
    if (typeof window !== 'undefined' && 'ontouchstart' in window) {
      // Mobile - attempt to call
      const confirmation = window.confirm(`Call ${phoneNumber}?`);
      if (confirmation) {
        window.location.href = `tel:${phoneNumber}`;
      }
    } else {
      // Desktop - copy to clipboard
      navigator.clipboard.writeText(phoneNumber);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-md"
        style={{
          background: "linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(31, 41, 55, 0.9) 100%)",
          border: "1px solid rgba(251, 191, 36, 0.3)",
          borderRadius: 16,
        }}
      >
        <DialogHeader>
          <DialogTitle 
            className="text-2xl"
            style={{
              background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Your Order
          </DialogTitle>
          <DialogDescription style={{ color: "#d1d5db" }}>
            Review and call to confirm
          </DialogDescription>
        </DialogHeader>
        
        {orderItems.length > 0 && (
          <div 
            className="mb-4 p-4 rounded-lg"
            style={{
              background: "rgba(245, 158, 11, 0.05)",
              border: "1px solid rgba(251, 191, 36, 0.2)",
            }}
          >
            {/* Receipt Header */}
            <div style={{
              fontSize: 12,
              color: "#9ca3af",
              marginBottom: 12,
              paddingBottom: 12,
              borderBottom: "1px dashed rgba(251, 191, 36, 0.3)",
            }}>
              <div style={{ marginBottom: 4 }}>Receipt</div>
              <div style={{ fontSize: 11 }}>The Wise Restaurant</div>
            </div>

            {/* Order Items */}
            <div className="space-y-3 mb-4">
              {orderItems.map((item, index) => (
                <div key={index}>
                  {item.category && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "#f59e0b",
                        fontWeight: 600,
                        marginBottom: 4,
                        textTransform: "uppercase",
                      }}
                    >
                      {item.category}
                    </div>
                  )}
                  <div 
                    className="flex justify-between items-center text-sm"
                    style={{
                      color: "#e5e7eb",
                      paddingBottom: 12,
                      borderBottom: "1px solid rgba(251, 191, 36, 0.1)",
                    }}
                  >
                    <span>{item.quantity}x {item.name}</span>
                    <span 
                      className="font-semibold"
                      style={{ color: "#fbbf24" }}
                    >
                      {item.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            {totalPrice !== undefined && (
              <div 
                className="mt-3 pt-3 border-t flex justify-between font-bold text-lg"
                style={{
                  borderColor: "rgba(251, 191, 36, 0.3)",
                  color: "#e5e7eb",
                }}
              >
                <span>Total:</span>
                <span style={{ color: "#fbbf24" }}>{totalPrice.toFixed(2)}dt</span>
              </div>
            )}
          </div>
        )}

        {/* Phone Numbers */}
        <div className="space-y-3">
          <div style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#f59e0b",
            textTransform: "uppercase",
            marginBottom: 4,
          }}>
            Call to Order
          </div>
          {locations.map((location, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start h-auto py-3 transition-all duration-300"
              style={{
                background: "rgba(245, 158, 11, 0.1)",
                borderColor: "rgba(251, 191, 36, 0.3)",
                color: "#e5e7eb",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(245, 158, 11, 0.2)";
                e.currentTarget.style.borderColor = "rgba(251, 191, 36, 0.6)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(245, 158, 11, 0.1)";
                e.currentTarget.style.borderColor = "rgba(251, 191, 36, 0.3)";
              }}
              onClick={() => handlePhoneClick(location.phone)}
            >
              <div className="flex items-center w-full gap-3">
                <Phone className="h-5 w-5 flex-shrink-0" style={{ color: "#f59e0b" }} />
                <div className="text-left">
                  <div className="font-semibold" style={{ color: "#fbbf24" }}>
                    {location.displayPhone}
                  </div>
                  <div className="text-xs opacity-80 mt-1">{location.name}</div>
                </div>
              </div>
            </Button>
          ))}
        </div>

        <p className="text-xs text-center mt-4" style={{ color: "#9ca3af" }}>
          Mention your items when calling to order
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
