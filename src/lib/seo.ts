import type { Product } from "@/types/product";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rystarstudios.com";

export const siteName = "Rystar Studios";

export const defaultSeoDescription =
  "Rystar Studios — limited drops, custom pieces and streetwear from Panama. No restock. Limited pieces.";

export function absoluteUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getProductAvailability(product: Product) {
  const hasStock = product.variants.some((variant) => variant.stock > 0);

  return hasStock
    ? "https://schema.org/InStock"
    : "https://schema.org/OutOfStock";
}

export function getProductSeoDescription(product: Product) {
  const baseDescription =
    product.description ||
    `${product.name} by Rystar Studios. Limited pieces, no restock.`;

  return baseDescription.length > 155
    ? `${baseDescription.slice(0, 152)}...`
    : baseDescription;
}

export function getProductJsonLd(product: Product) {
  const firstImage = product.images[0]
    ? absoluteUrl(product.images[0])
    : absoluteUrl("/icon.png");

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((image) => absoluteUrl(image)),
    description: getProductSeoDescription(product),
    brand: {
      "@type": "Brand",
      name: product.brand || "Rystar Studios",
    },
    sku: product.slug,
    category: product.category,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${product.slug}`),
      priceCurrency: "USD",
      price: (product.price / 100).toFixed(2),
      availability: getProductAvailability(product),
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "Rystar Studios",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/product/${product.slug}`),
    },
    thumbnailUrl: firstImage,
  };
}

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Rystar Studios",
    url: siteUrl,
    logo: absoluteUrl("/icon.png"),
    sameAs: ["https://www.instagram.com/rystarstudios"],
  };
}