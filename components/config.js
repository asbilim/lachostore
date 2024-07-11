export const defaultLocale = "en";
export const locales = ["en", "de", "fr", "tr"];

export const pathnames = {
  "/": "/",
  "/pathnames": {
    en: "/en/",
    de: "/de/",
    fr: "/fr/",
    tr: "/tr/",
  },
};

export const localePrefix = "always";

export const port = process.env.PORT || 3000;
export const host = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:${port}`;
