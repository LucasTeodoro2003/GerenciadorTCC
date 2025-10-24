"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/components/table";

import { Button } from "@/shared/ui/components/button";
import { useState } from "react";
import { Badge } from "@/shared/ui/components/badge";
import { Input } from "@/shared/ui/components/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const uniqueCategories = [
    ...new Set(data.map((item: any) => item.category)),
  ].sort();

  const handleStatusFilter = (status: string | null) => {
    if (status === statusFilter) {
      setStatusFilter(null);
      table.getColumn("status")?.setFilterValue(undefined);
    } else {
      setStatusFilter(status);
      table.getColumn("status")?.setFilterValue(status);
    }
  };

  const handleCategoryFilter = (category: string | null) => {
    if (category === categoryFilter) {
      setCategoryFilter(null);
      table.getColumn("category")?.setFilterValue(undefined);
    } else {
      setCategoryFilter(category);
      table.getColumn("category")?.setFilterValue(category);
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      pagination,
      sorting,
      columnFilters,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="h-full flex flex-col">
      <div className="rounded-xl border p-1 flex flex-col">
        <div className="space-y-4 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Button
              variant={statusFilter === "Pago" ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusFilter("Pago")}
              className={
                statusFilter === "Pago" ? "bg-green-500 hover:bg-green-600" : ""
              }
            >
              Pago
            </Button>
            <Button
              variant={statusFilter === "Pendente" ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusFilter("Pendente")}
              className={
                statusFilter === "Pendente"
                ? "bg-amber-500 hover:bg-amber-600"
                : ""
              }
            >
              Pendente
            </Button>
            <Button
              variant={statusFilter === "Atrasado" ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusFilter("Atrasado")}
              className={
                statusFilter === "Atrasado" ? "bg-red-500 hover:bg-red-600" : ""
              }
            >
              Atrasado
            </Button>
              <Input
                placeholder="Filtrar por descrição..."
                value={
                  (table.getColumn("description")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("description")?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
            {statusFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleStatusFilter(null)}
              >
                Limpar Filtro
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Categoria:</span>
            {uniqueCategories.map((category) => (
              <Button
                key={category}
                variant={categoryFilter === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </Button>
            ))}
            {categoryFilter && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCategoryFilter(null)}
              >
                Limpar Filtro
              </Button>
            )}
          </div>

          {(statusFilter || categoryFilter) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Filtros ativos:</span>
              {statusFilter && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Status: {statusFilter}
                </Badge>
              )}
              {categoryFilter && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Categoria: {categoryFilter}
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
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
                      <TableCell key={cell.id}>
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
                    Nenhuma despesa encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-2 pt-2">
          <div className="flex w-[100px] items-center justify-start text-sm font-medium">
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Primeira Pagina</span>
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Pagina Anterior</span>
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Proxima Pagina</span>
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Ultima Pagina</span>
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
