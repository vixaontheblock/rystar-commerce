"use client";

import { useMemo, useState } from "react";
import { products } from "@/data/products";
import { demoOrders, type DemoOrderStatus } from "@/data/demo-orders";
import { formatMoney } from "@/lib/money";

const orderStatuses: DemoOrderStatus[] = [
  "pending",
  "paid",
  "preparing",
  "shipped",
  "delivered",
  "cancelled",
];

function getStatusLabel(status: DemoOrderStatus) {
  const labels: Record<DemoOrderStatus, string> = {
    pending: "Pending",
    paid: "Paid",
    preparing: "Preparing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };

  return labels[status];
}

function getStatusClass(status: DemoOrderStatus) {
  const classes: Record<DemoOrderStatus, string> = {
    pending: "border-yellow-400/30 bg-yellow-400/10 text-yellow-200",
    paid: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    preparing: "border-blue-400/30 bg-blue-400/10 text-blue-200",
    shipped: "border-purple-400/30 bg-purple-400/10 text-purple-200",
    delivered: "border-white/20 bg-white/10 text-white",
    cancelled: "border-red-400/30 bg-red-400/10 text-red-200",
  };

  return classes[status];
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");
  const [orders, setOrders] = useState(demoOrders);

  const totalRevenue = useMemo(() => {
    return orders
      .filter((order) => order.status !== "cancelled")
      .reduce((total, order) => total + order.total, 0);
  }, [orders]);

  const totalStock = useMemo(() => {
    return products.reduce((total, product) => {
      const productStock = product.variants.reduce(
        (variantTotal, variant) => variantTotal + variant.stock,
        0
      );

      return total + productStock;
    }, 0);
  }, []);

  function updateOrderStatus(orderId: string, status: DemoOrderStatus) {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <div className="mb-10">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-500">
          Admin
        </p>

        <h1 className="text-5xl font-black uppercase tracking-tight md:text-7xl">
          Store dashboard
        </h1>

        <p className="mt-5 max-w-2xl text-neutral-400">
          Panel demo para visualizar pedidos, stock y productos. Luego esto se
          conecta a la base de datos real.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
            Revenue
          </p>
          <p className="mt-4 text-4xl font-black">
            {formatMoney(totalRevenue)}
          </p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
            Orders
          </p>
          <p className="mt-4 text-4xl font-black">{orders.length}</p>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
            Stock
          </p>
          <p className="mt-4 text-4xl font-black">{totalStock}</p>
        </div>
      </div>

      <div className="mt-10 flex gap-3 rounded-full border border-white/10 bg-white/[0.03] p-2">
        <button
          type="button"
          onClick={() => setActiveTab("orders")}
          className={[
            "flex-1 rounded-full px-5 py-3 text-sm font-black uppercase tracking-wide transition",
            activeTab === "orders"
              ? "bg-white text-black"
              : "text-neutral-400 hover:text-white",
          ].join(" ")}
        >
          Orders
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("products")}
          className={[
            "flex-1 rounded-full px-5 py-3 text-sm font-black uppercase tracking-wide transition",
            activeTab === "products"
              ? "bg-white text-black"
              : "text-neutral-400 hover:text-white",
          ].join(" ")}
        >
          Products
        </button>
      </div>

      {activeTab === "orders" && (
        <div className="mt-8 space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6"
            >
              <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-black">{order.id}</h2>

                    <span
                      className={[
                        "rounded-full border px-3 py-1 text-xs font-bold uppercase",
                        getStatusClass(order.status),
                      ].join(" ")}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>

                  <p className="mt-3 text-neutral-400">
                    {order.customerName} · {order.customerEmail} ·{" "}
                    {order.customerPhone}
                  </p>

                  <p className="mt-1 text-sm text-neutral-600">
                    Created: {order.createdAt}
                  </p>
                </div>

                <div className="lg:text-right">
                  <p className="text-sm uppercase tracking-[0.25em] text-neutral-500">
                    Total
                  </p>
                  <p className="mt-2 text-2xl font-black">
                    {formatMoney(order.total)}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black p-4">
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-neutral-500">
                  Items
                </p>

                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={`${order.id}-${item.name}-${item.variant}`}
                      className="flex justify-between gap-4 text-sm"
                    >
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-neutral-500">
                          {item.quantity} × {item.variant}
                        </p>
                      </div>

                      <p>{formatMoney(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.25em] text-neutral-500">
                  Update status
                </label>

                <select
                  value={order.status}
                  onChange={(event) =>
                    updateOrderStatus(
                      order.id,
                      event.target.value as DemoOrderStatus
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-black px-5 py-4 text-white outline-none transition focus:border-white md:max-w-xs"
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>
            </article>
          ))}
        </div>
      )}

      {activeTab === "products" && (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const productStock = product.variants.reduce(
              (total, variant) => total + variant.stock,
              0
            );

            return (
              <article
                key={product.id}
                className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="aspect-[4/3] w-full object-cover"
                />

                <div className="p-5">
                  <p className="mb-2 text-xs uppercase tracking-[0.25em] text-neutral-500">
                    {product.category}
                  </p>

                  <h2 className="text-xl font-black">{product.name}</h2>

                  <div className="mt-4 flex items-center justify-between gap-4">
                    <p className="font-bold">{formatMoney(product.price)}</p>

                    <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-bold text-neutral-300">
                      Stock {productStock}
                    </span>
                  </div>

                  <div className="mt-5 space-y-2">
                    {product.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="flex justify-between rounded-xl bg-black px-4 py-3 text-sm"
                      >
                        <span>
                          {variant.size}
                          {variant.color ? ` / ${variant.color}` : ""}
                        </span>
                        <span className="text-neutral-400">
                          {variant.stock} units
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}