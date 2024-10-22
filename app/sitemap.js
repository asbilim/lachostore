import { getProducts } from "@/server/get-products";
import { revalidateTag } from "next/cache";
import { format } from "date-fns";
import slugify from "react-slugify";
export default async function generateSimplifiedSitemap() {
  try {
    // Trigger a revalidation for the 'products' tag
    revalidateTag("products");

    // Fetch all products from the server
    const products = await getProducts();

    // Define the base URL
    const baseUrl = "https://shop.lachofit.com";

    // Create a set to hold unique store URLs to avoid duplication
    const storeUrls = new Set();

    // Create an array to hold all the sitemap entries
    const sitemapEntries = [];

    // Process each product
    products.forEach((product) => {
      // Add product URL
      sitemapEntries.push({
        url: `${baseUrl}/en/product/${slugify(product.name)}`,
        lastModified: format(new Date(), "yyyy-MM-dd"), // Formatting the date as YYYY-MM-DD
        priority: 0.9, // Slightly lower priority than store pages
      });

      // Check if store information exists and add store URL if it hasn't been added already
      if (product.vendor && product.vendor.slug) {
        const storeUrl = `${baseUrl}/en/mystore/${product.vendor.slug}`;
        if (!storeUrls.has(storeUrl)) {
          storeUrls.add(storeUrl);
          sitemapEntries.push({
            url: storeUrl,
            lastModified: format(new Date(), "yyyy-MM-dd"),
            priority: 1.0, // Higher priority for store pages
          });
        }
      }
    });

    // Return the sitemap entries
    return sitemapEntries;
  } catch (error) {
    console.error("Failed to generate sitemap:", error);
    return []; // Return an empty array in case of error
  }
}
