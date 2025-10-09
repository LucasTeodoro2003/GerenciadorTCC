"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function NumberProducts(formData: FormData) {
  try {
    await db.products.update({
      where: { id: formData.get("id")?.toString()},
      data: {
        amount: formData.get("value")?.toString(),
        updatedAt: new Date(),
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro ao atualizar o produto:", error);
    throw new Error("Falha ao atualizar o produto.");
  }
}