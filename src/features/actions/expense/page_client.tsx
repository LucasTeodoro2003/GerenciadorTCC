"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/features/actions/expense/data_table";
import { getColumns, ExpenseTable } from "@/features/actions/expense/colunms";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/components/button";
import {
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  ListFilter,
  CalendarDays,
} from "lucide-react";
import { CreateExpenseModal } from "@/features/Modal/expense/createExpense";
import { createExpense } from "@/shared/lib/actionCreateExpense";
import { User } from "next-auth";
import { Expense } from "@prisma/client";
import { decimalToNumber } from "@/shared/lib/decimalForNumber";

interface TableExpenseProps {
  expenses: Expense[];
  user: User;
}

function getStatusLabel(status: string): "Pago" | "Pendente" | "Atrasado" {
  switch (status.toLowerCase()) {
    case "paid":
    case "pago":
      return "Pago";
    case "pending":
    case "pendente":
      return "Pendente";
    case "overdue":
    case "atrasado":
      return "Atrasado";
    default:
      return "Pendente";
  }
}

export default function TableExpense({ expenses, user }: TableExpenseProps) {
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [tableData, setTableData] = useState<ExpenseTable[]>([]);
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
    const processedData = expenses.map((expense) => ({
      id: expense.id,
      description: expense.description ?? "",
      amount: decimalToNumber(expense.amount),
      date: expense.date ?? new Date().toString(),
      category: expense.category ?? "Outros",
      paymentMethod: expense.paymentMethod ?? "Dinheiro",
      status: getStatusLabel(expense.status),
    }));

    const filteredData = showAllMonths
      ? processedData
      : processedData.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate.getMonth() === selectedMonth &&
            expenseDate.getFullYear() === selectedYear
          );
        });

    setTableData(filteredData);
  }, [expenses, selectedMonth, selectedYear, showAllMonths]);

  const handleCreateExpense = async (expenseData: Omit<ExpenseTable, "id">) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("amount", expenseData.amount.toString());
      formData.append("date", expenseData.date.toString());
      formData.append("description", expenseData.description);
      formData.append("status", expenseData.status);
      formData.append("category", expenseData.category);
      formData.append("paymentMethod", expenseData.paymentMethod);
      const userId = user.id;

      await createExpense(userId || "", formData);

      setTimeout(() => {
        router.refresh();
        setCreateModalOpen(false);
        setIsSubmitting(false);
      }, 5000);
    } catch (error) {
      console.error("Erro ao criar despesa:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciamento de Despesas</h1>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle size={18} />
          Nova Despesa
        </Button>
      </div>

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
              {isCurrentMonth() ? "Mês Atual" : "Ir para Mês Atual"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
            Total de Despesas
          </h3>
          <p className="text-2xl font-bold">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(
              tableData.reduce((total, expense) => total + expense.amount, 0)
            )}
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
            Despesas Pagas
          </h3>
          <p className="text-2xl font-bold text-green-600">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(
              tableData
                .filter((expense) => expense.status === "Pago")
                .reduce((total, expense) => total + expense.amount, 0)
            )}
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">
            Despesas Pendentes
          </h3>
          <p className="text-2xl font-bold text-amber-600">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(
              tableData
                .filter(
                  (expense) =>
                    expense.status === "Pendente" ||
                    expense.status === "Atrasado"
                )
                .reduce((total, expense) => total + expense.amount, 0)
            )}
          </p>
        </div>
      </div>

      <DataTable columns={getColumns(router)} data={tableData} />

      <CreateExpenseModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSave={handleCreateExpense}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
