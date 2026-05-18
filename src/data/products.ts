import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "prod-rystar-acid-star-tee",
    name: "RYSTAR ACID STAR TEE",
    slug: "rystar-acid-star-tee",
    brand: "Rystar Studios",
    category: "Drop 002 - Acid Star",
    description:
      "T-shirt Acid Wash de 220 gsm. Pieza limitada de Rystar Studios para SS26 · Drop 001. Limited pieces. No restock.",
    price: 3000,
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
    ],
    tags: ["SS26", "Drop 001", "Acid Star", "No restock"],
    variants: [
      { id: "var-acid-star-s", size: "S", color: "Acid Wash", stock: 4 },
      { id: "var-acid-star-m", size: "M", color: "Acid Wash", stock: 6 },
      { id: "var-acid-star-l", size: "L", color: "Acid Wash", stock: 5 },
      { id: "var-acid-star-xl", size: "XL", color: "Acid Wash", stock: 2 },
    ],
  },
  {
    id: "prod-rystar-trust-the-process",
    name: "RYSTAR TRUST THE PROCESS",
    slug: "rystar-trust-the-process",
    brand: "Rystar Studios",
    category: "Drop 001 - Trust The Process",
    description:
      "Pieza limitada del drop Trust The Process. Hecha para quienes estuvieron desde el inicio. Sin restock.",
    price: 4500,
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200&auto=format&fit=crop",
    ],
    tags: ["SS25", "Drop 001", "Trust The Process", "No restock"],
    variants: [
      { id: "var-trust-s", size: "S", color: "Black", stock: 3 },
      { id: "var-trust-m", size: "M", color: "Black", stock: 5 },
      { id: "var-trust-l", size: "L", color: "Black", stock: 4 },
      { id: "var-trust-xl", size: "XL", color: "Black", stock: 1 },
    ],
  },
  {
    id: "prod-rystar-tristar-essense",
    name: "RYSTAR TRISTAR ESSENSE",
    slug: "rystar-tristar-essense",
    brand: "Rystar Studios",
    category: "Drop 001 - Trust The Process",
    description:
      "Pieza de edición limitada de Rystar Studios. Construida como una prenda unisex para uso diario.",
    price: 4500,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1200&auto=format&fit=crop",
    ],
    tags: ["SS25", "Drop 001", "Tristar", "Limited pieces"],
    variants: [
      { id: "var-tristar-s", size: "S", color: "Black", stock: 2 },
      { id: "var-tristar-m", size: "M", color: "Black", stock: 4 },
      { id: "var-tristar-l", size: "L", color: "Black", stock: 3 },
      { id: "var-tristar-xl", size: "XL", color: "Black", stock: 1 },
    ],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}