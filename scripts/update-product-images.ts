import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const productImages = [
  {
    slug: "rystar-acid-star-tee",
    images: [
      "/products/rystar-acid-star-tee-front.webp",
      "/products/rystar-acid-star-tee-back.webp",
    ],
  },
  {
    slug: "rystar-trust-the-process",
    images: [
      "/products/rystar-trust-the-process-tee-front.png",
      "/products/rystar-trust-the-process-tee-back.png",
    ],
  },
  {
    slug: "rystar-tristar-essense",
    images: [
      "/products/rystar-tristar-essense-tee-front.png",
      "/products/rystar-tristar-essense-tee-back.png",
    ],
  },
];

async function main() {
  for (const productData of productImages) {
    const product = await prisma.product.findUnique({
      where: {
        slug: productData.slug,
      },
    });

    if (!product) {
      console.log(`Product not found: ${productData.slug}`);
      continue;
    }

    await prisma.productImage.deleteMany({
      where: {
        productId: product.id,
      },
    });

    await prisma.productImage.createMany({
      data: productData.images.map((url, index) => ({
        productId: product.id,
        url,
        alt: `${product.name} image ${index + 1}`,
        position: index + 1,
      })),
    });

    console.log(`Updated images for: ${product.name}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });