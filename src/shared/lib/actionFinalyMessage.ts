"use server";

import { revalidatePath } from "next/cache";
import db from "./prisma";

export async function finalyMessage(serviceid: string) {
  try {
    await db.serviceVehicleService.update({
      where: {
        id: serviceid,
      },
      data: {
        sendMessage: true,
      },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar a Mensagem:", error);
    return { success: false, error };
  }
}
