"use client";
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
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface SheetPasswordClientProps {
  userId: string;
  alterPassword?: boolean;
  setAlterPassword?: (open: boolean) => void;
}

export function SheetPasswordClient({ userId, alterPassword, setAlterPassword }: SheetPasswordClientProps) {
  const [userPassword, setUserPassword] = useState("");
  const [userNewPassword, setUserNewPassword] = useState("");
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);

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
    }
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
      disabled={isSubmittingPassword || userPassword === "" || userNewPassword === "" ||userNewPassword.length < 8}
    >
      {isSubmittingPassword ? <CircularProgress size={20} /> : "Alterar Senha"}
    </Button>
  );

  return (
    <Sheet open={alterPassword} onOpenChange={setAlterPassword}>
      <Toaster position="top-center" richColors />
      <SheetTrigger asChild>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Alterar Senha</SheetTitle>
          <SheetDescription>
            Faça alterações na sua senha aqui. Clique em salvar quando terminar.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <div className="grid gap-3 mt-4">
            <Label htmlFor="password">Senha Antiga</Label>
            <div className="relative">
              <Input
                id="password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                type={showOldPassword ? "text" : "password"}
                className="pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                onMouseDown={() => setShowOldPassword(true)}
                onMouseUp={() => setShowOldPassword(false)}
                onMouseLeave={() => setShowOldPassword(false)}
                aria-label={showOldPassword ? "Esconder senha" : "Mostrar senha"}
              >
                {showOldPassword ? <VisibilityOffIcon className="text-cyan-500"/> : <VisibilityIcon />}
              </button>
            </div>
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
        <SheetFooter className="mt-4">
          <UserSubmitButton />
          <SheetClose asChild>
            <Button variant="outline">Fechar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}