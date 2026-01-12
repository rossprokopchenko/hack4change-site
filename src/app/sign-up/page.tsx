import type { Metadata } from "next";
import SignUp from "./page-content";
import { getServerTranslation, getServerLanguage } from "@/services/i18n";
import { redirect } from "next/navigation";
import { IS_SIGN_UP_ENABLED } from "@/services/auth/config";

export async function generateMetadata(): Promise<Metadata> {
  const language = await getServerLanguage();
  const { t } = await getServerTranslation(language, "sign-up");

  return {
    title: t("title"),
  };
}

export default function SignUpPage() {
  if (!IS_SIGN_UP_ENABLED) {
    return redirect("/");
  }

  return <SignUp />;
}
