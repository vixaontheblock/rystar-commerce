"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import { formatMoney } from "@/lib/money";
import { useCart } from "@/context/cart-context";

export function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();
  const firstAvailable =
    product.variants.find((variant) => variant.stock > 0) ??
    product.variants[0];

  const [variantId, setVariantId] = useState(firstAvailable?.id ?? "");
  const [added, setAdded] = useState(false);

  const selectedVariant = product.variants.find(
    (variant) => variant.id === variantId
  );

  const price = selectedVariant?.priceOverride ?? product.price;
  const isOutOfStock = !selectedVariant || selectedVariant.stock <= 0;

  function handleAddToCart() {
    if (!selectedVariant) return;

    addItem(product.id, selectedVariant.id);
    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1500);
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-2">
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-neutral-900">
        <img
          src={product.images[0]}
          alt={product.name}
          className="aspect-[4/5] h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-col justify-center">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-500">
          {product.category}
        </p>

        <h1 className="text-5xl font-black uppercase tracking-tight md:text-7xl">
          {product.name}
        </h1>

        <p className="mt-6 text-2xl font-bold">{formatMoney(price)}</p>

        <p className="mt-6 max-w-xl text-lg leading-8 text-neutral-300">
          {product.description}
        </p>

        <div className="mt-8">
          <p className="mb-3 text-sm font-bold uppercase tracking-wide">
            Selecciona talla
          </p>

          <div className="flex flex-wrap gap-3">
            {product.variants.map((variant) => {
              const active = variant.id === variantId;

              return (
                <button
                  key={variant.id}
                  type="button"
                  disabled={variant.stock <= 0}
                  onClick={() => setVariantId(variant.id)}
                  className={[
                    "rounded-full border px-5 py-3 text-sm font-bold transition",
                    active
                      ? "border-white bg-white text-black"
                      : "border-white/15 text-white hover:border-white",
                    variant.stock <= 0
                      ? "cursor-not-allowed opacity-30"
                      : "",
                  ].join(" ")}
                >
                  {variant.size}
                </button>
              );
            })}
          </div>

          {selectedVariant && (
            <p className="mt-3 text-sm text-neutral-500">
              Stock disponible: {selectedVariant.stock}
            </p>
          )}
        </div>

        <button
          type="button"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className="mt-10 rounded-full bg-white px-8 py-4 text-sm font-black uppercase tracking-wide text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isOutOfStock
            ? "Sold out"
            : added
            ? "Added to cart"
            : "Add to cart"}
        </button>
      </div>
    </section>
  );
}