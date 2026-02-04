import Teams from "./page-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teams | Admin Panel",
};

export default function TeamsPage() {
  return <Teams />;
}
