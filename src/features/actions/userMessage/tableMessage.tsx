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
import { Prisma, Products } from "@prisma/client";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/components/select";
import { NumberProducts } from "@/shared/lib/actionNumberProducts";

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
}

export function TableMessage({
  serviceTableMessage,
  products,
}: TableMessageProps) {
  const [pendingServiceId, setPendingServiceId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [servicesCompleted, setServicesCompleted] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [productsUsage, setproductsUsage] = useState(false);
  const [finishedService, setFinishedService] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>("");
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const [addProducts, setAddProducts] = useState(false);

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

  const handleSwitchChange = (serviceId: string, completed: boolean) => {
    if (completed) return;
    setPendingServiceId(serviceId);
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

        toast.success(`Serviço finalizado com sucesso!`);
        setproductsUsage(true);
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

  const updateProduct = async () => {
    console.log("AQUI : ", addProducts)
    if(addProducts){
      setLoadingAdd(true)
      console.log("AQUI PRODUTOS : ", selectedProductId)
    }else{
      setLoading(true);
      console.log("AQUI FINAL : ", selectedProductId)
    }
    try {
      const newAmount =
        Number(products.find((p) => p.id === selectedProductId)?.amount) -
        Number(quantity);
      const formProducts = new FormData();
      formProducts.append("id", selectedProductId || "");
      formProducts.append("value", newAmount.toString() || "");
      await NumberProducts(formProducts);
      setLoading(false);
      setSelectedProductId(null);
      setQuantity(0);
      toast.success("Produto Atualizado com Sucesso");
    } catch (error) {
      console.error("Erro ao atualizar produtos:", error);
      toast.error("Erro ao atualizar produtos.");
      setLoading(false);
    }

    if (addProducts) {
      setOpenProducts(true);
      toast.info("Adicione os dados do Produto");
      setAddProducts(false);
    } else {
      setOpenProducts(false);
    }
    setLoading(false)
    setLoadingAdd(false)
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Foto</TableHead>
            <TableHead className="w-36">Nome</TableHead>
            <TableHead className="w-40">Número</TableHead>
            <TableHead className="w-28">Placa</TableHead>
            <TableHead className="w-48">Veículo</TableHead>
            <TableHead className="w-56">Serviço Realizado</TableHead>
            <TableHead className="w-24">Data Agenda</TableHead>
            <TableHead className="w-24">Finalizar</TableHead>
            <TableHead className="w-24">Data Finalização</TableHead>
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
                        handleSwitchChange(serviceId, isCompleted)
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




      <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Quantidade Utilizada</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Produto
                  </label>
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

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">
                    Quantidade
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Informe a quantidade utilizada"
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    value={quantity}
                  />
                </div>

                <div className="mt-4 text-sm text-muted-foreground">
                  <span className="dark:text-red-400 text-red-500">
                    Obs: Clique em 'Adicionar mais' caso tenham sido utilizados
                    mais produtos no serviço!
                  </span>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <div className="justify-start">
            <AlertDialogAction
            disabled={loading || !selectedProductId || !quantity}
              onClick={() => {
                setAddProducts(true);
                updateProduct();
              }}
            >
              {loadingAdd ? <CircularProgress size={20} /> : "Adicionar Mais"}
            </AlertDialogAction>
            </div>
            <div className="justify-end">
            <AlertDialogAction
              disabled={loading || !selectedProductId || !quantity}
              onClick={() => {
                updateProduct();
              }}
            >
              {loading ? <CircularProgress size={20} /> : "Concluir"}
            </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
