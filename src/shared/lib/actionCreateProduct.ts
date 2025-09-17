"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(formData: FormData) {
  try {
    await db.products.create({
      data: {
        amount:formData.get("amount")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        price: formData.get("price")?.toString() || "",
        minAmout: formData.get("minAmount")?.toString() || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    throw new Error("Falha ao criar produto.");
  }
}
