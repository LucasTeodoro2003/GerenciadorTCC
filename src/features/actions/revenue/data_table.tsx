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
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  
  const uniqueCategories = [...new Set(data.map((item: any) => item.category))].sort();
  const uniqueSources = [...new Set(data.map((item: any) => item.source))].sort();
  
  const handleCategoryFilter = (category: string | null) => {
    if (category === categoryFilter) {
      setCategoryFilter(null);
      table.getColumn("category")?.setFilterValue(undefined);
    } else {
      setCategoryFilter(category);
      table.getColumn("category")?.setFilterValue(category);
    }
  };
  
  const handleSourceFilter = (source: string | null) => {
    if (source === sourceFilter) {
      setSourceFilter(null);
      table.getColumn("source")?.setFilterValue(undefined);
    } else {
      setSourceFilter(source);
      table.getColumn("source")?.setFilterValue(source);
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
        <div className="p-2 pb-4">
          <Input
            placeholder="Filtrar por descrição..."
            value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("description")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        
        <div className="space-y-4 mb-4 px-2">
          {/* Filtros de Categoria */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Categoria:</span>
            {uniqueCategories.map(category => (
              <Button 
                key={category}
                variant={categoryFilter === category ? "default" : "outline"} 
                size="sm"
                onClick={() => handleCategoryFilter(category)}
                className={categoryFilter === category && category === "Serviço" ? "bg-green-500 hover:bg-green-600" : ""}
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
          
          {/* Filtros de Origem */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Origem:</span>
            {uniqueSources.map(source => (
              <Button 
                key={source}
                variant={sourceFilter === source ? "default" : "outline"} 
                size="sm"
                onClick={() => handleSourceFilter(source)}
              >
                {source}
              </Button>
            ))}
            {sourceFilter && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleSourceFilter(null)}
              >
                Limpar Filtro
              </Button>
            )}
          </div>
          
          {/* Resumo dos filtros ativos */}
          {(categoryFilter || sourceFilter) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Filtros ativos:</span>
              {categoryFilter && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Categoria: {categoryFilter}
                </Badge>
              )}
              {sourceFilter && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Origem: {sourceFilter}
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
                    Nenhuma receita encontrada.
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