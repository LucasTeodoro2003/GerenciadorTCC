import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";
import MessagePageClient from "./page_client";
import db from "@/shared/lib/prisma";
import { Prisma } from "@prisma/client";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login");
  }
  const service = await db.serviceVehicleService.findMany({
    include: {
      service: {},
      serviceVehicle: {
        include: {
          vehicle: {
            include: {
              user: {
                include: {
                  vehicle: {
                    include: {
                      serviceVehicle: {
                        include: { services: { include: { service: {} } } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  const user = (await db.user.findUnique({
    where: { id: userId },
    include: {
      enterprise: {},
    },
  })) as Prisma.UserGetPayload<{ include: { enterprise: {} } }>;

  return <MessagePageClient serviceTableMessage={service} user={user} />;
}
