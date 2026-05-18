"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { formatMoney } from "@/lib/money";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <main className="px-5 py-24">
        <section className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-500">
            Cart
          </p>

          <h1 className="text-5xl font-black uppercase">Your cart is empty</h1>

          <Link
            href="/shop"
            className="mt-10 inline-flex rounded-full bg-white px-8 py-4 text-sm font-black uppercase tracking-wide text-black"
          >
            Go shopping
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="px-5 py-16">
      <section className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-500">
            Cart
          </p>

          <h1 className="text-5xl font-black uppercase">Your items</h1>

          <div className="mt-10 space-y-4">
            {items.map((item) => (
              <article
                key={item.lineId}
                className="grid gap-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5 md:grid-cols-[120px_1fr_auto]"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="aspect-square rounded-2xl object-cover"
                />

                <div>
                  <h2 className="text-xl font-bold">{item.product.name}</h2>
                  <p className="mt-2 text-sm text-neutral-400">
                    {item.variant.size}
                    {item.variant.color ? ` / ${item.variant.color}` : ""}
                  </p>
                  <p className="mt-4 font-semibold">
                    {formatMoney(item.unitPrice)}
                  </p>
                </div>

                <div className="flex items-center gap-3 md:flex-col md:items-end">
                  <input
                    type="number"
                    min={1}
                    max={item.variant.stock}
                    value={item.quantity}
                    onChange={(event) =>
                      updateQuantity(item.lineId, Number(event.target.value))
                    }
                    className="w-20 rounded-xl border border-white/10 bg-black px-3 py-2 text-white"
                  />

                  <button
                    type="button"
                    onClick={() => removeItem(item.lineId)}
                    className="text-sm text-neutral-500 transition hover:text-white"
                  >
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black uppercase">Summary</h2>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>

            <div className="flex justify-between text-neutral-400">
              <span>Shipping</span>
              <span>Calculated next</span>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatMoney(subtotal)}</span>
              </div>
            </div>
          </div>

          <Link
            href="/checkout"
            className="mt-8 flex w-full justify-center rounded-full bg-white px-8 py-4 text-sm font-black uppercase tracking-wide text-black transition hover:bg-neutral-200"
          >
            Checkout
          </Link>
        </aside>
      </section>
    </main>
  );
}