import { notFound } from "next/navigation";
import { ProductDetailClient } from "@/components/product-detail-client";
import { getStorefrontProductBySlug } from "@/lib/storefront-data";

export const dynamic = "force-dynamic";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const data = await getStorefrontProductBySlug(slug);

  if (!data) {
    notFound();
  }

  return (
    <ProductDetailClient
      product={data.product}
      relatedProducts={data.relatedProducts}
    />
  );
}