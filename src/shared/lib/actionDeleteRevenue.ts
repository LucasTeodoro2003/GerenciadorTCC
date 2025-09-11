"use server";

import { revalidatePath } from "next/cache";
import db from "./prisma";

export async function deleteRevenue(id: string) {
  try {
    // Verifica se é um registro de ServiceVehicle
    const serviceVehicle = await db.serviceVehicle.findUnique({
      where: { id },
    });

    if (serviceVehicle) {
      await db.serviceVehicle.delete({
        where: { id },
      });
    } else {
      // Se não for ServiceVehicle, tenta deletar de otherRevenue
      await db.revenue.delete({
        where: { id },
      });
    }

    revalidatePath("/revenue");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir receita:", error);
    return { success: false, error };
  }
}