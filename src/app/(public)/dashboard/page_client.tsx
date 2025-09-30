"use client"
import { ChartRadialShape } from "@/features/chars/charRadial";
import { ChartTooltipIndicatorLine } from "@/features/chars/charTooltip"; 
import { ChartAreaInteractive } from "@/features/chars/charMain"; 
import { Prisma, Revenue } from "@prisma/client";
import { ChartRadialStacked } from "@/features/chars/charRadial2";

interface CharPageProps {
    revenue: Revenue[];
    expense: Prisma.ExpenseGetPayload<{select:{date:true,amount:true}}>[];
    services: Prisma.ServiceVehicleGetPayload<{select:{dateTime:true,totalValue:true}}>[];
    servicesNames: Prisma.ServiceVehicleServiceGetPayload<{include:{service:{select:{description:true}},serviceVehicle:{select:{dateTime:true}}}}>[];
}

export default function CharPage({ revenue, expense, services, servicesNames }: CharPageProps){
    return (
        <div className="flex flex-col gap-4 p-4">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ChartRadialStacked servicesNames={servicesNames} />
      <ChartRadialShape servicesNames={servicesNames} />
      <ChartTooltipIndicatorLine servicesNames={servicesNames}/>
  </div>
  <div className="mt-4">
    <ChartAreaInteractive expense={expense} revenue={revenue} services={services} />
  </div>
</div>
    )
}