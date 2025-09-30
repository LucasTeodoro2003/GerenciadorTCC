"use server";

import { auth } from "@/shared/lib/auth";
import db from "@/shared/lib/prisma";
import { redirect, useRouter } from "next/navigation";
import CharPage from "./page_client";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login");
  }
  const user = await db.user.findUnique({
    where: {id: userId}
  }) 
  const enterprise = user?.enterpriseId
  // busca grafico principal (despesas x receitas)
  //despesas - revenue
  const revenue = await db.revenue.findMany({
    where: {user:{enterpriseId:enterprise}},
  })

  //receitas - expense + serviceVehicle
  const expense = await db.expense.findMany({
    where: {user: {enterpriseId:enterprise}},
    select:{date:true, amount:true}
  })
  const services = await db.serviceVehicle.findMany({
    where: {enterpriseId:enterprise},
    select:{dateTime:true, totalValue:true}
  })

  return (
    <CharPage expense={expense} revenue={revenue} services={services} />
  );
}
