"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Star, Mail, Phone, MapPin, ShoppingBag } from "lucide-react";
import { handleStoreVisit } from "../functions/api";
import { ProductCard } from "../main";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const staticContent = {
  storeSlogan: "Innovative tech solutions since 2020",
  aboutTitle: "About Us",
  contactTitle: "Get in Touch",
  featuredTitle: "Featured Products",
  ctaTitle: "Elevate Your Tech Game",
  ctaText: "Discover cutting-edge products tailored for your lifestyle.",
  ctaButton: "Explore Now",
  tabProducts: "Products",
  tabAbout: "About",
  tabContact: "Contact",
};

const MotionCard = motion(Card);

export default function StorePageClient({ store, products, locale }) {
  const [activeTab, setActiveTab] = useState("products");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const addVisit = async () => {
      try {
        await handleStoreVisit(store.id);
      } catch (error) {
        console.error("Failed to record store visit:", error);
      } finally {
        setIsLoading(false);
      }
    };
    addVisit();
  }, [store.id]);

  const renderBanner = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative h-[60vh] lg:h-[80vh] overflow-hidden">
      <Image
        src={
          store.avatar ||
          "https://images.pexels.com/photos/2155544/pexels-photo-2155544.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        }
        alt={store.name}
        layout="fill"
        objectFit="cover"
        className="z-0"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/30 z-10" />
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute inset-0 flex flex-col justify-center items-center text-center z-20">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
          {store.name}
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl">
          {staticContent.storeSlogan}
        </p>
        <Button size="lg" variant="secondary" className="group">
          {staticContent.ctaButton}
          <ShoppingBag className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </motion.div>
  );

  const renderProductsTab = () => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}>
      <h2 className="text-3xl font-bold mb-8 text-center">
        {staticContent.featuredTitle}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <motion.div key={product.id} variants={childVariants}>
            <ProductCard product={product} locale={locale} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderAboutTab = () => (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-3xl font-bold mb-4">{staticContent.aboutTitle}</h2>
        <p className="text-muted-foreground text-lg leading-relaxed">
          {store.description || "No description available."}
        </p>
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`w-6 h-6 ${
                i <= store.rating ? "text-yellow-400" : "text-gray-300"
              }`}
              fill={i <= store.rating ? "currentColor" : "none"}
            />
          ))}
          <span className="text-sm font-medium ml-2">
            {store.rating} ({store.review_count} reviews)
          </span>
        </div>
      </CardContent>
    </MotionCard>
  );

  const renderContactTab = () => (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden">
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
                  <span className="blur-sm hover:blur-none transition-all duration-300">
                    {store.contact_email}
                  </span>
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
                  <span className="blur-sm hover:blur-none transition-all duration-300">
                    {store.contact_phone}
                  </span>
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
                  <span className="blur-sm hover:blur-none transition-all duration-300">
                    {store.address}
                  </span>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
        {!store.contact_email && !store.contact_phone && !store.address && (
          <p className="text-center text-muted-foreground">
            No contact information available.
          </p>
        )}
      </CardContent>
    </MotionCard>
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
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      className="bg-primary text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-6">{staticContent.ctaTitle}</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          {staticContent.ctaText}
        </p>
        <Button size="lg" variant="secondary" className="group">
          {staticContent.ctaButton}
          <ShoppingBag className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="w-32 h-32 rounded-full" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-background to-secondary/5">
      {renderBanner()}

      <div className="container mx-auto px-4 py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-12">
            <TabsTrigger value="products" className="text-lg">
              {staticContent.tabProducts}
            </TabsTrigger>
            <TabsTrigger value="about" className="text-lg">
              {staticContent.tabAbout}
            </TabsTrigger>
            <TabsTrigger value="contact" className="text-lg">
              {staticContent.tabContact}
            </TabsTrigger>
          </TabsList>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}>
              {renderTabsContent()}
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </div>

      {renderCTASection()}
    </motion.div>
  );
}

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
