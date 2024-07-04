"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Globe, ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const footerSections = [
  {
    title: "Company",
    links: ["About", "Careers", "Brand Center", "Blog"],
  },
  {
    title: "Help Center",
    links: ["Discord Server", "Twitter", "Facebook", "Contact Us"],
  },
  {
    title: "Legal",
    links: ["Privacy Policy", "Licensing", "Terms"],
  },
];

const languages = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
];

export default function Footer() {
  const [language, setLanguage] = useState(languages[0]);

  return (
    <footer className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Link href="#" className="inline-block" prefetch={false}>
              <span className="sr-only">Lachoshop</span>
              <div className="h-8 w-auto">{/* Add your logo SVG here */}</div>
            </Link>
            <p className="text-sm font-light max-w-md">
              Redefining the shopping paradigm through avant-garde technology
              and unparalleled customer-centric experiences.
            </p>
            <div className="flex items-center space-x-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="max-w-xs"
              />
              <Button>
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="md:pl-8">
            <ScrollArea className="h-[300px] md:h-auto">
              <Accordion type="multiple" className="w-full">
                {footerSections.map((section, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-lg font-semibold">
                      {section.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {section.links.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <Link
                              href="#"
                              className="text-sm hover:underline"
                              prefetch={false}>
                              {link}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm font-light">
            &copy; 2024 Lachoshop. All rights reserved.
          </p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Globe className="mr-2 h-4 w-4" />
                {language.name}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onSelect={() => setLanguage(lang)}>
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </footer>
  );
}
