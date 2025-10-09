"use server";

import { revalidatePath } from "next/cache";
import db from "./prisma";

export async function updateMessageTemplate(formdate: FormData) {
  try {
    await db.user.update({
      where: {
        id: formdate.get("userid")?.toString(),
      },
      data: {
        message: formdate.get("message")?.toString() || "",
        updatedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/message");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar a Mensagem:", error);
    return { success: false, error };
  }
}
