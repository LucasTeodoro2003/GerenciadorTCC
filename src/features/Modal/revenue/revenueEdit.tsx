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
import { updateRevenue } from "@/shared/lib/actionUpdateRevenue";
import { useRouter } from "next/navigation";

interface EditRevenueModalProps {
  revenue: RevenueTable | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditRevenueModal({
  revenue,
  open,
  onOpenChange,
}: EditRevenueModalProps) {
  const [formData, setFormData] = useState<Partial<RevenueTable>>({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (revenue) {
      setFormData({
        id: revenue.id,
        description: revenue.description,
        amount: revenue.amount,
        date: revenue.date,
        category: revenue.category,
        source: revenue.source,
      });
    }
  }, [revenue]);

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
      setFormData((prev) => ({ ...prev, date: value + " 00:00:00" }));
    }
  };

  const handleSubmit = async () => {
    if (!revenue || !formData) return;
    
    setIsLoading(true);

    try {
      const formDate = new FormData();
      formDate.append("description", formData.description || "");
      formDate.append("amount", String(formData.amount || 0));
      
      let dateValue = formData.date || "";
      if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        dateValue = dateValue + " 00:00:00";
      }
      formDate.append("date", dateValue);
      
      formDate.append("category", formData.category || "");
      formDate.append("source", formData.source || "");
      
      await updateRevenue(revenue.id, formDate);
      
      setTimeout(()=>{
        router.refresh();
        onOpenChange(false);
        setIsLoading(false);
      }, 4000)
      
    } catch (error) {
      console.error("Erro ao salvar receita:", error);
      setIsLoading(false);
    }
  };

  const getInputDate = (date?: any) => {
    if (!date) return "";
    
    try {
      if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(date)) {
        const parts = date.split(' ');
        const datePart = parts[0];
        const timePart = parts[1];
        
        if (timePart === '00:00:00') {
          const [year, month, day] = datePart.split('-').map(Number);
          const adjustedDate = new Date(Date.UTC(year, month-1, day));
          return adjustedDate.toISOString().split('T')[0];
        }
        
        return datePart;
      }
      
      if (typeof date === 'string') {
        if (date.includes('T')) {
          const d = new Date(date);
          return d.toISOString().split('T')[0];
        }
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return date;
        }
      }
      
      const d = new Date(date);
      if (!isNaN(d.getTime())) {
        return d.toISOString().split('T')[0];
      }
      
      return "";
    } catch (e) {
      console.error("Erro ao processar data:", e);
      return "";
    }
  };

  if (!revenue) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Receita</DialogTitle>
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
              value={getInputDate(formData.date)}
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
              Origem
            </Label>
            <Select
              value={formData.source}
              onValueChange={(value) => handleSelectChange("source", value)}
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