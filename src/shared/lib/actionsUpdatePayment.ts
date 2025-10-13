"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updatePayment(serviceid: string) {
  try {
    await db.serviceVehicleService.update({
      where: { id: serviceid },
      data:{
        pay: true
      }
    });
    revalidatePath("/dashboard")
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw new Error("Falha ao atualizar o usuário.");
  }
}