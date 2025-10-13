"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteCarClient(idforDelete: string) {
  try {
    await db.vehicle.delete({
        where: {id: idforDelete}
      },);
    revalidatePath("/clientApp/userApp");
  } catch (error) {
    console.error("Erro ao deletar veículo:", error);
    throw new Error("Falha ao deletar veículo.");
  }
}
