import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/components/dialog";
import { Button } from "@/shared/ui/components/button";
import { Badge } from "@/shared/ui/components/badge";
import { Car } from "lucide-react";
import { Prisma } from "@prisma/client";
import { Card, CardContent, CardHeader } from "@/shared/ui/components/card";
import { Separator } from "@/shared/ui/components/separator";

interface UserInfo {
  id: string;
  name: string | null;
}

interface ServiceInfo {
  id: string;
  description?: string | null;
  price: string;
}

interface ServiceVehicleInfo {
  id: string;
  dateTime: Date | string;
  totalValue: string;
  service: ServiceInfo;
}

interface VehicleInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Prisma.VehicleGetPayload<{
    include: {
      serviceVehicle: { include: { services: { include: { service: {} } } } };
      user: { select: { id: true; name: true } };
    };
  }>;
  revenueid: string
}

function formatDate(date?: string | Date) {
  if (!date) return "-";
  let d: Date;
  if (typeof date === "string") {
    d = new Date(date);
  } else {
    d = date;
  }
  if (isNaN(d.getTime())) return "-";
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

export function VehicleInfoModal({
  open,
  onOpenChange,
  vehicle,
  revenueid,
}: VehicleInfoModalProps) {
  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Car className="h-6 w-6 text-blue-600" />
            <DialogTitle>Detalhes do Veículo</DialogTitle>
          </div>
        </DialogHeader>

<Card className="shadow-sm border w-full">
  <CardContent className="grid gap-6 py-6 text-gray-800 dark:text-gray-100 w-full">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground font-medium">Placa</span>
        <Badge className="bg-blue-500 text-white w-fit mt-1">{vehicle.plate}</Badge>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground font-medium">Tipo</span>
        <span className="font-medium">{vehicle.type}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground font-medium">Cor</span>
        <span className="font-medium">
          {vehicle.color || <span className="italic text-gray-500">Não informada</span>}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground font-medium">Ano</span>
        <span className="font-medium">
          {vehicle.yearCar || <span className="italic text-gray-500">Não informado</span>}
        </span>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground font-medium">Usuário</span>
        <span className="font-medium">
          {vehicle.user?.name || <span className="italic text-gray-500">Não informado</span>}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground font-medium">Criado em</span>
        <span className="font-medium">{formatDate(vehicle.createdAt)}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground font-medium">Editado em</span>
        <span className="font-medium">{formatDate(vehicle.updatedAt)}</span>
      </div>
    </div>
  </CardContent>
</Card>

<section className="mt-6">
  <h3 className="font-semibold text-base mb-4">Serviços Realizados:</h3>

  {vehicle.serviceVehicle && vehicle.serviceVehicle.length > 0 ? (
    <div className="space-y-4">
      {vehicle.serviceVehicle.map((serviceVehicle) => {
        const matchedServices = serviceVehicle.services.filter(
          (s) => s.serviceVehicleId === revenueid
        )
        if (matchedServices.length === 0) return null

        const discounts = parseFloat(serviceVehicle.discounts || "0")
        const addValue = parseFloat(serviceVehicle.addValue || "0")
        const totalValue = parseFloat(serviceVehicle.totalValue || "0")

        return (
          <Card key={serviceVehicle.id} className="shadow-sm border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-muted-foreground">
                  Serviços do veículo
                </span>
                <Badge className="bg-green-500 text-white">
                  Total: R$ {totalValue.toFixed(2)}
                </Badge>
              </div>
            </CardHeader>

            <Separator />

            <CardContent className="pt-3 space-y-3">
              <div>
                <b>Serviços:</b>
                <ul className="list-disc list-inside mt-1 text-sm space-y-1">
                  {matchedServices.map(({ service }) => (
                    <li key={service.id}>
                      {service.description || "Sem descrição"} - R${" "}
                      {parseFloat(service.price).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resumo financeiro */}
              {(discounts > 0 || addValue > 0) && (
                <div className="mt-3 text-sm space-y-1">
                  {discounts > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Descontos:</span>
                      <span>- R$ {discounts.toFixed(2)}</span>
                    </div>
                  )}
                  {addValue > 0 && (
                    <div className="flex justify-between text-blue-600">
                      <span>Acréscimos:</span>
                      <span>+ R$ {addValue.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Final:</span>
                    <span>R$ {totalValue.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <Separator />

              <div className="text-xs text-muted-foreground text-right">
                {formatDate(serviceVehicle.dateTime || "")}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  ) : (
    <div className="text-gray-500 mt-1 italic">
      Nenhum serviço encontrado.
    </div>
  )}
</section>


        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full mt-4"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
