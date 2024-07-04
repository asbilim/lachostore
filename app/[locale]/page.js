import Image from "next/image";
import { Button } from "@/components/ui/button";
import ShopMain from "@/components/layout/main";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-24 px-4 md:px-8 lg:px-12">
      <ShopMain />
    </main>
  );
}
