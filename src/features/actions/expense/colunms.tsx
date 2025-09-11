"use client";

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/components/alert-dialog";
import { DataTableColumnHeader } from "./headerTable";
import { Button } from "@/shared/ui/components/button";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/shared/ui/components/badge";
import { EditExpenseModal } from "@/features/Modal/expense/expenseEdity";
import { deleteExpense } from "@/shared/lib/actionDeleteExpense";

export type ExpenseTable = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  paymentMethod: string;
  status: "Pago" | "Pendente" | "Atrasado";
};

export function getColumns(
  router: ReturnType<typeof useRouter>
): ColumnDef<ExpenseTable>[] {
  return [
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Descrição" />
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Valor (R$)" />
      ),
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(amount);
        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Data" />
      ),
      cell: ({ row }) => {
        const dateStr = row.getValue("date") as string;
        const [year, month, day] = dateStr.split("-");
        return <div>{`${day}/${month}/${year}`}</div>;
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Categoria" />
      ),
    },
    {
      accessorKey: "paymentMethod",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Método de Pagamento" />
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;

        return (
          <Badge
            variant={
              status === "Pago"
                ? "default"
                : status === "Pendente"
                ? "outline"
                : "destructive"
            }
            className={
              status === "Pago"
                ? "bg-green-500 hover:bg-green-600 text-white border-transparent"
                : ""
            }
          >
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell({ row }) {
        const expense = row.original;
        const [confirmOpen, setConfirmOpen] = useState(false);
        const [loadingOpen, setLoadingOpen] = useState(false);
        const [pending, setPending] = useState(false);
        const [editModalOpen, setEditModalOpen] = useState(false);

        const handleDelete = () => {
          setConfirmOpen(true);
        };

        const handleEdit = () => {
          setEditModalOpen(true);
        };

        const handleConfirmDelete = async () => {
          setConfirmOpen(false);
          setLoadingOpen(true);
          setPending(true);
          await deleteExpense(expense.id);
          setTimeout(() => {
            router.refresh();
            setLoadingOpen(false);
            setPending(false);
          }, 4000);
        };

        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleEdit}
              disabled={pending}
              title="Editar despesa"
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar despesa</span>
            </Button>

            <Button
              variant="destructive"
              size="icon"
              onClick={handleDelete}
              disabled={pending}
              title="Excluir despesa"
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Excluir despesa</span>
            </Button>

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem certeza que deseja excluir esta despesa?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. A despesa será
                    permanentemente excluída do sistema.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => {
                      setConfirmOpen(false);
                    }}
                    disabled={pending}
                  >
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleConfirmDelete}
                    disabled={pending}
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={loadingOpen}>
              <AlertDialogContent>
                <AlertDialogTitle className="sr-only">
                  Processando...
                </AlertDialogTitle>
                <div className="flex flex-col items-center justify-center py-8">
                  <svg
                    className="animate-spin h-8 w-8 mb-4 text-primary"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span className="text-lg font-medium">Processando...</span>
                </div>
              </AlertDialogContent>
            </AlertDialog>

            {/* Modal de Edição */}
            <EditExpenseModal
              expense={expense}
              open={editModalOpen}
              onOpenChange={setEditModalOpen}
            />
          </div>
        );
      },
    },
  ];
}
