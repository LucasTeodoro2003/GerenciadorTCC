import ThemeToggle from "@/shared/ui/darkOrWhiteDown";
import { redirect } from "next/navigation";

export default async function NoAcessPage() {
  redirect("clientApp/calendarApp");
}
