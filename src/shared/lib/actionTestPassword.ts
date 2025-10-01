"use server";

import db from "@/shared/lib/prisma";
import bcrypt from "bcryptjs";

export async function testPassword(email: string, plainPassword: string) {
  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return false;
    }
    const isMatch = await bcrypt.compare(plainPassword, user.password);
    return isMatch;
  } catch (err) {
    console.error("Erro ao validar senha:", err);
    return false;
  }
}
