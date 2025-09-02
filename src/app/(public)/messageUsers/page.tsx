"use client"

import { TableMessage } from "@/features/actions/userMessage/tableMessage";
import { Button } from "@/shared/ui/components/button";
import { Input } from "@/shared/ui/components/input";
import { Toaster } from "@/shared/ui/components/sonner";
import { useState } from "react";
import { toast } from "sonner";

export default function PageMessage() {
    const [message, setMessage] = useState("Esta enviando esta mensagem aqui")

    async function Test(message: string){
        console.log("Recebido => ",message)
        toast.success(`${message}`)
        console.log("EXECUTADO \n\n\n\n")
    }
    
  return (
    <>
    <div className="flex w-full items-center gap-2">
      <Input type="email" placeholder="Mensagem à ser enviada" value={message} onChange={(e) => {setMessage(e.target.value);console.log(message)}} className="border-gray-300"/>
      <Button type="submit" variant="outline" className="bg-transparent rounded-full w-12 h-12 p-0 flex items-center justify-center" onClick={()=> Test(message)}>
        <img src="whatsapp.png" alt="whatsapp" className="w-12 dark:brightness-200 brightness-125 drop-shadow "/>
      </Button>
      <Toaster richColors position="top-center"/>
    </div>
    <div>
      <TableMessage/>
    </div>
    </>
  );
}

