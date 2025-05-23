"use server";

import { signIn } from "@/shared/lib/auth";

export async function SignUpGoogle() {
    await signIn("google")
  }