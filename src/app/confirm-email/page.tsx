import type { Metadata } from "next";
import ConfirmEmail from "./page-content";
import { getServerTranslation, getServerLanguage } from "@/services/i18n";

export async function generateMetadata(): Promise<Metadata> {  const language = await getServerLanguage();
  const { t } = await getServerTranslation(language, "confirm-email");

  return {
    title: t("title"),
  };
}

export default function Page() {
  return <ConfirmEmail />;
}
