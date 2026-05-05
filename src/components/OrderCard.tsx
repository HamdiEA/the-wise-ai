import React, { useState } from "react";
import { X, ShoppingCart, Phone } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
  category?: string;
}

interface OrderCardProps {
  orderItems: OrderItem[];
  totalPrice?: number;
  onClose: () => void;
  isChatOpen?: boolean;
}

const bubbleButtonBase: React.CSSProperties = {
  width: 68,
  height: 68,
  borderRadius: 999,
  background: "linear-gradient(145deg, hsl(36 68% 54%) 0%, hsl(28 58% 42%) 100%)",
  color: "hsl(36 30% 94%)",
  border: "1px solid hsl(38 74% 62% / 0.5)",
  boxShadow: "0 16px 34px hsl(24 40% 4% / 0.5), 0 0 0 1px hsl(38 74% 62% / 0.1) inset",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  fontWeight: 700,
  fontFamily: "'Josefin Sans', 'Segoe UI', sans-serif",
  transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
  flexDirection: "column",
  gap: 3,
  backdropFilter: "blur(12px)",
};

const bubbleButtonHover = {
  background: "linear-gradient(145deg, hsl(39 82% 66%) 0%, hsl(31 60% 47%) 100%)",
  boxShadow: "0 20px 40px hsl(24 40% 4% / 0.58), 0 0 28px hsl(38 74% 62% / 0.28)",
  transform: "translateY(-3px) scale(1.04)",
};

const bubbleButtonIdle = {
  background: bubbleButtonBase.background,
  boxShadow: bubbleButtonBase.boxShadow,
  transform: "scale(1)",
};

const callButtonBase: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "11px 12px",
  background: "linear-gradient(135deg, hsl(36 65% 58% / 0.07), hsl(24 16% 11% / 0.42))",
  border: "1px solid hsl(38 70% 52% / 0.16)",
  borderRadius: 14,
  cursor: "pointer",
  transition: "all 0.25s ease",
  color: "hsl(36 30% 92%)",
};

const callButtonHover = {
  background: "linear-gradient(135deg, hsl(36 65% 58% / 0.14), hsl(24 16% 11% / 0.54))",
  borderColor: "hsl(38 70% 52% / 0.34)",
};

const callButtonIdle = {
  background: callButtonBase.background,
  borderColor: callButtonBase.border,
};

const OrderCard = ({ orderItems, totalPrice, onClose, isChatOpen }: OrderCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const locations = [
    { name: "Bardo Tunis", phone: "52555414" },
    { name: "Teboulba", phone: "93560560" },
    { name: "Ksar Hellal Monastir", phone: "52555400" },
  ];

  const totalQuantity = orderItems.reduce((sum, item) => sum + item.quantity, 0);
  const computedTotal = orderItems.reduce((sum, item) => {
    const price = parseFloat(item.price.toString().replace(/[^0-9.]/g, "")) || 0;
    return sum + price * item.quantity;
  }, 0);

  const dispatchOrderUpdate = (items: OrderItem[]) => {
    const newTotal = items.reduce((sum, it) => {
      const priceNum = parseFloat(it.price.toString().replace("dt", "")) || 0;
      return sum + priceNum * it.quantity;
    }, 0);

    try {
      localStorage.setItem("completeOrder", JSON.stringify({ items, total: newTotal }));
    } catch {}

    window.dispatchEvent(
      new CustomEvent("orderUpdated", {
        detail: { items, total: newTotal, overwrite: true },
      })
    );
  };

  const handleRemoveItem = (name: string) => {
    const item = orderItems.find((i) => i.name === name);
    if (!item) return;

    if (item.quantity > 1) {
      const updated = orderItems.map((i) =>
        i.name === name ? { ...i, quantity: i.quantity - 1 } : i
      );
      window.dispatchEvent(new CustomEvent("orderItemDecremented", { detail: { name } }));
      dispatchOrderUpdate(updated);
    } else {
      const updated = orderItems.filter((i) => i.name !== name);
      window.dispatchEvent(new CustomEvent("orderItemsRemoved", { detail: { names: [name] } }));
      dispatchOrderUpdate(updated);
      if (updated.length === 0) {
        setShowDetails(false);
      }
    }
  };

  const handleClearAll = () => {
    if (orderItems.length) {
      const names = orderItems.map((i) => i.name);
      window.dispatchEvent(new CustomEvent("orderItemsRemoved", { detail: { names } }));
    }
    window.dispatchEvent(new Event("orderCleared"));
    try {
      localStorage.setItem("completeOrder", JSON.stringify({ items: [], total: 0 }));
    } catch {}
    window.dispatchEvent(
      new CustomEvent("orderUpdated", {
        detail: { items: [], total: 0, overwrite: true },
      })
    );
    onClose?.();
    setShowDetails(false);
  };

  const handlePhoneClick = (phone: string) => {
    if (typeof window !== "undefined" && "ontouchstart" in window) {
      const confirmation = window.confirm(`Appeler ${phone} ?`);
      if (confirmation) {
        window.location.href = `tel:${phone}`;
      }
    } else {
      navigator.clipboard.writeText(phone.replace(/(\d{2})(?=\d)/g, "$1 "));
      alert("Numero copie dans le presse-papiers");
    }
  };

  if (isChatOpen || orderItems.length === 0) {
    return null;
  }

  if (!showDetails) {
    return (
      <div
        className="order-card-bubble"
        style={{
          position: "fixed",
          right: 24,
          bottom: 108,
          zIndex: 9997,
          isolation: "isolate",
        }}
      >
        <button
          onClick={() => setShowDetails(true)}
          style={bubbleButtonBase}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = bubbleButtonHover.background;
            e.currentTarget.style.boxShadow = bubbleButtonHover.boxShadow;
            e.currentTarget.style.transform = bubbleButtonHover.transform;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = String(bubbleButtonIdle.background);
            e.currentTarget.style.boxShadow = String(bubbleButtonIdle.boxShadow);
            e.currentTarget.style.transform = bubbleButtonIdle.transform;
          }}
        >
          <ShoppingCart size={20} />
          <span style={{ fontSize: 10 }}>{totalQuantity}</span>
        </button>
      </div>
    );
  }

  return (
    <div
      className="order-card-expanded"
      style={{
        position: "fixed",
        right: 24,
        bottom: 108,
        zIndex: 9997,
        isolation: "isolate",
        width: "100%",
        maxWidth: 396,
        maxHeight: "85vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          borderRadius: 28,
          background: "linear-gradient(160deg, hsl(24 16% 9% / 0.96) 0%, hsl(22 12% 8% / 0.94) 52%, hsl(26 18% 10% / 0.98) 100%)",
          border: "1px solid hsl(34 22% 22% / 0.9)",
          boxShadow: "0 28px 70px hsl(0 0% 0% / 0.52), 0 0 0 1px hsl(38 70% 52% / 0.08) inset",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "85vh",
          backdropFilter: "blur(20px)",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, hsl(24 12% 12% / 0.96) 0%, hsl(24 12% 10% / 0.88) 100%)",
            padding: "16px 18px",
            borderBottom: "1px solid hsl(38 70% 52% / 0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShoppingCart size={18} style={{ color: "hsl(38 80% 68%)" }} />
            <strong
              style={{
                color: "hsl(36 30% 92%)",
                fontSize: 18,
                fontFamily: "'Cormorant Garamond', serif",
                letterSpacing: "0.02em",
              }}
            >
              Votre commande
            </strong>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={handleClearAll}
              title="Tout effacer"
              style={{
                border: "1px solid hsl(38 70% 52% / 0.2)",
                background: "hsl(36 65% 58% / 0.08)",
                color: "hsl(36 30% 92%)",
                borderRadius: 999,
                padding: "7px 12px",
                fontSize: 11,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Tout effacer
            </button>
            <button
              onClick={() => setShowDetails(false)}
              style={{
                border: "1px solid hsl(38 70% 52% / 0.14)",
                background: "hsl(24 12% 11% / 0.6)",
                cursor: "pointer",
                color: "hsl(36 30% 92%)",
                fontSize: 20,
                padding: "8px",
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "18px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
            background: "linear-gradient(180deg, hsl(24 14% 7% / 0.42), hsl(24 12% 8% / 0.12))",
          }}
        >
          <div style={{ marginBottom: 8 }}>
            <div
              style={{
                fontSize: 12,
                color: "hsl(36 14% 65%)",
                marginBottom: 12,
                paddingBottom: 12,
                borderBottom: "1px dashed hsl(38 70% 52% / 0.22)",
              }}
            >
              <div
                style={{
                  marginBottom: 4,
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  color: "hsl(38 80% 68%)",
                }}
              >
                Recu
              </div>
              <div style={{ fontSize: 11 }}>The Wise Restaurant</div>
            </div>

            {orderItems.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  paddingBottom: 12,
                  borderBottom: "1px solid hsl(38 70% 52% / 0.08)",
                  fontSize: 13,
                }}
              >
                <div style={{ flex: 1 }}>
                  {item.category && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "hsl(38 80% 68%)",
                        fontWeight: 600,
                        marginBottom: 2,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {item.category}
                    </div>
                  )}
                  <div style={{ color: "hsl(36 30% 92%)" }}>
                    {item.quantity}x {item.name}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 12 }}>
                  <div
                    style={{
                      color: "hsl(38 80% 68%)",
                      fontWeight: 600,
                      textAlign: "right",
                      minWidth: 52,
                    }}
                  >
                    {item.price}
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.name)}
                    title="Supprimer l'article"
                    style={{
                      border: "1px solid hsl(38 70% 52% / 0.22)",
                      background: "hsl(38 70% 52% / 0.08)",
                      color: "hsl(38 80% 68%)",
                      borderRadius: 999,
                      padding: "5px 8px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <X size={14} />
                    <span style={{ fontSize: 11 }}>Supprimer</span>
                  </button>
                </div>
              </div>
            ))}

            <div
              style={{
                marginTop: 12,
                paddingTop: 12,
                borderTop: "1px solid hsl(38 70% 52% / 0.18)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              <span style={{ color: "hsl(36 30% 92%)" }}>Total&nbsp;:</span>
              <span style={{ color: "hsl(38 80% 68%)" }}>{computedTotal.toFixed(2)}dt</span>
            </div>
          </div>

          <div
            style={{
              height: 1,
              background: "linear-gradient(90deg, transparent, hsl(38 70% 52% / 0.22), transparent)",
              margin: "8px 0",
            }}
          />

          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "hsl(38 80% 68%)",
                marginBottom: 10,
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              Appeler pour commander
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {locations.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handlePhoneClick(location.phone)}
                  style={callButtonBase}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = callButtonHover.background;
                    e.currentTarget.style.borderColor = callButtonHover.borderColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = String(callButtonIdle.background);
                    e.currentTarget.style.borderColor = "hsl(38 70% 52% / 0.16)";
                  }}
                >
                  <Phone size={16} style={{ color: "hsl(36 65% 58%)", flexShrink: 0 }} />
                  <div style={{ textAlign: "left", fontSize: 13 }}>
                    <div style={{ fontWeight: 600, color: "hsl(38 80% 68%)" }}>
                      {location.phone.replace(/(\d{2})(?=\d)/g, "$1 ")}
                    </div>
                    <div style={{ fontSize: 11, color: "hsl(36 14% 65%)", marginTop: 2 }}>
                      {location.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "13px 18px",
            borderTop: "1px solid hsl(38 70% 52% / 0.14)",
            background: "linear-gradient(135deg, hsl(24 12% 12% / 0.96) 0%, hsl(24 12% 10% / 0.88) 100%)",
            color: "hsl(36 30% 92%)",
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.78, color: "hsl(36 14% 65%)" }}>
            Mentionnez vos articles lors de l’appel
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "hsl(38 80% 68%)" }}>
            Total&nbsp;: {computedTotal.toFixed(2)}dt
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
