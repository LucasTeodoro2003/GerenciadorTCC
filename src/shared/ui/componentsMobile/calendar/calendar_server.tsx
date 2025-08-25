"use server"

import { Suspense } from "react";
import CalendarPage from "./calendar";

interface CalendarServerProps {
}

export default async function CalendarServer({}: CalendarServerProps) {
  return (
    <Suspense fallback={<div>Carregando calendário...</div>}>
      <CalendarPage />
    </Suspense>
  );
}