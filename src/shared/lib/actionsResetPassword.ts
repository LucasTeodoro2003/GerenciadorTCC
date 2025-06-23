"use server";

import db from "@/shared/lib/prisma";

export async function resetUser(userId: string) {
  try {
    await db.user.update({
      where: { id: userId },
      data: { password: "00000000" },
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw new Error("Falha ao atualizar o usuário.");
  }
}
