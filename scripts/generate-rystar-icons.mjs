import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const source = path.join(process.cwd(), "public/branding-source/WHITE.png");

const outputs = [
  { path: "src/app/icon.png", size: 512, padding: 0.16 },
  { path: "src/app/apple-icon.png", size: 180, padding: 0.16 },
  { path: "public/icons/icon-32.png", size: 32, padding: 0.12 },
  { path: "public/icons/icon-192.png", size: 192, padding: 0.16 },
  { path: "public/icons/icon-512.png", size: 512, padding: 0.16 },
  { path: "public/icons/apple-touch-icon.png", size: 180, padding: 0.16 },
];

async function makeIcon(outputPath, size, padding) {
  const fullOutputPath = path.join(process.cwd(), outputPath);
  const contentSize = Math.round(size * (1 - padding * 2));

  const logoBuffer = await sharp(source)
    .trim({
      background: "#000000",
      threshold: 12,
    })
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

  await fs.mkdir(path.dirname(fullOutputPath), { recursive: true });

  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: "#000000",
    },
  })
    .composite([
      {
        input: logoBuffer,
        left,
        top,
      },
    ])
    .png()
    .toFile(fullOutputPath);

  console.log(`Created ${outputPath}`);
}

async function main() {
  await fs.access(source);

  for (const output of outputs) {
    await makeIcon(output.path, output.size, output.padding);
  }

  const faviconSizes = [16, 32, 48];

  const faviconPaths = [];

  for (const size of faviconSizes) {
    const faviconPath = `public/icons/favicon-${size}.png`;
    await makeIcon(faviconPath, size, 0.1);
    faviconPaths.push(path.join(process.cwd(), faviconPath));
  }

  const icoBuffer = await pngToIco(faviconPaths);

  await fs.writeFile(path.join(process.cwd(), "src/app/favicon.ico"), icoBuffer);
  await fs.writeFile(path.join(process.cwd(), "public/icons/favicon.ico"), icoBuffer);

  const manifest = {
    name: "Rystar Studios",
    short_name: "Rystar",
    description: "Rystar Studios — limited drops, custom pieces and streetwear.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };

  await fs.writeFile(
    path.join(process.cwd(), "public/site.webmanifest"),
    JSON.stringify(manifest, null, 2)
  );

  console.log("Created src/app/favicon.ico");
  console.log("Created public/icons/favicon.ico");
  console.log("Created public/site.webmanifest");
  console.log("Rystar icons generated successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
