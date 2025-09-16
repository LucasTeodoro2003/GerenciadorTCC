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
import { Edit, Trash2, Car } from "lucide-react";
import { Badge } from "@/shared/ui/components/badge";
import { EditRevenueModal } from "@/features/Modal/revenue/revenueEdit";
import { deleteRevenue } from "@/shared/lib/actionDeleteRevenue";
import { VehicleInfoModal } from "../../Modal/revenue/vehicleInfoModal";

export type RevenueTable = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  source: string;
  vehicleInfo?: string;
};

type Vehicle = {
  id: string;
  color?: string | null;
  type: string;
  plate: string;
  yearCar?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  user?: {
    id: string;
    name: string | null;
  } | null;
  services?: {
    id: string;
    description?: string | null;
    price: string;
    date: string;
    totalValue: string;
  }[];
};

function getCategoryColor(category: string) {
  switch (category) {
    case "Serviço":
      return "bg-green-500 hover:bg-green-600";
    case "Venda":
      return "bg-blue-500 hover:bg-blue-600";
    case "Aluguel":
      return "bg-purple-500 hover:bg-purple-600";
    case "Investimento":
      return "bg-pink-500 hover:bg-pink-600";
    case "Outros":
      return "bg-gray-500 hover:bg-gray-600";
    default:
      return "bg-yellow-500 hover:bg-yellow-600";
  }
}

export function getColumns(
  router: ReturnType<typeof useRouter>,
  vehicles: Vehicle[]
): ColumnDef<RevenueTable>[] {
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
        let date: Date;
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
          date = new Date(dateStr + "T00:00:00Z");
        } else {
          date = new Date(dateStr);
        }
        if (!date || isNaN(date.getTime())) return <div>-</div>;
        const day = String(date.getUTCDate()).padStart(2, "0");
        const month = String(date.getUTCMonth() + 1).padStart(2, "0");
        const year = date.getUTCFullYear();
        return <div>{`${day}/${month}/${year}`}</div>;
      },
    },
    {
      accessorKey: "category",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Categoria" />
      ),
      cell: ({ row }) => {
        const category = row.getValue("category") as string;
        const color = getCategoryColor(category);

        return (
          <Badge
            variant="default"
            className={`${color} text-white border-transparent`}
          >
            {category}
          </Badge>
        );
      },
    },
    {
      accessorKey: "source",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Origem" />
      ),
    },
    {
      id: "vehicleInfo",
      header: "Veículo",
      cell: ({ row }) => {
        const revenue = row.original;
        const [modalOpen, setModalOpen] = useState(false);

        // Busca o veículo pelo id
        const vehicle = vehicles.find((v) => v.id === revenue.vehicleInfo);

        return (
          <>
            {revenue.vehicleInfo ? (
              <div className="flex items-center">
                <Car className="h-4 w-4 mr-2" />
                <Button
                  variant="link"
                  onClick={() => setModalOpen(true)}
                  className="p-0 h-auto text-blue-500 hover:text-blue-700"
                  disabled={!vehicle}
                >
                  Ver Veículo
                </Button>
                <VehicleInfoModal
                  open={modalOpen}
                  onOpenChange={setModalOpen}
                  vehicle={vehicle || null}
                />
              </div>
            ) : (
              <div>N/A</div>
            )}
          </>
        );
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell({ row }) {
        const revenue = row.original;
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
          await deleteRevenue(revenue.id);
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
              title="Editar receita"
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar receita</span>
            </Button>

            <Button
              variant="destructive"
              size="icon"
              onClick={handleDelete}
              disabled={pending}
              title="Excluir receita"
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Excluir receita</span>
            </Button>

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem certeza que deseja excluir esta receita?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. A receita será
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

            <EditRevenueModal
              revenue={revenue}
              open={editModalOpen}
              onOpenChange={setEditModalOpen}
            />
          </div>
        );
      },
    },
  ];
}
