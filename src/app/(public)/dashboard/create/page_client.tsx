"use client"

import CreateServiceVehiclePage, { CreateServiceVehiclePageProps } from "@/features/createThings/servicesVehicleCreate/servicesVehicle";

export default function CreatePageClient({
  disableDate,
  users,
  services,
}: CreateServiceVehiclePageProps) {
  return (
    <CreateServiceVehiclePage
      disableDate={disableDate}
      users={users}
      services={services}
    />
  );
}
