import React, { useState, useEffect } from "react";
import SimpleCopilotChat from "./SimpleCopilotChat";
import OrderCard from "./OrderCard";

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
  category?: string;
}

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedOrder = localStorage.getItem("completeOrder");
    if (savedOrder) {
      try {
        const { items, total } = JSON.parse(savedOrder);
        setOrderItems(items || []);
        setTotalPrice(total || 0);
      } catch (e) {
        console.error("Failed to load order from localStorage", e);
      }
    }
  }, []);

  // Listen for order updates: merge from menus, overwrite from OrderCard
  useEffect(() => {
    const handleOrderUpdate = (event: any) => {
      if (event.detail) {
        const newItems = event.detail.items || [];
        const overwrite = !!event.detail.overwrite;

        setOrderItems((prevItems) => {
          // If overwrite flag is set (events from OrderCard), replace entirely
          if (overwrite) {
            const calculatedTotalOverwrite = newItems.reduce((sum: number, item: OrderItem) => {
              const priceNum = parseFloat(item.price.toString().replace('dt', ''));
              return sum + priceNum * item.quantity;
            }, 0);

            localStorage.setItem(
              "completeOrder",
              JSON.stringify({ items: newItems, total: calculatedTotalOverwrite })
            );

            return newItems;
          }

          // Start with existing items
          const itemMap = new Map<string, OrderItem>();

          // Add all previous items
          prevItems.forEach((item) => {
            itemMap.set(item.name, { ...item });
          });

          // Merge new items - accumulate quantities for same items
          newItems.forEach((newItem: OrderItem) => {
            const existing = itemMap.get(newItem.name);
            if (existing) {
              // Item exists - update it (replace with new data from current menu)
              itemMap.set(newItem.name, newItem);
            } else {
              // New item - add it
              itemMap.set(newItem.name, newItem);
            }
          });

          // Convert back to array
          const merged = Array.from(itemMap.values());

          // Calculate total from all items
          const calculatedTotal = merged.reduce(
            (sum, item) => {
              const priceNum = parseFloat(item.price.toString().replace('dt', ''));
              return sum + priceNum * item.quantity;
            },
            0
          );

          // Persist to localStorage
          localStorage.setItem(
            "completeOrder",
            JSON.stringify({
              items: merged,
              total: calculatedTotal,
            })
          );

          return merged;
        });
      }
    };

    window.addEventListener("orderUpdated", handleOrderUpdate);
    return () => window.removeEventListener("orderUpdated", handleOrderUpdate);
  }, []);

  // Listen for explicit item removals/clears from menus and other components
  useEffect(() => {
    const handleItemsRemoved = (e: any) => {
      const names: string[] = e.detail?.names || [];
      if (!names.length) return;
      setOrderItems((prev) => {
        const filtered = prev.filter((it) => !names.includes(it.name));
        const newTotal = filtered.reduce((sum, it) => {
          const priceNum = parseFloat(it.price.toString().replace('dt', ''));
          return sum + priceNum * it.quantity;
        }, 0);
        try {
          localStorage.setItem("completeOrder", JSON.stringify({ items: filtered, total: newTotal }));
        } catch {}
        return filtered;
      });
    };
    const handleItemDecremented = (e: any) => {
      const name: string = e.detail?.name;
      if (!name) return;
      setOrderItems((prev) => {
        const updated = prev.map((it) => 
          it.name === name && it.quantity > 1 ? { ...it, quantity: it.quantity - 1 } : it
        ).filter((it) => it.quantity > 0);
        const newTotal = updated.reduce((sum, it) => {
          const priceNum = parseFloat(it.price.toString().replace('dt', ''));
          return sum + priceNum * it.quantity;
        }, 0);
        try {
          localStorage.setItem("completeOrder", JSON.stringify({ items: updated, total: newTotal }));
        } catch {}
        return updated;
      });
    };
    const handleCleared = () => {
      setOrderItems([]);
      setTotalPrice(0);
      try { localStorage.removeItem("completeOrder"); } catch {}
    };
    window.addEventListener('orderItemsRemoved', handleItemsRemoved);
    window.addEventListener('orderItemDecremented', handleItemDecremented);
    window.addEventListener('orderCleared', handleCleared);
    return () => {
      window.removeEventListener('orderItemsRemoved', handleItemsRemoved);
      window.removeEventListener('orderItemDecremented', handleItemDecremented);
      window.removeEventListener('orderCleared', handleCleared);
    };
  }, []);

  // Update total price whenever order items change
  useEffect(() => {
    const calculatedTotal = orderItems.reduce((sum, item) => {
      const priceNum = parseFloat(item.price.toString().replace('dt', ''));
      return sum + priceNum * item.quantity;
    }, 0);
    setTotalPrice(calculatedTotal);
  }, [orderItems]);

  return (
    <>
      {/* Order Card Bubble - appears above AI bubble */}
      <OrderCard 
        orderItems={orderItems}
        totalPrice={totalPrice}
        onClose={() => {
          setOrderItems([]);
          setTotalPrice(0);
          localStorage.removeItem("completeOrder");
        }}
        isChatOpen={open}
      />

      {/* AI Chat Bubble - Hidden when chatbot is open */}
      {!open && (
        <div style={{
          position: "fixed",
          right: 20,
          bottom: 24,
          zIndex: 9999,
        }}>
          <button
            aria-label="Open assistant"
            onClick={() => setOpen(true)}
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
              color: "#fff",
              border: "1px solid rgba(251, 146, 60, 0.5)",
              boxShadow: "0 8px 32px rgba(217, 119, 6, 0.3)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.5px",
              fontFamily: "'Inter', -apple-system, 'Segoe UI', sans-serif",
              textTransform: "uppercase",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #ea8c1a 0%, #c26812 100%)";
              e.currentTarget.style.boxShadow = "0 12px 40px rgba(217, 119, 6, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(135deg, #d97706 0%, #b45309 100%)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(217, 119, 6, 0.3)";
            }}
          >
            AI
          </button>
        </div>
      )}

      {/* Modal overlay */}
      {open && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0, 0, 0, 0.5)",
          zIndex: 9998,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
          padding: "20px",
        }} onClick={() => setOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: "100%",
            maxWidth: "400px",
            borderRadius: 16,
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            background: "rgba(0, 0, 0, 0.7)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            maxHeight: "85vh",
          }}>
            <div style={{padding: "14px 16px", borderBottom: "1px solid rgba(251, 146, 60, 0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(0,0,0,0.5)"}}>
              <strong style={{color: "#fbbf24", fontSize: "14px"}}>Wiser AI — Assistant</strong>
              <button onClick={() => setOpen(false)} style={{border: "none", background: "transparent", cursor: "pointer", color: "#fff", fontSize: "20px", padding: "0 8px"}}>✕</button>
            </div>
            <div style={{flex: 1, overflow: "hidden"}}>
              <SimpleCopilotChat />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
