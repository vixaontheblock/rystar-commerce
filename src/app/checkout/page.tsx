"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { formatMoney } from "@/lib/money";

const SHIPPING = 350;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const total = subtotal + SHIPPING;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const orderNumber = `RY-${Date.now().toString().slice(-6)}`;

    clearCart();
    router.push(`/checkout/success?order=${orderNumber}`);
  }

  if (items.length === 0) {
    return (
      <main className="px-5 py-24">
        <section className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-black uppercase">No items to checkout</h1>

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
        <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-500">
            Checkout
          </p>

          <h1 className="text-4xl font-black uppercase">Delivery details</h1>

          <div className="mt-8 grid gap-5">
            <input
              required
              name="name"
              placeholder="Nombre completo"
              className="rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition placeholder:text-neutral-600 focus:border-white"
            />

            <input
              required
              name="email"
              type="email"
              placeholder="Correo"
              className="rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition placeholder:text-neutral-600 focus:border-white"
            />

            <input
              required
              name="phone"
              placeholder="WhatsApp / Teléfono"
              className="rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition placeholder:text-neutral-600 focus:border-white"
            />

            <textarea
              required
              name="address"
              placeholder="Dirección de entrega"
              rows={5}
              className="rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition placeholder:text-neutral-600 focus:border-white"
            />

            <button
              type="submit"
              className="rounded-full bg-white px-8 py-4 text-sm font-black uppercase tracking-wide text-black transition hover:bg-neutral-200"
            >
              Continue demo checkout
            </button>
          </div>
        </form>

        <aside className="h-fit rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <h2 className="text-2xl font-black uppercase">Order summary</h2>

          <div className="mt-6 space-y-5">
            {items.map((item) => (
              <div key={item.lineId} className="flex justify-between gap-4 text-sm">
                <div>
                  <p className="font-semibold">{item.product.name}</p>
                  <p className="text-neutral-500">
                    {item.quantity} × {item.variant.size}
                  </p>
                </div>

                <p>{formatMoney(item.lineTotal)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4 border-t border-white/10 pt-6 text-sm">
            <div className="flex justify-between text-neutral-400">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>

            <div className="flex justify-between text-neutral-400">
              <span>Shipping</span>
              <span>{formatMoney(SHIPPING)}</span>
            </div>

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>
          </div>

          <p className="mt-5 text-xs leading-5 text-neutral-500">
            Este checkout todavía es demo. Luego este botón creará una orden en
            la base de datos y redirigirá a TiloPay.
          </p>
        </aside>
      </section>
    </main>
  );
}