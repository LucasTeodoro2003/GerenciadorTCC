"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createServiceVehicle(formData: FormData) {
  try {
    const serviceIdsString = formData.get("serviceIds")?.toString();
    const serviceIds = serviceIdsString ? JSON.parse(serviceIdsString) as string[] : [];
    const serviceVehicle = await db.serviceVehicle.create({
      data: {
        dateTime: new Date(formData.get("dateTime")?.toString() || new Date().toISOString()),
        totalValue: formData.get("totalValue")?.toString() || "",
        vehicleId: formData.get("vehicleId")?.toString() || "",
        enterpriseId: formData.get("enterpriseId")?.toString() || "",
        addValue: formData.get("addValue")?.toString() || "",
        services: {
          create: serviceIds.map((serviceId: string) => ({
            service: {
              connect: { id: serviceId }
            }
          }))
        },
        
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    revalidatePath("/dashboard");
    return serviceVehicle;
  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    throw new Error("Falha ao criar agendamento de serviço.");
  }
}