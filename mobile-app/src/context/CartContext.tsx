import { createContext, useContext, useState, type ReactNode } from "react";

export interface CartItem {
  detalleSeccionCartaId: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

interface CartContextType {
  mesaId: string | null;
  /** ID de la comanda abierta existente; null cuando hay que crear una nueva. */
  comandaId: string | null;
  /** Número de mesa para mostrar en el header tras el envío. */
  mesaNumero: string | null;
  items: CartItem[];
  total: number;
  startCart: (mesaId: string, comandaId?: string | null, mesaNumero?: string | null) => void;
  addItem: (item: Omit<CartItem, "cantidad">) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [mesaId, setMesaId] = useState<string | null>(null);
  const [comandaId, setComandaId] = useState<string | null>(null);
  const [mesaNumero, setMesaNumero] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);

  const total = items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  function startCart(id: string, cId?: string | null, numero?: string | null) {
    setMesaId(id);
    setComandaId(cId ?? null);
    setMesaNumero(numero ?? null);
    setItems([]);
  }

  function addItem(item: Omit<CartItem, "cantidad">) {
    setItems((prev) => {
      const existing = prev.find((i) => i.detalleSeccionCartaId === item.detalleSeccionCartaId);
      if (existing) {
        return prev.map((i) =>
          i.detalleSeccionCartaId === item.detalleSeccionCartaId
            ? { ...i, cantidad: i.cantidad + 1 }
            : i,
        );
      }
      return [...prev, { ...item, cantidad: 1 }];
    });
  }

  function increment(id: string) {
    setItems((prev) =>
      prev.map((i) =>
        i.detalleSeccionCartaId === id ? { ...i, cantidad: i.cantidad + 1 } : i,
      ),
    );
  }

  function decrement(id: string) {
    setItems((prev) => {
      const item = prev.find((i) => i.detalleSeccionCartaId === id);
      if (!item) return prev;
      if (item.cantidad <= 1) return prev.filter((i) => i.detalleSeccionCartaId !== id);
      return prev.map((i) =>
        i.detalleSeccionCartaId === id ? { ...i, cantidad: i.cantidad - 1 } : i,
      );
    });
  }

  function clearCart() {
    setMesaId(null);
    setComandaId(null);
    setMesaNumero(null);
    setItems([]);
  }

  return (
    <CartContext.Provider
      value={{ mesaId, comandaId, mesaNumero, items, total, startCart, addItem, increment, decrement, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
