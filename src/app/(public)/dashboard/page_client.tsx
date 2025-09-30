import { ChartRadarDots } from "@/features/chars/charRadar";
import { ChartRadialShape } from "@/features/chars/charRadial";
import { ChartTooltipIndicatorLine } from "@/features/chars/charTooltip"; 
import { ChartAreaInteractive } from "@/features/chars/charMain"; 
import { Prisma, Revenue } from "@prisma/client";

interface CharPageProps {
    revenue: Revenue[];
    expense: Prisma.ExpenseGetPayload<{select:{date:true,amount:true}}>[];
    services: Prisma.ServiceVehicleGetPayload<{select:{dateTime:true,totalValue:true}}>[];
}

export default function CharPage({ revenue, expense, services }: CharPageProps){
    return (
        <div className="flex flex-col gap-4 p-4">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ChartRadarDots />
      <ChartRadialShape />
      <ChartTooltipIndicatorLine />
  </div>
  <div className="mt-4">
    <ChartAreaInteractive expense={expense} revenue={revenue} services={services} />
  </div>
</div>
    )
}