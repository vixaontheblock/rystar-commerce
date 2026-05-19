import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { IntroSplash } from "@/components/intro-splash";
import {
  defaultSeoDescription,
  getOrganizationJsonLd,
  siteName,
  siteUrl,
} from "@/lib/seo";

const ogImage = "/og/rystar-og-v4.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rystar Studios — Limited Pieces",
    template: "%s · Rystar Studios",
  },
  description: defaultSeoDescription,
  applicationName: siteName,
  manifest: "/site.webmanifest",
  alternates: {
    canonical: siteUrl,
  },
  keywords: [
    "Rystar Studios",
    "Rystar Clothing",
    "streetwear Panama",
    "ropa streetwear Panamá",
    "limited drops",
    "custom clothing Panama",
    "moda urbana Panamá",
    "no restock",
  ],
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
    title: siteName,
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Rystar Studios — Limited Pieces",
    description: defaultSeoDescription,
    url: siteUrl,
    siteName,
    type: "website",
    locale: "es_PA",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Rystar Studios — Limited Pieces",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rystar Studios — Limited Pieces",
    description: defaultSeoDescription,
    images: [ogImage],
  },
  robots: {
    index: true,
    follow: true,
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
  const organizationJsonLd = getOrganizationJsonLd();

  return (
    <html lang="es">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />

        <CartProvider>
          <IntroSplash />
          <SiteHeader />
          {children}
          <SiteFooter />
        </CartProvider>
      </body>
    </html>
  );
}