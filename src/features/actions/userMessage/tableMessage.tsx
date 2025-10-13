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
import { Prisma, Products, User } from "@prisma/client";
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
import { CircularProgress } from "@mui/material";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/components/select";
import { NumberProducts } from "@/shared/lib/actionNumberProducts";
import { Button } from "@/shared/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/components/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/components/dialog";
import { Input } from "@/shared/ui/components/input";
import { updateMessageService } from "@/shared/lib/actionUpdateMessageService";
import { Badge } from "@/shared/ui/components/badge";
import { BadgeAlertIcon, BadgeCheckIcon } from "lucide-react";
import { updatePayment } from "@/shared/lib/actionsUpdatePayment";
import { AlertPay } from "./paymentconfirm";

interface TableMessageProps {
  serviceTableMessage: Prisma.ServiceVehicleServiceGetPayload<{
    include: {
      service: {};
      serviceVehicle: {
        include: {
          vehicle: {
            include: {
              user: {
                include: {
                  vehicle: {
                    include: {
                      serviceVehicle: {
                        include: { services: { include: { service: {} } } };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  }>[];
  products: Products[];
  user: User;
}

export function TableMessage({
  serviceTableMessage,
  products,
  user,
}: TableMessageProps) {
  const [pendingServiceId, setPendingServiceId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [servicesCompleted, setServicesCompleted] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [finishedService, setFinishedService] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>("");
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const [message, setMessage] = useState(user.message || "");
  const [open, setOpen] = useState(false);
  const [idPayment, setIdPayment] = useState("");

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
      return new Date(date).toLocaleDateString("pt-BR");
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "";
    }
  };

  const handleSwitchChange = (
    serviceId: string,
    completed: boolean,
    serviceDescription: string
  ) => {
    if (completed) return;
    setPendingServiceId(serviceId);
    const filledMessage = message.replace("[serviço aqui]", serviceDescription);
    setMessage(filledMessage);
    setIsDialogOpen(true);
  };

  const confirmServiceCompletion = async () => {
    if (pendingServiceId) {
      setFinishedService(true);
      try {
        setServicesCompleted((prev) => [...prev, pendingServiceId]);
        const formData = new FormData();
        formData.append("finished", "true");
        await FinishedService(pendingServiceId, formData);

        const formMessageService = new FormData();
        formMessageService.append("serviceid", pendingServiceId);
        formMessageService.append("message", message);
        try {
          await updateMessageService(formMessageService);
        } catch (error) {
          toast.error("Erro ao salvar Mensagem no Banco");
        }

        //logica da api de enviar mensagem para o cliente falando que terminou

        toast.success(`Serviço finalizado com sucesso!`);
        setOpenProducts(true);
      } catch (error) {
        console.error("Erro ao finalizar serviço:", error);
        toast.error("Erro ao finalizar serviço. Tente novamente.");
      } finally {
        setIsDialogOpen(false);
        setPendingServiceId(null);
        setFinishedService(false);
      }
    }
  };

  const cancelServiceCompletion = () => {
    setIsDialogOpen(false);
    setPendingServiceId(null);
  };

  const verifyProducts = () => {
    if (!selectedProductId) {
      toast.info("Primeiro Selecione um produto");
      return;
    }
    if (quantity === 0) {
      toast.info("Coloque a quantidade utilizado do produto");
      return;
    }
    handleProductUpdate(true);
  };

  const handleProductUpdate = async (isAddMore = false) => {
    try {
      if (isAddMore) {
        setLoadingAdd(true);
      } else {
        setLoading(true);
      }
      const newAmount =
        Number(products.find((p) => p.id === selectedProductId)?.amount) -
        Number(quantity);
      const formProducts = new FormData();
      formProducts.append("id", selectedProductId || "");
      formProducts.append("value", newAmount.toString() || "");
      await NumberProducts(formProducts);
      toast.success("Produto Atualizado com Sucesso");
      setSelectedProductId(null);
      setQuantity(0);
      if (!isAddMore) {
        setOpenProducts(false);
      }
    } catch (error) {
      console.error("Erro ao atualizar produtos:", error);
      toast.error("Erro ao atualizar produtos.");
    } finally {
      setLoading(false);
      setLoadingAdd(false);
    }
  };

  const payment = async (id:string) => {
    setIdPayment(id)
    setOpen(true);
  };

  return (
    <>
      <AlertPay open={open} setOpen={setOpen} id={idPayment}/>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Foto</TableHead>
            <TableHead className="w-20">Nome</TableHead>
            <TableHead className="w-40">Número</TableHead>
            <TableHead className="w-32">Placa</TableHead>
            <TableHead className="w-44">Veículo</TableHead>
            <TableHead className="w-56">Serviço Realizado</TableHead>
            <TableHead className="w-20">Data Agenda</TableHead>
            <TableHead className="w-16">Finalizar</TableHead>
            <TableHead className="w-20">Data Finalização</TableHead>
            <TableHead className="w-24">Pagamento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {serviceTableMessage && serviceTableMessage.length > 0 ? (
            serviceTableMessage.map((serviceItem) => {
              const user = serviceItem.serviceVehicle?.vehicle.user;
              const serviceId = serviceItem.id;
              const isCompleted =
                serviceItem.finished || servicesCompleted.includes(serviceId);

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
                  <TableCell>
                    {formatPlateCar(
                      serviceItem.serviceVehicle?.vehicle.plate || ""
                    )}
                  </TableCell>
                  <TableCell>
                    {serviceItem.serviceVehicle?.vehicle.type ||
                      "Não informado"}{" "}
                    -
                    {serviceItem.serviceVehicle?.vehicle.model ||
                      "Não informado"}
                  </TableCell>
                  <TableCell>
                    {serviceItem.service?.description ||
                      "Serviço não especificado"}
                  </TableCell>
                  <TableCell>
                    {isClient
                      ? formatDate(serviceItem.createdAt)
                      : "Carregando..."}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={isCompleted}
                      onCheckedChange={() =>
                        handleSwitchChange(
                          serviceId,
                          isCompleted,
                          serviceItem.service?.description || ""
                        )
                      }
                      disabled={isCompleted}
                      className={
                        isCompleted
                          ? "dark:bg-green-500 dark:brightness-100 "
                          : "dark:bg-red-500"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    {isClient && serviceItem.finished
                      ? formatDate(serviceItem.updatedAt)
                      : " - "}
                  </TableCell>
                  <TableCell
                    className="justify-center"
                    onClick={() => payment(serviceItem.id)}
                  >
                    {serviceItem.pay ? (
                      <Badge
                        variant="secondary"
                        className="rounded-lg bg-green-500 items-center gap-1"
                      >
                        <BadgeCheckIcon />
                        Pago
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="rounded-lg bg-red-500 items-center gap-1"
                      >
                        <BadgeAlertIcon />
                      </Badge>
                    )}
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
            <TableCell colSpan={9}>Total de Serviços</TableCell>
            <TableCell className="w-32">
              {serviceTableMessage ? serviceTableMessage.length : 0}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      <AlertDialog open={isDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar finalização</AlertDialogTitle>
            <AlertDialogDescription>
              Você realmente deseja finalizar este serviço? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelServiceCompletion}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmServiceCompletion}
              disabled={finishedService}
            >
              {finishedService ? (
                <CircularProgress size={20} />
              ) : (
                "Sim, Finalizar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* <AlertDialog open={openProducts}> */}
      <Dialog open={openProducts}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Quantidade Utilizada
            </DialogTitle>
            <DialogDescription asChild>
              <div className="mt-2">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2 w-full">
                      <label className="text-sm font-medium text-foreground">
                        Produto
                      </label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-full bg-primary text-primary-foreground border-2 border-background hover:bg-primary/40"
                            onClick={verifyProducts}
                            disabled={loadingAdd}
                          >
                            {loadingAdd ? <CircularProgress size={16} /> : "+"}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Adicionar Produto</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Select
                      onValueChange={(value) => setSelectedProductId(value)}
                      value={selectedProductId || ""}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o produto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-foreground">
                      Quantidade
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      className="w-full"
                      placeholder="Informe a quantidade utilizada"
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      value={quantity || ""}
                    />
                  </div>

                  <div className="pt-2">
                    <p className="text-sm text-muted-foreground">
                      <span className="text-destructive">
                        Obs: Descreva os dados do Produto e clique em '+' caso
                        tenham sido utilizados mais produtos no serviço!
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between items-center sm:justify-between mt-6">
            <div></div>
            <Button
              variant="default"
              disabled={loading || !selectedProductId || !quantity}
              onClick={() => handleProductUpdate(false)}
              className="min-w-[90px]"
            >
              {loading ? <CircularProgress size={16} /> : "Concluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
