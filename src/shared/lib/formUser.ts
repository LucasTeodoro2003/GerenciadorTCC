"use server"
import { redirect } from "next/navigation";
import prisma from "./prisma";

export async function onSubmit(data: FormData) {
    const email = data.get("email");
    const password = (data.get("password"));
    console.log("Email recebido:", email);
    console.log("Senha recebido:", password);
    
    
    if (email === "string" && password === "string") {
        await prisma.user.create({
            data: { email, password }
      });
      console.log("Usuário criado no banco de dados!");
      redirect("/dashboard")
    }
  }
  