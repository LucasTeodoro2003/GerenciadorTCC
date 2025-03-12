"use server";

import { signIn } from "@/shared/lib/auth";

export async function SignIn(formData: FormData) {
    signIn("forwardemail", formData)
  }