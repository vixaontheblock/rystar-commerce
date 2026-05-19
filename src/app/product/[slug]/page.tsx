import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/product-detail-client";
import { getStorefrontProductBySlug } from "@/lib/storefront-data";
import {
  absoluteUrl,
  getProductJsonLd,
  getProductSeoDescription,
  siteName,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getStorefrontProductBySlug(slug);

  if (!data) {
    return {
      title: "Product not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { product } = data;
  const description = getProductSeoDescription(product);
  const productUrl = absoluteUrl(`/product/${product.slug}`);
  const imageUrl = product.images[0]
    ? absoluteUrl(product.images[0])
    : absoluteUrl("/icon.png");

  return {
    title: product.name,
    description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.name} · ${siteName}`,
      description,
      url: productUrl,
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 1200,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} · ${siteName}`,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const data = await getStorefrontProductBySlug(slug);

  if (!data) {
    notFound();
  }

  const productJsonLd = getProductJsonLd(data.product);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />

      <ProductDetailClient
        product={data.product}
        relatedProducts={data.relatedProducts}
      />
    </>
  );
}