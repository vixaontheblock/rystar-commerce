import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { OrderStatus, PaymentStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { formatMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

type AdminOrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const orderStatuses: OrderStatus[] = [
  "PENDING",
  "PAID",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

const paymentStatuses: PaymentStatus[] = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
];

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

async function updateOrder(orderId: string, formData: FormData) {
  "use server";

  const status = String(formData.get("status") ?? "PENDING") as OrderStatus;
  const paymentStatus = String(
    formData.get("paymentStatus") ?? "PENDING"
  ) as PaymentStatus;

  const tilopayReference = String(
    formData.get("tilopayReference") ?? ""
  ).trim();

  const tilopayTransactionId = String(
    formData.get("tilopayTransactionId") ?? ""
  ).trim();

  await db.order.update({
    where: {
      id: orderId,
    },
    data: {
      status,
      paymentStatus,
      tilopayReference: tilopayReference || null,
      tilopayTransactionId: tilopayTransactionId || null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);

  redirect("/admin/orders");
}

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: {
      id,
    },
    include: {
      items: true,
    },
  });

  if (!order) {
    notFound();
  }

  const updateOrderWithId = updateOrder.bind(null, order.id);

  return (
    <main className="bg-black px-5 py-16 text-white md:py-24">
      <section className="mx-auto max-w-6xl">
        <div className="mb-12">
          <Link
            href="/admin/orders"
            className="inline-flex border border-white/10 bg-black px-5 py-4 text-xs font-black uppercase tracking-[0.25em] text-neutral-400 transition hover:bg-white/10 hover:text-white"
          >
            ← Back to orders
          </Link>

          <p className="mt-10 mb-5 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
            Admin · Order detail
          </p>

          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="text-6xl font-black uppercase leading-[0.85] tracking-tight md:text-9xl">
                {order.orderNumber}
              </h1>

              <p className="mt-8 max-w-2xl text-sm uppercase leading-7 tracking-[0.16em] text-neutral-500">
                Pedido creado desde checkout. Puedes actualizar el estado de la
                orden y pago manualmente mientras conectamos el endpoint oficial
                de TiloPay.
              </p>
            </div>

            <div className="border border-white/10 bg-white/[0.03] p-5 lg:min-w-72">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
                Total
              </p>

              <p className="mt-4 text-4xl font-black">
                {formatMoney(order.total)}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
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
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <section className="border border-white/10 bg-white/[0.03] p-5 md:p-6">
              <p className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
                Customer
              </p>

              <div className="grid gap-5 md:grid-cols-2">
                <InfoCard label="Name" value={order.customerName} />
                <InfoCard label="Email" value={order.customerEmail} />
                <InfoCard
                  label="Phone"
                  value={order.customerPhone ?? "Not provided"}
                />
                <InfoCard
                  label="Created"
                  value={order.createdAt.toLocaleString()}
                />
              </div>
            </section>

            <section className="border border-white/10 bg-white/[0.03] p-5 md:p-6">
              <p className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
                Delivery address
              </p>

              <p className="text-sm uppercase leading-7 tracking-[0.16em] text-neutral-400">
                {order.shippingAddress}
              </p>
            </section>

            <section className="border border-white/10 bg-white/[0.03] p-5 md:p-6">
              <p className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
                Items
              </p>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-4 border border-white/10 bg-black p-4 md:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <p className="font-black uppercase">
                        {item.productNameSnapshot}
                      </p>

                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-neutral-500">
                        {item.quantity} ×{" "}
                        {item.variantSnapshot ?? "No variant"}
                      </p>

                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-neutral-700">
                        Unit price: {formatMoney(item.unitPrice)}
                      </p>
                    </div>

                    <p className="font-black">{formatMoney(item.lineTotal)}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              <InfoCard label="Subtotal" value={formatMoney(order.subtotal)} />
              <InfoCard
                label="Shipping"
                value={
                  order.shippingTotal === 0
                    ? "Free"
                    : formatMoney(order.shippingTotal)
                }
              />
              <InfoCard label="Total" value={formatMoney(order.total)} />
            </section>
          </div>

          <aside className="h-fit border border-white/10 bg-white/[0.04] p-5 lg:sticky lg:top-40">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
              Manage order
            </p>

            <h2 className="text-4xl font-black uppercase leading-none">
              Update
              <span className="block text-neutral-700">Status</span>
            </h2>

            <form action={updateOrderWithId} className="mt-8 space-y-5">
              <div>
                <label className="mb-3 block text-xs font-black uppercase tracking-[0.25em] text-neutral-600">
                  Order status
                </label>

                <select
                  name="status"
                  defaultValue={order.status}
                  className="admin-input"
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-3 block text-xs font-black uppercase tracking-[0.25em] text-neutral-600">
                  Payment status
                </label>

                <select
                  name="paymentStatus"
                  defaultValue={order.paymentStatus}
                  className="admin-input"
                >
                  {paymentStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-3 block text-xs font-black uppercase tracking-[0.25em] text-neutral-600">
                  TiloPay reference
                </label>

                <input
                  name="tilopayReference"
                  defaultValue={order.tilopayReference ?? ""}
                  placeholder="Pending"
                  className="admin-input"
                />
              </div>

              <div>
                <label className="mb-3 block text-xs font-black uppercase tracking-[0.25em] text-neutral-600">
                  TiloPay transaction ID
                </label>

                <input
                  name="tilopayTransactionId"
                  defaultValue={order.tilopayTransactionId ?? ""}
                  placeholder="Pending"
                  className="admin-input"
                />
              </div>

              <button
                type="submit"
                className="w-full border border-white/20 !bg-black px-8 py-6 text-sm font-black uppercase tracking-[0.25em] !text-white transition hover:!bg-white/10 hover:!text-white"
              >
                Save order
              </button>
            </form>

            <div className="mt-6 border border-white/10 bg-black p-5">
              <p className="text-xs font-black uppercase leading-6 tracking-[0.22em] text-neutral-600">
                Cuando conectemos TiloPay real, el payment status debe cambiar
                automáticamente desde webhook/callback.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-black p-5">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-neutral-700">
        {label}
      </p>

      <p className="mt-3 text-sm font-black uppercase leading-6 tracking-[0.14em] text-neutral-300">
        {value}
      </p>
    </div>
  );
}