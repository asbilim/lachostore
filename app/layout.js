import { Kalam as Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
const inter = Inter({
  subsets: ["latin"],
  preload: true,
  weight: ["300", "400", "700"],
});

export const metadata = {
  title: "Lachofit Store | Official",
  description: "The official web store of Lachofit",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
