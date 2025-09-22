"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateServiceVehicle(formData: FormData) {
const data = new Date();
const dia = String(data.getDate()).padStart(2, '0');
const mes = String(data.getMonth() + 1).padStart(2, '0'); 
const ano = data.getFullYear();
const dataFormatada = `${dia}/${mes}/${ano}`;


  try {
    const serviceIdsString = formData.get("serviceIds")?.toString();
    const serviceIds = serviceIdsString ? (JSON.parse(serviceIdsString) as string[]) : [];
    const idServiceVehicle = formData.get("idServiceVehicle")?.toString() || "";
    const current = await db.serviceVehicleService.findMany({
      where: { serviceVehicleId: idServiceVehicle },
      select: { serviceId: true },
    });
    const currentIds = current.map((c) => c.serviceId);
    const toAdd = serviceIds.filter((id) => !!id && !currentIds.includes(id));
    const toRemove = currentIds.filter((id) => !serviceIds.includes(id));
    const validServices = await db.services.findMany({
      where: { id: { in: toAdd } },
      select: { id: true },
    });
    const validIds = validServices.map((s) => s.id);

    const serviceVehicle = await db.serviceVehicle.update({
      where: { id: idServiceVehicle },
      data: {
        totalValue: formData.get("valueTotal")?.toString() || "",
        discounts: formData.get("discount")?.toString() || "",
        addValue: formData.get("addition")?.toString() || "",
        obs: ("Atualizado por: ") + formData.get("userId")?.toString() + " => DATA: " + dataFormatada || "",
        services: {
          deleteMany: {
            serviceVehicleId: idServiceVehicle,
            serviceId: { in: toRemove },
          },
          create: validIds.map((serviceId) => ({
            service: { connect: { id: serviceId } },
          })),
        },
      },
      include: {
        services: { include: { service: true } },
      },
    });

    revalidatePath("/dashboard");
    return serviceVehicle;
  } catch (error) {
    console.error("Erro ao atualizar Serviços do Veículo:", error);
    throw new Error("Falha ao atualizar Serviços do Veículo.");
  }
}
