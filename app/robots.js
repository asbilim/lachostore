export default function robots() {
  //small comment
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/accounts/"],
    },
    sitemap: "https://shop.lachofit.com/sitemap.xml",
  };
}
