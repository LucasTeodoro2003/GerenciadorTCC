"use server";
import { auth } from "@/shared/lib/auth";
import { TabsUser } from "./page_client";
import { redirect } from "next/navigation";
import db from "@/shared/lib/prisma";
import { Address, User } from "@prisma/client";

export default async function Login() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/clientApp");
  }
  const user = await db.user.findUnique({
    where: {id: userId}
  }) as User

  const address = await db.address.findFirst({
    where: {userId: userId, isPrimary:true}
  }) as Address

  const vehicles = await db.vehicle.findMany({
    where: {userId: userId, enterpriseId: user.enterpriseId}
  })

  return <TabsUser user={user} address={address} vehicles={vehicles}/>;
}
