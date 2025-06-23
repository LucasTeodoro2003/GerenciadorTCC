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
import { User } from "@prisma/client";
import TableUser from "../users/page_client";

interface PageClientProps {
  user: User;
  firtsname: string;
  users: User[];
}

export default function PageClient({
  firtsname,
  user,
  users,
}: PageClientProps) {

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
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
        </header>
        <div className="flex flex-1 flex-col gap-4 p-5 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-2">
            <div className="flex flex-col rounded-xl bg-muted/50 pt-3 px-2 min-h-[400px] overflow-x-auto">
              <TableUser users={users} />
            </div>
            <div className="flex flex-col rounded-xl bg-muted/50 pt-3 px-2 min-h-[400px] overflow-x-auto">
            </div>
            <div className="rounded-xl bg-muted/50 col-span-2" />
          </div>
          <div className="min-h-[100%] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
