import { auth } from "@/shared/lib/auth";
import db from "@/shared/lib/prisma";
import { redirect } from "next/navigation";
import LayoutClient from "./layout_client";
import React from "react";
import { headers } from "next/headers";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = (await headers()).get("x-user-id");

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



  return (
    <LayoutClient
      firtsname={firstname}
      user={user}
      users={usersWithServices}
    >
      {children}
    </LayoutClient>
  );
}
