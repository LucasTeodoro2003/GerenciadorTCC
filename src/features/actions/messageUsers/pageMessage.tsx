"use client";

import ModalMessage from "@/features/actions/editytempMessage/modalMessage";
import { TableMessage } from "@/features/actions/userMessage/tableMessage";
import { Button } from "@/shared/ui/components/button";
import { Input } from "@/shared/ui/components/input";
import { Toaster } from "@/shared/ui/components/sonner";
import { Prisma, Products, User } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

export interface PageMessageProps {
  user: User;
  serviceTableMessage: Prisma.ServiceVehicleServiceGetPayload<{
    include: {
      service: {};
      serviceVehicle: {
        include: {
          vehicle: {
            include: {
              user: {
                include: {
                  vehicle: {
                    include: {
                      serviceVehicle: {
                        include: { services: { include: { service: {} } } };
                      };
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  }>[];
  products: Products[]
}

export default function PageMessage({
  user,
  serviceTableMessage,
  products,
}: PageMessageProps) {
  const [openModal, setOpenModal] = useState(false);

  return (
    <>
      <ModalMessage
        setOpenPerfil={setOpenModal}
        user={user}
        openModal={openModal}
      />
      {user.permission === 1 ? (
        <div className="flex w-full items-center gap-4">
          <div className="flex-1" />
          <div className="flex-1 flex justify-center">
            <h5 className="text-muted-foreground text-xl text-center">
              Últimos Serviços Realizados
            </h5>
          </div>
          <div className="flex-1 flex items-center justify-end space-x-4">
            <h1>Editar Mensagem</h1>
            <Button
              type="submit"
              variant="outline"
              className="bg-transparent rounded-full w-12 h-12 p-0 flex items-center justify-center"
              onClick={() => {
                setOpenModal(true);
              }}
            >
              <img
                src="/whatsapp.png"
                alt="whatsapp"
                className="w-12 dark:brightness-200 brightness-125 drop-shadow object-cover"
              />
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-center">
          <h5 className="text-muted-foreground text-xl text-center">
            Últimos Serviços Realizados
          </h5>
        </div>
      )}
      <div>
        <TableMessage user={user} serviceTableMessage={serviceTableMessage} products={products}/>
      </div>
    </>
  );
}
