import { Calendar } from "@/shared/ui/components/calendar";
import { useState } from "react";
import { ptBR } from "date-fns/locale";
import { Prisma } from "@prisma/client";

interface CalendarIconsProps{
    calendar: Prisma.UserGetPayload<{include:{vehicle:{include:{serviceVehicle:{}}}}}>[]
}

export default function CalendarIcons({calendar}:CalendarIconsProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  console.log("AQUI: ",calendar)

  return (
      <div className="flex w-full md:w-7/12">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate);
          }}
          className="rounded-md border shadow-sm w-full h-full"
          captionLayout="dropdown"
          disabled={[
            { dayOfWeek: [6] },
            { before: new Date() },
          ]}
          locale={ptBR}
          classNames={{ disabled: "text-gray-600" }}
        />
      </div>
  );
}
