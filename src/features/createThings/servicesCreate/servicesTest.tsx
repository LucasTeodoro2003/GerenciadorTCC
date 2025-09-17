import { Button } from "@/shared/ui/components/button";
import { Calendar } from "@/shared/ui/components/calendar";
import { Label } from "@/shared/ui/components/label";
import { Toaster } from "@/shared/ui/components/sonner";
import { Prisma, Services, ServiceVehicle } from "@prisma/client";
import { ptBR } from "date-fns/locale";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/components/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/components/popover";
import { Check, ChevronsUpDown, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/components/command";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/components/badge";
import { format } from "date-fns";
import { createServiceVehicle } from "@/shared/lib/actionCreateServiceVehicle";

interface CreateServiceProps {
  disableDate: ServiceVehicle[];
  users: Prisma.UserGetPayload<{
    include: { vehicle: { include: { serviceVehicle: {} } } };
  }>[];
  services: Services[];
}

export default function CreateService({
  disableDate,
  users,
  services,
}: CreateServiceProps) {
  const maxCarDay = 20;
  const maxCarHour = 2;

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("");
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [openUserCombobox, setOpenUserCombobox] = useState(false);
  const [openServiceCombobox, setOpenServiceCombobox] = useState(false);

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
          const date = new Date(e.dateTime as any);
          date.setHours(date.getHours() + 3);
          return date;
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
      .map(([dayKey]) => new Date(dayKey));
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
    if (
      !date ||
      selectedHour === null ||
      !selectedUserId ||
      !selectedVehicleId ||
      selectedServiceIds.length === 0
    ) {
      toast.error("Preencha todos os campos obrigatórios");
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

      await createServiceVehicle(formData);

      toast.success("Enviado com Sucesso", {
        description: `Data Marcada: ${formattedDate.toLocaleString(
          "pt-BR"
        )} para o veículo ${plateCar}.
      Serviços: ${servicesText}. Valor total: R$${totalValue.toFixed(2)}`,
      });

      setDate(new Date());
      setSelectedHour(null);
      setSelectedUserId("");
      setSelectedVehicleId("");
      setSelectedServiceIds([]);
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      toast.error("Erro ao criar agendamento. Tente novamente.");
    }
  };

  const toggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      <div className="w-full md:w-2/3">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate);
            setSelectedHour(null);
          }}
          className="rounded-md border shadow-sm w-full h-full"
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

      <div className="w-full md:w-1/3 flex flex-col">
        <div className="border-2 border-gray-200 dark:border-gray-200 dark:border-opacity-10 rounded-md p-4 h-full flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <Label className="block mb-2 font-medium">Hora</Label>
              <div className="grid grid-cols-2 gap-2">
                {Array.from({ length: 13 }, (_, i) => i + 6).map((hour) => (
                  <Button
                    key={hour}
                    variant="outline"
                    className={cn(
                      "py-2",
                      selectedHour === hour &&
                        "bg-primary text-primary-foreground",
                      isHourDisabled(hour) && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() =>
                      !isHourDisabled(hour) && setSelectedHour(hour)
                    }
                    disabled={isHourDisabled(hour)}
                  >
                    {hour}:00
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="block mb-2 font-medium">Usuário</Label>
              <Popover
                open={openUserCombobox}
                onOpenChange={setOpenUserCombobox}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openUserCombobox}
                    className="w-full justify-between"
                  >
                    {selectedUserId
                      ? users.find((user) => user.id === selectedUserId)
                          ?.name ||
                        users.find((user) => user.id === selectedUserId)
                          ?.email ||
                        "SEM NOME"
                      : "Selecione um usuário"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar usuário..." />
                    <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
                    <CommandList>
                      <CommandGroup>
                        {users.map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.name || user.email || ""}
                            onSelect={() => {
                              setSelectedUserId(user.id);
                              setSelectedVehicleId("");
                              setSelectedServiceIds([]);
                              setOpenUserCombobox(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedUserId === user.id
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {user.name || "SEM NOME"} - {user.email}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {selectedUserId && (
              <div>
                <Label className="block mb-2 font-medium">Veículo</Label>
                <Select
                  value={selectedVehicleId}
                  onValueChange={(value) => {
                    setSelectedVehicleId(value);
                    setSelectedServiceIds([]);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione um veículo" />
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
            )}

            {selectedVehicleId && (
              <div>
                <Label className="block mb-2 font-medium">Serviços</Label>
                <Popover
                  open={openServiceCombobox}
                  onOpenChange={setOpenServiceCombobox}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openServiceCombobox}
                      className="w-full justify-between"
                    >
                      {selectedServiceIds.length > 0
                        ? `${selectedServiceIds.length} serviço(s) selecionado(s)`
                        : "Selecione os serviços"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Buscar serviço..." />
                      <CommandEmpty>Nenhum serviço encontrado.</CommandEmpty>
                      <CommandList>
                        <CommandGroup>
                          {services.map((service) => (
                            <CommandItem
                              key={service.id}
                              value={service.description || ""}
                              onSelect={() => toggleService(service.id)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedServiceIds.includes(service.id)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {service.description} - R$
                              {Number(service.price || 0).toFixed(2)}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {selectedServiceIds.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedServices.map((service) => (
                      <Badge
                        key={service.id}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {service.description}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => toggleService(service.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}

                {selectedServiceIds.length > 0 && (
                  <div className="mt-3 text-sm font-medium">
                    Valor total: R$
                    {selectedServices
                      .reduce((sum, service) => sum + service.price, 0)
                      .toFixed(2)}
                  </div>
                )}
              </div>
            )}
          </div>

          <Button className="w-full mt-4" onClick={handleSend}>
            ENVIAR
          </Button>
        </div>
      </div>

      <Toaster position="top-center" richColors />
    </div>
  );
}
