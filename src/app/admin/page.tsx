import Link from "next/link";
import type { ReactNode } from "react";
import {
  getAdminDashboardData,
  type AdminCollection,
  type AdminProduct,
} from "@/lib/admin-data";
import { formatMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const data = await getAdminDashboardData();

  return (
    <main className="bg-black px-5 py-16 text-white md:py-24">
      <section className="mx-auto max-w-7xl">
        <div className="mb-12 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="mb-5 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
              Admin
            </p>

            <h1 className="text-6xl font-black uppercase leading-[0.85] tracking-tight md:text-9xl">
              Rystar
              <span className="block text-neutral-700">Dashboard</span>
            </h1>

            <p className="mt-8 max-w-2xl text-sm uppercase leading-7 tracking-[0.16em] text-neutral-500">
              Panel conectado a la base de datos. Aquí se van a gestionar
              productos, colecciones, inventario, pedidos y custom requests.
            </p>
          </div>

          <div className="border border-white/10 bg-white/[0.03] p-5">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
              Data source
            </p>

            <p className="mt-4 text-2xl font-black uppercase">
              Neon PostgreSQL
            </p>

            <p className="mt-3 text-xs font-black uppercase tracking-[0.2em] text-neutral-600">
              Prisma connected
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Collections"
            value={String(data.stats.collections)}
            note="Drops creados en la base de datos."
          />

          <StatCard
            label="Products"
            value={String(data.stats.products)}
            note={`${data.stats.variants} variants · ${data.stats.images} images`}
          />

          <StatCard
            label="Stock"
            value={String(data.stats.totalStock)}
            note="Unidades disponibles por talla."
          />

          <StatCard
            label="Revenue"
            value={formatMoney(data.stats.totalRevenue)}
            note={`${data.stats.orders} orders registrados.`}
          />
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="border border-white/10 bg-white/[0.03] p-5 md:p-6">
            <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
                  Products
                </p>

                <h2 className="mt-3 text-4xl font-black uppercase leading-none">
                  Product
                  <span className="block text-neutral-700">Inventory</span>
                </h2>
              </div>

              <Link
                href="/admin/products/new"
                className="border border-white/20 bg-black px-6 py-4 text-center text-xs font-black uppercase tracking-[0.25em] text-white transition hover:bg-white/10"
              >
                Add product
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {data.products.map((product: AdminProduct) => {
                const productStock = product.variants.reduce(
                  (
                    total: number,
                    variant: AdminProduct["variants"][number]
                  ) => total + variant.stock,
                  0
                );

                const firstImage = product.images[0]?.url;

                return (
                  <article
                    key={product.id}
                    className="overflow-hidden border border-white/10 bg-black"
                  >
                    <div className="bg-white">
                      {firstImage ? (
                        <img
                          src={firstImage}
                          alt={product.name}
                          className="aspect-square w-full object-contain"
                        />
                      ) : (
                        <div className="flex aspect-square items-center justify-center text-xs font-black uppercase tracking-[0.25em] text-black">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="mb-4 flex flex-wrap gap-2">
                        <AdminBadge>{product.status}</AdminBadge>

                        {product.collection ? (
                          <AdminBadge>{product.collection.season}</AdminBadge>
                        ) : (
                          <AdminBadge>No collection</AdminBadge>
                        )}
                      </div>

                      <h3 className="text-2xl font-black uppercase leading-none">
                        {product.name}
                      </h3>

                      <p className="mt-4 text-xs font-black uppercase tracking-[0.22em] text-neutral-600">
                        {product.slug}
                      </p>

                      <div className="mt-5 flex items-center justify-between gap-4">
                        <p className="font-black">
                          {formatMoney(product.price)}
                        </p>

                        <span className="border border-white/10 px-3 py-1 text-xs font-black uppercase text-neutral-400">
                          Stock {productStock}
                        </span>
                      </div>

                      <div className="mt-5 space-y-2">
                        {product.variants.map(
                          (variant: AdminProduct["variants"][number]) => (
                            <div
                              key={variant.id}
                              className="grid grid-cols-[1fr_auto] gap-4 border border-white/10 bg-white/[0.03] px-4 py-3 text-xs"
                            >
                              <span className="font-black uppercase tracking-[0.16em] text-neutral-400">
                                {variant.size}
                                {variant.color ? ` / ${variant.color}` : ""}
                              </span>

                              <span className="font-black text-white">
                                {variant.stock}
                              </span>
                            </div>
                          )
                        )}
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="border border-white/10 px-4 py-3 text-center text-xs font-black uppercase tracking-[0.2em] text-neutral-400 transition hover:bg-white/10 hover:text-white"
                        >
                          Edit
                        </Link>

                        <Link
                          href={`/product/${product.slug}`}
                          className="border border-white/10 px-4 py-3 text-center text-xs font-black uppercase tracking-[0.2em] text-neutral-400 transition hover:bg-white/10 hover:text-white"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <aside className="space-y-6">
            <section className="border border-white/10 bg-white/[0.03] p-5">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
                    Collections
                  </p>

                  <h2 className="mt-3 text-3xl font-black uppercase">Drops</h2>
                </div>

                <Link
                  href="/admin/collections/new"
                  className="border border-white/20 bg-black px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-white transition hover:bg-white/10"
                >
                  Add
                </Link>
              </div>

              <div className="space-y-4">
                {data.collections.map((collection: AdminCollection) => (
                  <article
                    key={collection.id}
                    className="border border-white/10 bg-black p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-black uppercase">
                          {collection.title}
                        </h3>

                        <p className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-neutral-600">
                          {collection.season} · {collection.year}
                        </p>
                      </div>

                      <AdminBadge>
                        {collection.products.length} items
                      </AdminBadge>
                    </div>

                    <Link
                      href={`/admin/collections/${collection.id}`}
                      className="mt-4 block border border-white/10 px-4 py-3 text-center text-xs font-black uppercase tracking-[0.2em] text-neutral-400 transition hover:bg-white/10 hover:text-white"
                    >
                      Edit collection
                    </Link>
                  </article>
                ))}
              </div>
            </section>

            <section className="border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
                Next actions
              </p>

              <div className="mt-5 space-y-3">
                {[
                  "Crear formulario Add Product",
                  "Crear formulario Add Collection",
                  "Editar stock por talla",
                  "Crear pedidos desde checkout",
                  "Conectar TiloPay",
                  "Proteger /admin con login",
                ].map((item: string, index: number) => (
                  <div
                    key={item}
                    className="flex gap-4 border border-white/10 bg-black p-4"
                  >
                    <span className="text-xs font-black text-neutral-700">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <p className="text-xs font-black uppercase leading-5 tracking-[0.18em] text-neutral-500">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
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

function AdminBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex border border-white/10 bg-black px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-neutral-500">
      {children}
    </span>
  );
}