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
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import Button from "@mui/material/Button";
import { motion, AnimatePresence } from "framer-motion";

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
        </header>
        <div className="flex flex-1 flex-col gap-4 p-5 pt-0">

          {/* GERENCIAMENTO DAS PAGINAS */}


          {/* */}
          {/* DASHBOARD INICIAL */}
          <AnimatePresence mode="wait">
            {showTable && (
              <motion.div
                key="table-content"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.35 }}
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
