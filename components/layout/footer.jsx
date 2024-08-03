"use client";
import { Link } from "../navigation";
import { ChevronDown, Globe, ArrowRight } from "lucide-react";
import { usePathname } from "../navigation";
import { DollarSign } from "lucide-react";
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
import NewsletterSubscribe from "../reusables/newsletter";
import { useCurrency } from "@/providers/currency";
const languages = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "de", name: "Deutsche" },
  { code: "tr", name: "Turkish" },
];

export default function Footer({
  locale,
  text,
  placeholder,
  subscribe,
  link_1,
  link_2,
  link_3,
  rights,
}) {
  const pathname = usePathname();
  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];
  const {
    currency,
    changeCurrency,
    supportedCurrencies,
    getCurrentRatio,
    convertCurrency,
  } = useCurrency();

  return (
    <footer className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Link
              href="/"
              className="inline-block"
              prefetch={false}
              locale={locale}>
              <span className="sr-only">Lachoshop</span>
              <div className="h-8 w-auto">{/* Add your logo SVG here */}</div>
            </Link>
            <p className="text-sm font-light max-w-md">{text}</p>

            <NewsletterSubscribe
              placeholder={placeholder}
              content={subscribe}
            />
          </div>
          <div className="md:pl-8">
            <ScrollArea className="h-[300px] md:h-auto">
              <Accordion type="multiple" className="w-full">
                {[link_1, link_2, link_3].map((section, index) => (
                  <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger className="text-lg font-semibold">
                      {section.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {Object.values(section)
                          .slice(1)
                          .map((link, linkIndex) => (
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
          <p className="text-sm font-light">{rights}</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Globe className="mr-2 h-4 w-4" />
                {currentLanguage.name}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {languages.map((lang) => (
                <DropdownMenuItem key={lang.code}>
                  <a
                    href={`/${lang.code}${pathname}`}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/${lang.code}${pathname}`;
                    }}>
                    {lang.name}
                  </a>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <p className="text-sm font-light">{rights}</p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Globe className="mr-2 h-4 w-4" />
                  {currentLanguage.name}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map((lang) => (
                  <DropdownMenuItem key={lang.code}>
                    <a
                      href={`/${lang.code}${pathname}`}
                      onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/${lang.code}${pathname}`;
                      }}>
                      {lang.name}
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <DollarSign className="mr-2 h-4 w-4" />
                  {currency}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {supportedCurrencies.map((curr) => (
                  <DropdownMenuItem
                    key={curr.code}
                    onSelect={() => {
                      changeCurrency(curr.code);
                    }}>
                    {curr.name} ({curr.code})
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </footer>
  );
}
