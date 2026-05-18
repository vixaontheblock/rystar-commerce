import type { Product } from "@/types/product";

export const products: Product[] = [
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
  {
    id: "prod-rystar-long-sleeve-white",
    name: "Rystar Long Sleeve",
    slug: "rystar-long-sleeve-white",
    brand: "Rystar Clothing",
    category: "Long Sleeves",
    description:
      "Long sleeve blanco con corte relajado, ideal para layering y outfits limpios.",
    price: 4200,
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200&auto=format&fit=crop",
    ],
    tags: ["Clean fit", "Layering"],
    variants: [
      { id: "var-longsleeve-white-s", size: "S", color: "White", stock: 4 },
      { id: "var-longsleeve-white-m", size: "M", color: "White", stock: 6 },
      { id: "var-longsleeve-white-l", size: "L", color: "White", stock: 5 },
      { id: "var-longsleeve-white-xl", size: "XL", color: "White", stock: 2 },
    ],
  },
  {
    id: "prod-rystar-shorts-black",
    name: "Rystar Utility Shorts",
    slug: "rystar-utility-shorts-black",
    brand: "Rystar Clothing",
    category: "Shorts",
    description:
      "Short negro utilitario con look urbano, cómodo para diario y fácil de combinar.",
    price: 4600,
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=1200&auto=format&fit=crop",
    ],
    tags: ["Utility", "Streetwear"],
    variants: [
      { id: "var-shorts-black-s", size: "S", color: "Black", stock: 4 },
      { id: "var-shorts-black-m", size: "M", color: "Black", stock: 5 },
      { id: "var-shorts-black-l", size: "L", color: "Black", stock: 3 },
      { id: "var-shorts-black-xl", size: "XL", color: "Black", stock: 1 },
    ],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}