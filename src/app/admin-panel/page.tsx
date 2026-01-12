import type { Metadata } from "next";
import { getServerTranslation, getServerLanguage } from "@/services/i18n";
import AdminPanel from "./page-content";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();
  const { t } = await getServerTranslation(language, "admin-panel-home");

  return {
    title: t("title"),
  };
}

export default function Page() {
  return <AdminPanel />;
}
