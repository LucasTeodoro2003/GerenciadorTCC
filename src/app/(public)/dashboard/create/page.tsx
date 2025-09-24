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
  const user = await db.user.findUnique({
    where: {id: userId}
  })
  const enterprise = user?.enterpriseId
  const dateDisable = await db.serviceVehicle.findMany({where:{enterpriseId:enterprise}});
  const users = await db.user.findMany({
    where: {enterpriseId: enterprise},
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