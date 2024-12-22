"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const IconWrapper = ({ icon: Icon, text }) => (
  <div className="flex items-center space-x-2 text-sm">
    <Icon className="w-4 h-4 text-primary" />
    <span>{text}</span>
  </div>
);

export const StoreCard = ({
  name,
  address,
  rating,
  operating_hours,
  slug,
  contact_phone,
  contact_email,
  social_media_links,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Link href={`/en/mystore/${slug}`} passHref>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }}>
        <Card className="h-full overflow-hidden">
          <CardHeader className="pb-2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute -top-6 -right-6 w-24 h-24 bg-primary rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {rating?.toFixed(1)}
              </span>
            </motion.div>
            <CardTitle className="text-xl font-bold text-primary">
              <Link href={`/en/mystore/${slug}`}>{name}</Link>
            </CardTitle>
            <Badge variant="outline" className="mt-2">
              {operating_hours}
            </Badge>
          </CardHeader>
          <CardContent className="pt-2">
            <IconWrapper icon={MapPin} text={address} />
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 space-y-2">
                  <IconWrapper icon={Phone} text={contact_phone} />
                  <IconWrapper icon={Mail} text={contact_email} />
                  <div className="flex space-x-4 mt-4">
                    {social_media_links?.facebook && (
                      <Button variant="outline" size="icon" asChild>
                        <a
                          href={social_media_links.facebook}
                          target="_blank"
                          rel="noopener noreferrer">
                          <Facebook className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {social_media_links?.twitter && (
                      <Button variant="outline" size="icon" asChild>
                        <a
                          href={social_media_links.twitter}
                          target="_blank"
                          rel="noopener noreferrer">
                          <Twitter className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    {social_media_links?.instagram && (
                      <Button variant="outline" size="icon" asChild>
                        <a
                          href={social_media_links.instagram}
                          target="_blank"
                          rel="noopener noreferrer">
                          <Instagram className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
};

import { useRef, useEffect } from "react";

export const StoreCarousel = ({ items }) => {
  const [width, setWidth] = useState(0);
  const carousel = useRef();

  function getUniqueVendors(products) {
    const vendorMap = new Map();
    products.forEach((product) => {
      if (product.vendor && !vendorMap.has(product.vendor.id)) {
        vendorMap.set(product.vendor.id, product.vendor);
      }
    });
    return Array.from(vendorMap.values());
  }

  const values = getUniqueVendors(items);

  useEffect(() => {
    const updateWidth = () => {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, [items]);

  return (
    <motion.div ref={carousel} className="cursor-grab overflow-hidden">
      <motion.div
        drag="x"
        dragConstraints={{ right: 0, left: -width }}
        className="flex">
        {values.slice(1).map((item) => (
          <motion.div key={item.id} className="min-w-[300px] max-w-[350px] p-2">
            <StoreCard {...item} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
