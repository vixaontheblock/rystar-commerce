import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const root = process.cwd();
const source = path.join(root, "public/branding-source/WHITE.png");

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

async function makeSquareIcon(outputPath, size, padding = 0.14) {
  const fullOutputPath = path.join(root, outputPath);
  const contentSize = Math.round(size * (1 - padding * 2));

  const logoBuffer = await sharp(source)
    .trim({ background: "#000000", threshold: 12 })
    .resize({
      width: contentSize,
      height: contentSize,
      fit: "inside",
      withoutEnlargement: false,
    })
    .png()
    .toBuffer();

  const metadata = await sharp(logoBuffer).metadata();

  const left = Math.round((size - (metadata.width ?? contentSize)) / 2);
  const top = Math.round((size - (metadata.height ?? contentSize)) / 2);

  await ensureDir(fullOutputPath);

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: "#000000",
    },
  })
    .composite([{ input: logoBuffer, left, top }])
    .png()
    .toFile(fullOutputPath);

  console.log(`Created ${outputPath}`);
}

async function makeOgImage() {
  const outputPath = path.join(root, "public/og/rystar-og-v2.png");

  const logoBuffer = await sharp(source)
    .trim({ background: "#000000", threshold: 12 })
    .resize({
      width: 520,
      height: 300,
      fit: "inside",
      withoutEnlargement: false,
    })
    .png()
    .toBuffer();

  const logoMeta = await sharp(logoBuffer).metadata();

  const logoLeft = Math.round((1200 - (logoMeta.width ?? 520)) / 2);
  const logoTop = 120;

  const textSvg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <text x="600" y="465" text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="58"
        font-weight="900"
        letter-spacing="2"
        fill="#ffffff">
        RYSTAR STUDIOS
      </text>

      <text x="600" y="520" text-anchor="middle"
        font-family="Arial, Helvetica, sans-serif"
        font-size="22"
        font-weight="700"
        letter-spacing="8"
        fill="#8a8a8a">
        LIMITED PIECES · NO RESTOCK
      </text>
    </svg>
  `;

  await ensureDir(outputPath);

  await sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 4,
      background: "#000000",
    },
  })
    .composite([
      {
        input: logoBuffer,
        left: logoLeft,
        top: logoTop,
      },
      {
        input: Buffer.from(textSvg),
        left: 0,
        top: 0,
      },
    ])
    .png()
    .toFile(outputPath);

  console.log("Created public/og/rystar-og-v2.png");
}

async function main() {
  await fs.access(source);

  await makeSquareIcon("src/app/icon.png", 512, 0.13);
  await makeSquareIcon("src/app/apple-icon.png", 180, 0.13);

  await makeSquareIcon("public/icons/icon-32.png", 32, 0.08);
  await makeSquareIcon("public/icons/icon-192.png", 192, 0.13);
  await makeSquareIcon("public/icons/icon-512.png", 512, 0.13);
  await makeSquareIcon("public/icons/apple-touch-icon.png", 180, 0.13);

  const faviconPaths = [];

  for (const size of [16, 32, 48]) {
    const faviconPath = `public/icons/favicon-${size}.png`;
    await makeSquareIcon(faviconPath, size, 0.08);
    faviconPaths.push(path.join(root, faviconPath));
  }

  const icoBuffer = await pngToIco(faviconPaths);

  await fs.writeFile(path.join(root, "src/app/favicon.ico"), icoBuffer);
  await fs.writeFile(path.join(root, "public/icons/favicon.ico"), icoBuffer);

  await makeOgImage();

  const manifest = {
    name: "Rystar Studios",
    short_name: "Rystar",
    description:
      "Rystar Studios — limited drops, custom pieces and streetwear.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  };

  await fs.writeFile(
    path.join(root, "public/site.webmanifest"),
    JSON.stringify(manifest, null, 2)
  );

  console.log("Rystar favicon, app icons and OG image generated.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});