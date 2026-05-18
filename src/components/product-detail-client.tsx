"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/types/product";
import { products } from "@/data/products";
import { formatMoney } from "@/lib/money";
import { useCart } from "@/context/cart-context";
import { ProductCard } from "@/components/product-card";

export function ProductDetailClient({ product }: { product: Product }) {
  const { addItem } = useCart();

  const firstVariant = product.variants[0];
  const firstAvailable =
    product.variants.find((variant) => variant.stock > 0) ?? firstVariant;

  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [variantId, setVariantId] = useState(firstAvailable?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedVariant = product.variants.find(
    (variant) => variant.id === variantId
  );

  const price = selectedVariant?.priceOverride ?? product.price;

  const isSoldOut = product.variants.every((variant) => variant.stock <= 0);
  const selectedStock = selectedVariant?.stock ?? 0;
  const canAddToCart = !isSoldOut && selectedStock > 0;

  const relatedProducts = useMemo(() => {
    return products.filter((item) => item.id !== product.id).slice(0, 2);
  }, [product.id]);

  function decreaseQuantity() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increaseQuantity() {
    if (!selectedVariant) return;

    setQuantity((current) => Math.min(selectedVariant.stock, current + 1));
  }

  function handleAddToCart() {
    if (!selectedVariant || !canAddToCart) return;

    for (let index = 0; index < quantity; index += 1) {
      addItem(product.id, selectedVariant.id);
    }

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1500);
  }

  return (
    <main>
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div>
          <div className="overflow-hidden border border-white/15 bg-white">
            <img
              src={selectedImage}
              alt={product.name}
              className="aspect-square w-full object-contain"
            />
          </div>

          {product.images.length > 1 && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              {product.images.map((image, index) => {
                const active = selectedImage === image;

                return (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={[
                      "border bg-white p-2 transition",
                      active
                        ? "border-white"
                        : "border-white/10 opacity-50 hover:opacity-100",
                    ].join(" ")}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="aspect-square w-full object-contain"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-start">
          <p className="mb-6 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
            {product.category}
          </p>

          <h1 className="text-6xl font-black uppercase leading-[0.82] tracking-tight text-white md:text-8xl">
            {product.name}
          </h1>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <p className="text-2xl font-black uppercase tracking-[0.18em]">
              {formatMoney(price)} USD
            </p>

            <span
              className={[
                "px-6 py-3 text-sm font-black uppercase tracking-[0.22em]",
                isSoldOut
                  ? "bg-white text-black"
                  : "border border-white/20 text-white",
              ].join(" ")}
            >
              {isSoldOut ? "Agotado" : "Disponible"}
            </span>
          </div>

          <p className="mt-5 max-w-2xl text-sm uppercase leading-7 tracking-[0.14em] text-neutral-500">
            Impuestos incluidos. Los gastos de envío se calculan en la pantalla
            de pago.
          </p>

          <p className="mt-8 max-w-2xl text-base uppercase leading-8 tracking-[0.12em] text-neutral-400">
            {product.description}
          </p>

          <div className="mt-10 border-t border-white/10 pt-8">
            <div className="mb-5 flex items-center gap-4">
              <p className="text-sm font-black uppercase tracking-[0.3em]">
                Talla
              </p>
              <span className="h-px flex-1 bg-white/10" />
            </div>

            <div className="flex flex-wrap gap-4">
              {product.variants.map((variant) => {
                const active = variant.id === variantId;
                const unavailable = variant.stock <= 0;

                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => {
                      setVariantId(variant.id);
                      setQuantity(1);
                    }}
                    className={[
                      "relative flex h-20 w-20 items-center justify-center border text-lg font-black uppercase transition",
                      active
                        ? "border-white bg-white text-black"
                        : "border-white/15 text-white hover:border-white",
                      unavailable ? "opacity-60" : "",
                    ].join(" ")}
                  >
                    {variant.size}

                    {unavailable && (
                      <span className="absolute h-px w-12 rotate-[-18deg] bg-current" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-8">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.3em]">
              Cantidad
            </p>

            <div className="grid h-20 w-72 grid-cols-3 border border-white/15">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={!canAddToCart}
                className="text-3xl text-neutral-400 transition hover:text-white disabled:opacity-30"
              >
                −
              </button>

              <div className="flex items-center justify-center text-3xl font-black">
                {quantity}
              </div>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={!canAddToCart}
                className="text-3xl text-neutral-400 transition hover:text-white disabled:opacity-30"
              >
                +
              </button>
            </div>
          </div>

          <button
            type="button"
            disabled={!canAddToCart}
            onClick={handleAddToCart}
            className="mt-8 w-full border border-white/15 bg-white px-8 py-7 text-sm font-black uppercase tracking-[0.28em] text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-neutral-600"
          >
            {isSoldOut ? "Agotado" : added ? "Agregado" : "Añadir al carrito"}
          </button>

          <div className="mt-6 border border-white/15 bg-[#92721f] px-8 py-6 text-center text-sm font-black uppercase tracking-[0.2em] text-black opacity-70">
            Pagar con TiloPay próximamente
          </div>

          <div className="mt-8 space-y-3 border-t border-white/10 pt-8">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-white">
              • Limited pieces.{" "}
              <span className="text-neutral-500">No restock.</span>
            </p>

            <p className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
              • Secure checkout · Rystar Studios
            </p>

            <p className="text-sm font-black uppercase tracking-[0.2em] text-neutral-500">
              • Shipping in Panama · 1-4 business days
            </p>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="border-t border-white/10 px-5 py-20">
          <div className="mx-auto max-w-7xl">
            <h2 className="max-w-4xl text-6xl font-black uppercase leading-[0.86] tracking-tight md:text-8xl">
              Te podría gustar
            </h2>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>

            <Link
              href="/shop"
              className="mt-12 flex items-center justify-center border border-white/15 px-8 py-6 text-center text-sm font-black uppercase tracking-[0.25em] transition hover:border-white hover:bg-white hover:text-black"
            >
              Ver catálogo completo →
            </Link>
          </div>
        </section>
      )}

      <section
        id="contact"
        className="border-t border-white/10 px-5 py-20"
      >
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-sm font-black uppercase tracking-[0.35em] text-neutral-500">
            Need help?
          </p>

          <h2 className="max-w-5xl text-6xl font-black uppercase leading-[0.85] md:text-8xl">
            Questions before the drop?
          </h2>

          <p className="mt-8 text-lg uppercase tracking-wide text-neutral-500">
            Write us directly before your size disappears.
          </p>

          <div className="mt-10 grid gap-4">
            <a
              href="https://wa.me/"
              target="_blank"
              className="bg-[#25D366] px-8 py-6 text-center text-sm font-black uppercase tracking-[0.25em] text-black transition hover:brightness-110"
            >
              WhatsApp
            </a>

            <Link
              href="/shop"
              className="border border-white/15 px-8 py-6 text-center text-sm font-black uppercase tracking-[0.25em] transition hover:border-white hover:bg-white hover:text-black"
            >
              Ver drop
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}