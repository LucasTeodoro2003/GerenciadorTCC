"use client";

import ModalMessage from "@/features/actions/editytempMessage/modalMessage";
import { TableMessage } from "@/features/actions/userMessage/tableMessage";
import { Button } from "@/shared/ui/components/button";
import { Input } from "@/shared/ui/components/input";
import { Toaster } from "@/shared/ui/components/sonner";
import { User } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

interface PageMessageProps {
  user: User;
  users: User[];
}

export default function PageMessage({ user, users }: PageMessageProps) {
  const [message, setMessage] = useState("Esta enviando esta mensagem aqui");
  const [openModal, setOpenModal] = useState(false);

  // async function Test(message: string){
  //     console.log("Recebido => ",message)
  //     toast.success(`${message}`)
  //     console.log("EXECUTADO \n\n\n\n")
  // }

  return (
    <>
      <ModalMessage
        setOpenPerfil={setOpenModal}
        user={user}
        openModal={openModal}
      />
      <div className="flex w-full items-center gap-4">
        <div className="flex-1"></div>
        <div className="flex-1 flex justify-center">
          <h5 className="text-muted-foreground text-xl text-center">
            Últimos Serviços Realizados
          </h5>
        </div>
        <div className="flex-1 flex items-center justify-end space-x-4">
          <h1>Editar Mensagem</h1>
          {/* <Input type="message" placeholder="Mensagem à ser enviada" value={message} onChange={(e) => {setMessage(e.target.value);console.log(message)}} className="border-gray-300"/> */}
          <Button
            type="submit"
            variant="outline"
            className="bg-transparent rounded-full w-12 h-12 p-0 flex items-center justify-center"
            onClick={() => {
              setOpenModal(true);
            }}
          >
            <img
              src="whatsapp.png"
              alt="whatsapp"
              className="w-12 dark:brightness-200 brightness-125 drop-shadow "
            />
          </Button>
        </div>
        <Toaster richColors position="top-center" />
      </div>
      <div>
        <TableMessage />
      </div>
    </>
  );
}
