import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";

// Define the protected routes without the locale prefix
const protectedRoutes = ["/store/register", "/accounts"];

// Initialize the next-intl middleware for locale handling
const intlMiddleware = createMiddleware({
  locales: ["en", "de", "fr", "tr"],
  defaultLocale: "en",
});

export async function middleware(request) {
  const { nextUrl } = request;

  // Extract the locale from the URL
  const locale = nextUrl.pathname.split("/")[1];

  // Remove the locale from the pathname for route matching
  const pathWithoutLocale = nextUrl.pathname.replace(`/${locale}`, "");

  // Retrieve the authentication token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check if the current path is a protected route
  const isProtected = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  // If the route is protected and the user is not authenticated, redirect to login
  if (isProtected && !token) {
    const redirectUrl = `${nextUrl.pathname}${nextUrl.search}`; // Current URL with query parameters
    return NextResponse.redirect(
      new URL(
        `/${locale}/auth/login?redirectUrl=${encodeURIComponent(redirectUrl)}`,
        request.url
      )
    );
  }

  // If the user is authenticated and tries to access an auth page, redirect to /products
  if (token && /^\/auth\//.test(pathWithoutLocale)) {
    return NextResponse.redirect(new URL(`/${locale}/products`, request.url));
  }

  // Apply the next-intl middleware for locale handling
  const response = intlMiddleware(request);

  return response;
}

export const config = {
  matcher: ["/", "/(de|en|fr|tr)/:path*"],
};
