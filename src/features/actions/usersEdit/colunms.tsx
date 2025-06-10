"use client";

import { useState, useEffect } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/components/select";
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
import { updateUserTable } from "@/shared/lib/actionUpdateUserTable";

export type Usertable = {
  id: string;
  name: string;
  email: string;
  typeUser: "Funcionario" | "Administrador" | "Cliente";
  numServices: number;
};

function getPermission(type: Usertable["typeUser"]): number {
  if (type === "Administrador") return 1;
  if (type === "Funcionario") return 2;
  if (type === "Cliente") return 3;
  return 2;
}

export function getColumns(router: ReturnType<typeof useRouter>): ColumnDef<Usertable>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      accessorKey: "numServices",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nº Serviços" />
      ),
    },
    {
      id: "typeUser",
      header: "Função",
      cell({ row }) {
        const typeUserSelect = row.original;
        const [open, setOpen] = useState(false);
        const [pending, setPending] = useState(false);
        const [nextPermission, setNextPermission] = useState<number | null>(null);
        const [showLoading, setShowLoading] = useState(false);
        const [minTimeDone, setMinTimeDone] = useState(false);

        useEffect(() => {
          let timer: NodeJS.Timeout;
          if (showLoading) {
            setMinTimeDone(false);
            timer = setTimeout(() => setMinTimeDone(true), 10000);
          }
          return () => clearTimeout(timer);
        }, [showLoading]);

        useEffect(() => {
          if (pending && showLoading && minTimeDone) {
            setShowLoading(false);
            setPending(false);
            setOpen(false);
          }
        }, [pending, showLoading, minTimeDone]);

        const handleConfirm = async () => {
          if (nextPermission == null) return;
          setPending(true);
          setShowLoading(true);
          await updateUserTable(typeUserSelect.id, nextPermission);
          await router.refresh();
        };

        return (
          <>
            <Select
              defaultValue={getPermission(typeUserSelect.typeUser).toString()}
              onValueChange={(val) => {
                setNextPermission(Number(val));
                setOpen(true);
              }}
              disabled={pending}
            >
              <SelectTrigger className="w-max">
                <SelectValue placeholder={typeUserSelect.typeUser} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">Cliente</SelectItem>
                <SelectItem value="2">Funcionario</SelectItem>
                <SelectItem value="1">Administrador</SelectItem>
              </SelectContent>
            </Select>
            <AlertDialog open={open} onOpenChange={v => !pending && setOpen(v)}>
              <AlertDialogContent>
                {showLoading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <svg className="animate-spin h-8 w-8 mb-4 text-primary" viewBox="0 0 24 24">
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
                    <span className="text-lg font-medium">Atualizando...</span>
                  </div>
                ) : (
                  <>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Tem certeza que deseja alterar a função?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação irá alterar a permissão do usuário. Tem certeza que deseja continuar?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => {
                          setOpen(false);
                          setNextPermission(null);
                        }}
                        disabled={pending}
                      >
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={pending}
                      >
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </>
                )}
              </AlertDialogContent>
            </AlertDialog>
          </>
        );
      },
    },
  ];
}