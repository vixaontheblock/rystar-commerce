import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "prod-rystar-tee-black",
    name: "Rystar Signature Tee",
    slug: "rystar-signature-tee-black",
    brand: "Rystar Clothing",
    category: "T-Shirts",
    description:
      "Camiseta premium de algodón con fit urbano, pensada para uso diario y outfits streetwear.",
    price: 3500,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
    ],
    tags: ["New drop", "Premium cotton"],
    variants: [
      { id: "var-tee-black-s", size: "S", color: "Black", stock: 6 },
      { id: "var-tee-black-m", size: "M", color: "Black", stock: 10 },
      { id: "var-tee-black-l", size: "L", color: "Black", stock: 8 },
      { id: "var-tee-black-xl", size: "XL", color: "Black", stock: 4 },
    ],
  },
  {
    id: "prod-rystar-hoodie-gray",
    name: "Rystar Core Hoodie",
    slug: "rystar-core-hoodie-gray",
    brand: "Rystar Clothing",
    category: "Hoodies",
    description:
      "Hoodie pesado con silueta relajada, acabado minimalista y presencia premium.",
    price: 6800,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop",
    ],
    tags: ["Heavyweight", "Essential"],
    variants: [
      { id: "var-hoodie-gray-s", size: "S", color: "Gray", stock: 3 },
      { id: "var-hoodie-gray-m", size: "M", color: "Gray", stock: 7 },
      { id: "var-hoodie-gray-l", size: "L", color: "Gray", stock: 5 },
      { id: "var-hoodie-gray-xl", size: "XL", color: "Gray", stock: 2 },
    ],
  },
  {
    id: "prod-rystar-cap-black",
    name: "Rystar Logo Cap",
    slug: "rystar-logo-cap-black",
    brand: "Rystar Clothing",
    category: "Accessories",
    description:
      "Gorra negra con logo frontal, estructura cómoda y ajuste clásico.",
    price: 2800,
    images: [
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=1200&auto=format&fit=crop",
    ],
    tags: ["Accessory", "Logo piece"],
    variants: [
      { id: "var-cap-black-os", size: "One Size", color: "Black", stock: 12 },
    ],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}