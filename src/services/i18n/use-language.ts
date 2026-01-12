"use client";

import useStoreLanguage from "./use-store-language";
import { fallbackLanguage } from "./config";

/**
 * Hook to get the current language from cookie-stored context.
 * This replaces the old URL-based language detection.
 */
function useLanguage() {
  const { language } = useStoreLanguage();
  return language || fallbackLanguage;
}

export default useLanguage;

