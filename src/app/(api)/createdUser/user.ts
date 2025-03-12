"use server"

import prisma from "@/shared/lib/prisma";
import { redirect } from "next/navigation";

if (typeof email === "string" && typeof password === "string" && password.trim() !== "") {
await prisma.user.create({
          data: { email, password }
      });
      console.log("Usuário criado no banco de dados!");
      redirect("/dashboard");
  } else {
      console.log("Email ou senha inválidos.");
  }
