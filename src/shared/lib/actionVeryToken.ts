import db from "./prisma";
import { createHash } from "crypto";

export default async function VerifyToken(token: string, email: string) {
    const hashedToken = createHash("sha256")
      .update(`${token}${process.env.AUTH_SECRET}`)
      .digest("hex");
console.log("Token recebido:", token);
console.log("Token hasheado:", hashedToken);
    try{
        const tokenData = await db.verificationToken.findUnique({
            where:{token: hashedToken, identifier: email, expires: {gt: new Date()}}
        })

        if(!tokenData){
            throw new Error("Token inválido ou expirado");
        }
    
        return true;
    }catch(err){
        console.error("Error verifying token:", err);
        throw new Error("Erro ao verificar token");
    }
}