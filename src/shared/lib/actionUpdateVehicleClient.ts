"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function edityVehicleClient(formData: FormData) {
  try {
    await db.vehicle.update({
      where: { id: formData.get("idvehicle")?.toString() || "" },
      data: {
        model: formData.get("model")?.toString() || "",
        plate: formData.get("plate")?.toString() || "",
        type: formData.get("type")?.toString() || "",
        color: formData.get("color")?.toString() || "",
        yearCar: formData.get("year")?.toString() || "",
        userId: formData.get("user")?.toString() || "",
        updatedAt: new Date(),
      },
    });
    revalidatePath("/clientApp/userApp");
  } catch (error) {
    console.error("Erro ao atualizar veículo:", error);
    throw new Error("Falha ao atualizar o veículo.");
  }
}