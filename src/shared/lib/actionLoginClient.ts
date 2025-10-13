"use server";
import { signIn } from "@/shared/lib/auth";
import { redirect } from "next/navigation";

export async function loginActionClient(formData: FormData) {
  try {
    await signIn("credentials", formData);
  } catch (err:any) {
    const errorMessage = err.message.split(" Read more at")[0];
    redirect("/clientApp/loginApp?tabs=login&error=" + encodeURIComponent(errorMessage));
  }
}
