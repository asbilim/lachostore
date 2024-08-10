import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

const protectedRoutes = ["/store/register"];

const intlMiddleware = createMiddleware({
  locales: ["en", "de", "fr", "tr"],
  defaultLocale: "en",
});

export async function middleware(request) {
  const { nextUrl } = request;

  // Récupérer le token d'authentification
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Vérifier si la route est protégée
  const isProtected = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Si la route est protégée et que l'utilisateur n'est pas connecté
  if (isProtected && !token) {
    const locale = nextUrl.pathname.split("/")[1]; // Récupérer la locale
    const redirectUrl = `${nextUrl.pathname}${nextUrl.search}`; // Récupérer l'URL actuelle
    return NextResponse.redirect(
      new URL(
        `/${locale}/auth/login?redirectUrl=${encodeURIComponent(redirectUrl)}`,
        request.url
      )
    );
  }

  // Si l'utilisateur est déjà connecté et tente d'accéder à une page d'authentification, rediriger vers /shop
  if (token && /^\/(de|en|fr|tr)\/auth\//.test(nextUrl.pathname)) {
    const locale = nextUrl.pathname.split("/")[1];
    return NextResponse.redirect(new URL(`/${locale}/products`, request.url));
  }

  // Appliquer le middleware de next-intl pour la gestion de la locale
  const response = intlMiddleware(request);

  return response;
}

export const config = {
  matcher: ["/", "/(de|en|fr|tr)/:path*"],
};
