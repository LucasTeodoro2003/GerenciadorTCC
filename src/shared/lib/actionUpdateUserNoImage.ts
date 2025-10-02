"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updatePerfilUserPageNoImage(formData: FormData) {
  try {
    await db.user.update({
      where: { id: formData.get("userId")?.toString() },
      data: {
        name: formData.get("name")?.toString(),
        email: formData.get("email")?.toString(),
        phone: formData.get("phone")?.toString(),
        updatedAt: new Date()
      },
    });
    revalidatePath('/dashboard')
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw new Error("Falha ao atualizar o usuário.");
  }
}
