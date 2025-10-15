"use server"
import { revalidatePath } from "next/cache";

export default async function SendMessage(address: string, service: string, data: string, user: string, plate: string, phone: string) {
  try {
    await fetch("https://api.talkaio.com/v0.1/message/send-text", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6InNxaXhFYXJkOEh4bU9SYU42ZmN0IiwiY2hhbm5lbElkIjoiQUJPOThOVnhvOHJIZmJ4TU1rZmgiLCJpYXQiOjE3NTk5NjQwNjN9.0xpQkn1qNJPqF1oTZJieLSV6khdgX52TnWvxbsE_CwY",
      },
      body: JSON.stringify({
        to: "5534992117868",
        text: `Serviço Agendado - ${service} - *PLACA: ${plate}* \nEndereço: ${address} \n*Data*: ${data} \n*Usuário*: ${user} \n*Telefone*: ${phone}`,
      }),
    });
    revalidatePath("/");
  } catch (error) {
    console.error("Erro ao mandar mensagem:", error);
    throw new Error("Falha ao mandar mensagem.");
  }
}
