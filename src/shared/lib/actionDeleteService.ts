"use server";

import db from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { supabase } from "./supabaseServer";

export async function deleteService(idforDelete: string) {
  try {
    const service = await db.services.findUnique({
      where: { id: idforDelete },
      select: { image: true },
    });

    if (service?.image) {
      const relativePath = service.image.split("/usersImages/")[1];

      if (relativePath) {
        const { error: deleteError } = await supabase.storage
          .from("usersImages")
          .remove([relativePath]);

        if (deleteError) {
          console.error("Erro ao deletar imagem do Storage:", deleteError);
        }
      }
    }
    await db.services.delete({
        where: {id: idforDelete}
      },);
    revalidatePath("/dashboard");
  } catch (error) {
    console.error("Erro ao deletar serviço:", error);
    throw new Error("Falha ao deletar serviço.");
  }
}
