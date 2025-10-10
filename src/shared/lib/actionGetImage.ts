"use server"
import db from "./prisma";

export default async function GetImage(idservice: string) {
  try {
    const image = await db.services.findUnique({
      where: { id: idservice },
      select: { image: true },
    });
    return image;
  } catch (err) {
    console.error("Erro ao buscar imagem: ", err);
    throw new Error("Erro ao buscar Imagem");
  }
}
