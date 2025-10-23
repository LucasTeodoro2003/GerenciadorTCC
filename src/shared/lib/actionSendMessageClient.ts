"use server";
import { revalidatePath } from "next/cache";

export default async function SendMessageClient(
  address: string,
  service: string,
  data: string,
  user: string,
  plate: string,
  phone: string,
  wantsSearchService: boolean,
  totalTime: number
) {
  if (wantsSearchService) {
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
          text: `✅ *AGENDAMENTO CONFIRMADO!* ✅\n\n🏎️ *ALVORADA ESTÉTICA AUTOMOTIVA* 🏎️\n\nOlá! Seu serviço foi agendado com sucesso! 🎉\n\n📋 *DETALHES DO AGENDAMENTO*:\n📍 *Endereço*: ${address}\n📅 *Data*: ${data}\n👤 *Cliente*: ${user}\n📞 *Telefone*: ${phone}\n🚗 *Veículo - Placa*: ${plate}\n🔧 *Serviço(s)*: ${service}\n*Tempo Total Estimado*: ${totalTime} minutos\n\n🙏 Agradecemos pela preferência! Estamos ansiosos para recebê-lo(a)!\n\n🔔 *ALVORADA ESTÉTICA AUTOMOTIVA* - Cuidando do seu veículo com excelência! 🌟\n\n\nℹ️*EM BREVE SEU VEÍCULO SERÁ BUSCADO* ℹ️`,
        }),
      });
      revalidatePath("/");
    } catch (error) {
      console.error("Erro ao mandar mensagem:", error);
      throw new Error("Falha ao mandar mensagem.");
    }
  } else {
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
          text: `✅ *AGENDAMENTO CONFIRMADO!* ✅\n\n🏎️ *ALVORADA ESTÉTICA AUTOMOTIVA* 🏎️\n\nOlá! Seu serviço foi agendado com sucesso! 🎉\n\n📋 *DETALHES DO AGENDAMENTO*:\n📍 *Endereço*: ${address}\n📅 *Data*: ${data}\n👤 *Cliente*: ${user}\n📞 *Telefone*: ${phone}\n🚗 *Veículo - Placa*: ${plate}\n🔧 *Serviço(s)*: ${service}\n*Tempo Total Estimado*: ${totalTime} minutos\n\n🙏 Agradecemos pela preferência! Estamos ansiosos para recebê-lo(a)!\n\n🔔 *ALVORADA ESTÉTICA AUTOMOTIVA* - Cuidando do seu veículo com excelência! 🌟`,
        }),
      });
      revalidatePath("/");
    } catch (error) {
      console.error("Erro ao mandar mensagem:", error);
      throw new Error("Falha ao mandar mensagem.");
    }
  }
}
