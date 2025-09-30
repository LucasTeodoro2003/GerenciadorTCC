"use server";
import { redirect } from "next/navigation";
import { auth } from "@/shared/lib/auth";
import db from "@/shared/lib/prisma";
import TableCarPage from "./page_client";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login");
  }
  const user = await db.user.findUnique({
    where: { id: userId },
  });
  const enterpriseId = user?.enterpriseId || "";
  const vehicles = await db.vehicle.findMany({
    where: { enterpriseId: enterpriseId },
  });

  return <TableCarPage vehicles={vehicles} />;
}
