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

interface CreateExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (expense: Omit<ExpenseTable, "id">) => Promise<void>;
  isSubmitting?: boolean;
}

export function CreateExpenseModal({
  open,
  onOpenChange,
  onSave,
  isSubmitting = false,
}: CreateExpenseModalProps) {
  const [formData, setFormData] = useState<Partial<ExpenseTable>>({
    description: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0] as string,
    category: "Outros",
    paymentMethod: "Dinheiro",
    status: "Pendente",
  });

  useEffect(() => {
    if (!open && !isSubmitting) {
      setFormData({
        description: "",
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        category: "Outros",
        paymentMethod: "Dinheiro",
        status: "Pendente",
      });
    }
  }, [open, isSubmitting]);

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
    if (!formData.description || !formData.amount) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await onSave(formData as Omit<ExpenseTable, "id">);
    } catch (error) {
      console.error("Erro ao criar despesa:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Despesa</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descrição *
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="col-span-3"
              placeholder="Descreva a despesa"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Valor (R$) *
            </Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              value={formData.amount || ""}
              onChange={handleNumberChange}
              className="col-span-3"
              placeholder="0,00"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Data *
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={(formData.date as string) || ""}
              onChange={handleDateChange}
              className="col-span-3"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Categoria *
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
              disabled={isSubmitting}
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
              Método de Pagamento *
            </Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) =>
                handleSelectChange("paymentMethod", value)
              }
              disabled={isSubmitting}
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
              Status *
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
              disabled={isSubmitting}
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
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Salvando despesa..." : "Criar despesa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}