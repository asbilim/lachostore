export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/accounts/"],
    },
    sitemap: "https://shop.lachofit.com/sitemap.xml",
  };
}
