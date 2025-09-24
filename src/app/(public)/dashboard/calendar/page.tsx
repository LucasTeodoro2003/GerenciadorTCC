import { auth } from "@/shared/lib/auth";
import CalendarPageClient from "./page_client";
import db from "@/shared/lib/prisma";
import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      redirect("/login");
    }
  
  const user = (await db.user.findUnique({
    where: { id: userId || "" },
    include: {
      enterprise: {},
    },
  })) as Prisma.UserGetPayload<{ include: { enterprise: {} } }>;
  
  const enterprise = user.enterpriseId

  const calendar = await db.user.findMany({
    where: { enterpriseId: enterprise },
    include: {
      vehicle: {
        include: {
          serviceVehicle: {
            include: { services: { include: { service: {} } } },
          },
          user: { include: { addresses: {} } },
        },
      },
    },
  });
  const services = await db.services.findMany({where:{enterpriseId:enterprise}});

  return (
    <CalendarPageClient calendar={calendar} services={services} user={user} />
  );
}
