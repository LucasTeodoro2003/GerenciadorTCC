"use client"

import { CreateServiceProps, CreateUserSomeVehicle } from "@/features/createThings/userVehicle/userVehicle";

export default function ClientsPageClient({ users }: CreateServiceProps) {
  return <CreateUserSomeVehicle users={users} />;
}
