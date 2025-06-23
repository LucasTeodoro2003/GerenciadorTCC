import { redirect } from "next/navigation";
import { signOut as signOutFn } from "next-auth/react";

export default function signOut() {
  signOutFn({ callbackUrl: "/login" });
}
