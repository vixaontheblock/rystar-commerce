import Link from "next/link";
import { db } from "@/lib/db";
import { formatMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

function getStatusClass(status: string) {
  const classes: Record<string, string> = {
    PENDING: "border-yellow-400/30 bg-yellow-400/10 text-yellow-200",
    PAID: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    PREPARING: "border-blue-400/30 bg-blue-400/10 text-blue-200",
    SHIPPED: "border-purple-400/30 bg-purple-400/10 text-purple-200",
    DELIVERED: "border-white/20 bg-white/10 text-white",
    CANCELLED: "border-red-400/30 bg-red-400/10 text-red-200",
    FAILED: "border-red-400/30 bg-red-400/10 text-red-200",
    REFUNDED: "border-orange-400/30 bg-orange-400/10 text-orange-200",
  };

  return classes[status] ?? "border-white/10 bg-white/5 text-neutral-400";
}

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      items: true,
    },
  });

  return (
    <main className="bg-black px-5 py-16 text-white md:py-24">
      <section className="mx-auto max-w-7xl">
        <div className="mb-12">
          <Link
            href="/admin"
            className="inline-flex border border-white/10 bg-black px-5 py-4 text-xs font-black uppercase tracking-[0.25em] text-neutral-400 transition hover:bg-white/10 hover:text-white"
          >
            ← Back to admin
          </Link>

          <p className="mt-10 mb-5 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
            Admin · Orders
          </p>

          <h1 className="text-6xl font-black uppercase leading-[0.85] tracking-tight md:text-9xl">
            Store
            <span className="block text-neutral-700">Orders</span>
          </h1>

          <p className="mt-8 max-w-2xl text-sm uppercase leading-7 tracking-[0.16em] text-neutral-500">
            Pedidos creados desde el checkout. Por ahora quedan como pending
            hasta conectar el endpoint oficial de TiloPay.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="border border-white/10 bg-white/[0.03] p-10 text-center">
            <h2 className="text-4xl font-black uppercase">No orders yet</h2>

            <p className="mx-auto mt-5 max-w-xl text-sm uppercase leading-7 tracking-[0.16em] text-neutral-600">
              Cuando alguien complete checkout, la orden aparecerá aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <article
                key={order.id}
                className="border border-white/10 bg-white/[0.03] p-5 md:p-6"
              >
                <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-black uppercase">
                        {order.orderNumber}
                      </h2>

                      <span
                        className={[
                          "border px-3 py-1 text-xs font-black uppercase tracking-[0.18em]",
                          getStatusClass(order.status),
                        ].join(" ")}
                      >
                        {order.status}
                      </span>

                      <span
                        className={[
                          "border px-3 py-1 text-xs font-black uppercase tracking-[0.18em]",
                          getStatusClass(order.paymentStatus),
                        ].join(" ")}
                      >
                        Payment {order.paymentStatus}
                      </span>
                    </div>

                    <p className="mt-4 text-sm text-neutral-400">
                      {order.customerName} · {order.customerEmail}
                      {order.customerPhone ? ` · ${order.customerPhone}` : ""}
                    </p>

                    <p className="mt-3 text-xs font-black uppercase leading-5 tracking-[0.2em] text-neutral-700">
                      {order.createdAt.toLocaleString()}
                    </p>
                  </div>

                  <div className="lg:text-right">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
                      Total
                    </p>

                    <p className="mt-2 text-3xl font-black">
                      {formatMoney(order.total)}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border border-white/10 bg-black p-5">
                  <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
                    Delivery address
                  </p>

                  <p className="text-sm uppercase leading-7 tracking-[0.14em] text-neutral-400">
                    {order.shippingAddress}
                  </p>
                </div>

                <div className="mt-5 border border-white/10 bg-black p-5">
                  <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
                    Items
                  </p>

                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="grid gap-3 border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1fr_auto]"
                      >
                        <div>
                          <p className="font-black uppercase">
                            {item.productNameSnapshot}
                          </p>

                          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-neutral-500">
                            {item.quantity} ×{" "}
                            {item.variantSnapshot ?? "No variant"}
                          </p>
                        </div>

                        <p className="font-black">
                          {formatMoney(item.lineTotal)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 border-t border-white/10 pt-5 md:grid-cols-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-neutral-700">
                      Subtotal
                    </p>

                    <p className="mt-2 font-black">
                      {formatMoney(order.subtotal)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-neutral-700">
                      Shipping
                    </p>

                    <p className="mt-2 font-black">
                      {order.shippingTotal === 0
                        ? "Free"
                        : formatMoney(order.shippingTotal)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-neutral-700">
                      TiloPay reference
                    </p>

                    <p className="mt-2 font-black text-neutral-400">
                      {order.tilopayReference ?? "Pending"}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/admin/orders/${order.id}`}
                  className="mt-5 block border border-white/10 bg-black px-5 py-4 text-center text-xs font-black uppercase tracking-[0.22em] text-neutral-400 transition hover:bg-white/10 hover:text-white"
                >
                  View / Edit order
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}