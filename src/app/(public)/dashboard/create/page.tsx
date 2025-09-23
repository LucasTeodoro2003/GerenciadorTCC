import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";
import CreatePageClient from "./page_client";
import db from "@/shared/lib/prisma";

export default async function Page(){
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        redirect("/login");
      }
  const dateDisable = await db.serviceVehicle.findMany();
  const users = await db.user.findMany({
    include: {
      vehicle: {
        include: {
          serviceVehicle: {},
        },
      },
    },
  });
    const services = await db.services.findMany();
  
    return(
        <CreatePageClient disableDate={dateDisable} services={services} users={users} />

    )
}