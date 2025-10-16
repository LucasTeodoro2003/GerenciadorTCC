"use client";
import { updateUser2 } from "@/shared/lib/actionsUpdateUser";
import { updateUserNoImage } from "@/shared/lib/actionsUpdateUserNoImage";
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
import { User } from "@prisma/client";
import { useState } from "react";
import imageCompression from "browser-image-compression";

interface ModalClientPromp {
  openModal: boolean;
  user: User;
}

export default function ModalClient({ openModal, user }: ModalClientPromp) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 0.9,
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };

        let compressedFile = await imageCompression(file, options);

        if (compressedFile.size > 900000) {
          const tougherOptions = {
            maxSizeMB: 0.8,
            maxWidthOrHeight: 600,
            useWebWorker: true,
          };
          compressedFile = await imageCompression(
            compressedFile,
            tougherOptions
          );
        }

        setImage(compressedFile);
      } catch (error) {
        console.error("Erro ao comprimir imagem:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);

      if (image) {
        formData.set("image", image);
      }

      const file = formData.get("image");

      if (!file || (file instanceof File && file.size === 0)) {
        console.log(formData);
        await updateUserNoImage(user.id || "", formData);
      } else {
        await updateUser2(user.id || "", formData);
      }
      window.location.reload();
    } catch (err) {
      alert("Erro ao atualizar");
    }
    setIsSubmitting(false);
    alert("Atualizado com sucesso");
  };

  return (
    <Dialog open={openModal}>
      <DialogContent className="sm:max-w-[425px] max-w-[90%] rounded-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>Editar Perfil</DialogTitle>
              <img
                src={user.image || "usuario.png"}
                alt={user.id}
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
            <DialogDescription>Digite suas informações</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 items-center gap-4">
              <div className="flex flex-col">
                <Label htmlFor="email" className="text-center mb-1">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  defaultValue={user.email ? user.email : "ERRO"}
                />
              </div>
              <div className="flex flex-col">
                <Label htmlFor="phone" className="text-center mb-1">
                  Telefone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  defaultValue={user.phone || ""}
                  maxLength={11}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="34999999999"
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-center">
                Nome
              </Label>
              <Input
                id="name"
                className="col-span-3"
                name="name"
                defaultValue={user.name ? user.name : "ERRO"}
              />
            </div>
            <div className="flex w-full items-center gap-1.5">
              <Label htmlFor="image" className="text-center">
                Selecione Nova Foto
              </Label>
              <Input
                id="image"
                type="file"
                name="image"
                onChange={handleFileChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!image}>
              {isSubmitting ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
