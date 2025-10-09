"use server";

import { revalidatePath } from "next/cache";
import db from "./prisma";

export async function updateMessageService(formdate: FormData) {
  try {
    await db.serviceVehicleService.update({
      where: {
        id: formdate.get("serviceid")?.toString(),
      },
      data: {
        message: formdate.get("message")?.toString() || "",
        sendMessage: false,
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
