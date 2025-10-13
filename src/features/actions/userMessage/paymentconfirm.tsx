"use client"
import { updatePayment } from "@/shared/lib/actionsUpdatePayment";
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
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { toast } from "sonner";

interface AlertPayProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  id: string
}

export function AlertPay({ open, setOpen, id }: AlertPayProps) {
    const [pay, setPay] = useState(false)
  const payment = async () => {
    setPay(true)
    try{
        await updatePayment(id)
        toast.success("Pagamento confirmado!")
        setPay(false)
    }catch(err){
        console.error("Erro ao finalizar pagamento: ", err)
        toast.error("Erro ao finalizar pagamento!")
        setPay(false)
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deseja confirmar o pagamento?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={()=>payment()}>{!pay ? "Continue" : <CircularProgress size={20}/>}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
