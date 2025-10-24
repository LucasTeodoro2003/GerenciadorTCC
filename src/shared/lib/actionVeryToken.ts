"use server";
import db from "./prisma";
import { createHash } from "crypto";

export default async function VerifyToken(token: string, email: string) {
  const hashedToken = createHash("sha256")
    .update(`${token}${process.env.AUTH_SECRET}`)
    .digest("hex");
  try {
    const tokenData = await db.verificationToken.findUnique({
      where: {
        token: hashedToken,
        identifier: email,
        expires: { gt: new Date() },
      },
    });

    if (!tokenData) {
      throw new Error("Token inválido ou expirado");
    }
    const user = await db.user.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new Error("Usuário não encontrado");
    }
    const userid = user.id;
    return { userid };
  } catch (err) {
    console.error("Error verifying token:", err);
    throw new Error("Erro ao verificar token");
  }
}
