"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateExpense(idUpdate: string, formData: FormData) {
  try {
    await db.expense.update({
      where: { id: idUpdate },
      data: {
        amount: parseFloat(formData.get("amount")?.toString() || ""),
        date: formData.get("date")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        status: formData.get("status")?.toString() || "",
        category: formData.get("category")?.toString() || "",
        paymentMethod: formData.get("paymentMethod")?.toString() || "",
        updatedAt: new Date(),
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw new Error("Falha ao atualizar o usuário.");
  }
}