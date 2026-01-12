
import type { Metadata } from "next";
import SignIn from "./page-content";
import { getServerTranslation, getServerLanguage } from "@/services/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();
  const { t } = await getServerTranslation(language, "sign-in");

  return {
    title: t("title"),
  };
}

export default function Page() {
  return <SignIn />;
}
