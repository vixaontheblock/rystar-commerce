"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { products } from "@/data/products";
import type { Product, ProductVariant } from "@/types/product";

type CartLine = {
  productId: string;
  variantId: string;
  quantity: number;
};

type CartItem = {
  lineId: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (productId: string, variantId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "rystar-cart-v1";

function getLineId(productId: string, variantId: string) {
  return `${productId}:${variantId}`;
}

function findVariant(productId: string, variantId: string) {
  const product = products.find((item) => item.id === productId);
  const variant = product?.variants.find((item) => item.id === variantId);

  if (!product || !variant) return null;

  return { product, variant };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const rawCart = window.localStorage.getItem(STORAGE_KEY);

    if (rawCart) {
      try {
        setLines(JSON.parse(rawCart));
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
    return lines
      .map((line) => {
        const found = findVariant(line.productId, line.variantId);

        if (!found) return null;

        const unitPrice =
          found.variant.priceOverride ?? found.product.price;

        return {
          lineId: getLineId(line.productId, line.variantId),
          product: found.product,
          variant: found.variant,
          quantity: line.quantity,
          unitPrice,
          lineTotal: unitPrice * line.quantity,
        };
      })
      .filter(Boolean) as CartItem[];
  }, [lines]);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = items.reduce((total, item) => total + item.lineTotal, 0);

  function addItem(productId: string, variantId: string) {
    const found = findVariant(productId, variantId);

    if (!found || found.variant.stock <= 0) return;

    setLines((current) => {
      const lineId = getLineId(productId, variantId);
      const existingLine = current.find(
        (line) => getLineId(line.productId, line.variantId) === lineId
      );

      if (existingLine) {
        return current.map((line) => {
          if (getLineId(line.productId, line.variantId) !== lineId) {
            return line;
          }

          return {
            ...line,
            quantity: Math.min(line.quantity + 1, found.variant.stock),
          };
        });
      }

      return [...current, { productId, variantId, quantity: 1 }];
    });
  }

  function updateQuantity(lineId: string, quantity: number) {
    setLines((current) =>
      current
        .map((line) => {
          if (getLineId(line.productId, line.variantId) !== lineId) {
            return line;
          }

          const found = findVariant(line.productId, line.variantId);
          const maxStock = found?.variant.stock ?? 1;

          return {
            ...line,
            quantity: Math.max(1, Math.min(quantity, maxStock)),
          };
        })
        .filter((line) => line.quantity > 0)
    );
  }

  function removeItem(lineId: string) {
    setLines((current) =>
      current.filter(
        (line) => getLineId(line.productId, line.variantId) !== lineId
      )
    );
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