import { Prisma, Services, ServiceVehicle } from "@prisma/client";
import CalendarClient from "./page.client";
import db from "@/shared/lib/prisma";
import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";
export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/clientApp/loginApp?tabs=login")
  }
  const user = await db.user.findUnique({
    where: { id: userId },
  });
  const enterprise = user?.enterpriseId;
  const disableDate = await db.serviceVehicle.findMany({
    where: { enterpriseId: enterprise },
  });

  const users = await db.user.findMany({
    where: { enterpriseId: enterprise },
    include: { vehicle: { include: { serviceVehicle: {} } } },
  });

  const services = await db.services.findMany({
    where: { enterpriseId: enterprise },
  });

  return (
    <CalendarClient
      disableDate={disableDate}
      services={services}
      users={users}
    />
  );
}
