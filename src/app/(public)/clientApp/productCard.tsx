import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/shared/ui/components/card";
import { Checkbox } from "@/shared/ui/components/checkbox";
import { Badge } from "@/shared/ui/components/badge";
import { Services } from "@prisma/client";
import { formatCurrency } from "@/shared/lib/utils";

interface ServiceCardProps {
  service: Services;
  isSelected: boolean;
  onToggleSelect: (service: Services) => void;
}

export function ServiceCard({ service, isSelected, onToggleSelect }: ServiceCardProps) {
  console.log("Service image URL:", service.image);
  return (
    <Card className={`relative transition-all ${isSelected ? 'border-primary ring-2 ring-primary' : ''}`}>
      <div className="absolute right-3 top-3 z-10">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => onToggleSelect(service)}
          className="h-5 w-5"
        />
      </div>
      <CardHeader className="p-4 pb-0">
        <div className="relative w-full h-48 rounded-md overflow-hidden">
          {service.image ? (
            <Image 
              src={service.image} 
              alt={service.description || "Serviço"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
              <span className="text-gray-400">Sem imagem</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{service.description || "Serviço"}</CardTitle>
          </div>
          <div>
            <CardTitle className="text-sm items-center justify-center dark:text-red-500 text-red-600">Tempo mínimo: {service.minService ? (service.minService + " minutos") : "Indefinido"}</CardTitle>
          </div>
        </div>
        <div className="mt-2">
          <Badge variant="secondary" className="mb-2">{service.description?.split(" ")[0]}</Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="text-lg font-semibold">{formatCurrency(parseFloat(service.price))}</span>
      </CardFooter>
    </Card>
  );
}