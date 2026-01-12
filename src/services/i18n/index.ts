import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { cookies, headers } from "next/headers";
import { getOptions, fallbackLanguage, cookieName, languages } from "./config";
import acceptLanguage from "accept-language";

// Initialize accept-language with supported languages
acceptLanguage.languages([...languages]);

const initI18next = async (language: string, namespace: string) => {
  // On server side we create a new instance for each render, because during
  // compilation everything seems to be executed in parallel
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`./locales/${language}/${namespace}.json`)
      )
    )
    .init(getOptions(language, namespace));

  return i18nInstance;
};

/**
 * Get the language from server-side cookies or Accept-Language header.
 * This is the single source of truth for language on the server.
 */
export async function getServerLanguage(): Promise<string> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  
  // Try to get language from cookie first
  const cookieValue = cookieStore.get(cookieName)?.value;
  if (cookieValue && languages.includes(cookieValue as typeof languages[number])) {
    return cookieValue;
  }
  
  // Fall back to Accept-Language header
  const acceptLang = headerStore.get("Accept-Language");
  const detectedLang = acceptLanguage.get(acceptLang);
  if (detectedLang) {
    return detectedLang;
  }
  
  return fallbackLanguage;
}

export async function getServerTranslation(
  language: string,
  namespace: string | string[],
  options: { keyPrefix?: string } = {}
) {
  const i18nextInstance = await initI18next(
    language,
    Array.isArray(namespace) ? namespace[0] : namespace
  );

  return {
    t: i18nextInstance.getFixedT(
      language,
      Array.isArray(namespace) ? namespace[0] : namespace,
      options.keyPrefix
    ),
    i18n: i18nextInstance,
  };
}

