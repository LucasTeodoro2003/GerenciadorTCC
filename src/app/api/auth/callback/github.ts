"use server";

import { signIn } from "@/shared/lib/auth";

export async function SignUpGitHub() {
    await signIn("github")
  }