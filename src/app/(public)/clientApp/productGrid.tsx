"use client"
import { useState } from "react";
import { Button } from "@/shared/ui/components/button";
import { Enterprise, Services } from "@prisma/client";
import { ServiceCard } from "./productCard";
import { formatCurrency } from "@/shared/lib/utils";
import { useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";

interface ServiceGridProps {
  services: Services[];
  enterprise: Enterprise;
}

export function ServiceGrid({ services, enterprise }: ServiceGridProps) {
  const router = useRouter()
  const [selectedServices, setSelectedServices] = useState<Services[]>([]);
  const [loading, setLoading] = useState(false)

  const handleToggleService = (service: Services) => {
    setSelectedServices(prev => {
      const isAlreadySelected = prev.some(s => s.id === service.id);
      
      if (isAlreadySelected) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const totalPrice = selectedServices.reduce((total, service) => {
    const price = typeof service.price === 'string' ? parseFloat(service.price) : service.price;
    return total + price;
  }, 0);


  const handlescheduleService = () => {
    setLoading(true)
    console.log(selectedServices.find((s)=>s.id)?.id)
    router.push("/clientApp/loginApp")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{enterprise.name}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <ServiceCard 
            key={service.id} 
            service={service}
            isSelected={selectedServices.some(s => s.id === service.id)}
            onToggleSelect={handleToggleService}
          />
        ))}
      </div>
      
      {selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-4">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="text-lg font-medium">
                {selectedServices.length} {selectedServices.length === 1 ? 'Serviço' : 'Serviços'} selecionado{selectedServices.length !== 1 ? 's' : ''}
              </span>
              <span className="text-xl font-bold">{formatCurrency(totalPrice)}</span>
            </div>
            <Button size="lg" className="w-full sm:w-auto" onClick={()=>handlescheduleService()}>
              {!loading ? "Criar conta" : <CircularProgress size={20}/>}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}