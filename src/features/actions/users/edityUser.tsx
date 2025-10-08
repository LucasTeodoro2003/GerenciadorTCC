"use client";
import { Button } from "@/shared/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/components/card";
import { Input } from "@/shared/ui/components/input";
import { Label } from "@/shared/ui/components/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui/components/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/components/select";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { Prisma } from "@prisma/client";
import { CircularProgress } from "@mui/material";
import { MapPin } from "lucide-react";
import { SheetPassword } from "@/features/Modal/passwordUser/user";
import { updatePerfilUserPage } from "@/shared/lib/actionUpdateUser";
import { updateAddress } from "@/shared/lib/actionUpdateAdress";
import { updatePerfilUserPageNoImage } from "@/shared/lib/actionUpdateUserNoImage";
import imageCompression from "browser-image-compression";
import { createAddress } from "@/shared/lib/actionCreateAddress";

export interface EdityUserProps {
  user: Prisma.UserGetPayload<{
    include: { addresses: { where: { isPrimary: true } } };
  }>;
}

export function EdityUser({ user }: EdityUserProps) {
  const [userName, setUserName] = useState(user.name || "Nome não definido");
  const [userEmail, setUserEmail] = useState(
    user.email || "Email não definido"
  );
  const [userPhone, setUserPhone] = useState(
    user.phone || "Telefone não definido"
  );
  const [addAddress, setAddAddress] = useState(true);
  const [street, setStreet] = useState(
    user.addresses[0]?.street || "Rua não definida"
  );
  const [number, setNumber] = useState(
    user.addresses[0]?.number || "Número não definido"
  );
  const [complement, setComplement] = useState(
    user.addresses[0]?.complement || "Complemento não definido"
  );
  const [district, setDistrict] = useState(
    user.addresses[0]?.district || "Bairro não definido"
  );
  const [city, setCity] = useState(
    user.addresses[0]?.city || "Cidade não definida"
  );
  const [state, setState] = useState(user.addresses[0]?.state || "MG");
  const [postalCode, setPostalCode] = useState(
    user.addresses[0]?.postalCode || "00000000"
  );
  const [isPrimaryAddress, setIsPrimaryAddress] = useState(true);
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user.image || "/usuario.png"
  );

  const brazilianStates = [
    "AC",
    "AL",
    "AP",
    "AM",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MT",
    "MS",
    "MG",
    "PA",
    "PB",
    "PR",
    "PE",
    "PI",
    "RJ",
    "RN",
    "RS",
    "RO",
    "RR",
    "SC",
    "SP",
    "SE",
    "TO",
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        setImage(compressedFile);
        setImagePreview(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error("Erro ao comprimir imagem:", error);
      }
    }
  };

  const ImagePreview = () => {
    if (imagePreview) {
      return (
        <img
          src={imagePreview}
          alt={`Imagem de ${user.name}`}
          className="w-32 h-32 object-cover rounded-full"
        />
      );
    }
    return (
      <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
        Sem imagem
      </div>
    );
  };

  const handleEditUser = async () => {
    try {
      if (
        !userName ||
        !userEmail ||
        !street ||
        !district ||
        !city ||
        !state ||
        !postalCode ||
        isPrimaryAddress === null ||
        isPrimaryAddress === undefined
      ) {
        toast.error("Preencha todos os campos");
        return;
      }
      setIsSubmittingUser(true);
      const userFormData = new FormData();
      userFormData.append("email", userEmail);
      userFormData.append("name", userName);
      userFormData.append("phone", userPhone || "");
      userFormData.append("userId", user.id || "");
      userFormData.append("image", image || "");

      const addressFormData = new FormData();
      addressFormData.append("street", street);
      addressFormData.append("district", district);
      addressFormData.append("city", city);
      addressFormData.append("state", state);
      addressFormData.append("postalCode", postalCode);
      addressFormData.append("isPrimary", isPrimaryAddress.toString());
      addressFormData.append("id", user.addresses[0]?.id);
      addressFormData.append("number", number || "");
      addressFormData.append("complement", complement || "");
      addressFormData.append("userId", user.id || "")

      if (image) {
        await updatePerfilUserPage(userFormData);
      } else {
        await updatePerfilUserPageNoImage(userFormData);
      }
      toast.success("Usuário atualizado com sucesso!");
      if (!user.addresses?.[0]) {
        await createAddress(addressFormData)
        toast.success("Endereço criado com Sucesso")
      } else {
        await updateAddress(addressFormData);
        toast.success("Endereço atualizado com Sucesso!");
      }
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      setUserName("");
      setUserEmail("");
      setUserPhone("");
      setAddAddress(false);
      setStreet("");
      setNumber("");
      setComplement("");
      setDistrict("");
      setCity("");
      setState("");
      setPostalCode("");
      setIsPrimaryAddress(true);
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      console.error("Erro geral ao editar usuário:", error);
      toast.error("Ocorreu um erro ao editar o usuário: ");
    } finally {
      setIsSubmittingUser(false);
    }
  };

  const UserSubmitButton = () => (
    <Button
      className="w-full flex items-center justify-center"
      onClick={handleEditUser}
      disabled={
        isSubmittingUser ||
        !userName ||
        !userEmail ||
        (addAddress && (!street || !district || !city || !state || !postalCode))
      }
    >
      {isSubmittingUser ? <CircularProgress size={20} /> : "Editar Usuário"}
    </Button>
  );

  return (
    <div className="w-full h-full p-4">
      <Toaster richColors position="top-center" />
      <Tabs defaultValue="user" className="w-full">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="user">Usuário</TabsTrigger>
        </TabsList>
        <TabsContent value="user" className="w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Editar Usuário</CardTitle>
              <CardDescription>
                Preencha os dados para editar o usuário.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Nome Completo <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="Digite o nome completo"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      E-mail <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      placeholder="Digite o e-mail"
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      placeholder="Ex: 34999999999"
                      maxLength={11}
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Imagem do usuário</Label>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="file-input"
                    />
                  </div>
                  <div className="mt-4">
                    <ImagePreview />
                  </div>
                </div>
                <div className="space-y-7 w-full ">
                  <SheetPassword userId={user.id} />
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="add-address"
                    checked={addAddress}
                    onChange={(e) => setAddAddress(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label
                    htmlFor="add-address"
                    className="font-medium flex items-center gap-1"
                  >
                    <MapPin className="h-4 w-4" />
                    Adicionar endereço
                  </Label>
                </div>

                {addAddress && (
                  <div className="grid gap-6 md:grid-cols-2 mt-4 p-4 bg-muted/50 rounded-md">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="street">
                          Rua/Logradouro <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="street"
                          placeholder="Ex: Rua das Flores"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="number">Número</Label>
                          <Input
                            id="number"
                            placeholder="Ex: 123"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="complement">Complemento</Label>
                          <Input
                            id="complement"
                            placeholder="Ex: Apto 101"
                            value={complement}
                            onChange={(e) => setComplement(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="district">
                          Bairro <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="district"
                          placeholder="Ex: Centro"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">
                          Cidade <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="city"
                          placeholder="Ex: São Paulo"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="state">
                            Estado <span className="text-red-500">*</span>
                          </Label>
                          <Select value={state} onValueChange={setState}>
                            <SelectTrigger>
                              <SelectValue placeholder="UF" />
                            </SelectTrigger>
                            <SelectContent>
                              {brazilianStates.map((st) => (
                                <SelectItem key={st} value={st}>
                                  {st}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="postalCode">
                            CEP <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="postalCode"
                            placeholder="Ex: 01234567"
                            maxLength={8}
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-4">
                        <input
                          type="checkbox"
                          id="primary-address"
                          checked={isPrimaryAddress}
                          onChange={(e) =>
                            setIsPrimaryAddress(e.target.checked)
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="primary-address">
                          Definir como endereço principal
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <UserSubmitButton />
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
