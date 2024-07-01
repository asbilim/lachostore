import { Montserrat as Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import PreHeader from "@/components/layout/preheader";

const inter = Inter({
  subsets: ["latin"],
  preload: true,
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
