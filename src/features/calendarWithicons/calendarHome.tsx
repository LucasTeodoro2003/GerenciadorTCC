import { useState } from "react";
import { ptBR } from "date-fns/locale";
import { Prisma, Services, User } from "@prisma/client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/shared/ui/components/card";
import { Badge } from "@/shared/ui/components/badge";
import { Button } from "@/shared/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/components/dialog";
import { format } from "date-fns";
import { Input } from "@/shared/ui/components/input";
import { Label } from "@/shared/ui/components/label";
import { Separator } from "@/shared/ui/components/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/components/select";
import { Trash2, Plus, X, Save } from "lucide-react";
import { ScrollArea } from "@/shared/ui/components/scroll-area";
import { toast } from "sonner";
import { updateServiceVehicle } from "@/shared/lib/actionUpdateServiceVehicle ";

interface CalendarIconsProps {
  calendar: Prisma.UserGetPayload<{
    include: {
      vehicle: {
        include: {
          serviceVehicle: {
            include: { services: { include: { service: {} } } };
          };
          user: { include: { addresses: {} } };
        };
      };
    };
  }>[];
  services: Services[];
  user: Prisma.UserGetPayload<{include: {enterprise: {}}}>;
}

export default function CalendarIcons({
  calendar,
  services,
  user,
}: CalendarIconsProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [discount, setDiscount] = useState<string>("0");
  const [addition, setAddition] = useState<string>("0");
  const [showServiceList, setShowServiceList] = useState(false);
  const [serviceToAdd, setServiceToAdd] = useState<string>("");

  const events = calendar.flatMap((user) =>
    user.vehicle.flatMap((vehicle) =>
      vehicle.serviceVehicle
        .filter((service) => service.dateTime !== null)
        .map((service) => {
          const startDate = service.dateTime as Date;
          const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

          // Encontrar o endereço principal
          const userAddress =
            vehicle.user.addresses && vehicle.user.addresses.length > 0
              ? vehicle.user.addresses[0]
              : null;

          const includedServices =
            service.services.map((sv) => ({
              id: sv.id,
              serviceId: sv.id,
              name: sv.service.description || "Serviço sem nome",
              value: sv.service.price || "0.00",
            })) || [];

          return {
            id: service.id,
            title: `${user.name} - ${vehicle.model} (${vehicle.plate})`,
            start: startDate,
            end: endDate,
            color: getColorEvent(vehicle.color || ""),
            extendedProps: {
              userName: user.name,
              userId: user.id,
              vehicleModel: vehicle.model,
              vehiclePlate: vehicle.plate,
              vehicleColor: vehicle.color || "Não especificada",
              serviceValue: service.totalValue,
              vehicleType: vehicle.type,
              vehicleYear: vehicle.yearCar || "Não especificado",
              updatedAt: service.updatedAt,
              userAddress: userAddress,
              services: includedServices,
              vehicleId: vehicle.id,
              serviceVehicleId: service.id,
            },
          };
        })
    )
  );

  function getColorEvent(vehicleColor: string): string {
    if (vehicleColor === "Branco" || vehicleColor === "Branquinho") {
      return "#A0A0A0";
    } else if (vehicleColor === "Rosa") {
      return "#FF69B4";
    } else if (vehicleColor === "Cinza Escuro") {
      return "#555555";
    } else {
      return "#3788d8";
    }
  }

  const handleDateClick = (info: any) => {
    setDate(info.date);
  };
const handleEventClick = (info: any) => {
  setSelectedEvent(info.event);
  setEditMode(false);
  if (info.event.extendedProps.services) {
    setSelectedServices([...info.event.extendedProps.services]); // só os vinculados
  } else {
    setSelectedServices([]);
  }
  setDiscount("0");
  setAddition("0");
};


  const formatCurrency = (value: string) => {
    return parseFloat(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatDate = (date: Date) => {
    return format(date, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  };

  const handleEditService = () => {
    setEditMode(true);
  };

const handleAddService = () => {
  if (serviceToAdd) {
    const serviceToAddObj = services.find((s) => s.id === serviceToAdd);
    if (serviceToAddObj) {
      const serviceAlreadyExists = selectedServices.some(
        (s) => s.serviceId === serviceToAddObj.id
      );
      if (!serviceAlreadyExists) {
        const newService = {
          id: `temp-${Date.now()}`,
          serviceId: serviceToAddObj.id,
          name: serviceToAddObj.description || "Serviço sem descrição",
          value: serviceToAddObj.price,
        };
        const updatedServices = [...selectedServices, newService];
        setSelectedServices(updatedServices);
        setSelectedEvent((prev: any) => {
          if (!prev) return prev;
          return {
            ...prev,
            extendedProps: {
              ...prev.extendedProps,
              services: updatedServices,
            },
          };
        });
      }
      setServiceToAdd("");
      setShowServiceList(false);
    }
  }
};

  const handleRemoveService = (index: number) => {
    const updatedServices = [...selectedServices];
    updatedServices.splice(index, 1);
    setSelectedServices(updatedServices);
  };

  const calculateTotal = () => {
    const servicesTotal = selectedServices.reduce(
      (sum, service) => sum + parseFloat(service.value),
      0
    );
    const discountValue = parseFloat(discount) || 0;
    const additionValue = parseFloat(addition) || 0;

    return servicesTotal - discountValue + additionValue;
  };

  const handleSaveChanges = async () => {
    if (!selectedEvent) return;
    const serviceIds = selectedServices.map((service) => service.serviceId);
    const formData = new FormData();
    formData.append("idServiceVehicle",selectedEvent.extendedProps.serviceVehicleId);
    formData.append("idVehicle", selectedEvent.extendedProps.vehicleId);
    formData.append("discount", String(parseFloat(discount) || 0));
    formData.append("addition", String(parseFloat(addition) || 0));
    formData.append("valueTotal", calculateTotal().toFixed(2));
    formData.append("serviceIds", JSON.stringify(serviceIds));
    formData.append("userId", user.name || "");

    console.log("FormData criado:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {

      await updateServiceVehicle(formData)
      toast.success("Serviço atualizado com sucesso!");
      setEditMode(false);
    } catch (error) {
      toast.error("Erro ao salvar:");
      console.log("Error aqui: ", error);
    }
  };

  return (
    <div
      className={`flex ${
        editMode ? "w-full" : "w-full md:w-7/12"
      } flex-col md:flex-row gap-4`}
    >
      <Card
        className={`border shadow-md ${
          editMode ? "w-full md:w-8/12" : "w-full"
        }`}
      >
        <CardContent className="p-4">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            locale={ptBR}
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="auto"
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5, 6],
              startTime: "08:00",
              endTime: "18:00",
            }}
            hiddenDays={[0]}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
            buttonText={{
              today: "Hoje",
              month: "Mês",
              week: "Semana",
              day: "Dia",
            }}
            dayHeaderFormat={{
              weekday: "long",
            }}
            allDaySlot={false}
            slotMinTime="08:00:00"
            slotMaxTime="18:00:00"
            slotDuration="00:30:00"
            themeSystem="standard"
            dayHeaderClassNames="!text-foreground dark:!text-foreground font-medium p-2"
            dayCellClassNames="!text-foreground dark:!text-foreground"
          />
        </CardContent>
      </Card>
      {editMode && selectedEvent && (
        <Card className="w-full md:w-4/12 border shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Editar Serviço</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditMode(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              {selectedEvent.extendedProps.userName} -{" "}
              {selectedEvent.extendedProps.vehicleModel} (
              {selectedEvent.extendedProps.vehiclePlate})
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-base font-medium">Serviços</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={() => setShowServiceList(!showServiceList)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar
                    </Button>
                  </div>

                  {showServiceList && services.length > 0 && (
                    <div className="mb-4 border rounded-md p-2 bg-background shadow-sm">
                      <div className="flex gap-2">
                        <Select
                          value={serviceToAdd}
                          onValueChange={setServiceToAdd}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione um serviço" />
                          </SelectTrigger>
                          <SelectContent>
                            {services.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.description} -{" "}
                                {formatCurrency(service.price)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button onClick={handleAddService} size="sm">
                          Adicionar
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedServices.length > 0 ? (
                    <div className="space-y-2">
                      {selectedServices.map((service, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 border rounded-md bg-muted/30"
                        >
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(service.value)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive/90"
                            onClick={() => handleRemoveService(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      Nenhum serviço adicionado
                    </p>
                  )}
                </div>

                <Separator />

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="discount">Desconto (R$)</Label>
                    <Input
                      id="discount"
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="addition">Acréscimo (R$)</Label>
                    <Input
                      id="addition"
                      type="number"
                      value={addition}
                      onChange={(e) => setAddition(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <Separator />

                {/* Resumo */}
                <div className="space-y-2">
                  <h3 className="font-medium">Resumo</h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>
                        {formatCurrency(
                          selectedServices
                            .reduce((sum, s) => sum + parseFloat(s.value), 0)
                            .toString()
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Desconto:</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Acréscimo:</span>
                      <span>+{formatCurrency(addition)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>{formatCurrency(calculateTotal().toString())}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditMode(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveChanges}>
              <Save className="h-4 w-4 mr-2" /> Salvar Alterações
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Modal de detalhes do serviço */}
      <Dialog
        open={selectedEvent !== null && !editMode}
        onOpenChange={(open) => !open && setSelectedEvent(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Detalhes do Serviço
            </DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Cliente
                  </p>
                  <p className="text-base font-semibold">
                    {selectedEvent.extendedProps.userName}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Valor
                  </p>
                  <Badge
                    variant="outline"
                    className="font-semibold bg-primary/10"
                  >
                    {formatCurrency(selectedEvent.extendedProps.serviceValue)}
                  </Badge>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Veículo
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Modelo</p>
                    <p className="text-sm font-medium">
                      {selectedEvent.extendedProps.vehicleModel}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Placa</p>
                    <p className="text-sm font-medium">
                      {selectedEvent.extendedProps.vehiclePlate}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Tipo</p>
                    <p className="text-sm font-medium">
                      {selectedEvent.extendedProps.vehicleType}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Ano</p>
                    <p className="text-sm font-medium">
                      {selectedEvent.extendedProps.vehicleYear}
                    </p>
                  </div>
                </div>
              </div>

              {/* Endereço em vez da cor do veículo */}
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Endereço
                </p>
                {selectedEvent.extendedProps.userAddress ? (
                  <p className="text-sm">
                    {[
                      selectedEvent.extendedProps.userAddress.street,
                      selectedEvent.extendedProps.userAddress.number,
                      selectedEvent.extendedProps.userAddress.neighborhood,
                      selectedEvent.extendedProps.userAddress.city,
                      selectedEvent.extendedProps.userAddress.state,
                      selectedEvent.extendedProps.userAddress.zipCode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhum endereço cadastrado
                  </p>
                )}
              </div>

              {/* Seção de serviços */}
              <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium text-muted-foreground">
                  Serviços Incluídos
                </p>
                {selectedEvent.extendedProps.services &&
                selectedEvent.extendedProps.services.length > 0 ? (
                  <div className="space-y-2">
                    {selectedEvent.extendedProps.services.map(
                      (service: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <span>{service.name}</span>
                          <span>{formatCurrency(service.value)}</span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Nenhum serviço detalhado disponível
                  </p>
                )}
              </div>

              <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium text-muted-foreground">
                  Datas
                </p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Agendamento</p>
                    <p className="text-sm">
                      {new Date(selectedEvent.start).toLocaleDateString(
                        "pt-BR",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                      {" às "}
                      {new Date(selectedEvent.start).toLocaleTimeString(
                        "pt-BR",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Data Finalização
                    </p>
                    <p className="text-sm">
                      {selectedEvent.extendedProps.updatedAt
                        ? formatDate(
                            new Date(selectedEvent.extendedProps.updatedAt)
                          )
                        : "Não disponível"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between gap-2 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => setSelectedEvent(null)}
                  className="w-full"
                >
                  Fechar
                </Button>

                <Button
                  variant="default"
                  className="w-full"
                  onClick={handleEditService}
                >
                  Editar Serviço
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
