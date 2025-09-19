"use client";

import { Switch } from "@/shared/ui/components/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/components/table";
import { Prisma } from "@prisma/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/components/alert-dialog";
import { FinishedService } from "@/shared/lib/actionUpdateService";
import { Button } from "@/shared/ui/components/button";
import { CircularProgress } from "@mui/material";

interface TableMessageProps {
  serviceTableMessage: Prisma.ServiceVehicleServiceGetPayload<{include:{service:{},serviceVehicle:{include:{vehicle:{include:{user:{include:{vehicle:{include:{serviceVehicle:{include:{services:{include:{service:{}}}}}}}}}}}}}}}>[]
}

export function TableMessage({ serviceTableMessage }: TableMessageProps) {
  const [pendingServiceId, setPendingServiceId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [servicesCompleted, setServicesCompleted] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [finishedService, setFinishedService] = useState(false)
  

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  const formatDate = (date: Date | null | undefined) => {
    if (!isClient || !date) return "";
    
    try {
      return new Date(date).toLocaleDateString('pt-BR');
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "";
    }
  };

  const handleSwitchChange = (serviceId: string, completed: boolean) => {
    if (completed) return;
    setPendingServiceId(serviceId);
    setIsDialogOpen(true);
  };

  const confirmServiceCompletion = async () => {
    if (pendingServiceId) {
      setFinishedService(true)
      try {
        setServicesCompleted((prev) => [...prev, pendingServiceId]);
        const formData = new FormData();
        formData.append("finished", "true");
        await FinishedService(pendingServiceId, formData);
        
        toast.success(`Serviço finalizado com sucesso!`);
      } catch (error) {
        console.error("Erro ao finalizar serviço:", error);
        toast.error("Erro ao finalizar serviço. Tente novamente.");
      } finally {
        setIsDialogOpen(false);
        setPendingServiceId(null);
        setFinishedService(false)
      }
    }
  };

  const cancelServiceCompletion = () => {
    setIsDialogOpen(false);
    setPendingServiceId(null);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Foto</TableHead>
            <TableHead className="w-36">Nome</TableHead>
            <TableHead className="w-32">Número</TableHead>
            <TableHead className="w-24">Placa</TableHead>
            <TableHead className="w-40">Veículo</TableHead>
            <TableHead className="w-56">Serviço Realizado</TableHead>
            <TableHead className="w-56">Data Agenda</TableHead>
            <TableHead className="w-28">Finalizar</TableHead>
            <TableHead className="w-28">Data Finalização</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {serviceTableMessage && serviceTableMessage.length > 0 ? (
            serviceTableMessage.map((serviceItem) => {
              const user = serviceItem.serviceVehicle?.vehicle.user;
              const serviceId = serviceItem.id;
              const isCompleted = serviceItem.finished || servicesCompleted.includes(serviceId);
              
              return (
                <TableRow key={serviceId}>
                  <TableCell>
                    <div className="relative rounded-full overflow-hidden w-12 h-12">
                      <img
                        src={user.image || "/usuario.png"}
                        alt={user.name || ""}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.name?.split(" ").slice(0, 2).join(" ")}
                  </TableCell>
                  <TableCell>{formatPhoneNumber(user.phone)}</TableCell>
                  <TableCell>{formatPlateCar(serviceItem.serviceVehicle?.vehicle.plate || "")}</TableCell>
                  <TableCell>
                    {serviceItem.serviceVehicle?.vehicle.type || "Não informado"} - 
                    {serviceItem.serviceVehicle?.vehicle.model || "Não informado"}
                  </TableCell>
                  <TableCell>{serviceItem.service?.description || "Serviço não especificado"}</TableCell>
                  <TableCell>
                    {isClient ? formatDate(serviceItem.createdAt) : "Carregando..."}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={isCompleted}
                      onCheckedChange={() => handleSwitchChange(serviceId, isCompleted)}
                      disabled={isCompleted}
                      className={isCompleted ? "dark:bg-green-500 dark:brightness-100 " : "dark:bg-red-500"}
                    />
                  </TableCell>
                  <TableCell>
                    {isClient && serviceItem.finished ? 
                      formatDate(serviceItem.updatedAt) : 
                      " - "}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                Nenhum serviço realizado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8}>Total de Serviços</TableCell>
            <TableCell className="w-40">
              {serviceTableMessage ? serviceTableMessage.length : 0}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <AlertDialog open={isDialogOpen} >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar finalização</AlertDialogTitle>
            <AlertDialogDescription>
              Você realmente deseja finalizar este serviço?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelServiceCompletion}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmServiceCompletion} disabled={finishedService}>{finishedService ? <CircularProgress size={20} /> : "Sim, Finalizar"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}