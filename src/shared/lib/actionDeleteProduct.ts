"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteProduct(idforDelete: string) {
  try {
    await db.products.delete({
        where: {id: idforDelete}
      },);
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
    throw new Error("Falha ao deletar produto.");
  }
}
