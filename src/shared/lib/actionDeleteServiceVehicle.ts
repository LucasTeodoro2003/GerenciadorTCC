"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteServiceVehicle(idforDelete: string) {
  try {
    await db.serviceVehicle.delete({
        where: {id: idforDelete}
      },);
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro ao deletar serviço:", error);
    throw new Error("Falha ao deletar serviço.");
  }
}
