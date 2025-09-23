import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";
import TablePageClient from "./page_client";
import db from "@/shared/lib/prisma";

export default async function Page(){
      const session = await auth();
      const userId = session?.user?.id;
      if (!userId) {
        redirect("/login");
      }
        const users = await db.user.findMany({
    include: {
      vehicle: {
        include: {
          serviceVehicle: {},
        },
      },
    },
  });
    return(
<TablePageClient users={users}/>
    )
}