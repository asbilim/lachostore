import { Manrope as Inte, Playfair_Display as Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PreHeader from "@/components/layout/preheader";
import { CartProvider } from "@/providers/cart";
import { getTranslations } from "next-intl/server";
import FloatingChat from "@/components/chats/floating";
import { getProducts } from "@/server/get-products";
import { Toaster } from "@/components/ui/sonner";
import { revalidateTag } from "next/cache";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CurrencyProvider } from "@/providers/currency";
import { AuthProvider } from "@/providers/next-auth";

const inter = Inte({
  subsets: ["latin"],
  preload: true,
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export function generateMetadata() {
  const siteName = "Lachofit Store";
  const baseUrl = "https://www.shop.lachofit.com";
  const defaultDescription =
    "Discover authentic African products at Lachofit Store. We offer a wide range of local goods from Cameroon and across Africa, with multi-currency support and worldwide shipping.";
  const defaultImage = `https://images.pexels.com/photos/25388946/pexels-photo-25388946/free-photo-of-strawberries-in-boxes-at-market.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`;

  return {
    title: {
      default: `${siteName} - Authentic African Products`,
      template: `%s | ${siteName}`,
    },
    description: defaultDescription,
    keywords: [
      "African products",
      "Cameroon",
      "e-commerce",
      "multivendor",
      "local goods",
      "African fashion",
      "African food",
      "African art",
      "multicurrency",
      "global shipping",
    ],
    authors: [{ name: "Lachofit Team" }],
    creator: "Lachofit Store",
    publisher: "Lachofit Inc.",
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: "/",
      languages: {
        "en-US": "/en",
        "fr-FR": "/fr",
        "de-DE": "/de",
        "tr-TU": "/tr",
      },
    },
    openGraph: {
      type: "website",
      siteName: siteName,
      title: `${siteName} - Your Gateway to African Excellence`,
      description: defaultDescription,
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: "Lachofit Store - Showcasing African Products",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@lachofitstore",
      title: `${siteName} - Authentic African Marketplace`,
      description:
        "Explore unique products from Cameroon and Africa. Multi-currency support, worldwide shipping!",
      images: [defaultImage],
    },
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/favicon.ico",
      apple: [
        { url: "/apple-icon.png" },
        { url: "/apple-icon-x3.png", sizes: "180x180", type: "image/png" },
      ],
    },
    manifest: `${baseUrl}/site.webmanifest`,
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ffffff" },
      { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    ],
    other: {
      "google-site-verification": "your-google-site-verification-code",
      "msvalidate.01": "your-bing-verification-code",
      "facebook-domain-verification": "your-facebook-domain-verification-code",
    },
  };
}

export default async function RootLayout({ children, params }) {
  const { locale } = params;
  const tHeader = await getTranslations("Header");
  const tFooter = await getTranslations("Footer");
  const products = await getProducts();
  revalidateTag("products");

  return (
    <html
      lang={locale}
      dangerouslyAllowSVG={true}
      suppressHydrationWarning={true}>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <TooltipProvider>
              <body className={inter.className}>
                <Toaster />
                <FloatingChat products={products} />
                <PreHeader />
                <Header
                  locale={locale}
                  home={tHeader("home")}
                  contact={tHeader("contact")}
                  apply={tHeader("apply")}
                  shop={tHeader("shop")}
                  header_cart={tHeader("cart")}
                  products={products}
                />
                {children}
                <Footer
                  locale={locale}
                  text={tFooter("text")}
                  placeholder={tFooter("placeholder")}
                  subscribe={tFooter("subscribe")}
                  link_1={{
                    title: tFooter("link_1.title"),
                    about: tFooter("link_1.about"),
                    careers: tFooter("link_1.careers"),
                    brand: tFooter("link_1.brand"),
                    blog: tFooter("link_1.blog"),
                  }}
                  link_2={{
                    title: tFooter("link_2.title"),
                    discord: tFooter("link_2.discord"),
                    twitter: tFooter("link_2.twitter"),
                    facebook: tFooter("link_2.facebook"),
                    contact: tFooter("link_2.contact"),
                  }}
                  link_3={{
                    title: tFooter("link_3.title"),
                    licensing: tFooter("link_3.licensing"),
                    terms: tFooter("link_3.terms"),
                  }}
                  rights={tFooter("rights")}
                />
              </body>
            </TooltipProvider>
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </html>
  );
}
