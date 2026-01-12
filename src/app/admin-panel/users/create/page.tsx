import type { Metadata } from "next";
import CreateUser from "./page-content";
import { getServerTranslation, getServerLanguage } from "@/services/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();
  const { t } = await getServerTranslation(
    language,
    "admin-panel-users-create"
  );

  return {
    title: t("title"),
  };
}

export default function Page() {
  return <CreateUser />;
}
