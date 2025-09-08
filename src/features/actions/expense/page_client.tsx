"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/features/actions/expense/data_table";
import { getColumns, ExpenseTable } from "@/features/actions/expense/colunms";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/components/button";
import { PlusCircle } from "lucide-react";
import { CreateExpenseModal } from "@/features/actions/Modal/expense/createExpense";
import { createExpense } from "@/shared/lib/actionCreateExpense";
import { User } from "next-auth";
import { Expense } from "@prisma/client";
import { decimalToNumber } from "@/shared/lib/decimalForNumber";

interface TableExpenseProps {
  expenses: Expense[];
  user: User,
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
  
  // Processar dados da tabela usando useEffect corretamente
  useEffect(() => {
    const processedData = expenses.map((expense) => ({
      id: expense.id,
      description: expense.description ?? "",
      amount: decimalToNumber(expense.amount),
      date: expense.date ? new Date(expense.date) : new Date(),
      category: expense.category ?? "Outros",
      paymentMethod: expense.paymentMethod ?? "Dinheiro",
      status: getStatusLabel(expense.status),
    }));
    
    setTableData(processedData);
  }, [expenses]);
  
  // Manipulador para criar nova despesa usando server action
  const handleCreateExpense = async (expenseData: Omit<ExpenseTable, "id">) => {
    try {
      setIsSubmitting(true);
      
      // Criar FormData para enviar ao servidor
      const formData = new FormData();
      formData.append("amount", expenseData.amount.toString());
      formData.append("date", expenseData.date.toISOString());
      formData.append("description", expenseData.description);
      formData.append("status", expenseData.status);
      formData.append("category", expenseData.category);
      formData.append("paymentMethod", expenseData.paymentMethod);
      const userId = user.id
      
      await createExpense(userId || "", formData);
      router.refresh();
      setCreateModalOpen(false);
    } catch (error) {
      console.error("Erro ao criar despesa:", error);
    } finally {
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Total de Despesas</h3>
          <p className="text-2xl font-bold">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(
              tableData.reduce((total, expense) => total + expense.amount, 0)
            )}
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Despesas Pagas</h3>
          <p className="text-2xl font-bold text-green-600">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(
              tableData
                .filter(expense => expense.status === "Pago")
                .reduce((total, expense) => total + expense.amount, 0)
            )}
          </p>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-500 dark:text-gray-400">Despesas Pendentes</h3>
          <p className="text-2xl font-bold text-amber-600">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(
              tableData
                .filter(expense => expense.status === "Pendente" || expense.status === "Atrasado")
                .reduce((total, expense) => total + expense.amount, 0)
            )}
          </p>
        </div>
      </div>
      
      <DataTable columns={getColumns(router)} data={tableData} />
      
      {/* Modal para criar nova despesa */}
      <CreateExpenseModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSave={handleCreateExpense}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}