import type { Metadata } from "next";
import About from "./page-content";
import { getServerTranslation, getServerLanguage } from "@/services/i18n";

export async function generateMetadata(): Promise<Metadata> {  const language = await getServerLanguage();
  const { t } = await getServerTranslation(language, "about");

  return {
    title: t("title"),
  };
}

export default function Page() {
  return <About />;
}