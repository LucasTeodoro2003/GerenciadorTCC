"use server"
import prisma from "@/shared/lib/prisma";
import { redirect } from "next/navigation";

export async function onSubmit(data: FormData) {
  const email = data.get("email");
  const password = data.get("password");

  console.log("Email recebido:", email);
  console.log("Senha recebida:", password);

  if (
    typeof email === "string" &&
    typeof password === "string" &&
    password.trim() !== ""
  ) {
    await prisma.user.create({
      data: { email, password },
    });
    console.log("Usuário criado no banco de dados!");
    redirect("/dashboard")
  } else {
    console.log("Email ou senha inválidos.");
  }
}
