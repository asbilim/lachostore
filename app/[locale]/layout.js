import { Manrope as Inte, Playfair_Display as Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PreHeader from "@/components/layout/preheader";
import { CartProvider } from "@/providers/cart";
import { getTranslations } from "next-intl/server";

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
  const t = await getTranslations("Header");

  return (
    <html lang={locale} dangerouslyAllowSVG={true}>
      <CartProvider>
        <body className={inter.className}>
          <PreHeader />
          <Header
            locale={locale}
            home={t("home")}
            contact={t("contact")}
            apply={t("apply")}
            shop={t("shop")}
            header_cart={t("cart")}
          />
          {children}
          <Footer locale={locale} />
        </body>
      </CartProvider>
    </html>
  );
}
