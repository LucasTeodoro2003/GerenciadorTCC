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
import { Prisma } from "@prisma/client";
import ThemeToggleV2 from "@/shared/ui/components/toggleDarkMode";
import ModalClient from "@/features/actions/firstAcess/modalAcess";
import { useState } from "react";
interface LayoutClientProps {
  children: React.ReactNode;
  user: Prisma.UserGetPayload<{include: {enterprise: {}}}>;
  firtsname: string;
  users: Prisma.UserGetPayload<{include: {vehicle:{include:{serviceVehicle:{}}}}}>[];
}

export default function LayoutClient({
  children,
  firtsname,
  user,
  users,
}: LayoutClientProps) {
  const firtsAcess = !user.emailVerified;
  const [,setOpenPerfil] = useState(false)
  return (
    <SidebarProvider>
      <AppSidebar
        user={user}
        users={users}
        setOpenPerfil={setOpenPerfil}
      />
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
          <ModalClient openModal={firtsAcess} user={user} setOpenPerfil={setOpenPerfil}/>

          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
