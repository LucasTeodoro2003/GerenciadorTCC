"use client";

import { DataTable } from "@/features/actions/usersEdit/data_table";
import { Prisma, User } from "@prisma/client";
import { getColumns, Usertable } from "@/features/actions/usersEdit/colunms";
import { useRouter } from "next/navigation";

interface TableUserProps {
  users: Prisma.UserGetPayload<{include: {vehicle:{include:{serviceVehicle:{}}}}}>[];
}

function getTypeUser(permission: number | null | undefined): "Administrador" | "Funcionario" | "Cliente" {
  if (permission === 1) return "Administrador";
  if (permission === 2) return "Funcionario";
  if (permission === 3) return "Cliente";
  return "Funcionario";
}

export default function TableUser({ users }: TableUserProps) {
  const router = useRouter();

  console.log("AQUI: ", users.map((u)=>u.vehicle.length))

  const data: Usertable[] = users.map((user) => ({
    id: user.id,
    name: user.name ?? "",
    email: user.email ?? "",
    typeUser: getTypeUser(user.permission),
    numVehicles: user.vehicle?.length || 0,
  }));

  return <DataTable columns={getColumns(router)} data={data} />;
}