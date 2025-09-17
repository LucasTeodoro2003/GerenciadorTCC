"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createAddress(formData: FormData) {
  try {
    await db.address.create({
      data: {
        userId: formData.get("userId")?.toString() || "",
        street:  formData.get("street")?.toString() || "",
        district:  formData.get("district")?.toString() || "",
        city:  formData.get("city")?.toString() || "",
        state:  formData.get("state")?.toString() || "",
        postalCode:  formData.get("postalCode")?.toString() || "",
        isPrimary:  Boolean(formData.get("isPrimary")?.toString()) || true,
        number:  formData.get("number")?.toString() || "",
        complement:  formData.get("complement")?.toString() || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro ao criar endereço:", error);
    throw new Error("Falha ao criar endereço.");
  }
}
