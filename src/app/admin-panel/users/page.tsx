import type { Metadata } from "next";
import { getServerTranslation, getServerLanguage } from "@/services/i18n";
import Users from "./page-content";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();
  const { t } = await getServerTranslation(
    language,
    "admin-panel-users"
  );

  return {
    title: t("title"),
  };
}

export default function Page() {
  return <Users />;
}
