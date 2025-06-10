"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserTable(userId: string, newPermission: number) {
  try {
    await db.user.update({
      where: { id: userId },
      data: { permission: newPermission },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw new Error("Falha ao atualizar o usuário.");
  }
}