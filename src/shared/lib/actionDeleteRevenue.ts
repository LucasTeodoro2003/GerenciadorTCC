"use server";

import { revalidatePath } from "next/cache";
import db from "./prisma";

export async function deleteRevenue(id: string) {
  try {
    const serviceVehicle = await db.serviceVehicle.findUnique({
      where: { id },
    });

    if (serviceVehicle) {
      await db.serviceVehicle.delete({
        where: { id },
      });
    } else {
      await db.revenue.delete({
        where: { id },
      });
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao excluir receita:", error);
    return { success: false, error };
  }
}