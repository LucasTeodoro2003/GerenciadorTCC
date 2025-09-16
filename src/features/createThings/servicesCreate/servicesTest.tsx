import { Button } from "@/shared/ui/components/button";
import { Calendar } from "@/shared/ui/components/calendar";
import { Label } from "@/shared/ui/components/label";
import { Toaster } from "@/shared/ui/components/sonner";
import { ServiceVehicle } from "@prisma/client";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { toast } from "sonner";

interface CreateServiceProps {
  disableDate: ServiceVehicle[];
}

export default function CreateService({ disableDate }: CreateServiceProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  const dates = disableDate
    .filter((e) => e.dateTime)
    .map((e) => e.dateTime)
    .toString()
    .split(",")
    .map((e) => new Date(e.trim()));
  console.log("AQUI: ", dates);

const handleSend = (date: Date | undefined, hour: number | null) => {
  if (!date || hour === null) {
    toast.error('Selecione uma data e hora');
    return;
  }
  const formattedDate = new Date(date);
  formattedDate.setHours(hour, 0, 0);
  toast.success('Enviado com Sucesso', {
    description: `Data Marcada: ${formattedDate.toLocaleString('pt-BR')}`,
  });
  setDate(new Date());
  setSelectedHour(null);
};

return (
  <div className="flex flex-col md:flex-row gap-4 w-full">
    <div className="w-full md:w-2/3">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border shadow-sm w-full h-full"
        captionLayout="dropdown"
        disabled={[...dates, { dayOfWeek: [6] }, { before: new Date() }]}
        locale={ptBR}
        classNames={{ disabled: "text-gray-600" }}
      />
    </div>
    
    <div className="w-full md:w-1/3 flex flex-col">
      <div className="border-2 border-gray-200 rounded-md p-4 h-full flex flex-col justify-between">
        <div className="space-y-4">
          <div>
            <Label className="block mb-2 font-medium">
              Hora
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 13 }, (_, i) => i + 6).map((hour) => (
                <Button 
                  key={hour}
                  variant="outline"
                  className={`py-2 ${selectedHour === hour ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setSelectedHour(hour)}
                >
                  {hour}:00
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full mt-4" 
          onClick={() => handleSend(date, selectedHour)}
        >
          ENVIAR
        </Button>
      </div>
    </div>
    
    <Toaster position="top-center" richColors />
  </div>
);
}
