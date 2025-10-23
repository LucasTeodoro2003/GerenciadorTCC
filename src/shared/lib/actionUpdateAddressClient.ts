"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateAddressClient(formData: FormData) {
  try {
    await db.address.update({
      where: { id: formData.get("id")?.toString() },
      data: {
        street: formData.get("street")?.toString(),
        number: formData.get("number")?.toString(),
        complement: formData.get("complement")?.toString(),
        district: formData.get("district")?.toString(),
        city: formData.get("city")?.toString(),
        state: formData.get("state")?.toString(),
        postalCode: formData.get("postalCode")?.toString(),
        isPrimary: true,
        updatedAt: new Date()
      },
    });
    revalidatePath('/clientApp/userApp')
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw new Error("Falha ao atualizar o usuário.");
  }
}
