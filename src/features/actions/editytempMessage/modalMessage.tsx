import { Button } from "@/shared/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/components/dialog";
import { Input } from "@/shared/ui/components/input";
import { Label } from "@/shared/ui/components/label";
import { Textarea } from "@/shared/ui/components/textarea";
import { User } from "@prisma/client";
import { useState } from "react";

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
  const defaultDays = 30;
  const [defaultMessage, setdefaultMessage] = useState("Olá! Tudo bem? \nQueremos agradecer pela confiança em escolher a Alvorada Estética Automotiva para cuidar do seu veículo. \nJá se passaram 30 dias desde o serviço realizado: [será preenchido automaticamente]. Esse é o momento ideal para fazer uma revisão preventiva ou até mesmo potencializar os resultados do serviço com um novo cuidado complementar — mantendo seu carro sempre com aparência de novo e protegido por muito mais tempo.Estamos à disposição para te orientar sobre o que é mais indicado para o seu veículo neste momento. \nConte com a gente para manter seu carro sempre impecável!\n\nEquipe Alvorada Estética Automotiva")
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [days, setDays] = useState(defaultDays);
  const [message, setMessage] = useState(defaultMessage);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      // Aqui você implementaria a lógica para salvar a configuração da mensagem automática
      // await updateAutomaticMessageSettings(user.id, formData);
      setOpenPerfil(false);
      alert("Configurações de mensagem automática atualizadas com sucesso!");
    } catch (err) {
      alert("Erro ao atualizar as configurações de mensagem automática");
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
                className="w-12 h-12 rounded-full"
              />
            </div>
            <DialogDescription>
              Configure a mensagem que será enviada automaticamente aos seus clientes
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="days" className="text-right">
                Intervalo (dias)
              </Label>
              <Input
                id="days"
                type="number"
                min="1"
                max="365"
                className="col-span-3"
                name="days"
                defaultValue={days}
                onChange={(e) => setDays(parseInt(e.target.value))}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="message">
                Conteúdo da mensagem
              </Label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                className="resize-none"
                defaultValue={defaultMessage}
                placeholder="Digite a mensagem que será enviada aos clientes..."
                onChange={(e)=>{setMessage(e.target.value)}}
              />
              <p className="text-sm text-gray-500 italic">
                Observação: Informações sobre o serviço realizado serão automaticamente 
                incluídas no final da mensagem.
              </p>
            </div>

            <div className="bg-gray-100 dark:bg-black p-3 rounded-md">
              <h4 className="font-medium mb-2">Prévia da mensagem:</h4>
              <div className="bg-white dark:bg-gray-800 dark:opacity-75 p-2 rounded border">
                <p>{message}</p>
                <p className="font-medium mt-2">Serviço realizado: <span className="text-gray-500">[será preenchido automaticamente]</span></p>
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