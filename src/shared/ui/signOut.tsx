import { redirect } from "next/navigation";
import { signOut as signOutFn } from "next-auth/react";

export default async function signOut() {
  await signOutFn();

  redirect("/login");
}
