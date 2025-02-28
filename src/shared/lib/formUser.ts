"use cliente"
import prisma from "./prisma";

export async function onSubmit(data: FormData) {
    const email = data.get("email");
    console.log("Email recebido:", email);
    
    
    if (typeof email === "string") {
        await prisma.user.create({
            data: { email },
      });
      console.log("Usuário criado no banco de dados!");
    }
  }
  