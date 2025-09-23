import { auth } from "@/shared/lib/auth";
import CalendarPageClient from "./page_client";
import db from "@/shared/lib/prisma";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login");
  }
  const enterprise = await db.user.findUnique({
    where: { id: userId },
    select: { enterpriseId: true },
  });
  
  const user = (await db.user.findUnique({
    where: { id: userId },
    include: {
      enterprise: {},
    },
  })) as Prisma.UserGetPayload<{ include: { enterprise: {} } }>;

  const calendar = await db.user.findMany({
    where: { enterpriseId: enterprise?.enterpriseId },
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
