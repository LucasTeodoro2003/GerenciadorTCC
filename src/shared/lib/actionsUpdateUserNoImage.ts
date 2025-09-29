"use server";

import db from "@/shared/lib/prisma";

export async function updateUser(userId: string, newPermission: number) {
  try {
    await db.user.update({
      where: { id: userId },
      data: { permission: newPermission },
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw new Error("Falha ao atualizar o usuário.");
  }
}

import { revalidatePath } from "next/cache";

export async function updateUserNoImage(userId: string, formData: FormData) {
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        email: formData.get("email")?.toString() || "",
        phone: formData.get("phone")?.toString() || "",
        name: formData.get("name")?.toString() || "",
        emailVerified: new Date(),
        updatedAt: new Date(),
      },
    });
    revalidatePath("/");
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw new Error("Falha ao atualizar o usuário.");
  }
}
