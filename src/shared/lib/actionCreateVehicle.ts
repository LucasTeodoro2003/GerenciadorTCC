"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createVehicle(formData: FormData) {
  try {
    await db.vehicle.create({
      data: {
        plate: formData.get("plate")?.toString() || "",
        type: formData.get("type")?.toString() || "",
        color: formData.get("color")?.toString() || "",
        yearCar: formData.get("year")?.toString() || "",
        userId: formData.get("user")?.toString() || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro ao criar veículo:", error);
    throw new Error("Falha ao criar veículo.");
  }
}
