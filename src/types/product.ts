export type ProductVariant = {
  id: string;
  size: string;
  color?: string;
  sku?: string;
  stock: number;
  priceOverride?: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  images: string[];
  tags: string[];
  variants: ProductVariant[];
};