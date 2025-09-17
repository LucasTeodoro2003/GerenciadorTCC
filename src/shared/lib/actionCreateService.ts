"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createService(formData: FormData) {
  try {
    await db.services.create({
      data: {
        price: formData.get("price")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    throw new Error("Falha ao criar serviço.");
  }
}
