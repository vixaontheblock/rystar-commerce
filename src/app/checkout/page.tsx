"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { formatMoney } from "@/lib/money";
import type { CheckoutPayload, CheckoutResponse } from "@/types/checkout";

const SHIPPING = 350;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const total = subtotal + SHIPPING;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const payload: CheckoutPayload = {
      customer: {
        name: String(formData.get("name") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        address: String(formData.get("address") ?? ""),
      },
      items: items.map((item) => ({
        productId: item.product.id,
        variantId: item.variant.id,
        productName: item.product.name,
        variantName: `${item.variant.size}${
          item.variant.color ? ` / ${item.variant.color}` : ""
        }`,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
      })),
      subtotal,
      shippingTotal: SHIPPING,
      total,
    };

    try {
      const response = await fetch("/api/checkout/demo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as CheckoutResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.ok ? "Checkout failed." : data.error);
      }

      clearCart();
      router.push(data.redirectUrl);
    } catch (checkoutError) {
      setError(
        checkoutError instanceof Error
          ? checkoutError.message
          : "Checkout failed. Try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="px-5 py-24">
        <section className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-500">
            Checkout
          </p>

          <h1 className="text-5xl font-black uppercase">
            No items to checkout
          </h1>

          <p className="mt-5 text-neutral-400">
            Agrega productos al carrito antes de continuar.
          </p>

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
      <section className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_400px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8"
        >
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-500">
            Checkout
          </p>

          <h1 className="text-4xl font-black uppercase md:text-5xl">
            Delivery details
          </h1>

          <p className="mt-4 max-w-xl text-neutral-400">
            Completa los datos de entrega. Por ahora este flujo simula la orden;
            luego conectamos esta misma estructura con TiloPay.
          </p>

          <div className="mt-8 grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-neutral-400">
                Nombre completo
              </label>
              <input
                required
                name="name"
                placeholder="Ej: Carlos Pérez"
                className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition placeholder:text-neutral-700 focus:border-white"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-neutral-400">
                  Correo
                </label>
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="cliente@email.com"
                  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition placeholder:text-neutral-700 focus:border-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-neutral-400">
                  WhatsApp
                </label>
                <input
                  required
                  name="phone"
                  placeholder="+507 6000-0000"
                  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition placeholder:text-neutral-700 focus:border-white"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-wide text-neutral-400">
                Dirección de entrega
              </label>
              <textarea
                required
                name="address"
                placeholder="Provincia, distrito, calle, edificio/casa, referencia..."
                rows={5}
                className="w-full resize-none rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition placeholder:text-neutral-700 focus:border-white"
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-black p-5">
              <p className="text-sm font-bold uppercase tracking-wide">
                Payment method
              </p>

              <div className="mt-4 rounded-2xl border border-white bg-white p-5 text-black">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-black uppercase">TiloPay</p>
                    <p className="mt-1 text-sm text-neutral-600">
                      Credit / debit card payment.
                    </p>
                  </div>

                  <span className="rounded-full bg-black px-4 py-2 text-xs font-black uppercase text-white">
                    Soon
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-neutral-500">
                En esta fase no se cobra nada. Esta sección deja preparado el
                espacio visual para la pasarela real.
              </p>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-white px-8 py-4 text-sm font-black uppercase tracking-wide text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Processing order..." : "Place demo order"}
            </button>
          </div>
        </form>

        <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/[0.04] p-6">
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-500">
            Summary
          </p>

          <h2 className="text-2xl font-black uppercase">Order details</h2>

          <div className="mt-6 space-y-5">
            {items.map((item) => (
              <div
                key={item.lineId}
                className="grid grid-cols-[64px_1fr_auto] gap-4"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="aspect-square rounded-2xl object-cover"
                />

                <div>
                  <p className="font-semibold leading-tight">
                    {item.product.name}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    {item.quantity} × {item.variant.size}
                    {item.variant.color ? ` / ${item.variant.color}` : ""}
                  </p>
                </div>

                <p className="text-sm font-semibold">
                  {formatMoney(item.lineTotal)}
                </p>
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

            <div className="flex justify-between border-t border-white/10 pt-4 text-lg font-bold">
              <span>Total</span>
              <span>{formatMoney(total)}</span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
              Next phase
            </p>
            <p className="mt-2 text-sm leading-6 text-neutral-400">
              Este mismo resumen se usará para crear la orden en la base de
              datos y enviar el monto a TiloPay.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}