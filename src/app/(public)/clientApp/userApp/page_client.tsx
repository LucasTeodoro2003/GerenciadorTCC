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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/components/select";
import { Toaster } from "@/shared/ui/components/sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui/components/tabs";
import ThemeToggleV2 from "@/shared/ui/components/toggleDarkMode";
import { CircularProgress } from "@mui/material";
import { Address, User, Vehicle } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import { updatePerfilUserPageNoImage } from "@/shared/lib/actionUpdateUserNoImage";
import { updateUser2 } from "@/shared/lib/actionsUpdateUser";
import { edityVehicleClient } from "@/shared/lib/actionUpdateVehicleClient";
import { updateAddressClient } from "@/shared/lib/actionUpdateAddressClient";
import { createAddressClient } from "@/shared/lib/actionCreateAddressClient";
import { deleteCarClient } from "@/shared/lib/actionDeleteCarClient";
import { createVehicleClient } from "@/shared/lib/actionCreateVehicleClient";
import { HomeIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { SheetPasswordClient } from "@/features/Modal/passwordUserClient/user";

interface TabsUserProps {
  user: User;
  address: Address;
  vehicles: Vehicle[];
}
export function TabsUser({ user, address, vehicles }: TabsUserProps) {
  const [name, setName] = useState(user.name || "Nome não definido");
  const [email, setEmail] = useState(user.email || "Email não definido");
  const [phone, setPhone] = useState(user.phone || "Telefone não definido");
  const [color, setColor] = useState("");
  const [type, setType] = useState("");
  const [model, setModel] = useState("");
  const [plate, setPlate] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [tabs, setTabs] = useState("user");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user?.image || null
  );
  const [street, setStreet] = useState(address?.street || "");
  const [city, setCity] = useState(address?.city || "");
  const [complement, setComplement] = useState(address?.complement || "");
  const [district, setDistrict] = useState(address?.district || "");
  const [number, setNumber] = useState(address?.number || "");
  const [postalCode, setPostalCode] = useState(address?.postalCode || "");
  const [state, setState] = useState(address?.state || "");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const firtAcess = address?.isPrimary;
  if (!firtAcess) {
    toast.info("Adicione um endereço");
  }
  const router = useRouter();
  const [page, setPage] = useState(false);
  const [alterPassword, setAlterPassword] = useState(false);
  const params = useSearchParams();
  router.prefetch("/clientApp");
  router.prefetch("/clientApp/calendarApp");
  router.prefetch("/clientApp/userApp");
  router.prefetch("/clientApp/loginApp");

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

  const handleSelectVehicle = (vehicleId: any) => {
    setSelectedVehicleId(vehicleId);
    const selected = vehicles.find((v) => v.id === vehicleId);

    if (selected) {
      setPlate(selected.plate || "");
      setModel(selected.model || "");
      setType(selected.type || "");
      setColor(selected.color || "");
      setYear(selected.yearCar || "");
    }
  };
  const handleDeleteVehicle = async () => {
    if (!selectedVehicleId) return;

    if (confirm("Tem certeza que deseja excluir este veículo?")) {
      setLoading(true);
      try {
        await deleteCarClient(selectedVehicleId);
        setSelectedVehicleId("");
        toast.success("Veículo excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir veículo:", error);
        toast.error("Erro ao excluir veículo.");
      } finally {
        setLoading(false);
      }
    }
  };

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
        if (imagePreview && !imagePreview.startsWith("/")) {
          URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error("Erro ao comprimir imagem:", error);
        toast("Não foi possível processar a imagem. Tente novamente.");
      }
    }
  };

  const updateUser = async () => {
    setLoading(true);
    try {
      const formUser = new FormData();
      formUser.append("name", name);
      formUser.append("email", email);
      formUser.append("phone", phone);
      formUser.append("userId", user.id);
      formUser.append("image", image || "");
      if (!image) {
        await updatePerfilUserPageNoImage(formUser);
      } else {
        await updateUser2(user.id, formUser);
      }
      setLoading(false);
      toast.success("Usuario atualizado com sucesso");
    } catch (err) {
      console.error("Erro ao atualizar o usuario: ", err);
      setLoading(false);
      toast.error("Erro ao atulizar o usuario");
    }
  };

  const handleupdateAddress = async () => {
    setLoading(true);
    try {
      const addressForm = new FormData();
      addressForm.append("street", street);
      addressForm.append("id", address?.id || "");
      addressForm.append("number", number || "");
      addressForm.append("complement", complement || "");
      addressForm.append("district", district || "");
      addressForm.append("city", city || "");
      addressForm.append("state", state || "");
      addressForm.append("postalCode", postalCode || "");
      addressForm.append("userId", user?.id || "");
      if (address?.id) {
        await updateAddressClient(addressForm);
      } else {
        await createAddressClient(addressForm);
      }
      setStreet("");
      setNumber("");
      setComplement("");
      setDistrict("");
      setCity("");
      setState("");
      setPostalCode("");
      setLoading(false);
      toast.success("Atualizado com sucesso");
    } catch (err) {
      console.error("Erro ao atualizar endereço: ", err);
      toast.error("Erro ao atualizar endereço");
      setLoading(false);
    }
  };

  const handleSendVehicle = async () => {
    setLoading(true);
    try {
      const formVehicle = new FormData();
      formVehicle.append("color", color);
      formVehicle.append("model", model);
      formVehicle.append("plate", plate);
      formVehicle.append("type", type);
      formVehicle.append("year", year);
      formVehicle.append("user", user.id || "");
      formVehicle.append("enterpriseId", "1");

      await createVehicleClient(formVehicle);

      toast.success("Veículo criado com sucesso");
      setColor("");
      setModel("");
      setPlate("");
      setType("");
      setYear("");
      setLoading(false);
    } catch (err) {
      console.error("Erro ao criar veículo:", err);
      toast.error("Erro ao criar veículo");
      setLoading(false);
    }
  };

  const handleEdityVehicle = async () => {
    setLoading(true);
    try {
      const formVehicle = new FormData();
      formVehicle.append("color", color);
      formVehicle.append("model", model);
      formVehicle.append("plate", plate);
      formVehicle.append("type", type);
      formVehicle.append("year", year);
      formVehicle.append("user", user.id || "");
      formVehicle.append("enterpriseId", "1");
      formVehicle.append("idvehicle", selectedVehicleId);

      await edityVehicleClient(formVehicle);

      toast.success("Veículo editado com sucesso");
      setColor("");
      setModel("");
      setPlate("");
      setType("");
      setYear("");
      setLoading(false);
    } catch (err) {
      console.error("Erro ao editar veículo:", err);
      toast.error("Erro ao editar veículo");
      setLoading(false);
    }
  };

  const handleHome = () => {
    setPage(true);
    router.push("/clientApp");
  };

  useEffect(() => {
    const tablesNew = params.get("tabs");
    if (tablesNew) {
      setTabs(tablesNew);
      const newParams = new URLSearchParams(params.toString());
      newParams.delete("tabs");
      router.push(`/clientApp/userApp?${newParams.toString()}`);
    }
  }, [params]);

  return (
    <>
      <div className="absolute top-6 right-6">
        <ThemeToggleV2 />
      </div>
      <SheetPasswordClient
        userId={user.id}
        alterPassword={alterPassword}
        setAlterPassword={setAlterPassword}
      />
      <div className="flex justify-center items-center w-full h-screen -pt-10">
        <Toaster richColors position="top-center" />
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="flex justify-center">
            <Button
              className="bg-transparent hover:bg-gray-300 dark:hover:bg-gray-500"
              onClick={() => handleHome()}
            >
              {!page ? (
                <HomeIcon className="text-black dark:text-white" />
              ) : (
                <CircularProgress size={20} />
              )}
            </Button>
          </div>
          <Tabs value={tabs}>
            <TabsList>
              <TabsTrigger value="user" onClick={() => setTabs("user")}>
                Usuario
              </TabsTrigger>
              <TabsTrigger
                value="address"
                onClick={() => {
                  setTabs("address");
                }}
              >
                Endereço
              </TabsTrigger>
              <TabsTrigger
                value="vehicle"
                onClick={() => {
                  setTabs("vehicle");
                }}
              >
                Veículos
              </TabsTrigger>
              <TabsTrigger
                value="password"
                onClick={() => setAlterPassword(true)}
              >
                Alterar Senha
              </TabsTrigger>
            </TabsList>
            <TabsContent value="user">
              <Card>
                <CardHeader>
                  <CardTitle>Editar dados</CardTitle>
                  <CardDescription>Dados do usuário</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative h-32 w-32 rounded-full overflow-hidden border-2 border-border">
                      <img
                        src={imagePreview || "/usuario.png"}
                        alt={`Imagem de ${user?.name || "perfil"}`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                        <label
                          htmlFor="profile-image-upload"
                          className="cursor-pointer p-2 rounded-full bg-background/80 hover:bg-background"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-camera"
                          >
                            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                            <circle cx="12" cy="13" r="3"></circle>
                          </svg>
                        </label>
                        <input
                          id="profile-image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Clique na imagem para alterar
                    </p>
                  </div>

                  <div className="grid gap-3">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      placeholder="Digite seu nome"
                      defaultValue={name || "Sem nome"}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="Digite seu email"
                      type="email"
                      defaultValue={email || "Sem email"}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      placeholder="Digite seu Telefone"
                      type="phone"
                      defaultValue={phone || "Sem Telefone"}
                      maxLength={11}
                      onChange={(e) => {
                        setPhone(e.target.value);
                      }}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => {
                      updateUser();
                    }}
                    disabled={!email || !name || loading || phone.length < 11}
                  >
                    {!loading ? (
                      "Salvar alterações"
                    ) : (
                      <CircularProgress size={20} />
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="vehicle">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Veículo</CardTitle>
                    <CardDescription>
                      {isEditing
                        ? "Edite as informações do seu veículo"
                        : "Adicione um novo veículo"}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? "Adicionar Novo" : "Meus Veículos"}
                  </Button>
                </CardHeader>

                {!isEditing ? (
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-3">
                          <Label htmlFor="plate">Placa *</Label>
                          <Input
                            id="plate"
                            maxLength={7}
                            placeholder="Digite a placa do seu veículo"
                            value={plate}
                            onChange={(e) => setPlate(e.target.value)}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="model">Modelo *</Label>
                          <Input
                            id="model"
                            placeholder="Digite o modelo do seu veículo"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-3">
                          <Label htmlFor="type">Tipo *</Label>
                          <Select
                            onValueChange={(e) => setType(e)}
                            value={type}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Carro">Carro</SelectItem>
                              <SelectItem value="Moto">Moto</SelectItem>
                              <SelectItem value="Triciclo">Triciclo</SelectItem>
                              <SelectItem value="Colecionado">
                                Item de Colecionador
                              </SelectItem>
                              <SelectItem value="Bike">Bicicleta</SelectItem>
                              <SelectItem value="Caminhão">Caminhão</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="cor">Cor *</Label>
                          <Input
                            id="cor"
                            placeholder="Digite a cor do seu veículo"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid gap-3">
                        <Label htmlFor="year">Ano *</Label>
                        <Input
                          id="year"
                          placeholder="Digite o ano do seu veículo"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                        />
                      </div>
                    </div>
                    <CardFooter className="mt-6 px-0">
                      <Button
                        onClick={handleSendVehicle}
                        disabled={
                          !model ||
                          !plate ||
                          !year ||
                          !type ||
                          !color ||
                          loading
                        }
                      >
                        {!loading ? (
                          "Salvar Novo Veículo"
                        ) : (
                          <CircularProgress size={20} />
                        )}
                      </Button>
                    </CardFooter>
                  </CardContent>
                ) : (
                  <CardContent>
                    {vehicles && vehicles.length > 0 ? (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label>Selecione um veículo para editar</Label>
                          <Select
                            onValueChange={handleSelectVehicle}
                            value={selectedVehicleId}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Escolha um veículo" />
                            </SelectTrigger>
                            <SelectContent>
                              {vehicles.map((vehicle) => (
                                <SelectItem key={vehicle.id} value={vehicle.id}>
                                  {vehicle.model} - {vehicle.plate}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {selectedVehicleId && (
                          <div className="border rounded-lg p-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-3">
                                <Label htmlFor="edit-plate">Placa *</Label>
                                <Input
                                  id="edit-plate"
                                  maxLength={7}
                                  placeholder="Digite a placa do seu veículo"
                                  value={plate}
                                  onChange={(e) => setPlate(e.target.value)}
                                />
                              </div>
                              <div className="grid gap-3">
                                <Label htmlFor="edit-model">Modelo *</Label>
                                <Input
                                  id="edit-model"
                                  placeholder="Digite o modelo do seu veículo"
                                  value={model}
                                  onChange={(e) => setModel(e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="grid gap-3">
                                <Label htmlFor="edit-type">Tipo *</Label>
                                <Select
                                  onValueChange={(e) => setType(e)}
                                  value={type}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecione o tipo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Carro">Carro</SelectItem>
                                    <SelectItem value="Moto">Moto</SelectItem>
                                    <SelectItem value="Triciclo">
                                      Triciclo
                                    </SelectItem>
                                    <SelectItem value="Colecionado">
                                      Item de Colecionador
                                    </SelectItem>
                                    <SelectItem value="Bike">
                                      Bicicleta
                                    </SelectItem>
                                    <SelectItem value="Caminhão">
                                      Caminhão
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-3">
                                <Label htmlFor="edit-cor">Cor *</Label>
                                <Input
                                  id="edit-cor"
                                  placeholder="Digite a cor do seu veículo"
                                  value={color}
                                  onChange={(e) => setColor(e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="grid gap-3">
                              <Label htmlFor="edit-year">Ano *</Label>
                              <Input
                                id="edit-year"
                                placeholder="Digite o ano do seu veículo"
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                              />
                            </div>

                            <div className="flex justify-between mt-4">
                              <Button
                                variant="outline"
                                onClick={handleDeleteVehicle}
                                disabled={loading}
                                className="text-red-500 border-red-200 hover:bg-red-50"
                              >
                                Excluir Veículo
                              </Button>
                              <Button
                                onClick={() => {
                                  handleEdityVehicle();
                                }}
                                disabled={
                                  !model ||
                                  !plate ||
                                  !year ||
                                  !type ||
                                  !color ||
                                  loading
                                }
                              >
                                {!loading ? (
                                  "Salvar Alterações"
                                ) : (
                                  <CircularProgress size={20} />
                                )}
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          Você ainda não possui veículos cadastrados.
                        </p>
                        <Button
                          className="mt-4"
                          onClick={() => setIsEditing(false)}
                        >
                          Adicionar Primeiro Veículo
                        </Button>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            </TabsContent>
            <TabsContent value="address">
              <Card>
                <CardHeader>
                  <CardTitle>Editar dados</CardTitle>
                  <CardDescription>Dados do Endereço</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="street">Nome da Rua</Label>
                      <Input
                        id="street"
                        placeholder="Rua"
                        defaultValue={street}
                        onChange={(e) => setStreet(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="number">Número</Label>
                      <Input
                        id="number"
                        placeholder="Número da Casa"
                        defaultValue={number}
                        onChange={(e) => setNumber(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="district">Bairro</Label>
                      <Input
                        id="district"
                        placeholder="Bairro"
                        defaultValue={district}
                        onChange={(e) => setDistrict(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="complement">Complemento</Label>
                      <Input
                        id="complement"
                        placeholder="Complemento"
                        defaultValue={complement}
                        onChange={(e) => setComplement(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        placeholder="Cidade"
                        defaultValue={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
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
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="postalCode">CEP</Label>
                    <Input
                      id="postalCode"
                      placeholder="CEP"
                      defaultValue={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      maxLength={8}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleupdateAddress()}
                    disabled={
                      !street ||
                      !state ||
                      !city ||
                      !postalCode ||
                      !district ||
                      !number ||
                      !complement
                    }
                  >
                    {!loading ? (
                      "Salvar alterações"
                    ) : (
                      <CircularProgress size={20} />
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
