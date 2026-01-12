import type { Metadata } from "next";
import { getServerTranslation, getServerLanguage } from "@/services/i18n";
import PageContent from "./page-content";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();
  const { t } = await getServerTranslation(language, "home");

  return {
    title: t("title"),
  };
}

export default async function Home() {
  return <PageContent />;
}

