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

const OrderCard = ({ orderItems, totalPrice, onClose, isChatOpen }: OrderCardProps) => {
  const [showDetails, setShowDetails] = useState(false);

  const locations = [
    { name: "Bardo Tunis", phone: "52555414" },
    { name: "Teboulba", phone: "93560560" },
    { name: "Ksar Hellal Monastir", phone: "52555400" }
  ];

  const handlePhoneClick = (phone: string) => {
    if (typeof window !== 'undefined' && 'ontouchstart' in window) {
      // Mobile - attempt to call
      const confirmation = window.confirm(`Call ${phone}?`);
      if (confirmation) {
        window.location.href = `tel:${phone}`;
      }
    } else {
      // Desktop - copy to clipboard
      navigator.clipboard.writeText(phone.replace(/(\d{2})(?=\d)/g, '$1 '));
      alert("Phone number copied to clipboard");
    }
  };

  // Don't show if chat is open or no items
  if (isChatOpen || orderItems.length === 0) {
    return null;
  }

  // Collapsed bubble view
  if (!showDetails) {
    return (
      <div
        style={{
          position: "fixed",
          right: 20,
          bottom: 100,
          zIndex: 9997,
        }}
      >
        <button
          onClick={() => setShowDetails(true)}
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            color: "#fff",
            border: "2px solid rgba(251, 191, 36, 0.6)",
            boxShadow: "0 8px 32px rgba(245, 158, 11, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 700,
            fontFamily: "'Inter', -apple-system, 'Segoe UI', sans-serif",
            transition: "all 0.3s ease",
            flexDirection: "column",
            gap: 2,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)";
            e.currentTarget.style.boxShadow = "0 12px 40px rgba(245, 158, 11, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.3)";
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)";
            e.currentTarget.style.boxShadow = "0 8px 32px rgba(245, 158, 11, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <ShoppingCart size={20} />
          <span style={{ fontSize: 10 }}>{orderItems.length}</span>
        </button>
      </div>
    );
  }

  // Expanded card view
  return (
    <div
      style={{
        position: "fixed",
        right: 20,
        bottom: 100,
        zIndex: 9997,
        width: "100%",
        maxWidth: 380,
        maxHeight: "85vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Card Container */}
      <div
        style={{
          borderRadius: 16,
          background: "linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(31, 41, 55, 0.8) 100%)",
          border: "1px solid rgba(251, 191, 36, 0.3)",
          boxShadow: "0 20px 60px rgba(245, 158, 11, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "85vh",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
            padding: "16px",
            borderBottom: "1px solid rgba(251, 191, 36, 0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ShoppingCart size={20} style={{ color: "#fff" }} />
            <strong style={{ color: "#fff", fontSize: 14 }}>Your Order</strong>
          </div>
          <button
            onClick={() => setShowDetails(false)}
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#fff",
              fontSize: 20,
              padding: "0 8px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {/* Order Items - Receipt Style */}
          <div style={{ marginBottom: 8 }}>
            <div
              style={{
                fontSize: 12,
                color: "#9ca3af",
                marginBottom: 12,
                paddingBottom: 12,
                borderBottom: "1px dashed rgba(251, 191, 36, 0.3)",
              }}
            >
              <div style={{ marginBottom: 4 }}>Receipt</div>
              <div style={{ fontSize: 11 }}>The Wise Restaurant</div>
            </div>

            {/* Items grouped by category */}
            {orderItems.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  paddingBottom: 10,
                  borderBottom: "1px solid rgba(251, 191, 36, 0.1)",
                  fontSize: 13,
                }}
              >
                <div style={{ flex: 1 }}>
                  {item.category && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "#f59e0b",
                        fontWeight: 600,
                        marginBottom: 2,
                        textTransform: "uppercase",
                      }}
                    >
                      {item.category}
                    </div>
                  )}
                  <div style={{ color: "#e5e7eb" }}>
                    {item.quantity}x {item.name}
                  </div>
                </div>
                <div
                  style={{
                    color: "#fbbf24",
                    fontWeight: 600,
                    textAlign: "right",
                    marginLeft: 12,
                  }}
                >
                  {item.price}
                </div>
              </div>
            ))}

            {/* Total */}
            {totalPrice !== undefined && (
              <div
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: "1px solid rgba(251, 191, 36, 0.3)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                <span style={{ color: "#e5e7eb" }}>Total:</span>
                <span style={{ color: "#fbbf24" }}>{totalPrice.toFixed(2)}dt</span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.3), transparent)",
              margin: "8px 0",
            }}
          />

          {/* Phone Numbers */}
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "#f59e0b",
                marginBottom: 10,
                textTransform: "uppercase",
              }}
            >
              Call to Order
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {locations.map((location, index) => (
                <button
                  key={index}
                  onClick={() => handlePhoneClick(location.phone)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 12px",
                    background: "rgba(245, 158, 11, 0.1)",
                    border: "1px solid rgba(251, 191, 36, 0.3)",
                    borderRadius: 8,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
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
                >
                  <Phone size={16} style={{ color: "#f59e0b", flexShrink: 0 }} />
                  <div style={{ textAlign: "left", fontSize: 13 }}>
                    <div style={{ fontWeight: 600, color: "#fbbf24" }}>
                      {location.phone.replace(/(\d{2})(?=\d)/g, '$1 ')}
                    </div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                      {location.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div
          style={{
            padding: "12px 16px",
            fontSize: 11,
            color: "#9ca3af",
            textAlign: "center",
            borderTop: "1px solid rgba(251, 191, 36, 0.2)",
            background: "rgba(0, 0, 0, 0.5)",
          }}
        >
          Mention your items when calling
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
