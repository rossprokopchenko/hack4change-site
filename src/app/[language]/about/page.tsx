import type { Metadata } from "next";
import About from "./page-content";
import { getServerTranslation } from "@/services/i18n";

type Props = {
  params: Promise<{ language: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { t } = await getServerTranslation(params.language, "about");

  return {
    title: `H4C - ${t("title")}`,
  };
}

export default function Page() {
  return <About />;
}