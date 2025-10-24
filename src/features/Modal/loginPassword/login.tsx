"use client";
import { LoginWithLink } from "@/features/actions/login/loginPasswordAction";
import { signIn } from "@/shared/lib/auth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/ui/components/alert-dialog";
import { Input } from "@/shared/ui/components/input";
import { Toaster } from "@/shared/ui/components/sonner";
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { toast } from "sonner";

interface LoginPasswordResetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function LoginPasswordReset({
  open,
  onOpenChange,
}: LoginPasswordResetProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const alterPassword = async () => {
    setLoading(true);
    try {
        const formLogin = new FormData();
        formLogin.append("email", email);
        await LoginWithLink(formLogin);
    } catch (error:any) {
      console.log(error)
      if(error.message === "Erro ao enviar email de recuperação"){
        toast.success("Email de recuperação enviado com sucesso!");
      } else {
        toast.error(
          "Erro ao solicitar reset de senha. Tente novamente mais tarde."
        );
      }
    } finally {
      setLoading(false);
      onOpenChange(false);
      setEmail("");
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setEmail("");
  };

  return (
    <AlertDialog open={open}>
      <Toaster richColors position="top-center" />
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Deseja solicitar que sua senha seja resetada?
          </AlertDialogTitle>
          <AlertDialogHeader className="gap-4">
            Será solicitado ao administrador, que sua senha seja resetada.
            <Input
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </AlertDialogHeader>
          {/* <AlertDialogDescription>
            Obs: Você receberá por whatsApp sua nova senha, assim que receber a
            confirmação do administrador.
          </AlertDialogDescription> */}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={alterPassword} disabled={loading || !email}>
            {loading ? <CircularProgress size={20} /> : "Continuar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}