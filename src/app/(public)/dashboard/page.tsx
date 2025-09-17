import { auth } from "@/shared/lib/auth";
import db from "@/shared/lib/prisma";
import { redirect } from "next/navigation";
import PageClient from "./page_client";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      enterprise: {},
    },
  });


  const usersWithServices = await db.user.findMany({
    include: {
      vehicle: {
        include: {
          serviceVehicle: {
          }
        },
      },
    },
  });

  const serviceTableMessage = await db.serviceVehicleService.findMany({include:{service:{},serviceVehicle:{include:{vehicle:{include:{user:{include:{vehicle:{include:{serviceVehicle:{include:{services:{include:{service:{}}}}}}}}}}}}}}})
  // const account = await db.account.findMany({include:{
  //   user: true
  // }})

  // console.log("MAIS UM TESTE", account.filter(user=>user.user.name).map(user=>user.user.name))

  if (!user || user.permission === 3) {
    redirect("/noAcess");
  }

  const firstname = user.name?.split(" ")[0] ?? "Sem Nome";

  const expense = await db.expense.findMany({
    where:
      user.permission === 1 && user.enterpriseId
        ? {
            user: {
              enterpriseId: user.enterpriseId,
            },
          }
        : { userId: userId },
    include: {
      user: {
        select: {
          email: true,
          name: true,
          id: true,
        },
      },
    },
  });

  const serviceVehicle = await db.serviceVehicle.findMany({include:{services:{include:{service:{}}}}})
  const services = await db.services.findMany()
  const revenue = await db.revenue.findMany()
  const vehicles = await db.vehicle.findMany({
    include:{
      user:{
        select:{
          name: true,
          id: true
        }
      },
      serviceVehicle:{
        include:
        {
          services:{
            include:{}
          }
        }
      }
    }
  })

  const dateDisable = await db.serviceVehicle.findMany()

  return (
    <PageClient
      firtsname={firstname}
      user={user}
      users={usersWithServices}
      expense={expense}
      serviceVehicles={serviceVehicle}
      services={services}
      revenue={revenue}
      vehicle={vehicles}
      dataServices={dateDisable}
      serviceTableMessage={serviceTableMessage}
    />
  );
}
