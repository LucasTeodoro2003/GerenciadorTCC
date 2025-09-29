"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function edityProduct(formData: FormData) {
  try {
    await db.products.update({
      where: { id: formData.get("idproduct")?.toString() || "" },
      data: {
        description: formData.get("description")?.toString() || "",
        amount: formData.get("amount")?.toString() || "",
        price: formData.get("price")?.toString() || "",
        minAmout: formData.get("minAmount")?.toString() || "",
        updatedAt: new Date(),
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    throw new Error("Falha ao atualizar o produto.");
  }
}