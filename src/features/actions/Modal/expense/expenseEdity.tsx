"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui/components/dialog";
import { Button } from "@/shared/ui/components/button";
import { Input } from "@/shared/ui/components/input";
import { Label } from "@/shared/ui/components/label";
import { Textarea } from "@/shared/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/components/select";
import { ExpenseTable } from "@/features/actions/expense/colunms";
import { updateExpense } from "@/shared/lib/actionUpdateExpense";
import { revalidatePath } from "next/cache";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface EditExpenseModalProps {
  expense: ExpenseTable | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditExpenseModal({
  expense,
  open,
  onOpenChange,
}: EditExpenseModalProps) {
  const [formData, setFormData] = useState<Partial<ExpenseTable>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (expense) {
      setFormData({
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
        category: expense.category,
        paymentMethod: expense.paymentMethod,
        status: expense.status,
      });
    }
  }, [expense]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (value) {
      setFormData((prev) => ({ ...prev, date: e.target.value }));
    }
  };

 const handleSubmit = async () => {
  if (!expense || !formData) return;
  
  setIsLoading(true);

  try {
    const formDate = new FormData();
    formDate.append("description", formData.description || "");
    formDate.append("amount", String(formData.amount || 0));
    formDate.append("date", formData.date || "");
    formDate.append("category", formData.category || "");
    formDate.append("paymentMethod", formData.paymentMethod || "");
    formDate.append("status", formData.status || "");
    
    await updateExpense(expense.id, formDate);
    
    setTimeout(()=>{
      router.refresh();
      onOpenChange(false);
      setIsLoading(false);
    }, 4000)
    
  } catch (error) {
    console.error("Erro ao salvar despesa:", error);
    setIsLoading(false);
  }
};

  if (!expense) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Despesa</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descrição
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Valor (R$)
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              value={formData.amount || ""}
              onChange={handleNumberChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Data
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={(formData.date as string) || ""}
              onChange={handleDateChange}
              className="col-span-3"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Categoria
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aluguel">Aluguel</SelectItem>
                <SelectItem value="Utilidades">Utilidades</SelectItem>
                <SelectItem value="Salários">Salários</SelectItem>
                <SelectItem value="Concertos">Concertos</SelectItem>
                <SelectItem value="Manutenção">Manutenção</SelectItem>
                <SelectItem value="Produtos">Produtos</SelectItem>
                <SelectItem value="Impostos">Impostos</SelectItem>
                <SelectItem value="Seguros">Seguros</SelectItem>
                <SelectItem value="Serviços">Serviços</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paymentMethod" className="text-right">
              Método de Pagamento
            </Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) =>
                handleSelectChange("paymentMethod", value)
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione um método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Transferência">Transferência</SelectItem>
                <SelectItem value="Débito Automático">
                  Débito Automático
                </SelectItem>
                <SelectItem value="Cartão de Crédito">
                  Cartão de Crédito
                </SelectItem>
                <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                <SelectItem value="Pix">Pix</SelectItem>
                <SelectItem value="Boleto">Boleto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pago">Pago</SelectItem>
                <SelectItem value="Pendente">Pendente</SelectItem>
                <SelectItem value="Atrasado">Atrasado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
