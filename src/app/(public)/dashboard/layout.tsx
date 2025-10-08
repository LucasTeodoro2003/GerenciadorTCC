import { auth } from "@/shared/lib/auth";
import db from "@/shared/lib/prisma";
import { redirect } from "next/navigation";
import LayoutClient from "./layout_client";
import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
    const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login");
  }
  const user = await db.user.findUnique({
    where: { id: userId || "" },
    include: {
      enterprise: {},
    },
  });


  const usersWithServices = await db.user.findMany({
    include: {
      vehicle: {
        include: {
          serviceVehicle: {},
        },
      },
    },
  });

  if (!user || user.permission === 3) {
    redirect("/noAcess");
  }

  const firstname = user.name?.split(" ")[0] ?? "Sem Nome";


  const products = await db.products.findMany({
    where: {enterpriseId: user.enterpriseId},
  })



  return (
    <LayoutClient
      firtsname={firstname}
      user={user}
      users={usersWithServices}
      products={products}
    >
      {children}
    </LayoutClient>
  );
}
