"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteExpense(idforDelete: string) {
  try {
    await db.expense.delete({
        where: {id: idforDelete}
      },);
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro ao deletar despesa:", error);
    throw new Error("Falha ao deletar despesa.");
  }
}
