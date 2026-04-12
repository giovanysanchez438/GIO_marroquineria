import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface CartItem {
  productId: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem("gio-cart");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const persist = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem("gio-cart", JSON.stringify(newItems));
  };

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      let next: CartItem[];
      if (existing) {
        next = prev.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i);
      } else {
        next = [...prev, { ...item, quantity }];
      }
      localStorage.setItem("gio-cart", JSON.stringify(next));
      return next;
    });
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems(prev => {
      const next = prev.filter(i => i.productId !== productId);
      localStorage.setItem("gio-cart", JSON.stringify(next));
      return next;
    });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) return removeItem(productId);
    setItems(prev => {
      const next = prev.map(i => i.productId === productId ? { ...i, quantity } : i);
      localStorage.setItem("gio-cart", JSON.stringify(next));
      return next;
    });
  }, [removeItem]);

  const clearCart = useCallback(() => {
    persist([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
