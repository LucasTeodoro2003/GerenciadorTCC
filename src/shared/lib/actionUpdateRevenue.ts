"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateRevenue(id: string, formData: FormData) {
  try {
    // Verifica se é um registro de ServiceVehicle
    const serviceVehicle = await db.serviceVehicle.findUnique({
      where: { id },
    });

    if (serviceVehicle) {
      await db.serviceVehicle.update({
        where: { id },
        data: {
          totalValue: formData.get("amount")?.toString() || "",
          date: new Date(formData.get("date")?.toString() || ""),
        },
      });
      
      // Se for um serviço, pode querer atualizar a descrição no serviço relacionado
      if (serviceVehicle.serviceId) {
        await db.services.update({
          where: { id: serviceVehicle.serviceId },
          data: {
            description: formData.get("description")?.toString() || "",
          },
        });
      }
    } else {
      // Se não for ServiceVehicle, atualiza em otherRevenue
      await db.revenue.update({
        where: { id },
        data: {
          amount: formData.get("amount")?.toString() || "",
          date: new Date(formData.get("date")?.toString() || ""),
          description: formData.get("description")?.toString() || "",
          category: formData.get("category")?.toString() || "",
          source: formData.get("source")?.toString() || "",
          updatedAt: new Date(),
        },
      });
    }

    revalidatePath("/revenue");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar receita:", error);
    throw new Error("Falha ao atualizar receita.");
  }
}