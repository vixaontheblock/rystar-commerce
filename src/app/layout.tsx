import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://rystarstudios.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rystar Studios — Limited Pieces",
    template: "%s · Rystar Studios",
  },
  description:
    "Rystar Studios. Limited pieces, no restock, drop culture from Panama.",
  applicationName: "Rystar Studios",
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "any",
      },
      {
        url: "/icon.png",
        type: "image/png",
        sizes: "512x512",
      },
    ],
    shortcut: "/favicon.ico",
    apple: [
      {
        url: "/apple-icon.png",
        type: "image/png",
        sizes: "180x180",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "Rystar Studios",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Rystar Studios — Limited Pieces",
    description:
      "Rystar Studios. Limited pieces, no restock, drop culture from Panama.",
    url: siteUrl,
    siteName: "Rystar Studios",
    type: "website",
    locale: "es_PA",
  },
  twitter: {
    card: "summary",
    title: "Rystar Studios — Limited Pieces",
    description:
      "Rystar Studios. Limited pieces, no restock, drop culture from Panama.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <CartProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}