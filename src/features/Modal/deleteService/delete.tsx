import { deleteServiceVehicle } from "@/shared/lib/actionDeleteServiceVehicle";
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
import { CircularProgress } from "@mui/material";
import { useState } from "react";
import { toast } from "sonner";

interface delServiceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  setSelectedEvent: (event: any | null) => void;
  deleteId: string;
}
export function DelService({ open, onOpenChange, setSelectedEvent, deleteId }: delServiceProps) {
  const [loading, setLoading] = useState(false);

  const DelService = async () => {
    setLoading(true);
    try {
      await deleteServiceVehicle(deleteId);
      onOpenChange(false);
      setSelectedEvent(null);
      toast.success("Serviço excluído com sucesso.");
    } catch (error) {
      console.error("Erro ao excluir o serviço:", error);
      toast.error("Erro ao excluir o serviço.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Serviço</AlertDialogTitle>
          <AlertDialogHeader>Deseja excluir este serviço?</AlertDialogHeader>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={DelService} disabled={loading}>
            {loading ? <CircularProgress size={20} /> : "Continuar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
