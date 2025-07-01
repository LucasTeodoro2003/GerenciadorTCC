"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/shared/ui/components/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/components/select";
import { User } from "@prisma/client";
import { ResetPasswordUser } from "@/shared/lib/actionsUpdateUser";

interface AlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users: User[]
}

export default function ResetPasswordModal({ open, onOpenChange, users}: AlertDialogProps) {
  const [selectedUser, setSelectedUser] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleReset = async () => {
  setConfirmOpen(false);
  if (selectedUser) {
    await ResetPasswordUser(selectedUser)
  }
  setSelectedUser("");
  onOpenChange(false);
  alert("Senha alterada com sucesso.")
  alert("Nova senha 00000000")
};

  return (
    <>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogTitle>Resetar senha de usuário</AlertDialogTitle>
          <div className="flex flex-col gap-4 py-2">
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o usuário" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>{user.name} ({user.email})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => onOpenChange(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => setConfirmOpen(true)}
              disabled={!selectedUser}
            >
              Resetar Senha
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Confirmação */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja resetar a senha deste usuário?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleReset}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
