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

type AdminTab = "overview" | "orders" | "products" | "setup";

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

function StatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="border border-white/10 bg-white/[0.03] p-6">
      <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
        {label}
      </p>

      <p className="mt-5 text-4xl font-black uppercase leading-none md:text-5xl">
        {value}
      </p>

      <p className="mt-4 text-xs font-black uppercase leading-5 tracking-[0.18em] text-neutral-600">
        {note}
      </p>
    </div>
  );
}

function AdminBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex border border-white/10 bg-black px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-neutral-500">
      {children}
    </span>
  );
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [orders, setOrders] = useState(demoOrders);
  const [orderQuery, setOrderQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | DemoOrderStatus>(
    "all"
  );

  const totalRevenue = useMemo(() => {
    return orders
      .filter((order) => order.status !== "cancelled")
      .reduce((total, order) => total + order.total, 0);
  }, [orders]);

  const paidOrders = useMemo(() => {
    return orders.filter((order) => order.status === "paid").length;
  }, [orders]);

  const pendingOrders = useMemo(() => {
    return orders.filter((order) => order.status === "pending").length;
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

  const totalProducts = products.length;

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const normalizedQuery = orderQuery.toLowerCase();

      const matchesQuery =
        order.id.toLowerCase().includes(normalizedQuery) ||
        order.customerName.toLowerCase().includes(normalizedQuery) ||
        order.customerEmail.toLowerCase().includes(normalizedQuery) ||
        order.customerPhone.toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [orders, orderQuery, statusFilter]);

  function updateOrderStatus(orderId: string, status: DemoOrderStatus) {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 text-white md:py-24">
      <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="mb-5 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
            Admin
          </p>

          <h1 className="text-6xl font-black uppercase leading-[0.85] tracking-tight md:text-9xl">
            Store
            <span className="block text-neutral-700">Dashboard</span>
          </h1>

          <p className="mt-8 max-w-2xl text-sm uppercase leading-7 tracking-[0.16em] text-neutral-500">
            Panel demo estructurado para conectar pronto base de datos, pagos,
            inventario y autenticación de administrador.
          </p>
        </div>

        <div className="border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
            Data source
          </p>

          <p className="mt-4 text-2xl font-black uppercase">Local demo</p>

          <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-neutral-600">
            DB connection pending
          </p>
        </div>
      </div>

      <div className="mb-10 grid gap-3 border border-white/10 bg-white/[0.03] p-2 md:grid-cols-4">
        {[
          { id: "overview", label: "Overview" },
          { id: "orders", label: "Orders" },
          { id: "products", label: "Products" },
          { id: "setup", label: "DB Setup" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as AdminTab)}
            className={[
              "px-5 py-4 text-xs font-black uppercase tracking-[0.25em] transition",
              activeTab === tab.id
                ? "bg-white text-black"
                : "text-neutral-500 hover:bg-white/10 hover:text-white",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-10">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Revenue"
              value={formatMoney(totalRevenue)}
              note="Orders excluding cancelled."
            />

            <StatCard
              label="Orders"
              value={String(orders.length)}
              note={`${paidOrders} paid · ${pendingOrders} pending`}
            />

            <StatCard
              label="Products"
              value={String(totalProducts)}
              note="Products currently loaded locally."
            />

            <StatCard
              label="Stock"
              value={String(totalStock)}
              note="Total units from variants."
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
                    Latest orders
                  </p>

                  <h2 className="mt-3 text-3xl font-black uppercase">
                    Order activity
                  </h2>
                </div>

                <AdminBadge>Demo data</AdminBadge>
              </div>

              <div className="space-y-4">
                {orders.slice(0, 4).map((order) => (
                  <div
                    key={order.id}
                    className="grid gap-4 border border-white/10 bg-black p-4 md:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <p className="font-black uppercase">{order.id}</p>
                      <p className="mt-2 text-sm text-neutral-500">
                        {order.customerName} · {order.customerEmail}
                      </p>
                    </div>

                    <div className="md:text-right">
                      <p className="font-black">{formatMoney(order.total)}</p>

                      <span
                        className={[
                          "mt-2 inline-flex border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]",
                          getStatusClass(order.status),
                        ].join(" ")}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
                Connection plan
              </p>

              <h2 className="mt-4 text-3xl font-black uppercase leading-none">
                Ready for
                <span className="block text-neutral-700">Database</span>
              </h2>

              <div className="mt-8 space-y-4">
                {[
                  "Create PostgreSQL database",
                  "Install Prisma ORM",
                  "Move products to Product table",
                  "Move variants to ProductVariant table",
                  "Create Order and OrderItem tables",
                  "Connect TiloPay payment status",
                  "Protect admin with login",
                ].map((item, index) => (
                  <div
                    key={item}
                    className="flex items-center gap-4 border border-white/10 bg-black p-4"
                  >
                    <span className="text-xs font-black text-neutral-700">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-500">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div>
          <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto]">
            <input
              value={orderQuery}
              onChange={(event) => setOrderQuery(event.target.value)}
              placeholder="Search order, customer, email or phone..."
              className="h-16 border border-white/15 bg-black px-5 text-xs font-black uppercase tracking-[0.22em] text-white outline-none placeholder:text-neutral-700 focus:border-white"
            />

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as "all" | DemoOrderStatus)
              }
              className="h-16 border border-white/15 bg-black px-5 text-xs font-black uppercase tracking-[0.22em] text-white outline-none focus:border-white"
            >
              <option value="all">All statuses</option>
              {orderStatuses.map((status) => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-5">
            {filteredOrders.map((order) => (
              <article
                key={order.id}
                className="border border-white/10 bg-white/[0.03] p-5 md:p-6"
              >
                <div className="grid gap-5 lg:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-black uppercase">
                        {order.id}
                      </h2>

                      <span
                        className={[
                          "border px-3 py-1 text-xs font-black uppercase tracking-[0.18em]",
                          getStatusClass(order.status),
                        ].join(" ")}
                      >
                        {getStatusLabel(order.status)}
                      </span>

                      <AdminBadge>Order model ready</AdminBadge>
                    </div>

                    <p className="mt-4 text-sm text-neutral-400">
                      {order.customerName} · {order.customerEmail} ·{" "}
                      {order.customerPhone}
                    </p>

                    <p className="mt-2 text-xs font-black uppercase tracking-[0.22em] text-neutral-700">
                      Created: {order.createdAt}
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

                <div className="mt-6 border border-white/10 bg-black p-4">
                  <p className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
                    Items
                  </p>

                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={`${order.id}-${item.name}-${item.variant}`}
                        className="grid gap-2 text-sm md:grid-cols-[1fr_auto]"
                      >
                        <div>
                          <p className="font-black uppercase">{item.name}</p>

                          <p className="mt-1 text-neutral-500">
                            {item.quantity} × {item.variant}
                          </p>
                        </div>

                        <p className="font-black">
                          {formatMoney(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-[260px_1fr] md:items-end">
                  <div>
                    <label className="mb-3 block text-xs font-black uppercase tracking-[0.25em] text-neutral-700">
                      Fulfillment status
                    </label>

                    <select
                      value={order.status}
                      onChange={(event) =>
                        updateOrderStatus(
                          order.id,
                          event.target.value as DemoOrderStatus
                        )
                      }
                      className="h-14 w-full border border-white/15 bg-black px-4 text-xs font-black uppercase tracking-[0.16em] text-white outline-none focus:border-white"
                    >
                      {orderStatuses.map((status) => (
                        <option key={status} value={status}>
                          {getStatusLabel(status)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-xs font-black uppercase leading-6 tracking-[0.2em] text-neutral-700">
                    Later this update will save to database and trigger customer
                    notifications.
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {activeTab === "products" && (
        <div>
          <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
                Products
              </p>

              <h2 className="mt-3 text-5xl font-black uppercase leading-none">
                Product
                <span className="block text-neutral-700">Inventory</span>
              </h2>
            </div>

            <button
              type="button"
              disabled
              className="border border-white/10 px-8 py-5 text-xs font-black uppercase tracking-[0.25em] text-neutral-700"
            >
              Add product soon
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const productStock = product.variants.reduce(
                (total, variant) => total + variant.stock,
                0
              );

              return (
                <article
                  key={product.id}
                  className="overflow-hidden border border-white/10 bg-white/[0.03]"
                >
                  <div className="bg-white">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="aspect-square w-full object-contain"
                    />
                  </div>

                  <div className="p-5">
                    <div className="mb-4 flex flex-wrap gap-2">
                      <AdminBadge>{product.category}</AdminBadge>
                      <AdminBadge>{product.slug}</AdminBadge>
                    </div>

                    <h2 className="text-2xl font-black uppercase leading-none">
                      {product.name}
                    </h2>

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <p className="font-black">{formatMoney(product.price)}</p>

                      <span className="border border-white/10 px-3 py-1 text-xs font-black uppercase text-neutral-400">
                        Stock {productStock}
                      </span>
                    </div>

                    <div className="mt-5 space-y-2">
                      {product.variants.map((variant) => (
                        <div
                          key={variant.id}
                          className="grid grid-cols-[1fr_auto] gap-4 border border-white/10 bg-black px-4 py-3 text-xs"
                        >
                          <span className="font-black uppercase tracking-[0.16em] text-neutral-400">
                            {variant.size}
                            {variant.color ? ` / ${variant.color}` : ""}
                          </span>

                          <span className="font-black text-white">
                            {variant.stock}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 border-t border-white/10 pt-5">
                      <p className="text-xs font-black uppercase leading-6 tracking-[0.2em] text-neutral-700">
                        DB fields ready: id, slug, price, images, variants,
                        stock, collection, tags.
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "setup" && (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
              Next infrastructure
            </p>

            <h2 className="mt-4 text-5xl font-black uppercase leading-[0.85]">
              Connect
              <span className="block text-neutral-700">Database</span>
            </h2>

            <p className="mt-6 text-sm uppercase leading-7 tracking-[0.16em] text-neutral-500">
              Este panel ya está armado para reemplazar datos locales por datos
              reales. La próxima fase sería crear la base de datos y conectar
              productos, órdenes, clientes y pagos.
            </p>
          </div>

          <div className="border border-white/10 bg-white/[0.03] p-6">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
              Suggested database models
            </p>

            <div className="space-y-4">
              {[
                "Product",
                "ProductVariant",
                "Collection",
                "Customer",
                "Order",
                "OrderItem",
                "Payment",
                "CustomRequest",
                "AdminUser",
              ].map((model) => (
                <div
                  key={model}
                  className="flex items-center justify-between border border-white/10 bg-black p-4"
                >
                  <p className="text-sm font-black uppercase tracking-[0.2em]">
                    {model}
                  </p>

                  <AdminBadge>Prisma model</AdminBadge>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-white/10 bg-white/[0.03] p-6 lg:col-span-2">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
              Deployment checklist
            </p>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                "Create database",
                "Add env variables",
                "Create Prisma schema",
                "Run migrations",
                "Seed products",
                "Protect /admin",
                "Connect TiloPay",
                "Handle webhooks",
              ].map((item, index) => (
                <div
                  key={item}
                  className="border border-white/10 bg-black p-5"
                >
                  <p className="text-xs font-black text-neutral-700">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <p className="mt-4 text-sm font-black uppercase leading-6 tracking-[0.18em] text-neutral-400">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}