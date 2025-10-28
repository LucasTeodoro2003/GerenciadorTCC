import { Button } from "@/shared/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/components/card"
import { Input } from "@/shared/ui/components/input"
import { Label } from "@/shared/ui/components/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui/components/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/components/select"
import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/components/popover"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shared/ui/components/command"
import { toast, Toaster } from "sonner"
import { User } from "@prisma/client"
import { createVehicle } from "@/shared/lib/actionCreateVehicle"
import { createAddress } from "@/shared/lib/actionCreateAddress"
import { CircularProgress } from "@mui/material"
import { createUserPage } from "@/shared/lib/actionsCreateuserPage"
import { getUserByEmail } from "@/shared/lib/actionGetUser"
import { useRouter, useSearchParams } from "next/navigation"
import { edityVehicle } from "@/shared/lib/actionUpdateVehicle"


export interface CreateServiceProps{
    users: User[]
}

export function CreateUserSomeVehicle({users}:CreateServiceProps) {
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userPhone, setUserPhone] = useState("")
  const [userPermission, setUserPermission] = useState("3")
  const [addAddress, setAddAddress] = useState(false)
  const [street, setStreet] = useState("")
  const [number, setNumber] = useState("")
  const [complement, setComplement] = useState("")
  const [district, setDistrict] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [isPrimaryAddress, setIsPrimaryAddress] = useState(true)
  const [vehicleOwner, setVehicleOwner] = useState("")
  const [vehiclePlate, setVehiclePlate] = useState("")
  const [vehicleType, setVehicleType] = useState("")
  const [vehicleModel, setVehicleModel] = useState("")
  const [vehicleYear, setVehicleYear] = useState("")
  const [vehicleColor, setVehicleColor] = useState("")
  const [isSubmittingUser, setIsSubmittingUser] = useState(false)
  const [isSubmittingVehicle, setIsSubmittingVehicle] = useState(false)
  const [idvehicle, setidVehicle] = useState("")
  const brazilianStates = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
    "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ]
    const params = useSearchParams()
    const router = useRouter()
  

  const handleCreateUser = async () => {
    try {
      if (!userName || !userEmail) {
        toast.error("Preencha os campos obrigatórios (Nome e E-mail)")
        return
      }
      setIsSubmittingUser(true);
      const userFormData = new FormData()
      userFormData.append("email", userEmail)
      userFormData.append("password", "123456789")
      userFormData.append("permission", userPermission.toString())
      userFormData.append("name", userName)
      userFormData.append("enterpriseId", users[0].enterpriseId || "")
      if (userPhone) {
        userFormData.append("phone", userPhone)
      }
      let result;
      try {
        result = await createUserPage(userFormData);
      } catch (createError) {
        console.error("Erro ao chamar createUserPage:", createError);
        toast.error("Erro ao criar usuário");
        setIsSubmittingUser(false);
        return;
      }
      if (!result || !result.success) {
        console.error("Falha ao criar usuário:", result);
        toast.error("Não foi possível criar o usuário");
        toast.error("EMAIL JÁ CADASTRADO")
        setIsSubmittingUser(false);
        return;
      }
      if (addAddress) {
        if (!street || !district || !city || !state || !postalCode) {
          toast.error("Preencha os campos obrigatórios do endereço");
          setIsSubmittingUser(false);
          return;
        }      
        let newUser;
        try {
          newUser = await getUserByEmail(userEmail);
        } catch (getUserError) {
          console.error("Erro ao buscar usuário por email:", getUserError);
          toast.error("Erro ao buscar dados do usuário para o endereço");
          setIsSubmittingUser(false);
          return;
        }
        if (!newUser || !newUser.id) {
          console.error("Usuário não encontrado após criação");
          toast.error("Não foi possível recuperar as informações do usuário para cadastrar o endereço");
          setIsSubmittingUser(false);
          return;
        }
        const addressFormData = new FormData();
        addressFormData.append("userId", newUser.id);
        addressFormData.append("street", street);
        addressFormData.append("district", district);
        addressFormData.append("city", city);
        addressFormData.append("state", state);
        addressFormData.append("postalCode", postalCode);
        addressFormData.append("isPrimary", isPrimaryAddress.toString());
        if (number) {
          addressFormData.append("number", number);
        }
        if (complement) {
          addressFormData.append("complement", complement);
        }      
        try {
          const addressResult = await createAddress(addressFormData);
        } catch (addressError) {
          console.error("Erro ao criar endereço:", addressError);
          toast.error("Erro ao cadastrar endereço: ");
          setIsSubmittingUser(false);
          return;
        }
      }
      toast.success(`Usuário cadastrado com sucesso!${addAddress ? ' Endereço adicionado.' : ''}`);      
      setTimeout(() => {
        window.location.reload();
      }, 1500);    
      setUserName("");
      setUserEmail("");
      setUserPhone("");
      setUserPermission("3");
      setAddAddress(false);
      setStreet("");
      setNumber("");
      setComplement("");
      setDistrict("");
      setCity("");
      setState("");
      setPostalCode("");
      setIsPrimaryAddress(true);
    } catch (error) {
      console.error("Erro geral ao criar usuário:", error);
      toast.error("Ocorreu um erro ao cadastrar o usuário: ")
    } finally {
      setIsSubmittingUser(false);
    }
  };


  const handleCreateVehicle = async () => {
    try {
      if (!vehicleOwner || !vehiclePlate || !vehicleType) {
        toast.error("Preencha os campos obrigatórios (Proprietário, Placa e Tipo)")
        return
      }
      setIsSubmittingVehicle(true);
      const formDate = new FormData();
      formDate.append("plate", vehiclePlate.toUpperCase())
      formDate.append("type", vehicleType)
      formDate.append("color", vehicleColor)
      formDate.append("year", vehicleYear)
      formDate.append("user", vehicleOwner)
      formDate.append("model", vehicleModel)
      formDate.append("enterpriseId", users[0].enterpriseId || "")
      await createVehicle(formDate)      
      toast.success("Veículo cadastrado com sucesso!")
      setVehicleOwner("")
      setVehiclePlate("")
      setVehicleType("")
      setVehicleModel("")
      setVehicleYear("")
      setVehicleColor("")
    } catch (error) {
      console.error("Erro ao criar veículo:", error)
      toast.error("Ocorreu um erro ao cadastrar o veículo")
    } finally {
      setIsSubmittingVehicle(false);
    }
  }
  
  const handleEdityVehicle = async () => {
    try {
      if (!vehicleOwner || !vehiclePlate || !vehicleType) {
        toast.error("Preencha os campos obrigatórios (Proprietário, Placa e Tipo)")
        return
      }
      setIsSubmittingVehicle(true);
      const formDate = new FormData();
      formDate.append("idvehicle", idvehicle)
      formDate.append("plate", vehiclePlate.toUpperCase())
      formDate.append("type", vehicleType)
      formDate.append("color", vehicleColor)
      formDate.append("year", vehicleYear)
      formDate.append("user", vehicleOwner)
      formDate.append("model", vehicleModel)
      formDate.append("enterpriseId", users[0].enterpriseId || "")
      await edityVehicle(formDate)      
      toast.success("Veículo editado com sucesso!")
      setVehicleOwner("")
      setVehiclePlate("")
      setVehicleType("")
      setVehicleModel("")
      setVehicleYear("")
      setVehicleColor("")
      router.replace("/dashboard/clients");
    } catch (error) {
      console.error("Erro ao editar veículo:", error)
      toast.error("Ocorreu um erro ao editar o veículo")
      router.replace("/dashboard/clients");
    } finally {
      setIsSubmittingVehicle(false);
    }
  }

  const UserSubmitButton = () => (
    <Button 
      className="w-full flex items-center justify-center" 
      onClick={handleCreateUser}
      disabled={
        isSubmittingUser || 
        !userName || 
        !userEmail || 
        (addAddress && (!street || !district || !city || !state || !postalCode))
      }
    >
      {isSubmittingUser ? <CircularProgress size={20} /> : "Cadastrar Usuário"}
    </Button>
  );
  const VehicleSubmitButton = () => (
    <Button 
      className="w-full flex items-center justify-center" 
      onClick={!idvehicle ? handleCreateVehicle : handleEdityVehicle}
      disabled={isSubmittingVehicle || !vehicleOwner || !vehiclePlate || !vehicleType || !vehicleColor || !vehicleModel || !vehicleYear}
    >
      {isSubmittingVehicle 
      ? <CircularProgress size={20} /> 
      : idvehicle 
        ? "Editar Veículo" 
        : "Cadastrar Veículo"}
    </Button>
  );

  const defaultTable = params.get("table") ? (params.get("table") === "vehicles" ? "car" : "user") : "user";
  const typeTable = params.get("idvehicle") ? true : false

  useEffect(() => {
  if (typeTable && defaultTable === "car") {
    const plate = params.get("plate")
    const type = params.get("type")
    const model = params.get("model")
    const color = params.get("color")
    const year = params.get("yearCar")
    const userVehicle = params.get("userid")
    const idvehicle = params.get("idvehicle")
    
    if (userVehicle) setVehicleOwner(userVehicle)
    if (plate) setVehiclePlate(plate)
    if (type) setVehicleType(type)
    if (model) setVehicleModel(model)
    if (color) setVehicleColor(color)
    if (year) setVehicleYear(year)
    if (idvehicle) setidVehicle(idvehicle)
    router.replace("/dashboard/clients");
  }
}, [params, typeTable, defaultTable])

  return (
    <div className="w-full h-full p-4">
      <Toaster richColors position="top-center"/>
      <Tabs defaultValue={defaultTable} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="user">Usuário</TabsTrigger>
          <TabsTrigger value="car">Veículo</TabsTrigger>
        </TabsList>
        <TabsContent value="user" className="w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Cadastrar Usuário</CardTitle>
              <CardDescription>
                Preencha os dados para cadastrar um novo cliente.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo <span className="text-red-500">*</span></Label>
                    <Input 
                      id="name" 
                      placeholder="Digite o nome completo" 
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail <span className="text-red-500">*</span></Label>
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
                    <Label htmlFor="phone">Telefone <span className="text-red-500">*</span></Label>
                    <Input 
                      id="phone" 
                      placeholder="Ex: 34999999999"
                      maxLength={11}
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="permission">Permissão <span className="text-red-500">*</span></Label>
                    <Select 
                      value={userPermission} 
                      onValueChange={setUserPermission}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível de permissão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Administrador</SelectItem>
                        <SelectItem value="2">Funcionário</SelectItem>
                        <SelectItem value="3">Cliente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
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
                  <Label htmlFor="add-address" className="font-medium flex items-center gap-1">
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
                          <Label htmlFor="number">Número <span className="text-red-500">*</span></Label>
                          <Input 
                            id="number" 
                            placeholder="Ex: 123" 
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="complement">Complemento <span className="text-red-500">*</span></Label>
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
                              {brazilianStates.map(st => (
                                <SelectItem key={st} value={st}>{st}</SelectItem>
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
                          onChange={(e) => setIsPrimaryAddress(e.target.checked)}
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
        <TabsContent value="car" className="w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{idvehicle ? "Editar Veículo" : "Cadastrar Veículo"}</CardTitle>
              <CardDescription>
                Preencha os dados para {idvehicle ? "editar um veículo" : "cadastrar um novo veículo"}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle-owner">Proprietário <span className="text-red-500">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between"
                      >
                        {vehicleOwner 
                          ? users.find(u => u.id === vehicleOwner)?.name || "Selecione um proprietário"
                          : "Selecione um proprietário"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Buscar cliente..." />
                        <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
                        <CommandList>
                          <CommandGroup>
                            {users.map((user) => (
                              <CommandItem
                                key={user.id}
                                value={user.name || ""}
                                onSelect={() => setVehicleOwner(user.id)}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    vehicleOwner === user.id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {user.name} ({user.email})
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="plate">Placa <span className="text-red-500">*</span></Label>
                  <Input 
                    id="plate" 
                    placeholder="ABC1234"
                    maxLength={7}
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo <span className="text-red-500">*</span></Label>
                  <Select value={vehicleType} onValueChange={setVehicleType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de veículo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Carro">Carro</SelectItem>
                      <SelectItem value="Moto">Moto</SelectItem>
                      <SelectItem value="Caminhão">Caminhão</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="model">Modelo <span className="text-red-500">*</span></Label>
                  <Input 
                    id="model" 
                    placeholder="Ex: Onix, Gol, Fiesta" 
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year">Ano <span className="text-red-500">*</span></Label>
                  <Input 
                    id="year" 
                    placeholder="Ex: 2022" 
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="color">Cor <span className="text-red-500">*</span></Label>
                  <Input 
                    id="color" 
                    placeholder="Ex: Preto, Branco, Prata" 
                    value={vehicleColor}
                    onChange={(e) => setVehicleColor(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <VehicleSubmitButton />
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}