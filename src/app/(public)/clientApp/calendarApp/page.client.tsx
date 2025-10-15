"use client";
import { Button } from "@/shared/ui/components/button";
import { Calendar } from "@/shared/ui/components/calendar";
import { Label } from "@/shared/ui/components/label";
import { Toaster } from "@/shared/ui/components/sonner";
import { Prisma, Services, ServiceVehicle, User } from "@prisma/client";
import { ptBR } from "date-fns/locale";
import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/components/select";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/components/badge";
import { format } from "date-fns";
import { createServiceVehicle } from "@/shared/lib/actionCreateServiceVehicle";
import { CircularProgress } from "@mui/material";
import signOutFunction from "@/shared/ui/signOut";
import ThemeToggleV2 from "@/shared/ui/components/toggleDarkMode";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/components/tooltip";
import { useRouter } from "next/navigation";
import SendMessage from "@/shared/lib/actionSendMessageAdm";

export interface CalendarClientProps {
  disableDate: ServiceVehicle[];
  users: Prisma.UserGetPayload<{
    include: { vehicle: { include: { serviceVehicle: {} } } };
  }>[];
  services: Services[];
  user: Prisma.UserGetPayload<{ include: { addresses: {} } }>;
}

export default function CalendarClient({
  disableDate,
  users,
  services,
  user,
}: CalendarClientProps) {
  const maxCarDay = 20;
  const maxCarHour = 2;

  const router = useRouter();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>(user.id);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [exit, setExit] = useState(false);
  const [page, setPage] = useState(false);

  useEffect(() => {
    try {
      const savedServiceIds = localStorage.getItem("selectedServiceIds");
      if (savedServiceIds) {
        const parsedIds = JSON.parse(savedServiceIds);
        if (Array.isArray(parsedIds)) {
          setSelectedServiceIds(parsedIds);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar serviços do localStorage:", error);
    }
  }, []);

  const userVehicles = selectedUserId
    ? users.find((user) => user.id === selectedUserId)?.vehicle || []
    : [];

  const selectedServices = services
    .filter((service) => selectedServiceIds.includes(service.id))
    .map((service) => ({ ...service, price: Number(service.price || 0) }));

  const { disabledDays, disabledHours } = useMemo(() => {
    const allDates = disableDate
      .filter((e) => e.dateTime)
      .map((e) => {
        try {
          return new Date(e.dateTime as any);
        } catch (error) {
          return null;
        }
      })
      .filter(Boolean) as Date[];

    const dayCounter = new Map<string, number>();
    const hourCounter = new Map<string, number>();
    const disabledHoursMap = new Map<string, Set<number>>();

    allDates.forEach((dateTime) => {
      const dayKey = format(dateTime, "yyyy-MM-dd");
      const hour = dateTime.getHours();
      const hourKey = `${dayKey} ${hour}`;

      dayCounter.set(dayKey, (dayCounter.get(dayKey) || 0) + 1);
      hourCounter.set(hourKey, (hourCounter.get(hourKey) || 0) + 1);

      if ((hourCounter.get(hourKey) || 0) >= maxCarHour) {
        if (!disabledHoursMap.has(dayKey)) {
          disabledHoursMap.set(dayKey, new Set<number>());
        }
        disabledHoursMap.get(dayKey)?.add(hour);
      }
    });

    const disabledDays = Array.from(dayCounter.entries())
      .filter(([_, count]) => count >= maxCarDay)
      .map(([dayKey]) => {
        const [year, month, day] = dayKey.split("-").map(Number);
        return new Date(year, month - 1, day);
      });

    return {
      disabledDays,
      disabledHours: disabledHoursMap,
    };
  }, [disableDate, maxCarDay, maxCarHour]);

  const isHourDisabled = (hour: number): boolean => {
    if (!date) return true;
    const dayKey = format(date, "yyyy-MM-dd");
    return disabledHours.get(dayKey)?.has(hour) || false;
  };

  const handleSend = async () => {
    setIsLoading(true);
    if (
      !date ||
      selectedHour === null ||
      !selectedUserId ||
      !selectedVehicleId ||
      selectedServiceIds.length === 0
    ) {
      toast.error("Preencha todos os campos obrigatórios");
      setIsLoading(false);
      return;
    }

    const plateCar =
      userVehicles.find((c) => c.id === selectedVehicleId)?.plate || "";
    const formattedDate = new Date(date);
    formattedDate.setHours(selectedHour, 0, 0);

    const servicesText = selectedServices.map((s) => s.description).join(", ");
    const totalValue = selectedServices.reduce(
      (sum, service) => sum + service.price,
      0
    );

    try {
      const formData = new FormData();
      formData.append("vehicleId", selectedVehicleId);
      formData.append("dateTime", formattedDate.toISOString());
      formData.append("totalValue", totalValue.toFixed(2));
      formData.append("serviceIds", JSON.stringify(selectedServiceIds));
      formData.append("enterpriseId", users[0].enterpriseId || "");

      await createServiceVehicle(formData);

      toast.success("Enviado com Sucesso", {
        description: `Data Marcada: ${formattedDate.toLocaleString(
          "pt-BR"
        )} para o veículo ${plateCar}.
      Serviços: ${servicesText}. Valor total: R$${totalValue.toFixed(2)}`,
      });
      const addressTrue = user.addresses.find((a) => a.isPrimary === true);
      const address = `Rua: ${addressTrue?.street}, nº:${addressTrue?.number} - Bairro: ${addressTrue?.district} // obs: ${addressTrue?.complement}`;

      try {
        await SendMessage(
          address,
          servicesText,
          formattedDate.toLocaleString("pt-BR")
        );
      } catch (err) {
        console.error("Erro ao enviar mensagem para o proprietario: ", err);
      }
      localStorage.removeItem("selectedServiceIds");

      setDate(new Date());
      setSelectedHour(null);
      setSelectedUserId("");
      setSelectedVehicleId("");
      setSelectedServiceIds([]);
      setIsLoading(false);
      router.push("/clientApp")
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      toast.error("Erro ao criar agendamento. Tente novamente mais tarde!.");
      setIsLoading(false);
    }
  };

  const toggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleExit = async () => {
    setExit(true);
    try {
      await signOutFunction();
    } catch (err) {
      console.error("Erro ao sair: ", err);
    }
  };

  const handleHome = () => {
    setPage(true);
    router.push("/clientApp");
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="bg-transparent w-10 h-10 rounded-full flex items-center justify-center p-0 dark:hover:bg-gray-600 hover:bg-gray-200"
                    onClick={() => handleExit()}
                  >
                    {!exit ? (
                      <ExitToAppIcon
                        className="text-black dark:text-white"
                        fontSize="large"
                      />
                    ) : (
                      <CircularProgress size={20} />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sair</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <h1 className="text-3xl font-bold">{user.name || "Cliente"}</h1>
          </div>
          <ThemeToggleV2 />
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center md:items-end mt-2">
          <div className="w-full md:w-1/2">
            <Label className="text-md font-medium block mb-1">
              Selecione seu veículo
            </Label>
            <Select
              value={selectedVehicleId}
              onValueChange={(value) => {
                setSelectedVehicleId(value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Escolha um veículo para agendamento" />
              </SelectTrigger>
              <SelectContent>
                {userVehicles.length > 0 ? (
                  userVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.type} - {vehicle.plate}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-vehicles" disabled>
                    Nenhum veículo cadastrado
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {selectedServiceIds.length > 0 && (
        <div className="mb-8 p-6 border rounded-xl bg-background shadow-sm">
          <div className="flex flex-wrap items-center justify-between mb-4 gap-3">
            <h2 className="text-xl font-semibold">Serviços Selecionados</h2>
            <Button
              variant="outline"
              className="flex items-center gap-2 dark:hover:bg-neutral-200 hover:bg-neutral-500 bg-neutral-700 dark:bg-neutral-400 transition"
              onClick={handleHome}
              disabled={!!page}
            >
              {!page ? (
                <>
                  <span className="dark:text-black text-white">
                    Home / Selecionar mais serviços
                  </span>
                </>
              ) : (
                <CircularProgress size={20} />
              )}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedServices.length > 0 ? (
              selectedServices.map((service) => (
                <Badge
                  key={service.id}
                  variant="secondary"
                  className="flex items-center gap-2 text-sm py-2 px-3"
                >
                  <span>{service.description || "Sem descrição"}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive hover:bg-transparent"
                    onClick={() => toggleService(service.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Badge>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">
                Nenhum serviço selecionado ainda.
              </p>
            )}
          </div>
          <div className="text-lg font-semibold text-right">
            Valor total:{" "}
            <span className="text-primary">
              R${" "}
              {selectedServices
                .reduce((sum, service) => sum + service.price, 0)
                .toFixed(2)}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-2/3">
          <Label className="text-xl font-medium block mb-3">
            Selecione a data
          </Label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate);
              setSelectedHour(null);
            }}
            className="rounded-lg border shadow w-full"
            captionLayout="dropdown"
            disabled={[
              ...disabledDays,
              { dayOfWeek: [6] },
              { before: new Date() },
            ]}
            locale={ptBR}
            classNames={{ disabled: "text-gray-600" }}
          />
        </div>

        <div className="w-full md:w-1/3">
          <Label className="text-xl font-medium block mb-3">
            Selecione o horário
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-2">
            {Array.from({ length: 13 }, (_, i) => i + 6).map((hour) => (
              <Button
                key={hour}
                variant="outline"
                className={cn(
                  "py-2",
                  selectedHour === hour && "bg-primary text-primary-foreground",
                  isHourDisabled(hour) && "opacity-50 cursor-not-allowed"
                )}
                onClick={() => !isHourDisabled(hour) && setSelectedHour(hour)}
                disabled={isHourDisabled(hour)}
              >
                {hour}:00
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Button
          className="w-full py-6 text-lg"
          onClick={handleSend}
          disabled={
            !selectedVehicleId ||
            isLoading ||
            !selectedHour ||
            !selectedUserId ||
            selectedServiceIds.length === 0
          }
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <span>Agendando</span>
              <CircularProgress size={20} />
            </div>
          ) : (
            "AGENDAR SERVIÇO"
          )}
        </Button>
      </div>

      <Toaster position="top-center" richColors />
    </div>
  );
}
