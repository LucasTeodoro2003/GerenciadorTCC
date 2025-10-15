"use client";
import { AppSidebar } from "@/shared/ui/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/components/breadcrumb";
import { Separator } from "@/shared/ui/components/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/ui/components/sidebar";
import { Prisma, Products, ServiceVehicleService } from "@prisma/client";
import ThemeToggleV2 from "@/shared/ui/components/toggleDarkMode";
import ModalClient from "@/features/actions/firstAcess/modalAcess";
import { toast, Toaster } from "sonner";
import { useCallback, useEffect } from "react";
import { finalyMessage } from "@/shared/lib/actionFinalyMessage";
import { updateMessageService } from "@/shared/lib/actionUpdateMessageService";
import SendMessage30 from "@/shared/lib/actionSendMessage30";
interface LayoutClientProps {
  children: React.ReactNode;
  user: Prisma.UserGetPayload<{ include: { enterprise: {} } }>;
  firtsname: string;
  users: Prisma.UserGetPayload<{
    include: { vehicle: { include: { serviceVehicle: {} } } };
  }>[];
  products: Products[];
  services: Prisma.ServiceVehicleServiceGetPayload<{
    include: {
      serviceVehicle: { include: { vehicle: { include: { user: {} } } } };
    };
  }>[];
}

export default function LayoutClient({
  children,
  firtsname,
  user,
  users,
  products,
  services,
}: LayoutClientProps) {
  const firtsAcess = !user.emailVerified;

  const checkInventory = useCallback(() => {
    if (products && products.length > 0) {
      products.forEach((product) => {
        const amount = parseInt(product.amount, 10);
        const minAmount = product.minAmout
          ? parseInt(product.minAmout, 10)
          : null;
        if (minAmount !== null && amount <= minAmount) {
          toast.info(
            <div>
              <strong>{product.description}</strong>
              <p>Quantidade restante: {amount}</p>
              <p>Quantidade mínima: {minAmount}</p>
            </div>
          );
        }
      });
    }
  }, [products]);

  useEffect(() => {
    checkInventory();
    const intervalId = setInterval(checkInventory, 3600000); //1Hora
    return () => clearInterval(intervalId);
  }, [checkInventory]);

  useEffect(() => {
    const checkForFollowUps = async () => {
      if (!services || services.length === 0) return;
      const today = new Date();
      for (const serviceItem of services) {
        if (
          serviceItem.finished &&
          serviceItem.updatedAt &&
          serviceItem.sendMessage === false
        ) {
          const completionDate = new Date(serviceItem.updatedAt);
          const diffTime = today.getTime() - completionDate.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays >= 30) {
            const followUpMessage = serviceItem.message || "erro";
            if (followUpMessage === "erro") {
              toast.error(
                `Mensagem de ${
                  serviceItem.serviceVehicle.vehicle.user.name || "cliente"
                } sobre os serviços com algum erro`
              );
            } else {
              const formMessageService = new FormData();
              formMessageService.append("serviceid", serviceItem.id);
              formMessageService.append(
                "message",
                `FINALIZADO - DIA:${new Date().toLocaleDateString()}`
              );
              await updateMessageService(formMessageService);

              try {
                const phoneNumber =
                  serviceItem.serviceVehicle.vehicle.user.phone || "";
                const message = serviceItem.message || "";
                if (!phoneNumber) {
                  throw new Error("Número de telefone não encontrado");
                }
                await SendMessage30(phoneNumber, message);
                toast.success(`Mensagem para ${serviceItem.serviceVehicle.vehicle.user.name} enviada com sucesso`);
              } catch (err) {
                console.error("Erro ao enviar mensagem: ", err);
                toast.error(
                  `Erro ao enviar mensagem para ${
                    serviceItem.serviceVehicle.vehicle.user.name || "cliente"
                  }`
                );
              }

              await finalyMessage(serviceItem.id);
            }
          }
        }
      }
    };

    checkForFollowUps();
  }, [services, updateMessageService, finalyMessage]);

  return (
    <SidebarProvider>
      <AppSidebar user={user} users={users} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Seja Bem Vindo, {firtsname}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto mr-2">
            <ThemeToggleV2 />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-5 pt-0">
          <ModalClient openModal={firtsAcess} user={user} />
          <Toaster richColors position="top-center" closeButton />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
