import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "./navigation";
export default async function HeroShop({ title, description, link_1, link_2 }) {
  return (
    <section className="relative w-full md:h-[50vh] h-[65vh] overflow-hidden my-4 bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.pexels.com/photos/13612713/pexels-photo-13612713.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="opacity-30 md:opacity-50"
          priority
          unoptimized
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
        <motion.div
          className="text-center space-y-6 mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          <h1 className="text-4xl md:text-6xl font-extrabold text-primary">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto">
            {description}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-primary text-primary-foreground">
              <Link href="/store/register/">{link_1}</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-secondary text-secondary-foreground">
              {link_2}
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
