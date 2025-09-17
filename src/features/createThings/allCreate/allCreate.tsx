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
import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/components/popover"
import { Check, ChevronsUpDown, Calendar as CalendarIcon, MapPin } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shared/ui/components/command"
import { toast, Toaster } from "sonner"
import { User } from "@prisma/client"
import { format } from "date-fns"
import { Calendar } from "@/shared/ui/components/calendar"
import { ptBR } from "date-fns/locale"
import { createService } from "@/shared/lib/actionCreateService"
import { createUserPage } from "@/shared/lib/actionsCreateuserPage"
import { createVehicle } from "@/shared/lib/actionCreateVehicle"
import { createExpense } from "@/shared/lib/actionCreateExpense"
import { createProduct } from "@/shared/lib/actionCreateProduct"
import { getUserByEmail } from "@/shared/lib/actionGetUser"
import { createAddress } from "@/shared/lib/actionCreateAddress"
import { CircularProgress } from "@mui/material"

interface CreateServiceProps{
    users: User[]
}

export function CreateService({users}:CreateServiceProps) {
  const [servicePrice, setServicePrice] = useState("")
  const [serviceDescription, setServiceDescription] = useState("")
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
  const [productPrice, setProductPrice] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [productAmount, setProductAmount] = useState("")
  const [productMinAmount, setProductMinAmount] = useState("")
  const [productAsExpense, setProductAsExpense] = useState(false)
  const [expenseDate, setExpenseDate] = useState<Date | undefined>(new Date())
  const [expenseCategory, setExpenseCategory] = useState("Produtos")
  const [expensePaymentMethod, setExpensePaymentMethod] = useState("Dinheiro")
  const [expenseStatus, setExpenseStatus] = useState("Pago")
  const [expenseUser, setExpenseUser] = useState("")
  const [openExpenseDateCalendar, setOpenExpenseDateCalendar] = useState(false)
  const [isSubmittingService, setIsSubmittingService] = useState(false)
  const [isSubmittingUser, setIsSubmittingUser] = useState(false)
  const [isSubmittingVehicle, setIsSubmittingVehicle] = useState(false)
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false)
  const brazilianStates = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
    "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ]

  const handleCreateService = async () => {
    try {
      if (!servicePrice || !serviceDescription) {
        toast.error("Preencha todos os campos obrigatórios");
        return
      }
      setIsSubmittingService(true);
      const formData = new FormData()
      formData.append("price", servicePrice)
      formData.append("description", serviceDescription)
      await createService(formData)
      toast.success("Serviço cadastrado com sucesso!")
      setServicePrice("")
      setServiceDescription("")
    } catch (error) {
      console.error("Erro ao criar serviço:", error)
      toast.error("Ocorreu um erro ao cadastrar o serviço")
    } finally {
      setIsSubmittingService(false);
    }
  }

  
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
          console.log("Resultado da criação de endereço:", addressResult);
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
      formDate.append("plate", vehiclePlate)
      formDate.append("type", vehicleType)
      formDate.append("color", vehicleColor)
      formDate.append("year", vehicleYear)
      formDate.append("user", vehicleOwner)
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


  const handleCreateProduct = async () => {
    try {
      if (!productPrice || !productDescription || !productAmount) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
      setIsSubmittingProduct(true);
      const formDate = new FormData();
      formDate.append("price", productPrice);
      formDate.append("description", productDescription);
      formDate.append("amount", productAmount);
      if (productMinAmount) {
        formDate.append("minAmount", productMinAmount);
      }
      await createProduct(formDate);
      if (productAsExpense) {
        if (!expenseUser || !expenseDate) {
          toast.error("Para registrar como despesa, selecione um usuário e uma data");
          setIsSubmittingProduct(false);
          return;
        }
        const totalAmount = parseFloat(productPrice) * parseFloat(productAmount);
        const formattedDate = expenseDate 
          ? expenseDate.toISOString().split('T')[0] 
          : new Date().toISOString().split('T')[0];
        const formDate = new FormData();
        formDate.append("description", productDescription);
        formDate.append("amount", totalAmount.toString());
        formDate.append("date", formattedDate);
        formDate.append("category", expenseCategory);
        formDate.append("paymentMethod", expensePaymentMethod);
        formDate.append("status", expenseStatus);
        await createExpense(expenseUser, formDate);
      }
      toast.success(`Produto cadastrado com sucesso!${productAsExpense ? ' Despesa registrada.' : ''}`);
      setProductPrice("");
      setProductDescription("");
      setProductAmount("");
      setProductMinAmount("");
      setProductAsExpense(false);
      setExpenseDate(new Date());
      setExpenseCategory("Produtos");
      setExpensePaymentMethod("Dinheiro");
      setExpenseStatus("Pago");
      setExpenseUser("");
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      toast.error("Ocorreu um erro ao cadastrar o produto");
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const ServiceSubmitButton = () => (
    <Button 
      className="w-full flex items-center justify-center" 
      onClick={handleCreateService}
      disabled={isSubmittingService || !servicePrice || !serviceDescription}
    >
      {isSubmittingService ? <CircularProgress size={20} /> : "Cadastrar Serviço"}
    </Button>
  );
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
      onClick={handleCreateVehicle}
      disabled={isSubmittingVehicle || !vehicleOwner || !vehiclePlate || !vehicleType}
    >
      {isSubmittingVehicle ? <CircularProgress size={20} /> : "Cadastrar Veículo"}
    </Button>
  );
  const ProductSubmitButton = () => (
    <Button 
      className="w-full flex items-center justify-center" 
      onClick={handleCreateProduct}
      disabled={
        isSubmittingProduct || 
        !productPrice || 
        !productDescription || 
        !productAmount || 
        (productAsExpense && (!expenseUser || !expenseDate))
      }
    >
      {isSubmittingProduct ? 
        <CircularProgress size={20} /> : 
        `Cadastrar Produto${productAsExpense ? " e Registrar Despesa" : ""}`
      }
    </Button>
  );



  return (
    <div className="w-full h-full p-4">
      <Toaster richColors position="top-center"/>
      <Tabs defaultValue="service" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="service">Serviço</TabsTrigger>
          <TabsTrigger value="user">Usuário</TabsTrigger>
          <TabsTrigger value="car">Veículo</TabsTrigger>
          <TabsTrigger value="product">Produto</TabsTrigger>
        </TabsList>
        <TabsContent value="service" className="w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Cadastrar Serviço</CardTitle>
              <CardDescription>
                Preencha os dados para cadastrar um novo tipo de serviço.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="service-description">Descrição do Serviço</Label>
                  <Input 
                    id="service-description" 
                    placeholder="Ex: Troca de óleo, Alinhamento, Balanceamento" 
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="service-price">Preço (R$)</Label>
                  <Input 
                    id="service-price" 
                    placeholder="Ex: 120.00" 
                    value={servicePrice}
                    onChange={(e) => setServicePrice(e.target.value)}
                  />
                  <p className="text-sm text-gray-500">
                    Digite o valor
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <ServiceSubmitButton />
            </CardFooter>
          </Card>
        </TabsContent>
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
                    <Label htmlFor="permission">Permissão</Label>
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
              <CardTitle>Cadastrar Veículo</CardTitle>
              <CardDescription>
                Preencha os dados para cadastrar um novo veículo.
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
                  <Label htmlFor="model">Modelo</Label>
                  <Input 
                    id="model" 
                    placeholder="Ex: Onix, Gol, Fiesta" 
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="year">Ano</Label>
                  <Input 
                    id="year" 
                    placeholder="Ex: 2022" 
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="color">Cor</Label>
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
        <TabsContent value="product" className="w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Cadastrar Produto</CardTitle>
              <CardDescription>
                Preencha os dados para cadastrar um novo produto no estoque.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-description">
                      Descrição do Produto <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="product-description" 
                      placeholder="Ex: Óleo de motor, Filtro de ar" 
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="product-price">
                      Preço Unitário (R$) <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="product-price" 
                      placeholder="Ex: 45.90" 
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-amount">
                      Quantidade <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="product-amount" 
                      placeholder="Ex: 10" 
                      value={productAmount}
                      onChange={(e) => setProductAmount(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="product-min-amount">
                      Quantidade Mínima
                    </Label>
                    <Input 
                      id="product-min-amount" 
                      placeholder="Ex: 5" 
                      value={productMinAmount}
                      onChange={(e) => setProductMinAmount(e.target.value)}
                    />
                    <p className="text-sm text-gray-500">
                      Quantidade mínima para alertas de estoque baixo
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    id="register-as-expense"
                    checked={productAsExpense}
                    onChange={(e) => setProductAsExpense(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="register-as-expense" className="font-medium">
                    Registrar também como despesa
                  </Label>
                </div>
                
                {productAsExpense && (
                  <div className="grid gap-6 md:grid-cols-2 mt-4 p-4 bg-muted/50 rounded-md">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="expense-user">
                          Responsável pela Despesa <span className="text-red-500">*</span>
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              className="w-full justify-between"
                            >
                              {expenseUser 
                                ? users.find(u => u.id === expenseUser)?.name || "Selecione um usuário"
                                : "Selecione um usuário"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Buscar usuário..." />
                              <CommandEmpty>Nenhum usuário encontrado.</CommandEmpty>
                              <CommandList>
                                <CommandGroup>
                                  {users.map((user) => (
                                    <CommandItem
                                      key={user.id}
                                      value={user.name || ""}
                                      onSelect={() => setExpenseUser(user.id)}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          expenseUser === user.id ? "opacity-100" : "opacity-0"
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
                        <Label htmlFor="expense-date">
                          Data da Despesa <span className="text-red-500">*</span>
                        </Label>
                        <Popover open={openExpenseDateCalendar} onOpenChange={setOpenExpenseDateCalendar}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between text-left font-normal"
                            >
                              {expenseDate ? (
                                format(expenseDate, "dd/MM/yyyy")
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={expenseDate}
                              onSelect={(date) => {
                                setExpenseDate(date)
                                setOpenExpenseDateCalendar(false)
                              }}
                              locale={ptBR}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="expense-category">Categoria</Label>
                        <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Produtos">Produtos</SelectItem>
                            <SelectItem value="Estoque">Estoque</SelectItem>
                            <SelectItem value="Ferramentas">Ferramentas</SelectItem>
                            <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                            <SelectItem value="Outros">Outros</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="expense-payment">Forma de Pagamento</Label>
                        <Select value={expensePaymentMethod} onValueChange={setExpensePaymentMethod}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a forma de pagamento" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                            <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                            <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                            <SelectItem value="PIX">PIX</SelectItem>
                            <SelectItem value="Transferência">Transferência</SelectItem>
                            <SelectItem value="Boleto">Boleto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="expense-status">Status</Label>
                        <Select value={expenseStatus} onValueChange={setExpenseStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pago">Pago</SelectItem>
                            <SelectItem value="Pendente">Pendente</SelectItem>
                            <SelectItem value="Atrasado">Atrasado</SelectItem>
                            <SelectItem value="Cancelado">Cancelado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2 pt-2">
                        <div className="p-4 bg-primary/10 rounded-md">
                          <p className="text-sm font-medium">
                            Valor total da despesa: 
                            <span className="text-primary ml-1">
                              R$ {(
                                (!isNaN(parseFloat(productPrice)) ? parseFloat(productPrice) : 0) * 
                                (!isNaN(parseFloat(productAmount)) ? parseFloat(productAmount) : 0)
                              ).toFixed(2)}
                            </span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            (Preço unitário × Quantidade)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <ProductSubmitButton />
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}