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
import { fileToBase64 } from "./convertImage";

export async function updateUser2(userId: string, formData: FormData) {
  try {
    await db.user.update({
      where: { id: userId },
      data: {
        emailVerified: new Date() || "",
        name: formData.get("name")?.toString() || "",
        image: await fileToBase64(formData.get("image") as File) || "",
        email: formData.get("email")?.toString() || "",
        phone: formData.get("phone")?.toString() || "",
        updatedAt: new Date()
      },
    });
    revalidatePath('/')
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw new Error("Falha ao atualizar o usuário.");
  }
}