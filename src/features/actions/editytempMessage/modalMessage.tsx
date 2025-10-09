"use client";

import { updateMessageTemplate } from "@/shared/lib/actionUpdateMessageUser";
import { Button } from "@/shared/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/components/dialog";
import { Label } from "@/shared/ui/components/label";
import { Textarea } from "@/shared/ui/components/textarea";
import { User } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

interface ModalMessagePromp {
  openModal: boolean;
  user: User;
  setOpenPerfil: (open: boolean) => void;
}

export default function ModalMessage({
  openModal,
  user,
  setOpenPerfil,
}: ModalMessagePromp) {
  const [message, setMessage] = useState(user.message || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formMessage = new FormData()
    formMessage.append("userid", user.id)
    formMessage.append("message", message)
    try {
      const result = await updateMessageTemplate(formMessage);
      
      if (result.success) {
        toast.success("Configurações de mensagem automática atualizadas com sucesso!");
        setOpenPerfil(false);
      } else {
        toast.error("Erro ao atualizar as configurações de mensagem automática");
      }
    } catch (err) {
      toast.error("Erro ao atualizar as configurações de mensagem automática");
      console.error(err);
    }
    setIsSubmitting(false);
  };
  
  return (
    <Dialog onOpenChange={setOpenPerfil} open={openModal}>
      <DialogContent className="sm:max-w-[850px] max-w-full rounded-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Configuração de Mensagem Automática</DialogTitle>
              <img
                src={user.image || "usuario.png"}
                alt={user.name || "Usuário"}
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
            <DialogDescription>
              Configure a mensagem que será enviada automaticamente aos seus clientes
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="message">
                Conteúdo da mensagem
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                className="resize-none"
                value={message}
                placeholder="Digite a mensagem que será enviada aos clientes..."
                onChange={(e) => setMessage(e.target.value)}
              />
              <p className="text-sm text-gray-500 italic">
                Observação: Use "[serviço aqui]" como marcador para onde o serviço 
                finalizado deve aparecer.
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-black p-3 rounded-md">
              <h4 className="font-medium mb-2">Prévia da mensagem:</h4>
              <div className="bg-white dark:bg-gray-800 dark:opacity-75 p-2 rounded border">
                <p>{message}</p>
                <p className="font-medium mt-2">Serviço realizado: <span className="text-gray-500">[serviço aqui]</span></p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}