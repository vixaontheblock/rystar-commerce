"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { formatMoney } from "@/lib/money";

const SHIPPING = 350;
const FREE_SHIPPING_THRESHOLD = 10000;

type TilopayCheckoutResponse =
  | {
      ok: true;
      orderId: string;
      orderNumber: string;
      paymentUrl?: string;
      mode?: string;
      message?: string;
      tilopayReason?: string;
    }
  | {
      ok: false;
      message: string;
    };

const outlineButtonClass =
  "border border-white/20 !bg-black px-8 py-6 text-sm font-black uppercase tracking-[0.25em] !text-white transition hover:!bg-white/10 hover:!text-white active:!bg-white/10 focus:!bg-black focus:!text-white";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [pendingMessage, setPendingMessage] = useState("");

  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingTotal = qualifiesForFreeShipping || subtotal === 0 ? 0 : SHIPPING;
  const total = subtotal + shippingTotal;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPendingMessage("");
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);

    const payload = {
      customerName: String(formData.get("name") ?? "").trim(),
      customerEmail: String(formData.get("email") ?? "").trim(),
      customerPhone: String(formData.get("phone") ?? "").trim(),
      shippingAddress: String(formData.get("address") ?? "").trim(),
      items,
    };

    try {
      const response = await fetch("/api/checkout/tilopay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as TilopayCheckoutResponse;

      if (!response.ok || !data.ok) {
        throw new Error(data.ok ? "Checkout failed." : data.message);
      }

      clearCart();

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }

      if (data.mode === "tilopay_pending_configuration") {
        setPendingMessage(
          `Orden ${data.orderNumber} creada en Neon. Falta configurar el endpoint real de TiloPay para redirigir al pago.`
        );

        window.setTimeout(() => {
          router.push(`/checkout/success?order=${data.orderNumber}`);
        }, 1800);

        return;
      }

      router.push(`/checkout/success?order=${data.orderNumber}`);
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

  if (items.length === 0 && !pendingMessage) {
    return (
      <main className="bg-black px-5 py-24 text-white">
        <section className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
            Checkout
          </p>

          <h1 className="text-6xl font-black uppercase leading-[0.85] tracking-tight md:text-8xl">
            No items
            <span className="block text-neutral-700">to checkout</span>
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-sm uppercase leading-7 tracking-[0.16em] text-neutral-500">
            Agrega productos al carrito antes de continuar.
          </p>

          <Link href="/shop" className={`${outlineButtonClass} mt-10 inline-flex`}>
            Go shopping
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-black px-5 py-16 text-white md:py-24">
      <section className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_420px]">
        <form
          onSubmit={handleSubmit}
          className="border border-white/10 bg-white/[0.03] p-6 md:p-8"
        >
          <p className="mb-5 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
            Checkout
          </p>

          <h1 className="text-5xl font-black uppercase leading-[0.85] tracking-tight md:text-7xl">
            Delivery
            <span className="block text-neutral-700">Details</span>
          </h1>

          <p className="mt-6 max-w-xl text-sm uppercase leading-7 tracking-[0.16em] text-neutral-500">
            Completa los datos de entrega. Esta orden se guarda en Neon como
            pending y queda lista para enviarse a TiloPay.
          </p>

          <div className="mt-8 grid gap-5">
            <Field label="Nombre completo">
              <input
                required
                name="name"
                placeholder="Ej: Carlos Pérez"
                className="admin-input"
              />
            </Field>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Correo">
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="cliente@email.com"
                  className="admin-input"
                />
              </Field>

              <Field label="WhatsApp">
                <input
                  required
                  name="phone"
                  placeholder="+507 6000-0000"
                  className="admin-input"
                />
              </Field>
            </div>

            <Field label="Dirección de entrega">
              <textarea
                required
                name="address"
                placeholder="Provincia, distrito, calle, edificio/casa, referencia..."
                rows={5}
                className="admin-input resize-none leading-6"
              />
            </Field>

            <div className="border border-white/10 bg-black p-5">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-600">
                Payment method
              </p>

              <div className="mt-5 border border-white/15 bg-white/[0.03] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-black uppercase">TiloPay</p>
                    <p className="mt-2 text-sm uppercase leading-6 tracking-[0.14em] text-neutral-500">
                      Credit / debit card payment.
                    </p>
                  </div>

                  <span className="border border-white/15 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-neutral-400">
                    Pending endpoint
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs uppercase leading-5 tracking-[0.18em] text-neutral-600">
                La orden se crea en la base de datos. Cuando tengamos el endpoint
                oficial de TiloPay, este mismo botón redirigirá al pago real.
              </p>
            </div>

            {error && (
              <div className="border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            )}

            {pendingMessage && (
              <div className="border border-yellow-400/30 bg-yellow-400/10 p-4 text-sm uppercase leading-6 tracking-[0.16em] text-yellow-100">
                {pendingMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="border border-white/20 !bg-black px-8 py-6 text-sm font-black uppercase tracking-[0.25em] !text-white transition hover:!bg-white/10 hover:!text-white active:!bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Creating order..." : "Create order"}
            </button>
          </div>
        </form>

        <aside className="h-fit border border-white/10 bg-white/[0.04] p-6 lg:sticky lg:top-40">
          <p className="mb-5 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
            Summary
          </p>

          <h2 className="text-4xl font-black uppercase leading-none">
            Order
            <span className="block text-neutral-700">Details</span>
          </h2>

          <div className="mt-8 space-y-5">
            {items.map((item) => (
              <div
                key={item.lineId}
                className="grid grid-cols-[76px_1fr_auto] gap-4 border border-white/10 bg-black p-3"
              >
                <div className="bg-white">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="aspect-square w-full object-contain"
                  />
                </div>

                <div>
                  <p className="text-sm font-black uppercase leading-tight">
                    {item.product.name}
                  </p>

                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-neutral-500">
                    {item.quantity} × {item.variant.size}
                    {item.variant.color ? ` / ${item.variant.color}` : ""}
                  </p>
                </div>

                <p className="text-sm font-black">
                  {formatMoney(item.lineTotal)}
                </p>
              </div>
            ))}
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

          <div className="mt-5 border border-white/10 bg-black p-5">
            <p className="text-xs font-black uppercase leading-6 tracking-[0.22em] text-neutral-600">
              Order saved in Neon · TiloPay structure ready · Shipping in Panama
              · Limited pieces · No restock
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-3 block text-xs font-black uppercase tracking-[0.25em] text-neutral-600">
        {label}
      </label>

      {children}
    </div>
  );
}