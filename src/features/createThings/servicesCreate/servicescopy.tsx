"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/shared/ui/components/button";
import { Calendar } from "@/shared/ui/components/calendar";
import { Label } from "@/shared/ui/components/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/components/popover";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

// ============================================================
// CONFIGURAÇÃO IMPORTANTE - AJUSTE ESTES VALORES CONFORME NECESSÁRIO
// ============================================================
// Número máximo de carros que podem ser atendidos em um mesmo horário
const MAX_CARS_PER_HOUR = 1 as const; 

// Número máximo de carros que podem ser atendidos em um mesmo dia
const MAX_CARS_PER_DAY = 1 as const;
// ============================================================

interface ServicesCreateProps {
  disableDates: {
    date: string;
    time: string;
  }[];
}

// Definimos os horários disponíveis para agendamento (das 8h às 18h, a cada 30 minutos)
const AVAILABLE_HOURS = Array.from({ length: 21 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8;
  const minute = (i % 2) * 30;
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
});

interface DateStats {
  totalBookings: number;
  bookingsByHour: Map<string, number>;
  fullyBookedHours: number;
}

export default function ServicesCreate({ disableDates }: ServicesCreateProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [time, setTime] = React.useState<string>("");
  
  // Console.log para exibir as datas recebidas do banco
  React.useEffect(() => {
    console.log('============= DADOS RECEBIDOS DO BANCO =============');
    console.log('Total de registros:', disableDates.length);
    
    if (disableDates.length > 0) {
      console.log('Estrutura do primeiro registro:', disableDates[0]);
      
      console.log('\nListagem completa de datas:');
      disableDates.forEach((item, index) => {
        console.log(`[${index}] Original:`, item);
      });
    } else {
      console.log('Nenhum registro de data encontrado no banco.');
    }
    
    console.log('====================================================');
  }, [disableDates]);
  
  // Converter as datas do banco para um formato mais fácil de trabalhar
  const bookedAppointments = React.useMemo(() => {
    return disableDates.map(item => {
      // Obter a data e o horário dos campos específicos
      const dateStr = item.date;  // formato YYYY-MM-DD
      const timeStr = item.time;  // formato HH:MM:SS
      
      // Criar um objeto Date a partir da combinação de data e hora
      const [year, month, day] = dateStr.split('-').map(Number);
      const [hours, minutes, seconds] = timeStr.split(':').map(Number);
      
      // Criar uma data com o ano, mês (0-11) e dia
      const dateObj = new Date(year, month - 1, day, hours, minutes, seconds);
      
      console.log('Processando item:', item);
      console.log('Data parseada:', `${year}-${month}-${day}`);
      console.log('Hora parseada:', `${hours}:${minutes}:${seconds}`);
      console.log('Date object criado:', dateObj);
      console.log('Date string formato ISO:', dateObj.toISOString());
      
      return {
        date: dateObj,
        dateString: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
        timeString: timeStr
      };
    });
  }, [disableDates]);
  
  // Calcular estatísticas de agendamentos por data
  const bookingStatsByDate = React.useMemo(() => {
    const stats = new Map<string, DateStats>();
    
    // Inicializar estatísticas para cada data única
    const uniqueDates = new Set(bookedAppointments.map(a => a.dateString));
    uniqueDates.forEach(dateStr => {
      stats.set(dateStr, {
        totalBookings: 0,
        bookingsByHour: new Map<string, number>(),
        fullyBookedHours: 0
      });
    });
    
    // Preencher as estatísticas
    bookedAppointments.forEach(appointment => {
      const dateStats = stats.get(appointment.dateString);
      if (dateStats) {
        // Incrementar total de agendamentos para a data
        dateStats.totalBookings++;
        
        // Incrementar contagem para o horário específico
        const currentHourCount = dateStats.bookingsByHour.get(appointment.timeString) || 0;
        dateStats.bookingsByHour.set(appointment.timeString, currentHourCount + 1);
        
        // Verificar se o horário está totalmente ocupado
        if ((currentHourCount + 1) >= MAX_CARS_PER_HOUR) {
          dateStats.fullyBookedHours++;
        }
      }
    });
    
    return stats;
  }, [bookedAppointments]);
  
  // Console.log para mostrar os dados processados
  React.useEffect(() => {
    console.log('============= DADOS PROCESSADOS =============');
    console.log('Agendamentos após processamento:');
    
    // Mostrar estatísticas por data
    bookingStatsByDate.forEach((stats, dateStr) => {
      console.log(`Data: ${dateStr}`);
      console.log(`  Total de agendamentos: ${stats.totalBookings}/${MAX_CARS_PER_DAY} (limite diário)`);
      console.log(`  Horas totalmente ocupadas: ${stats.fullyBookedHours}/${AVAILABLE_HOURS.length}`);
      
      console.log('  Detalhamento por hora:');
      AVAILABLE_HOURS.forEach(hour => {
        const count = stats.bookingsByHour.get(hour) || 0;
        const isFullyBooked = count >= MAX_CARS_PER_HOUR;
        console.log(`    ${hour.substring(0, 5)}: ${count}/${MAX_CARS_PER_HOUR} carros ${isFullyBooked ? '(LOTADO)' : ''}`);
      });
    });
    
    console.log('===========================================');
  }, [bookingStatsByDate]);
  
  // Calcular quais datas estão totalmente ocupadas (por hora ou por limite diário)
  const fullyBookedDates = React.useMemo(() => {
    const fullyBooked: Date[] = [];
    
    bookingStatsByDate.forEach((stats, dateStr) => {
      // Uma data está totalmente ocupada se:
      // 1. Todos os horários estiverem ocupados OU
      // 2. O número total de agendamentos atingiu o limite diário
      const isFullyBookedByHours = stats.fullyBookedHours >= AVAILABLE_HOURS.length;
      const isFullyBookedByDailyLimit = stats.totalBookings >= MAX_CARS_PER_DAY;
      
      if (isFullyBookedByHours || isFullyBookedByDailyLimit) {
        const [year, month, day] = dateStr.split('-').map(Number);
        fullyBooked.push(new Date(year, month - 1, day));
        
        // Log para depuração
        if (isFullyBookedByHours) {
          console.log(`Data ${dateStr} está lotada: Todos os horários estão ocupados`);
        }
        if (isFullyBookedByDailyLimit) {
          console.log(`Data ${dateStr} está lotada: Limite diário de ${MAX_CARS_PER_DAY} carros atingido`);
        }
      }
    });
    
    return fullyBooked;
  }, [bookingStatsByDate]);
  
  // Console.log para mostrar as datas completamente ocupadas
  React.useEffect(() => {
    console.log('Datas completamente ocupadas:', fullyBookedDates.map(d => format(d, 'yyyy-MM-dd')));
  }, [fullyBookedDates]);
  
  // Calcular os horários disponíveis para a data selecionada
  const availableTimes = React.useMemo(() => {
    if (!date) return AVAILABLE_HOURS;
    
    const selectedDateStr = format(date, 'yyyy-MM-dd');
    const dateStats = bookingStatsByDate.get(selectedDateStr);
    
    // Se a data não tem agendamentos, todos os horários estão disponíveis
    if (!dateStats) return AVAILABLE_HOURS;
    
    // Se o limite diário foi atingido, nenhum horário está disponível
    if (dateStats.totalBookings >= MAX_CARS_PER_DAY) {
      console.log(`Data ${selectedDateStr} atingiu o limite diário de ${MAX_CARS_PER_DAY} carros`);
      return [];
    }
    
    // Filtrar apenas horários que não atingiram o limite por hora
    return AVAILABLE_HOURS.filter(timeStr => {
      const bookingsCount = dateStats.bookingsByHour.get(timeStr) || 0;
      return bookingsCount < MAX_CARS_PER_HOUR;
    });
  }, [date, bookingStatsByDate]);
  
  // Console.log para análise de horários para a data selecionada
  React.useEffect(() => {
    if (!date) return;
    
    const selectedDateStr = format(date, 'yyyy-MM-dd');
    const dateStats = bookingStatsByDate.get(selectedDateStr);
    
    console.log('=== ANÁLISE DE HORÁRIOS PARA A DATA SELECIONADA ===');
    console.log(`Data: ${selectedDateStr}`);
    
    if (!dateStats) {
      console.log('Nenhum agendamento registrado para esta data');
      console.log('Todos os horários estão disponíveis');
      return;
    }
    
    console.log(`Total de agendamentos: ${dateStats.totalBookings}/${MAX_CARS_PER_DAY} (limite diário)`);
    
    if (dateStats.totalBookings >= MAX_CARS_PER_DAY) {
      console.log('⚠️ LIMITE DIÁRIO ATINGIDO - NENHUM HORÁRIO DISPONÍVEL');
    } else {
      console.log(`Horários disponíveis: ${availableTimes.length}/${AVAILABLE_HOURS.length}`);
      
      AVAILABLE_HOURS.forEach(timeStr => {
        const bookingsCount = dateStats.bookingsByHour.get(timeStr) || 0;
        const isAvailable = bookingsCount < MAX_CARS_PER_HOUR;
        console.log(
          `${timeStr.substring(0, 5)} - ${bookingsCount}/${MAX_CARS_PER_HOUR} carros ${isAvailable ? '✅ DISPONÍVEL' : '❌ INDISPONÍVEL'}`
        );
      });
    }
  }, [date, bookingStatsByDate, availableTimes]);
  
  // Atualizar o horário selecionado quando mudar a data ou os horários disponíveis
  React.useEffect(() => {
    // Se o horário atual não estiver disponível, selecione o primeiro disponível
    if (availableTimes.length > 0 && (!time || !availableTimes.includes(time))) {
      setTime(availableTimes[0]);
    } else if (availableTimes.length === 0) {
      setTime("");
    }
  }, [availableTimes, time]);
  
  // Combinação de data e hora para o banco de dados
  const getFormattedDateTime = React.useCallback(() => {
    if (!date || !time) return null;
    
    // Extraímos as partes da hora do input de tempo
    const [hours, minutes, seconds] = time.split(':').map(Number);
    
    // Criamos uma nova data com a data selecionada e a hora do input
    const dateObj = new Date(date);
    dateObj.setHours(hours, minutes, seconds);
    
    // Extrair os componentes da data
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1; // +1 pois getMonth retorna 0-11
    const day = dateObj.getDate();
    
    // Formatamos para o formato que o banco espera
    return {
      dateString: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
      timeString: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      fullDateTime: dateObj.toISOString()
    };
  }, [date, time]);

  // Efeito para logar os valores quando mudam
  React.useEffect(() => {
    const formattedDateTime = getFormattedDateTime();
    if (formattedDateTime) {
      console.log("Data para DB:", formattedDateTime.dateString);
      console.log("Hora para DB:", formattedDateTime.timeString);
      console.log("Data e Hora completa:", formattedDateTime.fullDateTime);
    }
  }, [date, time, getFormattedDateTime]);

  // Função de ajuda para verificar com segurança os dados da data selecionada
  const getDateStatus = (selectedDate: Date | undefined) => {
    if (!selectedDate) return null;
    
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    const stats = bookingStatsByDate.get(dateStr);
    
    return stats ? {
      totalBookings: stats.totalBookings,
      isFullyBooked: stats.totalBookings >= MAX_CARS_PER_DAY,
      maxCarsPerDay: MAX_CARS_PER_DAY
    } : null;
  };

  // Obtém o status da data selecionada
  const selectedDateStatus = React.useMemo(() => getDateStatus(date), [date, bookingStatsByDate]);

  return (
    <div className="w-full max-w-md border-2 border-white p-4 rounded-lg">
      <div className="flex items-center justify-center w-full pb-4 text-lg font-medium">
        Criar Serviço
      </div>

      
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Label
            htmlFor="date-picker"
            className="items-center flex justify-center"
          >
            Data
          </Label>
          <div className="px-2 py-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date-picker"
                  className="w-full justify-between font-normal"
                >
                  {date ? format(date, "PP", { locale: ptBR }) : "Selecione uma Data"}
                  <ChevronDownIcon className="h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  locale={ptBR}
                  onSelect={(date) => {
                    setDate(date);
                    setOpen(false);
                  }}
                  disabled={(date) => {
                    // Desabilita datas no passado
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    if (date < today) return true;
                    
                    // Desabilita datas completamente ocupadas (por hora ou limite diário)
                    return fullyBookedDates.some(bookedDate => isSameDay(bookedDate, date));
                  }}
                  classNames={{
                    day_disabled: "text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/20",
                  }}
                  footer={
                    fullyBookedDates.length > 0 ? (
                      <p className="p-2 text-center text-sm text-muted-foreground">
                        As datas não selecionaváveis estão totalmente ocupadas.
                      </p>
                    ) : null
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <Label
            htmlFor="time-picker"
            className="items-center flex justify-center"
          >
            Hora
          </Label>
          {date ? (
            availableTimes.length > 0 ? (
              <select
                id="time-picker"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 rounded-md border border-input bg-background"
              >
                <option value="" disabled>Selecione um horário</option>
                {availableTimes.map((timeOption) => (
                  <option key={timeOption} value={timeOption}>
                    {timeOption.substring(0, 5)}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-red-500 text-sm p-2 bg-red-100/20 dark:bg-red-900/20 rounded-md">
                Não há horários disponíveis para esta data.
                {selectedDateStatus?.isFullyBooked && (
                  <span className="block mt-1 font-medium">
                    Limite diário de {MAX_CARS_PER_DAY} carros atingido.
                  </span>
                )}
              </p>
            )
          ) : (
            <p className="text-muted-foreground text-sm p-2 bg-muted rounded-md">
              Selecione uma data primeiro.
            </p>
          )}
        </div>
      </div>
      
      {date && time && (
        <div className="mt-6 p-3 bg-muted rounded-md">
          <p className="text-sm font-medium">Resumo do agendamento:</p>
          <p className="text-sm">Data: {date ? format(date, "PPP", { locale: ptBR }) : "-"}</p>
          <p className="text-sm">Hora: {time ? time.substring(0, 5) : "-"}</p>
          
          {/* Exibir informação sobre ocupação da data */}
          {date && (
            <div className="mt-2 pt-2 border-t border-border/30">
              <p className="text-xs text-muted-foreground">
                {selectedDateStatus 
                  ? `Agendamentos: ${selectedDateStatus.totalBookings}/${MAX_CARS_PER_DAY} do limite diário`
                  : "Nenhum agendamento para esta data"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}