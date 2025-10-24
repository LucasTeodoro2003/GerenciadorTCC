"use server";
import { signIn } from "@/shared/lib/auth";
import { toast } from "sonner";

export async function LoginWithLink(formLogin: FormData) {
  try {
    const email = formLogin.get("email")?.toString() || "";
    await signIn("resend", formLogin);
  } catch (error) {
    console.error("Error sending reset link:", error);
    throw new Error("Erro ao enviar email de recuperação");
  }
}
