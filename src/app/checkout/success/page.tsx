import Link from "next/link";
import { db } from "@/lib/db";
import { formatMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

type CheckoutSuccessPageProps = {
  searchParams: Promise<{
    order?: string;
    reference?: string;
    orderNumber?: string;
  }>;
};

function getStatusCopy(paymentStatus?: string) {
  if (paymentStatus === "PAID") {
    return {
      label: "Payment confirmed",
      message:
        "Tu pago fue confirmado correctamente. Estamos preparando tu orden.",
    };
  }

  return {
    label: "Payment validation",
    message:
      "Tu orden fue recibida. Si completaste el pago en TiloPay, estamos validando la confirmación para preparar tu entrega.",
  };
}

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const params = await searchParams;
  const orderNumber = params.order ?? params.reference ?? params.orderNumber;

  const order = orderNumber
    ? await db.order.findUnique({
        where: {
          orderNumber,
        },
        include: {
          items: true,
        },
      })
    : null;

  const statusCopy = getStatusCopy(order?.paymentStatus);

  return (
    <main className="bg-black px-5 py-20 text-white md:py-28">
      <section className="mx-auto max-w-5xl">
        <div className="border border-white/10 bg-white/[0.03] p-6 text-center md:p-12">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white text-4xl font-black text-black">
            ✓
          </div>

          <p className="mt-8 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
            Order received
          </p>

          <h1 className="mx-auto mt-6 max-w-4xl text-6xl font-black uppercase leading-[0.85] tracking-tight md:text-8xl">
            Thank you for
            <span className="block text-neutral-700">your order.</span>
          </h1>

          <p className="mt-8 text-lg font-black uppercase tracking-[0.12em] text-white">
            Orden: {orderNumber ?? "Pending reference"}
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-sm uppercase leading-7 tracking-[0.16em] text-neutral-500">
            {statusCopy.message}
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <StatusCard label="Step 1" value="Order received" />
            <StatusCard label="Step 2" value={statusCopy.label} />
            <StatusCard label="Step 3" value="Delivery soon" />
          </div>

          {order && (
            <div className="mx-auto mt-10 max-w-2xl border border-white/10 bg-black p-5 text-left">
              <p className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
                Order summary
              </p>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-5 border-b border-white/10 pb-4 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-black uppercase">
                        {item.productNameSnapshot}
                      </p>

                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-neutral-600">
                        {item.quantity} ×{" "}
                        {item.variantSnapshot ?? "No variant"}
                      </p>
                    </div>

                    <p className="text-sm font-black">
                      {formatMoney(item.lineTotal)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex justify-between border-t border-white/10 pt-5 text-lg font-black uppercase">
                <span>Total</span>
                <span>{formatMoney(order.total)}</span>
              </div>
            </div>
          )}

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/shop"
              className="border border-white/20 !bg-black px-8 py-5 text-center text-sm font-black uppercase tracking-[0.25em] !text-white transition hover:!bg-white/10 hover:!text-white active:!bg-white/10"
            >
              Ver catálogo
            </Link>

            <Link
              href="/"
              className="border border-white/20 !bg-black px-8 py-5 text-center text-sm font-black uppercase tracking-[0.25em] !text-white transition hover:!bg-white/10 hover:!text-white active:!bg-white/10"
            >
              Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function StatusCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-black p-5 text-left">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
        {label}
      </p>

      <p className="mt-3 text-lg font-black uppercase text-white">{value}</p>
    </div>
  );
}