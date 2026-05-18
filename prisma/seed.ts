import { PrismaClient, ProductStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const ss26 = await prisma.collection.upsert({
    where: { slug: "drop-001-ss26-acid-star" },
    update: {},
    create: {
      title: "Acid Star",
      slug: "drop-001-ss26-acid-star",
      season: "SS26",
      year: 2026,
      description:
        "Nuevo drop de temporada 2026. Una pieza, cantidades limitadas y sin restock.",
      position: 1,
    },
  });

  const ss25 = await prisma.collection.upsert({
    where: { slug: "drop-001-ss25-trust-the-process" },
    update: {},
    create: {
      title: "Trust The Process",
      slug: "drop-001-ss25-trust-the-process",
      season: "SS25",
      year: 2025,
      description:
        "El drop que marcó el inicio. Piezas limitadas para quienes entienden el proceso.",
      position: 2,
    },
  });

  await prisma.product.upsert({
    where: { slug: "rystar-acid-star-tee" },
    update: {},
    create: {
      collectionId: ss26.id,
      name: "RYSTAR ACID STAR TEE",
      slug: "rystar-acid-star-tee",
      description:
        "Acid wash tee de Rystar Studios para SS26 · Drop 001. Pieza limitada, sin restock y hecha para quienes estuvieron desde el inicio.",
      price: 3000,
      status: ProductStatus.SOLD_OUT,
      tags: ["SS26", "2026", "Drop 001", "Acid Star", "No restock"],
      images: {
        create: [
          {
            url: "/products/acid-star-front.webp",
            alt: "RYSTAR ACID STAR TEE front",
            position: 1,
          },
          {
            url: "/products/acid-star-back.webp",
            alt: "RYSTAR ACID STAR TEE back",
            position: 2,
          },
        ],
      },
      variants: {
        create: [
          { size: "S", color: "Acid Wash", stock: 0 },
          { size: "M", color: "Acid Wash", stock: 0 },
          { size: "L", color: "Acid Wash", stock: 0 },
          { size: "XL", color: "Acid Wash", stock: 0 },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "rystar-trust-the-process" },
    update: {},
    create: {
      collectionId: ss25.id,
      name: "RYSTAR TRUST THE PROCESS",
      slug: "rystar-trust-the-process",
      description:
        "Pieza limitada del drop Trust The Process. Hecha para quienes creen en el proceso desde el inicio.",
      price: 4500,
      status: ProductStatus.ACTIVE,
      tags: ["SS25", "2025", "Drop 001", "Trust The Process", "No restock"],
      images: {
        create: [
          {
            url: "/products/trust-the-process-front.webp",
            alt: "RYSTAR TRUST THE PROCESS front",
            position: 1,
          },
          {
            url: "/products/trust-the-process-back.webp",
            alt: "RYSTAR TRUST THE PROCESS back",
            position: 2,
          },
        ],
      },
      variants: {
        create: [
          { size: "S", color: "White", stock: 3 },
          { size: "M", color: "White", stock: 5 },
          { size: "L", color: "White", stock: 4 },
          { size: "XL", color: "White", stock: 1 },
        ],
      },
    },
  });

  await prisma.product.upsert({
    where: { slug: "rystar-tristar-essense" },
    update: {},
    create: {
      collectionId: ss25.id,
      name: "RYSTAR TRISTAR ESSENSE",
      slug: "rystar-tristar-essense",
      description:
        "Pieza de edición limitada de Rystar Studios. Construida como una prenda unisex para uso diario.",
      price: 4500,
      status: ProductStatus.ACTIVE,
      tags: ["SS25", "2025", "Drop 001", "Tristar", "Limited pieces"],
      images: {
        create: [
          {
            url: "/products/tristar-essense-front.webp",
            alt: "RYSTAR TRISTAR ESSENSE front",
            position: 1,
          },
          {
            url: "/products/tristar-essense-back.webp",
            alt: "RYSTAR TRISTAR ESSENSE back",
            position: 2,
          },
        ],
      },
      variants: {
        create: [
          { size: "S", color: "Black", stock: 2 },
          { size: "M", color: "Black", stock: 4 },
          { size: "L", color: "Black", stock: 3 },
          { size: "XL", color: "Black", stock: 1 },
        ],
      },
    },
  });
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