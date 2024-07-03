import { Manrope as Inte, Playfair_Display as Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PreHeader from "@/components/layout/preheader";

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

export default function RootLayout({ children }) {
  return (
    <html lang="en" dangerouslyAllowSVG={true}>
      <body className={inter.className}>
        <PreHeader />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
