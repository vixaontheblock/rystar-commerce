"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { formatMoney } from "@/lib/money";

const FREE_SHIPPING_THRESHOLD = 10000;
const SHIPPING = 350;

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingTotal = qualifiesForFreeShipping || subtotal === 0 ? 0 : SHIPPING;
  const total = subtotal + shippingTotal;

  const remainingForFreeShipping = Math.max(
    FREE_SHIPPING_THRESHOLD - subtotal,
    0
  );

  const shippingProgress = Math.min(
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
    100
  );

  const outlineButtonClass =
    "!bg-black !text-white border border-white/20 px-8 py-6 text-sm font-black uppercase tracking-[0.25em] transition hover:!bg-white/10 hover:!text-white active:!bg-white/10 focus:!bg-black focus:!text-white";

  if (items.length === 0) {
    return (
      <main className="bg-black px-5 py-20 text-white md:py-28">
        <section className="mx-auto max-w-7xl">
          <div className="border border-white/10 bg-white/[0.03] p-8 text-center md:p-16">
            <p className="mb-6 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
              Cart
            </p>

            <h1 className="text-6xl font-black uppercase leading-[0.85] tracking-tight md:text-9xl">
              Your cart
              <span className="block text-neutral-700">is empty</span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-sm uppercase leading-7 tracking-[0.16em] text-neutral-500">
              Todavía no has agregado ninguna pieza. Explora el drop antes de
              que se agoten las tallas disponibles.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/shop" className={outlineButtonClass}>
                Ver catálogo
              </Link>

              <Link
                href="/custom"
                className={`${outlineButtonClass} border-white/15 text-neutral-400`}
              >
                Custom order
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-black px-5 py-16 text-white md:py-24">
      <section className="mx-auto max-w-7xl">
        <div className="mb-12">
          <p className="mb-5 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
            Cart
          </p>

          <h1 className="text-6xl font-black uppercase leading-[0.85] tracking-tight md:text-9xl">
            Your
            <span className="block text-neutral-700">Cart</span>
          </h1>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
          <div>
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-5">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-600">
                Items
              </p>

              <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-600">
                {items.length} {items.length === 1 ? "product" : "products"}
              </p>
            </div>

            <div className="space-y-5">
              {items.map((item) => (
                <article
                  key={item.lineId}
                  className="grid gap-5 border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[150px_1fr_auto] md:p-5"
                >
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="block overflow-hidden bg-white"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="aspect-square w-full object-contain transition duration-500 hover:scale-105"
                    />
                  </Link>

                  <div className="flex flex-col justify-between gap-5">
                    <div>
                      <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
                        {item.product.category}
                      </p>

                      <Link
                        href={`/product/${item.product.slug}`}
                        className="block text-2xl font-black uppercase leading-none transition hover:text-neutral-400 md:text-3xl"
                      >
                        {item.product.name}
                      </Link>

                      <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-neutral-500">
                        {item.variant.size}
                        {item.variant.color ? ` / ${item.variant.color}` : ""}
                      </p>

                      <p className="mt-4 text-sm font-black uppercase tracking-[0.22em] text-white">
                        {formatMoney(item.unitPrice)} USD
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.lineId)}
                      className="w-fit text-xs font-black uppercase tracking-[0.25em] text-neutral-700 transition hover:text-white"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-5 md:flex-col md:items-end">
                    <div className="grid h-14 w-44 grid-cols-3 border border-white/15">
                      <button
                        type="button"
                        onClick={() =>
                          item.quantity <= 1
                            ? removeItem(item.lineId)
                            : updateQuantity(item.lineId, item.quantity - 1)
                        }
                        className="text-2xl text-neutral-500 transition hover:bg-white hover:text-black"
                      >
                        −
                      </button>

                      <div className="flex items-center justify-center text-lg font-black">
                        {item.quantity}
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.lineId, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.variant.stock}
                        className="text-2xl text-neutral-500 transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-neutral-700">
                        Total
                      </p>

                      <p className="mt-2 text-xl font-black">
                        {formatMoney(item.lineTotal)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <Link
              href="/shop"
              className="mt-8 inline-flex !bg-black !text-white border border-white/15 px-7 py-5 text-xs font-black uppercase tracking-[0.25em] transition hover:!bg-white/10 hover:!text-white active:!bg-white/10 focus:!bg-black focus:!text-white"
            >
              ← Continue shopping
            </Link>
          </div>

          <aside className="h-fit border border-white/10 bg-white/[0.04] p-6 lg:sticky lg:top-40">
            <p className="mb-5 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
              Summary
            </p>

            <h2 className="text-4xl font-black uppercase leading-none">
              Order
              <span className="block text-neutral-700">Details</span>
            </h2>

            <div className="mt-8 border border-white/10 bg-black p-5">
              {qualifiesForFreeShipping ? (
                <p className="text-xs font-black uppercase leading-6 tracking-[0.22em] text-white">
                  Free shipping unlocked.
                </p>
              ) : (
                <p className="text-xs font-black uppercase leading-6 tracking-[0.22em] text-neutral-500">
                  Add{" "}
                  <span className="text-white">
                    {formatMoney(remainingForFreeShipping)}
                  </span>{" "}
                  more to unlock free shipping in Panama.
                </p>
              )}

              <div className="mt-5 h-2 bg-white/10">
                <div
                  className="h-full bg-white transition-all duration-500"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>

            <div className="mt-8 space-y-5 border-y border-white/10 py-6">
              <div className="flex justify-between gap-5 text-sm font-black uppercase tracking-[0.18em] text-neutral-500">
                <span>Subtotal</span>
                <span>{formatMoney(subtotal)}</span>
              </div>

              <div className="flex justify-between gap-5 text-sm font-black uppercase tracking-[0.18em] text-neutral-500">
                <span>Shipping</span>
                <span>
                  {shippingTotal === 0 ? "Free" : formatMoney(shippingTotal)}
                </span>
              </div>

              <div className="flex justify-between gap-5 pt-4 text-xl font-black uppercase tracking-[0.12em] text-white">
                <span>Total</span>
                <span>{formatMoney(total)}</span>
              </div>
            </div>

            <Link
                href="/checkout"
                className="mt-8 flex w-full items-center justify-center border border-white/20 !bg-black px-8 py-6 text-sm font-black uppercase tracking-[0.25em] !text-white transition hover:!bg-white/10 hover:!text-white active:!bg-white/10 focus:!bg-black focus:!text-white"
                >
                Checkout →
            </Link>

            <div className="mt-5 border border-white/10 bg-black p-5">
              <p className="text-xs font-black uppercase leading-6 tracking-[0.22em] text-neutral-600">
                Secure checkout · TiloPay soon · Shipping in Panama · Limited
                pieces · No restock
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}