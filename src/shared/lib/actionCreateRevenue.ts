"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createRevenue(userId: string, formData: FormData) {
  try {
    await db.revenue.create({
      data: {
        amount: formData.get("amount")?.toString() || "",
        date: new Date(formData.get("date")?.toString() || new Date().toISOString()),
        description: formData.get("description")?.toString() || "",
        category: formData.get("category")?.toString() || "",
        source: formData.get("source")?.toString() || "",
        userId: userId,
        
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro ao criar receita:", error);
    throw new Error("Falha ao criar receita.");
  }
}