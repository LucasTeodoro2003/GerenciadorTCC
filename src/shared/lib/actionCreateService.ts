"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { supabase } from "./supabaseServer";

export async function createService(formData: FormData) {
  try {const file = formData.get("image") as File | null;
        let imageUrl: string | null = null;
        if (file && file.size > 0) {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const fileExtension = file.name.split('.').pop() || 'png';
        const filePath = `Services-${formData.get("enterpriseId")}/${Date.now()}.${fileExtension}`;
  
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
    
    await db.services.create({
      data: {
        price: formData.get("price")?.toString() || "",
        description: formData.get("description")?.toString() || "",
        enterpriseId: formData.get("enterpriseId")?.toString() || "",
        minService: formData.get("minService")?.toString() || "",
        image: imageUrl || "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro ao criar serviço:", error);
    throw new Error("Falha ao criar serviço.");
  }
}
