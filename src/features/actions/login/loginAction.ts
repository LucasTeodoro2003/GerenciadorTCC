"use server";
import { signIn } from "@/shared/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", formData);
  } catch (err:any) {
    const errorMessage = err.message.split(" Read more at")[0];
    redirect("/login?error=" + encodeURIComponent(errorMessage));
  }
}
