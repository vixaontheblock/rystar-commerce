import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ReactNode } from "react";
import { ProductStatus } from "@prisma/client";
import { db } from "@/lib/db";

type ProductEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parsePriceToCents(value: FormDataEntryValue | null) {
  const rawValue = String(value ?? "0").replace(",", ".");
  const numberValue = Number(rawValue);

  if (Number.isNaN(numberValue)) {
    return 0;
  }

  return Math.round(numberValue * 100);
}

function parseStock(value: FormDataEntryValue | null) {
  const numberValue = Number(value ?? 0);

  if (Number.isNaN(numberValue)) {
    return 0;
  }

  return Math.max(0, Math.floor(numberValue));
}

async function updateProduct(productId: string, formData: FormData) {
  "use server";

  const name = String(formData.get("name") ?? "").trim();
  const manualSlug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const collectionId = String(formData.get("collectionId") ?? "");
  const status = String(formData.get("status") ?? "DRAFT") as ProductStatus;
  const color = String(formData.get("color") ?? "").trim();
  const tagsRaw = String(formData.get("tags") ?? "");
  const imagesRaw = String(formData.get("images") ?? "");

  if (!name) {
    throw new Error("Product name is required.");
  }

  const slug = manualSlug ? slugify(manualSlug) : slugify(name);
  const price = parsePriceToCents(formData.get("price"));

  const tags = tagsRaw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  const imageUrls = imagesRaw
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean);

  await db.product.update({
    where: {
      id: productId,
    },
    data: {
      name,
      slug,
      description,
      price,
      status,
      tags,
      collectionId: collectionId || null,
    },
  });

  await db.productImage.deleteMany({
    where: {
      productId,
    },
  });

  if (imageUrls.length > 0) {
    await db.productImage.createMany({
      data: imageUrls.map((url, index) => ({
        productId,
        url,
        alt: `${name} image ${index + 1}`,
        position: index + 1,
      })),
    });
  }

  const sizes = ["S", "M", "L", "XL"];

  for (const size of sizes) {
    const variantId = String(formData.get(`variantId_${size}`) ?? "");
    const stock = parseStock(formData.get(`stock_${size}`));

    if (variantId) {
      await db.productVariant.update({
        where: {
          id: variantId,
        },
        data: {
          size,
          color: color || null,
          stock,
        },
      });
    } else {
      await db.productVariant.create({
        data: {
          productId,
          size,
          color: color || null,
          stock,
        },
      });
    }
  }

  revalidatePath("/admin");
  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath(`/product/${slug}`);

  redirect("/admin");
}

export default async function ProductEditPage({ params }: ProductEditPageProps) {
  const { id } = await params;

  const [product, collections] = await Promise.all([
    db.product.findUnique({
      where: {
        id,
      },
      include: {
        collection: true,
        images: {
          orderBy: {
            position: "asc",
          },
        },
        variants: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    }),

    db.collection.findMany({
      orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  if (!product) {
    notFound();
  }

  const productData = product;
  const updateProductWithId = updateProduct.bind(null, productData.id);

  const firstColor =
    productData.variants.find((variant) => variant.color)?.color ?? "";

  function getVariantBySize(size: string) {
    return productData.variants.find((variant) => variant.size === size);
  }

  return (
    <main className="bg-black px-5 py-16 text-white md:py-24">
      <section className="mx-auto max-w-5xl">
        <div className="mb-10">
          <Link
            href="/admin"
            className="inline-flex border border-white/10 bg-black px-5 py-4 text-xs font-black uppercase tracking-[0.25em] text-neutral-400 transition hover:bg-white/10 hover:text-white"
          >
            ← Back to admin
          </Link>

          <p className="mt-10 mb-5 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
            Admin · Products
          </p>

          <h1 className="text-6xl font-black uppercase leading-[0.85] tracking-tight md:text-8xl">
            Edit
            <span className="block text-neutral-700">Product</span>
          </h1>

          <p className="mt-8 max-w-2xl text-sm uppercase leading-7 tracking-[0.16em] text-neutral-500">
            Edita el producto desde la base de datos. Los cambios se guardan en
            Neon vía Prisma.
          </p>
        </div>

        <form action={updateProductWithId} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Nombre del producto">
              <input
                name="name"
                required
                defaultValue={productData.name}
                className="admin-input"
              />
            </Field>

            <Field label="Slug">
              <input
                name="slug"
                defaultValue={productData.slug}
                className="admin-input"
              />
            </Field>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Field label="Precio USD">
              <input
                name="price"
                required
                type="number"
                step="0.01"
                min="0"
                defaultValue={(productData.price / 100).toFixed(2)}
                className="admin-input"
              />
            </Field>

            <Field label="Colección">
              <select
                name="collectionId"
                defaultValue={productData.collectionId ?? ""}
                className="admin-input"
              >
                <option value="">Sin colección</option>

                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.title} · {collection.season}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Estado">
              <select
                name="status"
                defaultValue={productData.status}
                className="admin-input"
              >
                <option value="DRAFT">Draft</option>
                <option value="ACTIVE">Active</option>
                <option value="SOLD_OUT">Sold out</option>
                <option value="HIDDEN">Hidden</option>
              </select>
            </Field>
          </div>

          <Field label="Descripción">
            <textarea
              name="description"
              rows={5}
              defaultValue={productData.description ?? ""}
              className="admin-input resize-none leading-6"
            />
          </Field>

          <Field label="Tags separados por coma">
            <input
              name="tags"
              defaultValue={productData.tags.join(", ")}
              className="admin-input"
            />
          </Field>

          <Field label="Imágenes">
            <textarea
              name="images"
              rows={5}
              defaultValue={productData.images
                .map((image) => image.url)
                .join("\n")}
              className="admin-input resize-none leading-6"
            />

            <p className="mt-3 text-xs font-black uppercase leading-5 tracking-[0.18em] text-neutral-700">
              Pon una ruta por línea. Ejemplo: /products/acid-star-front.webp
            </p>
          </Field>

          <div className="border border-white/10 bg-white/[0.03] p-5">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
              Variants / Stock
            </p>

            <div className="mb-6">
              <label className="mb-3 block text-xs font-black uppercase tracking-[0.25em] text-neutral-600">
                Color general
              </label>

              <input
                name="color"
                defaultValue={firstColor}
                placeholder="Black, White, Acid Wash..."
                className="admin-input"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {["S", "M", "L", "XL"].map((size) => {
                const variant = getVariantBySize(size);

                return (
                  <div key={size}>
                    <input
                      type="hidden"
                      name={`variantId_${size}`}
                      value={variant?.id ?? ""}
                    />

                    <label className="mb-3 block text-xs font-black uppercase tracking-[0.25em] text-neutral-600">
                      Stock {size}
                    </label>

                    <input
                      name={`stock_${size}`}
                      type="number"
                      min="0"
                      defaultValue={variant?.stock ?? 0}
                      className="admin-input"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row">
            <button
              type="submit"
              className="border border-white/20 bg-white px-8 py-6 text-sm font-black uppercase tracking-[0.25em] text-black transition hover:bg-neutral-200"
            >
              Save changes
            </button>

            <Link
              href="/admin"
              className="border border-white/10 bg-black px-8 py-6 text-center text-sm font-black uppercase tracking-[0.25em] text-neutral-400 transition hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Link>

            <Link
              href={`/product/${productData.slug}`}
              className="border border-white/10 bg-black px-8 py-6 text-center text-sm font-black uppercase tracking-[0.25em] text-neutral-400 transition hover:bg-white/10 hover:text-white"
            >
              View product
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="border border-white/10 bg-white/[0.03] p-5">
      <label className="mb-3 block text-xs font-black uppercase tracking-[0.25em] text-neutral-600">
        {label}
      </label>

      {children}
    </div>
  );
}