"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown} from "lucide-react"
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from "@/shared/ui/components/button"
import { Input } from "@/shared/ui/components/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/components/table"
import { Vehicle } from "@prisma/client"
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CircularProgress } from "@mui/material";
import { Toaster } from "@/shared/ui/components/sonner";
import { deleteCar } from "@/shared/lib/actionDeleteCar";

export const columns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "plate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Placa
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("plate")}</div>,
  },
  {
    accessorKey: "model",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Modelo
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("model")}</div>,
  },
  {
    accessorKey: "yearCar",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ano
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("yearCar")}</div>,
  },
  {
    accessorKey: "color",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Cor
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("color")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const vehicle = row.original
      
      const router = useRouter();
      const [loading, setLoading] = React.useState(false);
      const handleSubmitCar = async () => {
          router.push(`/dashboard/clients?table=vehicles&userid=${vehicle.userId}&plate=${vehicle.plate}&type=${vehicle.type}&model=${vehicle.model}&color=${vehicle.color}&yearCar=${vehicle.yearCar}`);
      };
      const handleDeleteCar = async () => {
        try {
          setLoading(true);
          await deleteCar(vehicle.id);

          toast.success("Veículo excluído com sucesso!");
          router.refresh();
        } catch (error) {
          console.error(error);
          toast.error("Erro ao excluir o veículo.");
        } finally {
          setLoading(false);
        }
      };

  return (
    <div className="flex space-x-2">
      <Toaster richColors position="top-center" />
      <Button variant="outline" className="h-8 px-3" onClick={() => handleSubmitCar()}>
        <EditIcon fontSize="small" className="mr-2" />
        Editar
      </Button>

      <Button variant="destructive" className="h-8 px-3" onClick={() => handleDeleteCar() } disabled={loading}>
                    {!loading ? (
              <>
                <DeleteIcon fontSize="small" className="mr-2" />
                Excluir{" "}
              </>
            ) : (
              <>
                "Excluindo... " <CircularProgress size={20} />
              </>
            )}
      </Button>
    </div>
  )
    },
  },
]










interface DataTableDemoProps {
vehicles: Vehicle[]
}


export function DataTableDemoCar({vehicles}: DataTableDemoProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: vehicles,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Pesquisar veículo..."
          value={(table.getColumn("plate")?.getFilterValue() as string) ?? ""}
          onChange={(event:any) =>
            table.getColumn("plate")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <div className="overflow-hidden rounded-md border">





        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-center">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-center">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>





      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Proxima
          </Button>
        </div>
      </div>
    </div>
  )
}
