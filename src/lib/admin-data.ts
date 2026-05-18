import { db } from "@/lib/db";

export type AdminProductImage = {
  id: string;
  url: string;
  alt: string | null;
  position: number;
};

export type AdminProductVariant = {
  id: string;
  size: string;
  color: string | null;
  stock: number;
  priceOverride: number | null;
};

export type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  status: string;
  collection: {
    id: string;
    title: string;
    slug: string;
    season: string;
    year: number;
  } | null;
  images: AdminProductImage[];
  variants: AdminProductVariant[];
};

export type AdminCollection = {
  id: string;
  title: string;
  slug: string;
  season: string;
  year: number;
  description: string | null;
  isActive: boolean;
  position: number;
  products: {
    id: string;
    name: string;
    slug: string;
  }[];
};

export type AdminOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  status: string;
  paymentStatus: string;
  subtotal: number;
  shippingTotal: number;
  total: number;
  createdAt: Date;
  items: {
    id: string;
    productNameSnapshot: string;
    variantSnapshot: string | null;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
};

export type AdminCustomRequest = {
  id: string;
  customerName: string | null;
  customerContact: string;
  customerEmail: string | null;
  garmentType: string;
  color: string | null;
  size: string | null;
  printType: string | null;
  description: string;
  referenceImageUrl: string | null;
  status: string;
  createdAt: Date;
};

export type AdminDashboardData = {
  stats: {
    collections: number;
    products: number;
    variants: number;
    images: number;
    orders: number;
    customRequests: number;
    totalStock: number;
    totalRevenue: number;
  };
  collections: AdminCollection[];
  products: AdminProduct[];
  orders: AdminOrder[];
  customRequests: AdminCustomRequest[];
};

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [collections, products, orders, customRequests] = await Promise.all([
    db.collection.findMany({
      orderBy: [{ position: "asc" }, { createdAt: "desc" }],
      include: {
        products: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
          orderBy: { createdAt: "desc" },
        },
      },
    }),

    db.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        collection: {
          select: {
            id: true,
            title: true,
            slug: true,
            season: true,
            year: true,
          },
        },
        images: {
          select: {
            id: true,
            url: true,
            alt: true,
            position: true,
          },
          orderBy: { position: "asc" },
        },
        variants: {
          select: {
            id: true,
            size: true,
            color: true,
            stock: true,
            priceOverride: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    }),

    db.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          select: {
            id: true,
            productNameSnapshot: true,
            variantSnapshot: true,
            quantity: true,
            unitPrice: true,
            lineTotal: true,
          },
        },
      },
    }),

    db.customRequest.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalStock = products.reduce((total: number, product) => {
    const productStock = product.variants.reduce(
      (variantTotal: number, variant) => variantTotal + variant.stock,
      0
    );

    return total + productStock;
  }, 0);

  const totalRevenue = orders
    .filter((order) => order.status !== "CANCELLED")
    .reduce((total: number, order) => total + order.total, 0);

  const totalVariants = products.reduce(
    (total: number, product) => total + product.variants.length,
    0
  );

  const totalImages = products.reduce(
    (total: number, product) => total + product.images.length,
    0
  );

  return {
    stats: {
      collections: collections.length,
      products: products.length,
      variants: totalVariants,
      images: totalImages,
      orders: orders.length,
      customRequests: customRequests.length,
      totalStock,
      totalRevenue,
    },
    collections,
    products,
    orders,
    customRequests,
  };
}