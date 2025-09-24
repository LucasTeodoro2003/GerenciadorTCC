import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";
import RevenuePageClient from "./page_client";
import db from "@/shared/lib/prisma";
import { Prisma } from "@prisma/client";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login");
  }
    const user = (await db.user.findUnique({
    where: { id: userId },
    include: {
      enterprise: {},
    },
  })) as Prisma.UserGetPayload<{ include: { enterprise: {} } }>;
  const enterprise = user.enterpriseId;

  const serviceVehicle = await db.serviceVehicle.findMany({where:{enterpriseId: enterprise},
    include: { services: { include: { service: {} } } },
  });

  
  const services = await db.services.findMany({
    where: {  enterpriseId: enterprise },
  });

  const vehicles = await db.vehicle.findMany({
    where: {enterpriseId: enterprise},
    include: {
      user: {
        select: {
          name: true,
          id: true,
        },
      },
      serviceVehicle: {
        include: {
          services: {
            include: {
              service:{}
            },
          },
        },
      },
    },
  });
  const revenue = await db.revenue.findMany();

  return (
    <RevenuePageClient
      serviceVehicles={serviceVehicle}
      services={services}
      user={user}
      vehicles={vehicles}
      revenue={revenue}
    />
  );
}
