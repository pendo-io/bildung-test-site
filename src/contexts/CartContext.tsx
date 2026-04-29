import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Trip } from "@/lib/trips";

type CartItem = {
  trip: Trip;
  travelers: number;
  departure: string;
};

type CartContextValue = {
  items: CartItem[];
  addToCart: (trip: Trip, travelers: number, departure: string) => void;
  removeFromCart: (tripId: string) => void;
  updateTravelers: (tripId: string, travelers: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "wanderlux-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((trip: Trip, travelers: number, departure: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.trip.id === trip.id);
      if (existing) {
        return prev.map((i) => (i.trip.id === trip.id ? { ...i, travelers, departure } : i));
      }
      return [...prev, { trip, travelers, departure }];
    });
  }, []);

  const removeFromCart = useCallback((tripId: string) => {
    setItems((prev) => prev.filter((i) => i.trip.id !== tripId));
  }, []);

  const updateTravelers = useCallback((tripId: string, travelers: number) => {
    setItems((prev) =>
      prev.map((i) => (i.trip.id === tripId ? { ...i, travelers: Math.max(1, travelers) } : i))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { count, subtotal } = useMemo(() => {
    const count = items.reduce((acc, i) => acc + i.travelers, 0);
    const subtotal = items.reduce((acc, i) => acc + i.trip.priceUSD * i.travelers, 0);
    return { count, subtotal };
  }, [items]);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateTravelers, clear, count, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
