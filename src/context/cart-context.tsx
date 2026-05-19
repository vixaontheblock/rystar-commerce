"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CartProductSnapshot = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  images: string[];
};

type CartVariantSnapshot = {
  id: string;
  size: string;
  color?: string | null;
  stock: number;
  priceOverride?: number | null;
};

type CartLine = {
  lineId: string;
  product: CartProductSnapshot;
  variant: CartVariantSnapshot;
  quantity: number;
};

type CartItem = {
  lineId: string;
  product: CartProductSnapshot;
  variant: CartVariantSnapshot;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (
    product: CartProductSnapshot,
    variant: CartVariantSnapshot,
    quantity?: number
  ) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "rystar-cart-v2";

function getLineId(productId: string, variantId: string) {
  return `${productId}:${variantId}`;
}

function normalizeQuantity(quantity: number, stock: number) {
  if (stock <= 0) return 0;

  return Math.max(1, Math.min(Math.floor(quantity), stock));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const rawCart = window.localStorage.getItem(STORAGE_KEY);

    if (rawCart) {
      try {
        const parsedCart = JSON.parse(rawCart) as CartLine[];

        if (Array.isArray(parsedCart)) {
          setLines(parsedCart);
        }
      } catch {
        setLines([]);
      }
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const items = useMemo<CartItem[]>(() => {
    return lines.map((line) => {
      const unitPrice = line.variant.priceOverride ?? line.product.price;

      return {
        lineId: line.lineId,
        product: line.product,
        variant: line.variant,
        quantity: line.quantity,
        unitPrice,
        lineTotal: unitPrice * line.quantity,
      };
    });
  }, [lines]);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);

  function addItem(
    product: CartProductSnapshot,
    variant: CartVariantSnapshot,
    quantity = 1
  ) {
    if (variant.stock <= 0) return;

    const lineId = getLineId(product.id, variant.id);
    const quantityToAdd = normalizeQuantity(quantity, variant.stock);

    if (quantityToAdd <= 0) return;

    setLines((current) => {
      const existingLine = current.find((line) => line.lineId === lineId);

      if (existingLine) {
        return current.map((line) => {
          if (line.lineId !== lineId) return line;

          return {
            ...line,
            product,
            variant,
            quantity: normalizeQuantity(
              line.quantity + quantityToAdd,
              variant.stock
            ),
          };
        });
      }

      return [
        ...current,
        {
          lineId,
          product,
          variant,
          quantity: quantityToAdd,
        },
      ];
    });
  }

  function updateQuantity(lineId: string, quantity: number) {
    setLines((current) =>
      current
        .map((line) => {
          if (line.lineId !== lineId) return line;

          return {
            ...line,
            quantity: normalizeQuantity(quantity, line.variant.stock),
          };
        })
        .filter((line) => line.quantity > 0)
    );
  }

  function removeItem(lineId: string) {
    setLines((current) => current.filter((line) => line.lineId !== lineId));
  }

  function clearCart() {
    setLines([]);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}