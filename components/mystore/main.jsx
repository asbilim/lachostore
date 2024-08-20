"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductCard } from "../main";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import { Star, Mail, Phone, MapPin } from "lucide-react";
import { handleStoreVisit } from "../functions/api";
// Static text content
const staticContent = {
  storeSlogan: "Innovative tech solutions since 2020",
  aboutTitle: "About",
  contactTitle: "Contact Us",
  featuredTitle: "Featured Products",
  ctaTitle: "Ready to Upgrade Your Tech?",
  ctaText:
    "Explore our wide range of products and find the perfect fit for your lifestyle.",
  ctaButton: "Shop Now",
  tabProducts: "Products",
  tabAbout: "About",
  tabContact: "Contact",
};

export default function StorePageClient({ store, products, locale }) {
  const [activeTab, setActiveTab] = useState("products");

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    const addVisit = async () => {
      const data = await handleStoreVisit(store.id);
    };
    addVisit();
  }, [store.id]);

  const renderBanner = () => (
    <div className="relative h-[50vh] lg:h-[70vh] overflow-hidden">
      <Image
        src={
          store.avatar ||
          "https://images.pexels.com/photos/2155544/pexels-photo-2155544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        }
        alt={store.name}
        layout="fill"
        objectFit="cover"
        className="z-0"
      />
      <div className="absolute inset-0 bg-black/50 z-10" />
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-20">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {store.name}
          </h1>
          <p className="text-xl md:text-2xl text-white/80">
            {staticContent.storeSlogan}
          </p>
          <Button size="lg" variant="secondary" className="mt-8">
            {staticContent.ctaButton}
          </Button>
        </motion.div>
      </div>
    </div>
  );

  const renderProductsTab = () => (
    <motion.div variants={childVariants}>
      <h2 className="text-3xl font-bold mb-6">{staticContent.featuredTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </div>
    </motion.div>
  );

  const renderAboutTab = () => (
    <motion.div variants={childVariants}>
      <Card>
        <CardContent className="p-6">
          <h2 className="text-3xl font-bold mb-4">
            {staticContent.aboutTitle}
          </h2>
          <p className="text-muted-foreground">
            {store.description || "No description available."}
          </p>
          <div className="flex items-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i <= store.rating ? "fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-sm font-medium">
              {store.rating} ({store.review_count} reviews)
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderContactTab = () => (
    <motion.div variants={childVariants}>
      <Card>
        <CardContent className="p-6">
          <h2 className="text-3xl font-bold mb-6">
            {staticContent.contactTitle}
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {store.contact_email && (
              <AccordionItem value="email">
                <AccordionTrigger>Email</AccordionTrigger>
                <AccordionContent>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>{store.contact_email}</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            {store.contact_phone && (
              <AccordionItem value="phone">
                <AccordionTrigger>Phone</AccordionTrigger>
                <AccordionContent>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>{store.contact_phone}</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            {store.address && (
              <AccordionItem value="address">
                <AccordionTrigger>Address</AccordionTrigger>
                <AccordionContent>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>{store.address}</span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
            {!store.contact_email && !store.contact_phone && !store.address && (
              <p>No contact information available.</p>
            )}
          </Accordion>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderTabsContent = () => {
    switch (activeTab) {
      case "products":
        return renderProductsTab();
      case "about":
        return renderAboutTab();
      case "contact":
        return renderContactTab();
      default:
        return renderProductsTab();
    }
  };

  const renderCTASection = () => (
    <motion.div
      className="bg-primary text-white py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.5 }}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">{staticContent.ctaTitle}</h2>
        <p className="text-xl mb-8">{staticContent.ctaText}</p>
        <Button size="lg" variant="secondary">
          {staticContent.ctaButton}
        </Button>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      {renderBanner()}

      <div className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="products">
              {staticContent.tabProducts}
            </TabsTrigger>
            <TabsTrigger value="about">{staticContent.tabAbout}</TabsTrigger>
            <TabsTrigger value="contact">
              {staticContent.tabContact}
            </TabsTrigger>
          </TabsList>
          <AnimatePresence mode="wait">{renderTabsContent()}</AnimatePresence>
        </Tabs>
      </div>

      {renderCTASection()}
    </motion.div>
  );
}
