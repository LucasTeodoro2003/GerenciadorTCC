"use server";

import db from "@/shared/lib/prisma";
import bcrypt from "bcryptjs";

export async function resetUser(userId: string) {
  try {
      const password = "123456789"
      const hash = bcrypt.hashSync(password, 10);
      
    await db.user.update({
      where: { id: userId },
      data: { password: hash },
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw new Error("Falha ao atualizar o usuário.");
  }
}
