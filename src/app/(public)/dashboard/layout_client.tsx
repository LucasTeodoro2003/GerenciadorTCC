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
import { Prisma, Products } from "@prisma/client";
import ThemeToggleV2 from "@/shared/ui/components/toggleDarkMode";
import ModalClient from "@/features/actions/firstAcess/modalAcess";
import { toast, Toaster } from "sonner";
import { useCallback, useEffect } from "react";
interface LayoutClientProps {
  children: React.ReactNode;
  user: Prisma.UserGetPayload<{ include: { enterprise: {} } }>;
  firtsname: string;
  users: Prisma.UserGetPayload<{
    include: { vehicle: { include: { serviceVehicle: {} } } };
  }>[];
  products: Products[];
}

export default function LayoutClient({
  children,
  firtsname,
  user,
  users,
  products,
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
            </div>,
          );
        }
      });
    }
  }, [products]);

  useEffect(() => {
    checkInventory();
    const intervalId = setInterval(checkInventory, 900000); //15minutos
    return () => clearInterval(intervalId);
  }, [checkInventory]);

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
          <Toaster richColors position="top-center" closeButton/>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
