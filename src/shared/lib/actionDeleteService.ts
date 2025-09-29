"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteService(idforDelete: string) {
  try {
    await db.services.delete({
        where: {id: idforDelete}
      },);
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro ao deletar serviço:", error);
    throw new Error("Falha ao deletar serviço.");
  }
}
