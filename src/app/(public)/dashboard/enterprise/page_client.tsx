"use client"

import { CreateServiceSomeProducts } from "@/features/createThings/productsServices/productsServices";
import { CreateServiceProps } from "@/features/createThings/userVehicle/userVehicle";

export default function EnterprisePageClient({users}:CreateServiceProps) {
  return <CreateServiceSomeProducts users={users} />;
}
