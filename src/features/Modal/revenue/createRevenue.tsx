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
import { RevenueTable } from "@/features/actions/revenue/columns";

interface CreateRevenueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (revenue: Omit<RevenueTable, "id">) => Promise<void>;
  isSubmitting?: boolean;
}

export function CreateRevenueModal({
  open,
  onOpenChange,
  onSave,
  isSubmitting = false,
}: CreateRevenueModalProps) {
  const [formData, setFormData] = useState<Partial<RevenueTable>>({
    description: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0] as string,
    category: "Serviço",
    source: "Diversos",
  });

  useEffect(() => {
    if (!open && !isSubmitting) {
      setFormData({
        description: "",
        amount: 0,
        date: new Date().toISOString().split("T")[0],
        category: "Serviço",
        source: "Diversos",
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
      console.log(value)
    }
  };

const handleSubmit = async () => {
  if (!formData.description || !formData.amount) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  let date = formData.date;
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    date = date + "T00:00:00Z";
  }

  try {
    await onSave({ ...formData, date } as Omit<RevenueTable, "id">);
  } catch (error) {
    console.error("Erro ao criar receita:", error);
  }
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Nova Receita</DialogTitle>
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
              placeholder="Descreva a receita"
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
                <SelectItem value="Serviço">Serviço</SelectItem>
                <SelectItem value="Venda">Venda</SelectItem>
                <SelectItem value="Aluguel">Aluguel</SelectItem>
                <SelectItem value="Investimento">Investimento</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="source" className="text-right">
              Origem *
            </Label>
            <Select
              value={formData.source}
              onValueChange={(value) => handleSelectChange("source", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecione uma origem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Veículo">Veículo</SelectItem>
                <SelectItem value="Peças">Peças</SelectItem>
                <SelectItem value="Equipamentos">Equipamentos</SelectItem>
                <SelectItem value="Diversos">Diversos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Salvando receita..." : "Criar receita"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}