"use server"

import db from "./prisma";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email: email.toLowerCase()
      }
    });
    
    return user;
  } catch (error) {
    console.error("Erro ao buscar usuário por email:", error);
    return null;
  }
};