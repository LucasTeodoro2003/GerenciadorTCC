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
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggleV2 from "@/shared/ui/components/toggleDarkMode";
import { useState } from "react";
import { SkeletonCard } from "@/shared/ui/skeletonTable";

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

  const showTable = searchParams.get("page") === "table";
  const [activeSkeleton, setactiveSkeleton] = useState(false);

  const handleSetSkeleton = (isActive: any) => {
    setactiveSkeleton(isActive);
  };

  return (
    <SidebarProvider>
      <AppSidebar user={user} users={users} onSetSkeleton={handleSetSkeleton} />
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

          {activeSkeleton && !showTable && (
            <div className="w-full h-screen p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                <div className="flex flex-col rounded-xl bg-muted/50 p-4 h-full overflow-x-auto">
                  <SkeletonCard />
                </div>
                <div className="flex flex-col rounded-xl bg-muted/50 p-4 h-full overflow-x-auto">
                  <SkeletonCard />
                </div>
                <div className="rounded-xl bg-muted/50 col-span-1 md:col-span-2 p-4 h-full">
                  <SkeletonCard />
                </div>
              </div>
            </div>
          )}

          {activeSkeleton}
          <AnimatePresence mode="wait">
            {showTable && (
              <motion.div
                key="table-content"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.35 }}
                onAnimationComplete={() => {
                  setactiveSkeleton(false);
                }}
              >
                <div className="grid auto-rows-min gap-4 md:grid-cols-2">
                  <div className="flex flex-col rounded-xl bg-muted/50 pt-3 px-2 min-h-[400px] overflow-x-auto">
                    <TableUser users={users} />
                  </div>
                  <div className="flex flex-col rounded-xl bg-muted/50 pt-3 px-2 min-h-[400px] overflow-x-auto"></div>
                  <div className="rounded-xl bg-muted/50 col-span-2" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* DASHBOARD INICIAL */}
          {/* */}

          <div className="min-h-[100%] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
