import React, { useState, useEffect } from "react";
import SimpleCopilotChat from "./SimpleCopilotChat";
import OrderCard from "./OrderCard";
import { Sparkles, MessageCircle, X } from "lucide-react";
import type { Lang } from "@/context/LanguageContext";
import t, { tr } from "@/data/translations";

const AiAvatar = () => (
  <div className="wise-ai-avatar" aria-hidden="true">
    <Sparkles size={14} />
  </div>
);

interface OrderItem {
  name: string;
  quantity: number;
  price: string;
  category?: string;
}

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("fr");
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
    return () => {
      window.removeEventListener("orderUpdated", handleOrderUpdate);
    };
  }, []);

  return (
    <>
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

      {!open && (
        <div className="wise-chat-launcher-wrap">
          <button className="wise-chat-launcher" aria-label="Open assistant" onClick={() => setOpen(true)}>
            <span className="wise-chat-launcher__pulse" aria-hidden="true" />
            <MessageCircle size={22} strokeWidth={1.8} />
          </button>
        </div>
      )}

      {open && (
        <div className="wise-chat-overlay" onClick={() => setOpen(false)}>
          <section
            className="wise-chat-panel glass"
            onClick={(e) => e.stopPropagation()}
            aria-label="Wiser AI assistant"
          >
            <div className="wise-chat-panel__header">
              <div className="wise-chat-panel__identity">
                <AiAvatar />
                <div>
                  <strong>Assistant The Wise</strong>
                  <span className="wise-chat-panel__online">
                    <span className="wise-status-dot" aria-hidden="true" />
                    {tr(t.chat.available, lang)}
                  </span>
                </div>
              </div>
              <div className="wise-chat-panel__actions">
                <div className="wise-language-toggle wise-language-toggle--sm" aria-label="Language">
                  <button className={lang === "fr" ? "is-active" : ""} onClick={() => setLang("fr")}>FR</button>
                  <button className={lang === "en" ? "is-active" : ""} onClick={() => setLang("en")}>EN</button>
                  <button className={lang === "ar" ? "is-active" : ""} onClick={() => setLang("ar")} style={{ fontFamily: "'Noto Naskh Arabic', serif" }}>{"\u0639\u0631"}</button>
                </div>
                <button className="wise-chat-close" onClick={() => setOpen(false)} aria-label="Close assistant">
                  <X size={16} />
                </button>
              </div>
            </div>
            <div className="wise-chat-panel__body">
              <SimpleCopilotChat lang={lang} setLang={setLang} />
            </div>
          </section>
        </div>
      )}
    </>
  );
}


