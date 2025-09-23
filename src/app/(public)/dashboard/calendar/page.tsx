import CalendarPageClient from "./page_client";
import db from "@/shared/lib/prisma";
import { Prisma } from "@prisma/client";
import { headers } from "next/headers";

export default async function Page() {
  const userId = (await headers()).get("x-user-id");
  
  
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
  const services = await db.services.findMany();

  return (
    <CalendarPageClient calendar={calendar} services={services} user={user} />
  );
}
