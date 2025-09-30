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
import { Check, ChevronsUpDown, Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/shared/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shared/ui/components/command"
import { toast, Toaster } from "sonner"
import { User } from "@prisma/client"
import { format } from "date-fns"
import { Calendar } from "@/shared/ui/components/calendar"
import { ptBR } from "date-fns/locale"
import { createService } from "@/shared/lib/actionCreateService"
import { createExpense } from "@/shared/lib/actionCreateExpense"
import { createProduct } from "@/shared/lib/actionCreateProduct"
import { CircularProgress } from "@mui/material"
import { useSearchParams } from "next/navigation"
import { edityProduct } from "@/shared/lib/actionUpdateProduct"
import { updateService } from "@/shared/lib/actionUpdateServicePage"

interface CreateServiceProps{
    users: User[]
}

export function CreateServiceSomeProducts({users}:CreateServiceProps) {
  const [servicePrice, setServicePrice] = useState("")
  const [serviceDescription, setServiceDescription] = useState("")
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
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false)
  const params = useSearchParams()


  const handleCreateService = async () => {
    try {
      if (!servicePrice || !serviceDescription) {
        toast.error("Preencha todos os campos obrigatórios");
        return
      }
      setIsSubmittingService(true);
      const formData = new FormData()
      formData.append("price", servicePrice.replace(',', '.'))
      formData.append("description", serviceDescription)
      formData.append("enterpriseId", users[0].enterpriseId || "")
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
  
  const handleEdityService = async () => {
    try {
      if (!servicePrice || !serviceDescription) {
        toast.error("Preencha todos os campos obrigatórios");
        return
      }
      setIsSubmittingService(true);
      const formData = new FormData()
      formData.append("idservice", params.get("id") || "")
      formData.append("price", servicePrice.replace(',', '.'))
      formData.append("description", serviceDescription)
      formData.append("enterpriseId", users[0].enterpriseId || "")
      await updateService(formData)
      toast.success("Serviço atualizado com sucesso!")
      setServicePrice("")
      setServiceDescription("")
    } catch (error) {
      console.error("Erro ao editar serviço:", error)
      toast.error("Ocorreu um erro ao editar o serviço")
    } finally {
      setIsSubmittingService(false);
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
      formDate.append("enterpriseId", users[0].enterpriseId || "");
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

  const handleEdityProduct = async () => {
    try {
      if (!productPrice || !productDescription || !productAmount) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
      setIsSubmittingProduct(true);
      const formDate = new FormData();
      formDate.append("idproduct", params.get("id") || "");
      formDate.append("price", productPrice);
      formDate.append("description", productDescription);
      formDate.append("amount", productAmount);
      formDate.append("enterpriseId", users[0].enterpriseId || "");
      if (productMinAmount) {
        formDate.append("minAmount", productMinAmount);
      }
      await edityProduct(formDate);

      toast.success(`Produto cadastrado com sucesso!`);
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
      onClick={!typeTable ? handleCreateService : handleEdityService}
      disabled={isSubmittingService || !servicePrice || !serviceDescription}
    >{!typeTable ? (
      <>  {isSubmittingService ? <CircularProgress size={20} /> : "Cadastrar Serviço"} </>
    ) : (
      <>  {isSubmittingService ? <CircularProgress size={20} /> : "Editar Serviço"} </>
    )}
    </Button>
  );
  const ProductSubmitButton = () => (
    <Button 
      className="w-full flex items-center justify-center"
      onClick={!typeTable ? handleCreateProduct : handleEdityProduct}
      disabled={
        isSubmittingProduct || 
        !productPrice || 
        !productDescription || 
        !productAmount ||
        !productMinAmount ||
        (productAsExpense && (!expenseUser || !expenseDate))
      }
    >
      {isSubmittingProduct ? (
        typeTable ? "Editando Produto..." : "Cadastrando Produto..."
      ) : (
        typeTable ? `Editar Produto${productAsExpense ? " e Registrar Despesa" : ""}` : `Cadastrar Produto${productAsExpense ? " e Registrar Despesa" : ""}`
      )}
    </Button>
  );

const defaultTable = params.get("table") ? (params.get("table") === "products" ? "product" : "service") : "service";
const typeTable = params.get("description") ? true : false

{typeTable ? (
  defaultTable === "product" ? (
  useEffect(() => {
      const desc = params.get("description")
      const price = params.get("price")
      const amount = params.get("amount")
      const minAmount = params.get("minAmount")
  
      if (desc) setProductDescription(desc)
      if (price) setProductPrice(price)
      if (amount) setProductAmount(amount)
      if (minAmount) setProductMinAmount(minAmount)
    }, [params])
  ) : (
    useEffect(() => {
      const desc = params.get("description")
      const price = params.get("price")

      if (desc) setServiceDescription(desc)
      if (price) setServicePrice(price)
    }, [params])
  )
): (null)
}



  return (
    <div className="w-full h-full p-4">
      <Toaster richColors position="top-center"/>
      <Tabs defaultValue={defaultTable} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="service">Serviço</TabsTrigger>
          <TabsTrigger value="product">Produto</TabsTrigger>
        </TabsList>
        <TabsContent value="service" className="w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{typeTable ? "Editar Serviço" : "Cadastrar Serviço"}</CardTitle>
              <CardDescription>
                Preencha os dados para {typeTable ? "editar um serviço" : "cadastrar um novo tipo de serviço"}
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
                    onChange={(e) => {
                      const value = e.target.value;
                      const validValue = value.replace(/[^\d.,]/g, '');
                      setServicePrice(validValue);
                    }}
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
        <TabsContent value="product" className="w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>{typeTable ? "Editar Produto" : "Cadastrar Produto"}</CardTitle>
              <CardDescription>
                Preencha os dados para {typeTable ? "editar um produto" : "cadastrar um novo produto"} no estoque.
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
              {!typeTable ? (


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
              ) : (<></>)}
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