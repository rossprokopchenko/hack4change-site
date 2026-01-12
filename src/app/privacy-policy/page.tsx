import type { Metadata } from "next";
import PageContent from "./page-content";
import { getServerTranslation, getServerLanguage } from "@/services/i18n";

export async function generateMetadata(): Promise<Metadata> {  const language = await getServerLanguage();
  const { t } = await getServerTranslation(language, "privacy-policy");

  return {
    title: t("title"),
  };
}

export default function Page() {
  return <PageContent />;
}
