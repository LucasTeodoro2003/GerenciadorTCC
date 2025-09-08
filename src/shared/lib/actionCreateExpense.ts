"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createExpense(userId: string, formData: FormData) {
  try {
    await db.expense.create({
      data: {
        amount: formData.get("amount")?.toString() || "",
        date: formData.get("date")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        status: formData.get("status")?.toString() || "",
        category: formData.get("category")?.toString() || "",
        userId: userId,
        paymentMethod: formData.get("paymentMethod")?.toString() || "",

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro ao criar despesa:", error);
    throw new Error("Falha ao criar despesa.");
  }
}
