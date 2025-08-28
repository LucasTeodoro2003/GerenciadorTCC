"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { fileToBase64 } from "./convertImage";

export async function updateNameUser(userid: string, formData: FormData) {
  try {
    await db.user.update({
      where: { id: userid },
      data: {
        name: formData.get("name")?.toString(),
        updatedAt: new Date(),
        emailVerified: new Date(),
      },
    });
    revalidatePath('/')
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw new Error("Falha ao atualizar o usuário.");
  }
}
