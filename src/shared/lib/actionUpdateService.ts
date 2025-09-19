"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function FinishedService(idUpdate: string, formData: FormData) {
  try {
    await db.serviceVehicleService.update({
      where: { id: idUpdate },
      data: {
        finished: Boolean(formData.get("finished")?.toString()) || false,
        updatedAt: new Date(),
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);
    throw new Error("Falha ao atualizar o serviço.");
  }
}