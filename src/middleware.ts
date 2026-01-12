import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import acceptLanguage from "accept-language";
import {
  fallbackLanguage,
  languages,
  cookieName,
} from "./services/i18n/config";

acceptLanguage.languages([...languages]);

const PUBLIC_FILE = /\.(.*)$/;

/**
 * Middleware for cookie-based language detection.
 * 1. Redirects legacy language-prefixed URLs (e.g., /en/about) to clean URLs (e.g., /about).
 * 2. Sets the language cookie if not present or if overridden by a legacy URL.
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Skip static files, _next internals, and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.includes("/api/") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Check for legacy language prefixes (e.g., /en/path or /en)
  const langPrefix = languages.find(
    (lang) => pathname === `/${lang}` || pathname.startsWith(`/${lang}/`)
  );

  if (langPrefix) {
    // Determine the new clean path
    const newPathname = pathname === `/${langPrefix}` 
      ? "/" 
      : pathname.replace(`/${langPrefix}`, "");
    
    const response = NextResponse.redirect(new URL(`${newPathname}${search}`, req.url));

    // Update the cookie to match the language prefix user was trying to access
    response.cookies.set(cookieName, langPrefix, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return response;
  }

  const response = NextResponse.next();

  // If no language cookie is set, detect language from Accept-Language header
  // and set the cookie for future requests
  if (!req.cookies.has(cookieName)) {
    const detectedLanguage =
      acceptLanguage.get(req.headers.get("Accept-Language")) || fallbackLanguage;
    response.cookies.set(cookieName, detectedLanguage, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
  }

  return response;
}


