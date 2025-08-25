"use server"

import { Suspense } from "react";
import CalendarPage from "./calendar";
import { SkeletonCard } from "./skeletton";

interface CalendarServerProps {
}

// Função para gerar datas aleatórias entre hoje e 30 dias à frente
// async function generateRandomDisabledDates(count: number): Promise<Date[]> {
//   const disabledDates: Date[] = [];
//   const today = new Date();
//   const thirtyDaysLater = new Date();
//   thirtyDaysLater.setDate(today.getDate() + 30);
  
//   for (let i = 0; i < count; i++) {
//     const randomTimestamp = today.getTime() + 
//       Math.random() * (thirtyDaysLater.getTime() - today.getTime());
//     const randomDate = new Date(randomTimestamp);
//     // Resetamos a hora para meia-noite para comparar apenas datas
//     randomDate.setHours(0, 0, 0, 0);
//     disabledDates.push(randomDate);
//   }
  
//   return disabledDates;
// }

export default async function CalendarServer({}: CalendarServerProps) {
  // Gerar 10 datas taleatórias indisponíveis
  // const disabledDates = await generateRandomDisabledDates(10);

  const disabledDates = [
  new Date("2025-08-29T00:00:00.000Z"),
  new Date("2025-09-02T00:00:00.000Z"),
  new Date("2025-09-05T00:00:00.000Z"),
  new Date("2025-09-15T00:00:00.000Z"),
  new Date("2025-09-08T00:00:00.000Z"),
  new Date("2025-09-05T00:00:00.000Z"),
  new Date("2025-09-14T00:00:00.000Z"),
  new Date("2025-09-14T00:00:00.000Z"),
  new Date("2025-09-04T00:00:00.000Z"),
  new Date("2025-09-05T00:00:00.000Z")
]
  
  return (
    <Suspense fallback={<SkeletonCard/>}>
      <CalendarPage disabledDates={disabledDates} />
    </Suspense>
  );
}