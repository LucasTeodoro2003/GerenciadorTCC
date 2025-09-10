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
import { Button } from "@/shared/ui/components/button";
import { Key } from "lucide-react";
import { resetUser } from "@/shared/lib/actionsResetPassword";

export type Usertable = {
  id: string;
  name: string;
  email: string;
  typeUser: "Funcionario" | "Administrador" | "Cliente";
  numVehicles: number;
};

function getPermission(type: Usertable["typeUser"]): number {
  if (type === "Administrador") return 1;
  if (type === "Funcionario") return 2;
  if (type === "Cliente") return 3;
  return 2;
}

export function getColumns(
  router: ReturnType<typeof useRouter>
): ColumnDef<Usertable>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nome" />
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
    },
    {
      accessorKey: "numVehicles",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nº Veículos" />
      ),
    },
    {
      id: "typeUser",
      header: "Função",
      cell({ row }) {
        const typeUserSelect = row.original;
        const [confirmOpen, setConfirmOpen] = useState(false);
        const [loadingOpen, setLoadingOpen] = useState(false);
        const [pending, setPending] = useState(false);
        const [nextPermission, setNextPermission] = useState<number | null>(
          null
        );

        const handleSelect = (val: string) => {
          setNextPermission(Number(val));
          setConfirmOpen(true);
        };

        const handleConfirm = async () => {
          setConfirmOpen(false);
          setLoadingOpen(true);
          setPending(true);
          if (nextPermission == null) return;
          await updateUserTable(typeUserSelect.id, nextPermission);
          await router.refresh();
          setTimeout(() => {
            setLoadingOpen(false);
            setPending(false);
            setNextPermission(null);
          }, 3500);
        };

        return (
          <>
            <Select
              defaultValue={getPermission(typeUserSelect.typeUser).toString()}
              onValueChange={handleSelect}
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

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem certeza que deseja alterar a função?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação irá alterar a permissão do usuário. Tem certeza
                    que deseja continuar?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => {
                      setConfirmOpen(false);
                      setNextPermission(null);
                    }}
                    disabled={pending}
                  >
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirm} disabled={pending}>
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={loadingOpen}>
              <AlertDialogContent>
                <AlertDialogTitle className="sr-only">
                  Atualizando usuário
                </AlertDialogTitle>
                <div className="flex flex-col items-center justify-center py-8">
                  <svg
                    className="animate-spin h-5 w-8 mb-4 text-primary"
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
                  <span className="text-lg font-medium">Atualizando...</span>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </>
        );
      },
    },
    {
      id: "resetPassword",
      header: "Resetar Senha",
      cell({ row }) {
        const user = row.original;
        const [confirmOpen, setConfirmOpen] = useState(false);
        const [loadingOpen, setLoadingOpen] = useState(false);
        const [pending, setPending] = useState(false);

        const handleResetPassword = () => {
          setConfirmOpen(true);
        };

        const handleConfirm = async () => {
          setConfirmOpen(false);
          setLoadingOpen(true);
          setPending(true);

          await resetUser(user.id);
          await router.refresh();

          setTimeout(() => {
            setLoadingOpen(false);
            setPending(false);
          }, 2500);
        };

        return (
          <>
            <Button
              variant="destructive"
              size="icon"
              onClick={handleResetPassword}
              disabled={pending}
              title="Resetar senha"
              className="dark:bg-red-600 bg-red-400 hover:bg-red-600 dark:hover:bg-red-800 ml-7"
            >
              <Key className="h-4 w-4 "/>
              <span className="sr-only">Resetar senha</span>
            </Button>

            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Tem certeza que deseja resetar a senha?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação irá gerar uma nova senha para o usuário{" "}
                    <strong>{user.name}</strong>.
                    <br />
                    <strong>
                      Nova senha:{" "}
                      <strong className="text-red-500">123456789</strong>
                    </strong>
                    <br />
                    Deseja continuar?
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
                  <AlertDialogAction onClick={handleConfirm} disabled={pending}>
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={loadingOpen}>
              <AlertDialogContent>
                <AlertDialogTitle className="sr-only">
                  Resetando senha
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
                  <span className="text-lg font-medium">
                    Resetando senha...
                  </span>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </>
        );
      },
    },
  ];
}
