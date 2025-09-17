"use client";

import { Checkbox } from "@/shared/ui/components/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/components/table";
import { Prisma, User } from "@prisma/client";
import { table } from "console";
import { useState } from "react";
import { toast } from "sonner";

interface TableMessageProps {
  serviceTableMessage: Prisma.ServiceVehicleServiceGetPayload<{include:{service:{},serviceVehicle:{include:{vehicle:{include:{user:{include:{vehicle:{include:{serviceVehicle:{include:{services:{include:{service:{}}}}}}}}}}}}}}}>[]
}

export function TableMessage({ serviceTableMessage }: TableMessageProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const formatPhoneNumber = (phoneNumber: string | null) => {
    if (!phoneNumber || typeof phoneNumber !== "string") return phoneNumber;
    const cleaned = phoneNumber.replace(/\D/g, "");
    if (cleaned.length !== 11) return phoneNumber;
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(
      2,
      3
    )} ${cleaned.substring(3, 7)}-${cleaned.substring(7, 11)}`;
  };

  const formatPlateCar = (plate: string | null) => {
    if (!plate || typeof plate !== "string") return plate;
    if (plate.length !== 7) return plate;
    return `${plate.substring(0, 3)} - ${plate.substring(3, 7)}`;
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => {
        const newSelected = [...prev, id];
        console.log(newSelected);
        toast.success(`Usuário selecionado: ${id}`);
        return newSelected;
      });
    } else {
      setSelectedIds((prev) => {
        const newSelected = prev.filter((item) => item !== id);
        console.log(newSelected);
        toast.info(`Usuário removido: ${id}`);
        return newSelected;
      });
    }
  };

  const user = serviceTableMessage.map((e)=>e.serviceVehicle?.vehicle.user)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-20">Foto</TableHead>
          <TableHead className="w-36">Nome</TableHead>
          <TableHead className="w-28">Número</TableHead>
          <TableHead className="w-20">Placa</TableHead>
          <TableHead className="w-40">Veículo</TableHead>
          <TableHead>Serviço Realizado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {serviceTableMessage && serviceTableMessage.length > 0 ? (
          user.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div
                  className="relative cursor-pointer"
                  onClick={() =>
                    handleCheckboxChange(
                      user.id,
                      !selectedIds.includes(user.id)
                    )
                  }
                >
                  <div className="relative rounded-full overflow-hidden w-12 h-12 hover:bg-blue-500 hover:border-2 hover:border-blue-500">
                    <img
                      src={user.image || "/usuario.png"}
                      alt={user.name || ""}
                      className="w-full h-full object-cover"
                    />
                    {selectedIds.includes(user.id) && (
                      <div className="absolute inset-0 rounded-full bg-blue-500 bg-opacity-40 flex items-center justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-medium">
                {user.name?.split(" ").slice(0, 2).join(" ")}
              </TableCell>
              <TableCell>{formatPhoneNumber(user.phone)}</TableCell>
              <TableCell>{formatPlateCar(user.vehicle.find((e)=>e.plate)?.plate || "")} </TableCell>
              <TableCell>{user.vehicle?.find((e)=>e.type)?.type || "Não informado"}</TableCell>
{/* <TableCell>
  {
    user.vehicle.some(vehicle => 
      vehicle.serviceVehicle?.some(serviceVehicle => 
        serviceVehicle.services?.some(service => 
          service.service?.description
        )
      )
    ) || "Sem serviço"
  }
</TableCell> */}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              Nenhum serviço realizado
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={5}>Total de Serviços</TableCell>
          <TableCell className="w-56">
            {serviceTableMessage ? serviceTableMessage.length : 0}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}