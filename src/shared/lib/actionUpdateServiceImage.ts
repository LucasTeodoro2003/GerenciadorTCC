"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { supabase } from "./supabaseServer";

export async function updateServiceImage(formData: FormData) {
  try {
    const file = formData.get("image") as File | null;
          let imageUrl: string | null = null;
          if (file && file.size > 0) {
          const fileBuffer = Buffer.from(await file.arrayBuffer());
          const fileExtension = file.name.split('.').pop() || 'png';
          const filePath = `Service-${formData.get("idservice")}/${Date.now()}.${fileExtension}`;
    
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

    await db.services.update({
      where: { id: formData.get("idservice")?.toString() || "" },
      data: {
        description: formData.get("description")?.toString() || "",
        price: formData.get("price")?.toString() || "",
        image: imageUrl,
        minService: formData.get("minService")?.toString() || "",
        updatedAt: new Date(),
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro ao atualizar serviço:", error);
    throw new Error("Falha ao atualizar o serviço.");
  }
}