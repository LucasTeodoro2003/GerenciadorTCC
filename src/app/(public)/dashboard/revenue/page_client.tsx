"use client"

import TableRevenue, { TableRevenueProps } from "@/features/actions/revenue/page_client";

export default function RevenuePageClient({
  services,
  serviceVehicles,
  revenue = [],
  user,
  vehicles,
}: TableRevenueProps) {
  return (
    <TableRevenue
      serviceVehicles={serviceVehicles}
      services={services}
      user={user}
      revenue={revenue}
      vehicles={vehicles}
    />
  );
}
