"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateRevenue(id: string, formData: FormData) {
  try {
    const serviceVehicle = await db.serviceVehicle.findUnique({
      where: { id },
      include: {
        services: {
          include: {
            service: true
          }
        }
      }
    });

    if (serviceVehicle) {
      await db.serviceVehicle.update({
        where: { id },
        data: {
          totalValue: formData.get("amount")?.toString() || "",
          dateTime: new Date(formData.get("date")?.toString() || new Date().toISOString()),
        },
      });
      
      const descriptionUpdate = formData.get("description")?.toString();
      
      if (descriptionUpdate && serviceVehicle.services.length > 0) {
        const firstServiceRelation = serviceVehicle.services[0];
        
        if (firstServiceRelation && firstServiceRelation.service) {
          await db.services.update({
            where: { id: firstServiceRelation.serviceId },
            data: {
              description: descriptionUpdate,
            },
          });
        }
        for (const serviceRelation of serviceVehicle.services) {
          await db.services.update({
            where: { id: serviceRelation.serviceId },
            data: {
              description: descriptionUpdate,
            },
          });
        }
      }
    } else {
      await db.revenue.update({
        where: { id },
        data: {
          amount: formData.get("amount")?.toString() || "",
          date: new Date(formData.get("date")?.toString() || new Date().toISOString()),
          description: formData.get("description")?.toString() || "",
          category: formData.get("category")?.toString() || "",
          source: formData.get("source")?.toString() || "",
          updatedAt: new Date(),
        },
      });
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar receita:", error);
    throw new Error("Falha ao atualizar receita.");
  }
}