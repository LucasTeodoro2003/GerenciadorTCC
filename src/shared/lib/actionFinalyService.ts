"use server";
import { revalidatePath } from "next/cache";

export default async function SendMessageFinaly(
  user: string,
  phone: string,
) {
    try {
      await fetch("https://api.talkaio.com/v0.1/message/send-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6InNxaXhFYXJkOEh4bU9SYU42ZmN0IiwiY2hhbm5lbElkIjoiQUJPOThOVnhvOHJIZmJ4TU1rZmgiLCJpYXQiOjE3NTk5NjQwNjN9.0xpQkn1qNJPqF1oTZJieLSV6khdgX52TnWvxbsE_CwY",
        },
        body: JSON.stringify({
          to: `55${phone}`,
          text: `👋 Olá ${user}, tudo bem?\n\n🚗 Lembra do seu carro? Temos ótimas notícias! 🎉\n\n🔧 *Seus serviços foram finalizados com sucesso!* \n\n🏁 *Agradecemos por confiar em nossos serviços!*\n⭐ *Até a próxima!* 😉`
        }),
      });
      revalidatePath("/");
    } catch (error) {
      console.error("Erro ao mandar mensagem:", error);
      throw new Error("Falha ao mandar mensagem.");
    }
}
