"use server";

import { signIn } from "@/shared/lib/auth";

export async function sendgridAction(formData: FormData) {
  return signIn("resend", formData);
}
