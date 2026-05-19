import { ProductStatus } from "@prisma/client";
import { db } from "@/lib/db";
import type { Product } from "@/types/product";

type StorefrontDbProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  tags: string[];
  collectionId?: string | null;
  collection: {
    id: string;
    title: string;
    slug: string;
    season: string;
    year: number;
  } | null;
  images: {
    url: string;
  }[];
  variants: {
    id: string;
    size: string;
    color: string | null;
    stock: number;
    priceOverride: number | null;
  }[];
};

const visibleProductStatus: ProductStatus[] = [
  ProductStatus.ACTIVE,
  ProductStatus.SOLD_OUT,
];

function mapDbProductToProduct(product: StorefrontDbProduct): Product {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: "Rystar Studios",
    category: product.collection
      ? `${product.collection.title} · ${product.collection.season}`
      : "Rystar Studios",
    description: product.description ?? "",
    price: product.price,
    images:
      product.images.length > 0
        ? product.images.map((image) => image.url)
        : ["/logo/rystar-logo.gif"],
    tags: product.tags,
    variants: product.variants.map((variant) => ({
      id: variant.id,
      size: variant.size,
      color: variant.color ?? undefined,
      stock: variant.stock,
      priceOverride: variant.priceOverride ?? undefined,
    })),
  };
}

export async function getStorefrontProducts() {
  const products = await db.product.findMany({
    where: {
      status: {
        in: visibleProductStatus,
      },
    },
    orderBy: {
      createdAt: "desc",
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
  });

  return products.map(mapDbProductToProduct);
}

export async function getStorefrontCollections() {
  const collections = await db.collection.findMany({
    where: {
      isActive: true,
    },
    orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    include: {
      products: {
        where: {
          status: {
            in: visibleProductStatus,
          },
        },
        orderBy: {
          createdAt: "desc",
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
      },
    },
  });

  return collections.map((collection) => ({
    id: collection.id,
    title: collection.title,
    slug: collection.slug,
    season: collection.season,
    year: collection.year,
    description: collection.description,
    products: collection.products.map(mapDbProductToProduct),
  }));
}

export async function getStorefrontProductBySlug(slug: string) {
  const product = await db.product.findFirst({
    where: {
      slug,
      status: {
        in: visibleProductStatus,
      },
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
  });

  if (!product) {
    return null;
  }

  const relatedWhere = product.collectionId
    ? {
        id: {
          not: product.id,
        },
        collectionId: product.collectionId,
        status: {
          in: visibleProductStatus,
        },
      }
    : {
        id: {
          not: product.id,
        },
        status: {
          in: visibleProductStatus,
        },
      };

  const relatedProducts = await db.product.findMany({
    where: relatedWhere,
    take: 2,
    orderBy: {
      createdAt: "desc",
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
  });

  return {
    product: mapDbProductToProduct(product),
    relatedProducts: relatedProducts.map(mapDbProductToProduct),
  };
}