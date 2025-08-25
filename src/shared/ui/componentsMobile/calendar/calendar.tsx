"use client"

import { useState, useEffect } from "react";
import { Calendar } from "../../components/calendar";

interface CalendarPageProps {
}

export default function CalendarPage({}: CalendarPageProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    const initialDate = new Date();
    setDate(initialDate);
    console.log("Data inicial selecionada:", formatDate(initialDate));
  }, []);

  const formatDate = (date: Date | undefined): string => {
    if (!date) return "Nenhuma data selecionada";
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
    console.log("Nova data selecionada:", formatDate(newDate));
  };

  if (!isClient) {
    return null;
  }

  return (
    <div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        className="rounded-lg border"
      />
      <div className="mt-4 text-sm text-gray-500">
        Data selecionada: {formatDate(date)}
      </div>
    </div>
  );
}