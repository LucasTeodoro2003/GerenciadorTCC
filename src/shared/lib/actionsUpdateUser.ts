"use server";

import db from "@/shared/lib/prisma";

export async function updateUser(userId: string, newPermission: number) {
  try {
    await db.user.update({
      where: { id: userId },
      data: { permission: newPermission },
    });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw new Error("Falha ao atualizar o usuário.");
  }
}

import { revalidatePath } from "next/cache";
import { supabase } from "./supabaseServer";

export async function updateUser2(userId: string, formData: FormData) {
  try {
     const file = formData.get("image") as File | null;
      let imageUrl: string | null = null;
      if (file && file.size > 0) {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const fileExtension = file.name.split('.').pop() || 'png';
      const filePath = `${userId}/${Date.now()}.${fileExtension}`;

      const { error: uploadError } = await supabase.storage
        .from("usersImages") 
        .upload(filePath, fileBuffer, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from("usersImages")
        .getPublicUrl(filePath);

      imageUrl = publicData.publicUrl;
    }
    await db.user.update({
      where: { id: userId },
      data: {
        emailVerified: new Date() || "",
        name: formData.get("name")?.toString() || "",
        image: imageUrl ?? undefined,
        email: formData.get("email")?.toString() || "",
        phone: formData.get("phone")?.toString() || "",
        updatedAt: new Date()
      },
    });
    revalidatePath('/')
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    throw new Error("Falha ao atualizar o usuário.");
  }
}