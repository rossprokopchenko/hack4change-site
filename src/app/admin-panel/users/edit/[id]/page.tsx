import type { Metadata } from "next";
import EditUser from "./page-content";
import { getServerTranslation, getServerLanguage } from "@/services/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();
  const { t } = await getServerTranslation(
    language,
    "admin-panel-users-edit"
  );

  return {
    title: t("title1"),
  };
}

export default function Page() {
  return <EditUser />;
}
