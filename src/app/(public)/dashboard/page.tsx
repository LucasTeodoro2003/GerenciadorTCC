import { auth } from "@/shared/lib/auth";
import db from "@/shared/lib/prisma";
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
import { redirect } from "next/navigation";
import PageClient from "./page_client";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;

  const user = await db.user.findUnique({
    where: { id: userId },
  });
  
  const permission = user?.permission;
  console.log("A permissao é: ", permission);

  if (!session || permission != 1 || !user) redirect("/login");

  const firtsname = user?.name?.split(" ")[0];
  console.log(firtsname);

  return (
    <PageClient firtsname={firtsname? firtsname : "Sem Nome"} user={user}/>
  )


}
