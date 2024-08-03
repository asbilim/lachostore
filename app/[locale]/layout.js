import { Manrope as Inte, Playfair_Display as Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PreHeader from "@/components/layout/preheader";
import { CartProvider } from "@/providers/cart";
import { getTranslations } from "next-intl/server";
import FloatingChat from "@/components/chats/floating";
import { keepServerAwake } from "@/components/reusables/ping";
import { getProducts } from "@/server/get-products";
import { Toaster } from "@/components/ui/sonner";
import { revalidateTag } from "next/cache";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CurrencyProvider } from "@/providers/currency";

const inter = Inte({
  subsets: ["latin"],
  preload: true,
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: "Lachofit Store | Official",
  description: "The official web store of Lachofit",
};

export default async function RootLayout({ children, params }) {
  const { locale } = params;
  const tHeader = await getTranslations("Header");
  const tFooter = await getTranslations("Footer");
  const products = await getProducts();
  revalidateTag("products");
  // keepServerAwake(process.env.BACKEND_URL);

  return (
    <html
      lang={locale}
      dangerouslyAllowSVG={true}
      suppressHydrationWarning={true}>
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
    </html>
  );
}
