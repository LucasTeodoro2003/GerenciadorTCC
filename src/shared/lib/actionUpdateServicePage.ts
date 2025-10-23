"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateService(formData: FormData) {
  try {
    await db.services.update({
      where: { id: formData.get("idservice")?.toString() || "" },
      data: {
        description: formData.get("description")?.toString() || "",
        price: formData.get("price")?.toString() || "",
        minService: formData.get("minService")?.toString() || "",
        updatedAt: new Date(),
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);
    throw new Error("Falha ao atualizar o serviço.");
  }
}