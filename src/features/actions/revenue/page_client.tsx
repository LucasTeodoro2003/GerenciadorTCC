"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/features/actions/revenue/data_table";
import { getColumns, RevenueTable } from "@/features/actions/revenue/columns";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/components/button";
import {
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  CalendarDays,
} from "lucide-react";
import { CreateRevenueModal } from "@/features/Modal/revenue/createRevenue";
import { createRevenue } from "@/shared/lib/actionCreateRevenue";
import { User } from "next-auth";
import { Prisma, Services, ServiceVehicle, Vehicle, } from "@prisma/client";
import { decimalToNumber } from "@/shared/lib/decimalForNumber";

interface TableRevenueProps {
  services: Services[];
  serviceVehicles: Prisma.ServiceVehicleGetPayload<{include:{services:{include:{service:{}}}}}>[]
  revenue?: any[];
  user: User;
  vehicles: Vehicle[];
}

export type RevenueData = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  source: string;
  vehicleInfo?: string;
};

export default function TableRevenue({
  services,
  serviceVehicles,
  revenue = [],
  user,
  vehicles,
}: TableRevenueProps) {
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState<RevenueTable[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [showAllMonths, setShowAllMonths] = useState<boolean>(false);

  const isCurrentMonth = () => {
    const now = new Date();
    return (
      selectedMonth === now.getMonth() && selectedYear === now.getFullYear()
    );
  };

  const changeMonth = (direction: "prev" | "next") => {
    if (showAllMonths) {
      setShowAllMonths(false);
    }

    if (direction === "prev") {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear((prev) => prev - 1);
      } else {
        setSelectedMonth((prev) => prev - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear((prev) => prev + 1);
      } else {
        setSelectedMonth((prev) => prev + 1);
      }
    }
  };

  const goToCurrentMonth = () => {
    setSelectedMonth(new Date().getMonth());
    setSelectedYear(new Date().getFullYear());
    if (showAllMonths) {
      setShowAllMonths(false);
    }
  };

  useEffect(() => {
    // Modificação aqui para lidar com a nova estrutura de relacionamento
    const serviceRevenueData = serviceVehicles.map((serviceVehicle) => {
      // Obter descrições de todos os serviços associados a este agendamento
      const serviceDescriptions = serviceVehicle.services
        .map(relation => relation.service.description || "")
        .filter(Boolean)
        .join(", ");
      
      // Se não houver descrições, use um valor padrão
      const description = serviceDescriptions || "Serviço automotivo";

      return {
        id: serviceVehicle.id,
        description: description,
        amount: decimalToNumber(Number(serviceVehicle.totalValue)),
        date: serviceVehicle.dateTime || new Date(),
        category: "Serviço",
        source: "Veículo",
        vehicleInfo: serviceVehicle.vehicleId,
      };
    });

    const otherRevenueData = revenue.map((r) => ({
      id: r.id,
      description: r.description || "Receita adicional",
      amount: decimalToNumber(r.amount),
      date: r.date || new Date().toISOString().split("T")[0],
      category: r.category || "Outros",
      source: r.source || "Diversos",
    }));

    const allRevenueData = [...serviceRevenueData, ...otherRevenueData];

    const filteredData = showAllMonths
      ? allRevenueData
      : allRevenueData.filter((revenue) => {
          const revenueDate = new Date(revenue.date);
          return (
            revenueDate.getMonth() === selectedMonth &&
            revenueDate.getFullYear() === selectedYear
          );
        });

    setTableData(filteredData);
  }, [
    services,
    serviceVehicles,
    revenue,
    selectedMonth,
    selectedYear,
    showAllMonths,
  ]);

  const handleCreateRevenue = async (revenueData: Omit<RevenueTable, "id">) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("amount", revenueData.amount.toString());
      formData.append("date", revenueData.date.toString());
      formData.append("description", revenueData.description);
      formData.append("category", revenueData.category);
      formData.append("source", revenueData.source);
      const userId = user.id;

      await createRevenue(userId || "", formData);

      setTimeout(() => {
        router.refresh();
        setCreateModalOpen(false);
        setIsSubmitting(false);
      }, 5000);
    } catch (error) {
      console.error("Erro ao criar receita:", error);
      setIsSubmitting(false);
    }
  };

  const totalServiceRevenues = tableData
    .filter((revenue) => revenue.category === "Serviço")
    .reduce((sum, revenue) => sum + revenue.amount, 0);

  const totalOtherRevenues = tableData
    .filter((revenue) => revenue.category !== "Serviço")
    .reduce((sum, revenue) => sum + revenue.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciamento de Receitas</h1>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle size={18} />
          Nova Receita
        </Button>
      </div>

      {/* Resto do componente permanece igual */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changeMonth("prev")}
            disabled={showAllMonths}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Mês Anterior</span>
          </Button>

          <div className="text-lg font-medium">
            {showAllMonths
              ? "Todos os Meses"
              : new Date(selectedYear, selectedMonth).toLocaleDateString(
                  "pt-BR",
                  { month: "long", year: "numeric" }
                )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => changeMonth("next")}
            disabled={showAllMonths}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Próximo Mês</span>
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={showAllMonths ? "default" : "outline"}
            size="sm"
            onClick={() => setShowAllMonths(!showAllMonths)}
            className="flex items-center gap-1"
          >
            <ListFilter className="h-4 w-4" />
            {showAllMonths ? "Filtrar por Mês" : "Ver Tudo"}
          </Button>

          {!showAllMonths && (
            <Button
              variant={isCurrentMonth() ? "default" : "ghost"}
              size="sm"
              onClick={goToCurrentMonth}
              className={`flex items-center gap-1 ${
                isCurrentMonth() ? "bg-primary text-primary-foreground" : ""
              }`}
              disabled={isCurrentMonth()}
            >
              <CalendarDays className="h-4 w-4" />
              Mês Atual
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
            Total de Receitas
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(
              tableData.reduce((total, revenue) => total + revenue.amount, 0)
            )}
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
            Receitas de Serviços
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totalServiceRevenues)}
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
            Outras Receitas
          </h3>
          <p className="text-2xl font-bold text-amber-600">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totalOtherRevenues)}
          </p>
        </div>
      </div>

      <DataTable columns={getColumns(router, vehicles)} data={tableData} />

      <CreateRevenueModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSave={handleCreateRevenue}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}