"use client";
import { useState } from "react";
import { Button } from "@/shared/ui/components/button";
import { Enterprise, Services, User } from "@prisma/client";
import { ServiceCard } from "./productCard";
import { formatCurrency } from "@/shared/lib/utils";
import { redirect, useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";
import ThemeToggleV2 from "@/shared/ui/components/toggleDarkMode";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/components/tooltip";
import signOutFunction from "@/shared/ui/signOut";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/shared/ui/components/alert";
import { Terminal } from "lucide-react";

interface ServiceGridProps {
  services: Services[];
  enterprise: Enterprise;
  user: User | null;
}

export function ServiceGrid({ services, enterprise, user }: ServiceGridProps) {
  const router = useRouter();
  const [selectedServices, setSelectedServices] = useState<Services[]>([]);
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState(false);
  const [exit, setExit] = useState(false);

  const handleToggleService = (service: Services) => {
    setSelectedServices((prev) => {
      const isAlreadySelected = prev.some((s) => s.id === service.id);

      if (isAlreadySelected) {
        return prev.filter((s) => s.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const totalPrice = selectedServices.reduce((total, service) => {
    const price =
      typeof service.price === "string"
        ? parseFloat(service.price)
        : service.price;
    return total + price;
  }, 0);

  const handlescheduleService = () => {
    setLoading(true);

    const selectedServiceIds = selectedServices.map((service) => service.id);

    localStorage.setItem(
      "selectedServiceIds",
      JSON.stringify(selectedServiceIds)
    );

    console.log("Serviços salvos:", selectedServiceIds);
    router.push("/clientApp/loginApp");
    setLoading(false);
  };

  const handleLogar = () => {
    setLogin(true);
    router.push("/clientApp/loginApp?tabs=login");
  };

  const handleExit = () => {
    setExit(true);
    signOutFunction();
  };

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center md:text-left order-2 md:order-1 w-full md:w-auto">
          {enterprise.name}
        </h1>

        <div className="flex items-center justify-between gap-4 order-1 md:order-2 w-full md:w-auto">
          {user ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="bg-transparent dark:text-white text-black dark:hover:bg-gray-600 hover:bg-gray-200 flex items-center gap-2"
                    onClick={() => handleExit()}
                  >
                    {!exit ? (
                      <>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-background">
                          <img
                            src={user?.image || "/usuario.png"}
                            alt={user?.name || "Usuário"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="hidden sm:inline-block">
                          {user?.name}
                        </span>
                      </>
                    ) : (
                      <CircularProgress size={20} />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sair</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Button onClick={() => handleLogar()}>
              {!login ? "Entrar" : <CircularProgress size={20} />}
            </Button>
          )}
          <ThemeToggleV2 />
        </div>
      </div>

      {/* Alert Section - Made responsive */}
      <div className="pb-6 w-full max-w-3xl mx-auto">
        <Alert variant="default">
          <Terminal className="mr-2 h-4 w-4 shrink-0" />
          <div>
            <AlertTitle className="text-lg font-semibold">
              Bem-vindo!
            </AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground">
              Clique em <strong>"Entrar"</strong> para acessar e selecionar os
              serviços disponíveis. Se você já estiver logado, basta escolher os
              serviços que deseja utilizar.
            </AlertDescription>
          </div>
        </Alert>
      </div>

      {/* Services Grid - Already responsive with grid-cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-24">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            isSelected={selectedServices.some((s) => s.id === service.id)}
            onToggleSelect={handleToggleService}
          />
        ))}
      </div>

      {/* Bottom Action Bar */}
      {selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-3 md:p-4 z-10">
          <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 text-center sm:text-left">
              <span className="text-base sm:text-lg font-medium">
                {selectedServices.length}{" "}
                {selectedServices.length === 1 ? "Serviço" : "Serviços"}{" "}
                selecionado{selectedServices.length !== 1 ? "s" : ""}
              </span>
              <span className="text-lg sm:text-xl font-bold">
                {formatCurrency(totalPrice)}
              </span>
            </div>
            <Button
              size="lg"
              className="w-full sm:w-auto mt-2 sm:mt-0"
              onClick={() => handlescheduleService()}
            >
              {!loading ? "Criar conta" : <CircularProgress size={20} />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
