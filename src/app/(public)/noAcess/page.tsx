import { redirect } from "next/navigation";

export default async function NoAcessPage() {
  redirect("clientApp/calendarApp");
}
