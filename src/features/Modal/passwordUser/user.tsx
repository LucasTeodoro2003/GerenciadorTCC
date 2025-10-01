"use client"
import { testPassword } from "@/shared/lib/actionTestPassword";
import { resetUserPassword } from "@/shared/lib/actionUpdatePassword";
import { Button } from "@/shared/ui/components/button";
import { Input } from "@/shared/ui/components/input";
import { Label } from "@/shared/ui/components/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/components/sheet";
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { toast, Toaster } from "sonner";

interface SheetPasswordProps {
  userId: string;
}

export function SheetPassword({ userId }: SheetPasswordProps) {
  const [userPassword, setUserPassword] = useState("");
  const [userNewPassword, setUserNewPassword] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  const handleTestPassword = async () => {
    setIsSubmittingPassword(true);
    if (userPassword !== "") {
      const valid = await testPassword(userId, userPassword);
      if (!valid) {
        toast.error("Senha atual incorreta");
        toast.error("Por favor, insira a senha correta para continuar.");
        setIsSubmittingPassword(false);
        return;
      }
    }toast.error("Por favor, insira a senha atual para continuar.");
    if (userNewPassword.length < 8) {
      toast.error("A nova senha deve ter no mínimo 8 caracteres.");
      setIsSubmittingPassword(false);
      return;
    }
    await resetUserPassword(userId, userNewPassword);
    toast.success("Senha alterada com sucesso!");
    setUserPassword("");
    setUserNewPassword("");
    setIsSubmittingPassword(false);
  };

  const UserSubmitButton = () => (
    <Button
      className="w-full flex items-center justify-center"
      onClick={handleTestPassword}
      disabled={isSubmittingPassword || userPassword === "" || userNewPassword === ""}
    >
      {isSubmittingPassword ? <CircularProgress size={20} /> : "Alterar Senha"}
    </Button>
  );

  return (
    <Sheet>
      <Toaster position="top-center" richColors />
      <SheetTrigger asChild>
        <Button variant="outline" className="h-full w-full">Alterar Senha</Button>
      </SheetTrigger>
      <SheetTrigger >
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Alterar Senha</SheetTitle>
          <SheetDescription>
            Faça alterações na sua senha aqui. Clique em salvar quando terminar.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3">
            <Label htmlFor="password">Senha Antiga</Label>
            <Input
              id="password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="passwordnew">Nova Senha</Label>
            <Input
              id="passwordnew"
              value={userNewPassword}
              onChange={(e) => setUserNewPassword(e.target.value)}
            />
            <SheetFooter>Minimo 8 caracteres</SheetFooter>
          </div>
        </div>
        <SheetFooter>
          <UserSubmitButton />
          <SheetClose asChild>
            <Button variant="outline">Fechar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
