"use client";

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
  dateTime: Date | string; // pode ser dateTime!
  totalValue: string;
  service: ServiceInfo;
}

interface VehicleInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: {
    id: string;
    color?: string | null;
    type: string;
    plate: string;
    yearCar?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user?: UserInfo | null;
    serviceVehicle?: ServiceVehicleInfo[];
  } | null;
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

export function VehicleInfoModal({ open, onOpenChange, vehicle }: VehicleInfoModalProps) {
  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Car className="h-6 w-6 text-blue-600" />
            <DialogTitle>Detalhes do Veículo</DialogTitle>
          </div>
        </DialogHeader>

        {/* Dados principais do veículo */}
        <div className="grid gap-3 py-2 text-gray-800 dark:text-gray-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Placa:</span>
            <Badge className="bg-blue-500 text-white">{vehicle.plate}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Tipo:</span>
            <span>{vehicle.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Cor:</span>
            <span>{vehicle.color || <span className="italic text-gray-500">Não informada</span>}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Ano:</span>
            <span>{vehicle.yearCar || <span className="italic text-gray-500">Não informado</span>}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Usuário:</span>
            <span>{vehicle.user?.name || <span className="italic text-gray-500">Não informado</span>}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Criado em:</span>
            <span>{formatDate(vehicle.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Editado em:</span>
            <span>{formatDate(vehicle.updatedAt)}</span>
          </div>
        </div>

        {/* Lista de serviços realizados */}
        <section className="mt-6">
          <div className="font-semibold text-base mb-2">Serviços Realizados:</div>
          {vehicle.serviceVehicle && vehicle.serviceVehicle.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {vehicle.serviceVehicle.map(serviceVehicle => (
                <li key={serviceVehicle.id} className="py-2">
                  <div className="flex flex-col md:flex-row md:items-center md:gap-4">
                    <span className="block flex-1">
                      <b>Descrição:</b> {serviceVehicle.service.description || "Sem descrição"}
                    </span>
                    <Badge className="bg-green-500 text-white">{`R$ ${serviceVehicle.service.price}`}</Badge>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {formatDate(serviceVehicle.dateTime)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">
                      Valor Total: <b>R$ {serviceVehicle.totalValue}</b>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-gray-500 mt-1 italic">Nenhum serviço encontrado.</div>
          )}
        </section>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full mt-4">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}