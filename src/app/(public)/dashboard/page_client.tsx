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
import { Expense, Prisma, Revenue, Services, ServiceVehicle, User, Vehicle } from "@prisma/client";
import TableUser from "../../../features/actions/users/page_client";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggleV2 from "@/shared/ui/components/toggleDarkMode";
import { useState } from "react";
import {
  SkeletonExpense,
  SkeletonHome,
  SkeletonMessage,
  SkeletonTable,
} from "@/shared/ui/skeletonCards";
import ModalClient from "@/features/actions/firstAcess/modalAcess";
import PageMessage from "../../../features/actions/messageUsers/pageMessage";
import TableExpense from "@/features/actions/expense/page_client";
import TableRevenue from "@/features/actions/revenue/page_client";

interface PageClientProps {
  user: Prisma.UserGetPayload<{include: {enterprise: {}}}>;
  firtsname: string;
  users: Prisma.UserGetPayload<{include: {vehicle:{include:{serviceVehicle:{}}}}}>[];
  expense: Expense[]
  serviceVehicle: ServiceVehicle[]
  services: Services[]
  revenue: Revenue[]
  vehicle: Vehicle[]
}



export default function PageClient({
  firtsname,
  user,
  users,
  expense,
  serviceVehicle,
  services,
  revenue,
  vehicle
}: PageClientProps) {
  const searchParams = useSearchParams();

  // const pathname = usePathname();
  // const router = useRouter();
  // const { replace } = useRouter();

  // function handleSearch(term: string) {
  //   const params = new URLSearchParams(searchParams);
  //   if (term) {
  //     params.set("page", term);
  //   } else {
  //     params.delete("page");
  //   }
  //   replace(`${pathname}?${params.toString()}`);
  // }

  // function InitTable() {
  //   console.log("Enviando");
  //   return "table";
  // }

  // function removeParams() {
  //   console.log("Removendo");
  //   return "";
  // }
  const firtsAcess = !user.emailVerified;

  const showTable = searchParams.get("page") === "table";
  const showHome = searchParams.toString() === "";
  const showMessage = searchParams.get("page") === "message";
  const showExpense = searchParams.get("page") === "expense";
  const showRevenue = searchParams.get("page") === "revenue";

  const [activeSkeletonTable, setactiveSkeletonTable] = useState(false);
  const [activeSkeletonHome, setactiveSkeletonHome] = useState(false);
  const [activeSkeletonMessage, setactiveSkeletonMessage] = useState(false);
  const [activeSkeletonExpense, setactiveSkeletonExpense] = useState(false);
  const [activeSkeletonRevenue, setactiveSkeletonRevenue] = useState(false);

  const handleSetSkeletonTable = (isActive: any) => {
    setactiveSkeletonTable(isActive);
  };

  const handleSetSkeletonRevenue = (isActive: any) => {
    setactiveSkeletonRevenue(isActive);
  };
  
  const handleSetSkeletonHome = (isActive: any) => {
    setactiveSkeletonHome(isActive);
  };

  const handleSetSkeletonMessage = (isActive: any) => {
    setactiveSkeletonMessage(isActive);
  };

  const handleSetSkeletonExpense = (isActive: any) => {
    setactiveSkeletonExpense(isActive);
  };

  return (
    <SidebarProvider>
      <AppSidebar
        user={user}
        users={users}
        onSetSkeletonTable={handleSetSkeletonTable}
        onSetSkeletonHome={handleSetSkeletonHome}
        onSetSkeletonMessage={handleSetSkeletonMessage}
        onSetSkeletonExpense={handleSetSkeletonExpense}
        onSetSkeletonRevenue={handleSetSkeletonRevenue}

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
                  {/* <Button
                    className="border-white border-4"
                    onClick={() => {
                      handleSearch(InitTable());
                    }}
                  >
                    Parametros
                  </Button>
                  <Button
                    className="border-white border-4"
                    onClick={() => {
                      handleSearch(removeParams());
                    }}
                  >
                    Parametros
                  </Button> */}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto mr-2">
            <ThemeToggleV2 />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-5 pt-0">
          {/* GERENCIAMENTO DAS PAGINAS */}

          {/* */}
          {/* DASHBOARD INICIAL */}

          <ModalClient openModal={firtsAcess} user={user} />

          {activeSkeletonTable && !showTable && (
            <div className="w-full h-screen p-4">
              <SkeletonTable />
            </div>
          )}

          {activeSkeletonHome && !showHome && (
            <div className="w-full h-screen p-4">
              <SkeletonHome />
            </div>
          )}

          {activeSkeletonMessage && !showMessage && (
            <div className="w-full h-screen p-4">
              <SkeletonMessage />
            </div>
          )}

          {activeSkeletonExpense && !showExpense && (
            <div className="w-full h-screen p-4">
              <SkeletonExpense />
            </div>
          )}

          {activeSkeletonRevenue && !showRevenue && (
            <div className="w-full h-screen p-4">
              <SkeletonExpense />
            </div>
          )}

          {showTable && (
            <motion.div
              key="table-content"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              onAnimationComplete={() => {
                setactiveSkeletonTable(false);
              }}
            >
              <div className="flex flex-col w-full h-screen rounded-xl bg-muted/50 p-4 overflow-hidden">
                <div className="w-full h-full overflow-auto">
                  <TableUser users={users} />
                </div>
              </div>
            </motion.div>
          )}

          {showMessage && <PageMessage user={user} users={users} />}
          {showExpense &&  <TableExpense expenses={expense} user={user}/>}
          {showRevenue &&  <TableRevenue serviceVehicles={serviceVehicle} services={services} user={user} revenue={revenue} vehicles={vehicle}/>}
          {/* DASHBOARD INICIAL */}
          {/* */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
