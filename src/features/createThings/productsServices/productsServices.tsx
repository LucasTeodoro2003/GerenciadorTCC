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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/components/select";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/components/popover";
import { Check, ChevronsUpDown, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/components/command";
import { toast, Toaster } from "sonner";
import { User } from "@prisma/client";
import { format } from "date-fns";
import { Calendar } from "@/shared/ui/components/calendar";
import { ptBR } from "date-fns/locale";
import { createService } from "@/shared/lib/actionCreateService";
import { createExpense } from "@/shared/lib/actionCreateExpense";
import { createProduct } from "@/shared/lib/actionCreateProduct";
import { CircularProgress } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { edityProduct } from "@/shared/lib/actionUpdateProduct";
import { updateService } from "@/shared/lib/actionUpdateServicePage";
import imageCompression from "browser-image-compression";
import { updateServiceImage } from "@/shared/lib/actionUpdateServiceImage";
import GetImage from "@/shared/lib/actionGetImage";

interface CreateServiceProps {
  users: User[];
}

export function CreateServiceSomeProducts({ users }: CreateServiceProps) {
  const [servicePrice, setServicePrice] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productAmount, setProductAmount] = useState("");
  const [productMinAmount, setProductMinAmount] = useState("");
  const [productAsExpense, setProductAsExpense] = useState(false);
  const [expenseDate, setExpenseDate] = useState<Date | undefined>(new Date());
  const [expenseCategory, setExpenseCategory] = useState("Produtos");
  const [expensePaymentMethod, setExpensePaymentMethod] = useState("Dinheiro");
  const [expenseStatus, setExpenseStatus] = useState("Pago");
  const [expenseUser, setExpenseUser] = useState("");
  const [openExpenseDateCalendar, setOpenExpenseDateCalendar] = useState(false);
  const [isSubmittingService, setIsSubmittingService] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [serviceImage, setServiceImage] = useState<File | null>(null);
  const [customTimeValue, setCustomTimeValue] = useState<string>("");
  const [customTimeUnit, setCustomTimeUnit] = useState("horas");
  const [serviceTimeOption, setServiceTimeOption] = useState("");
  const [serviceTimeMinutes, setServiceTimeMinutes] = useState(0);
  const [idproduct, setIdproduct] = useState("");
  const [idservice, setIdservice] = useState("");
  const params = useSearchParams();
  const router = useRouter();

  const formatTimeForDisplay = (minutes: number) => {
    if (minutes === 0) return "Não definido";

    const dias = Math.floor(minutes / (24 * 60));
    const horas = Math.floor((minutes % (24 * 60)) / 60);
    const mins = minutes % 60;

    let resultado = [];
    if (dias > 0) resultado.push(`${dias} dia${dias > 1 ? "s" : ""}`);
    if (horas > 0) resultado.push(`${horas} hora${horas > 1 ? "s" : ""}`);
    if (mins > 0) resultado.push(`${mins} minuto${mins > 1 ? "s" : ""}`);

    return resultado.join(" e ");
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
        setServiceImage(compressedFile);
      } catch (error) {
        console.error("Erro ao comprimir imagem:", error);
      }
    }
  };

  const handleCreateService = async () => {
    try {
      if (!servicePrice || !serviceDescription) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
      if(serviceTimeMinutes === 0){
        toast.error("Defina o tempo mínimo do serviço");
        return;
      }
      setIsSubmittingService(true);
      const formData = new FormData();
      formData.append("price", servicePrice.replace(",", "."));
      formData.append("description", serviceDescription);
      formData.append("enterpriseId", users[0].enterpriseId || "");
      formData.append("image", serviceImage || "");
      formData.append("minService", serviceTimeMinutes.toString());
      await createService(formData);
      toast.success("Serviço cadastrado com sucesso!");
      setServicePrice("");
      setServiceDescription("");
      setServiceImage(null);
      setServiceTimeMinutes(0);
      setServiceDescription("");
    } catch (error) {
      console.error("Erro ao criar serviço:", error);
      toast.error("Ocorreu um erro ao cadastrar o serviço");
    } finally {
      setIsSubmittingService(false);
    }
  };

  const handleEdityService = async () => {
    try {
      if (!servicePrice || !serviceDescription) {
        toast.error("Preencha todos os campos obrigatórios");
        return;
      }
      if(serviceTimeMinutes === 0){
        toast.error("Defina o tempo mínimo do serviço");
        return;
      }
      setIsSubmittingService(true);
      const formData = new FormData();
      formData.append("idservice", idservice);
      formData.append("price", servicePrice.replace(",", "."));
      formData.append("description", serviceDescription);
      formData.append("enterpriseId", users[0].enterpriseId || "");
      formData.append("image", serviceImage || "");
      formData.append("minService", serviceTimeMinutes.toString());
      if (serviceImage) {
        await updateServiceImage(formData);
      } else {
        await updateService(formData);
      }
      toast.success("Serviço atualizado com sucesso!");
      setServicePrice("");
      setServiceDescription("");
      setServiceImage(null);
      setServiceTimeMinutes(0);
      setServiceDescription("");
      router.replace("/dashboard/enterprise");
    } catch (error) {
      console.error("Erro ao editar serviço:", error);
      toast.error("Ocorreu um erro ao editar o serviço");
      router.replace("/dashboard/enterprise");
    } finally {
      setIsSubmittingService(false);
    }
  };

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
          toast.error(
            "Para registrar como despesa, selecione um usuário e uma data"
          );
          setIsSubmittingProduct(false);
          return;
        }
        const totalAmount =
          parseFloat(productPrice) * parseFloat(productAmount);
        const formattedDate = expenseDate
          ? expenseDate.toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0];
        const formDate = new FormData();
        formDate.append("description", productDescription);
        formDate.append("amount", totalAmount.toString());
        formDate.append("date", formattedDate);
        formDate.append("category", expenseCategory);
        formDate.append("paymentMethod", expensePaymentMethod);
        formDate.append("status", expenseStatus);
        await createExpense(expenseUser, formDate);
      }
      toast.success(
        `Produto cadastrado com sucesso!${
          productAsExpense ? " Despesa registrada." : ""
        }`
      );
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
      formDate.append("idproduct", idproduct);
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
      router.replace("/dashboard/enterprise");
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      toast.error("Ocorreu um erro ao cadastrar o produto");
      router.replace("/dashboard/enterprise");
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const ServiceSubmitButton = () => (
    <Button
      className="w-full flex items-center justify-center"
      onClick={!idservice ? handleCreateService : handleEdityService}
      disabled={isSubmittingService || !servicePrice || !serviceDescription}
    >
      {!idservice ? (
        <>
          {" "}
          {isSubmittingService ? (
            <CircularProgress size={20} />
          ) : (
            "Cadastrar Serviço"
          )}{" "}
        </>
      ) : (
        <>
          {" "}
          {isSubmittingService ? (
            <CircularProgress size={20} />
          ) : (
            "Editar Serviço"
          )}{" "}
        </>
      )}
    </Button>
  );
  const ProductSubmitButton = () => (
    <Button
      className="w-full flex items-center justify-center"
      onClick={!idproduct ? handleCreateProduct : handleEdityProduct}
      disabled={
        isSubmittingProduct ||
        !productPrice ||
        !productDescription ||
        !productAmount ||
        !productMinAmount ||
        (productAsExpense && (!expenseUser || !expenseDate))
      }
    >
      {isSubmittingProduct
        ? idproduct
          ? "Editando Produto..."
          : "Cadastrando Produto..."
        : idproduct
        ? `Editar Produto${productAsExpense ? " e Registrar Despesa" : ""}`
        : `Cadastrar Produto${productAsExpense ? " e Registrar Despesa" : ""}`}
    </Button>
  );

  const defaultTable = params.get("table")
    ? params.get("table") === "products"
      ? "product"
      : "service"
    : "service";
  const typeTable = params.get("description") ? true : false;

  useEffect(() => {
    const fetchData = async () => {
      if (typeTable) {
        if (defaultTable === "product") {
          const desc = params.get("description");
          const price = params.get("price");
          const amount = params.get("amount");
          const minAmount = params.get("minAmount");
          const id = params.get("id");

          if (desc) setProductDescription(desc);
          if (price) setProductPrice(price);
          if (amount) setProductAmount(amount);
          if (minAmount) setProductMinAmount(minAmount);
          if (id) setIdproduct(id);
          router.replace("/dashboard/enterprise");
        } else {
          const desc = params.get("description");
          const price = params.get("price");
          const id = params.get("id");
          
          if (desc) setServiceDescription(desc);
          if (price) setServicePrice(price);
          if (id) setIdservice(id);
          router.replace("/dashboard/enterprise");
          
          try {
            const image = await GetImage(id || "");
            if (image?.image) {
              try {
                const response = await fetch(image.image);
                const blob = await response.blob();
                const file = new File([blob], "image.jpg", { type: blob.type });
                setServiceImage(file);
              } catch (error) {
                console.error("Erro ao converter imagem:", error);
                setServiceImage(null);
              }
            } else {
              setServiceImage(null);
            }
          } catch (error) {
            console.error("Erro ao buscar imagem:", error);
            setServiceImage(null);
          }
        }
      }
    };

    fetchData();
  }, [params, typeTable, defaultTable]);

  return (
    <div className="w-full h-full p-4">
      <Toaster richColors position="top-center" />
      <Tabs defaultValue={defaultTable} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="service">Serviço</TabsTrigger>
          <TabsTrigger value="product">Produto</TabsTrigger>
        </TabsList>
        <TabsContent value="service" className="w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>
                {idservice ? "Editar Serviço" : "Cadastrar Serviço"}
              </CardTitle>
              <CardDescription>
                Preencha os dados para{" "}
                {idservice
                  ? "editar um serviço"
                  : "cadastrar um novo tipo de serviço"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="service-description">
                    Descrição do Serviço
                  </Label>
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
                      const validValue = value.replace(/[^\d.,]/g, "");
                      setServicePrice(validValue);
                    }}
                  />
                  <p className="text-sm text-gray-500">Digite o valor</p>
                  <div className="space-y-2">
                    <Label htmlFor="service-time">Tempo para Finalização</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Select
                          value={serviceTimeOption}
                          onValueChange={(value) => {
                            setServiceTimeOption(value);
                            if (value !== "personalizado") {
                              const minutesMap = {
                                "30min": 30,
                                "1h": 60,
                                "1h30min": 90,
                                "2h": 120,
                                "3h": 180,
                                "4h": 240,
                                "5h": 300,
                                "6h": 360,
                                "1dia": 1440,
                                "2dias": 2880,
                              };
                              setServiceTimeMinutes(
                                minutesMap[value as keyof typeof minutesMap] ||
                                  0
                              );
                            }
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tempo estimado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Tempo estimado</SelectLabel>
                              <SelectItem value="30min">30 minutos</SelectItem>
                              <SelectItem value="1h">1 hora</SelectItem>
                              <SelectItem value="1h30min">
                                1 hora e 30 minutos
                              </SelectItem>
                              <SelectItem value="2h">2 horas</SelectItem>
                              <SelectItem value="3h">3 horas</SelectItem>
                              <SelectItem value="4h">4 horas</SelectItem>
                              <SelectItem value="5h">5 horas</SelectItem>
                              <SelectItem value="6h">6 horas</SelectItem>
                              <SelectItem value="1dia">1 dia</SelectItem>
                              <SelectItem value="2dias">2 dias</SelectItem>
                              <SelectItem value="personalizado">
                                Personalizado
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>

                        {serviceTimeOption === "personalizado" && (
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <Input
                              id="custom-time-value"
                              type="number"
                              placeholder="Quantidade"
                              value={customTimeValue}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                setCustomTimeValue(inputValue);
                                const numericValue =
                                  parseFloat(inputValue) || 0;
                                if (customTimeUnit === "minutos") {
                                  setServiceTimeMinutes(numericValue);
                                } else if (customTimeUnit === "horas") {
                                  setServiceTimeMinutes(numericValue * 60);
                                } else if (customTimeUnit === "dias") {
                                  setServiceTimeMinutes(numericValue * 24 * 60);
                                }
                              }}
                              min="1"
                            />
                            <Select
                              value={customTimeUnit}
                              onValueChange={(value) => {
                                setCustomTimeUnit(value);

                                // Reconverter o valor para minutos quando a unidade muda
                                if (value === "minutos") {
                                  setServiceTimeMinutes(
                                    parseInt(customTimeValue) || 0
                                  );
                                } else if (value === "horas") {
                                  setServiceTimeMinutes(
                                    (parseInt(customTimeValue) || 0) * 60
                                  );
                                } else if (value === "dias") {
                                  setServiceTimeMinutes(
                                    (parseInt(customTimeValue) || 0) * 24 * 60
                                  );
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Unidade" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="minutos">Minutos</SelectItem>
                                <SelectItem value="horas">Horas</SelectItem>
                                <SelectItem value="dias">Dias</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <p className="text-sm text-gray-500">
                          Tempo estimado:{" "}
                          {formatTimeForDisplay(serviceTimeMinutes)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service-image">Imagem do Serviço</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <div className="space-y-2">
                      <Input
                        id="service-image"
                        type="file"
                        accept="image/*"
                        className="dark:bg-neutral-900"
                        onChange={handleFileChange}
                      />
                      <p className="text-sm text-gray-500">
                        Selecione uma imagem para o serviço
                      </p>
                    </div>
                    <div className="border rounded-md overflow-hidden w-full flex items-center justify-center bg-gray-50 dark:bg-neutral-900">
                      {serviceImage ? (
                        <img
                          src={URL.createObjectURL(serviceImage)}
                          alt="Pré-visualização"
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <p className="flex text-gray-400 text-sm text-center items-center h-9">
                          Nenhuma imagem selecionada
                        </p>
                      )}
                    </div>
                  </div>
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
              <CardTitle>
                {idproduct ? "Editar Produto" : "Cadastrar Produto"}
              </CardTitle>
              <CardDescription>
                Preencha os dados para{" "}
                {idproduct ? "editar um produto" : "cadastrar um novo produto"}{" "}
                no estoque.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-description">
                      Descrição do Produto{" "}
                      <span className="text-red-500">*</span>
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
                      Preço Unitário (R$){" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="product-price"
                      placeholder="Ex: 45.90"
                      value={productPrice}
                      onChange={(e) => {
                        const value = e.target.value;
                        const validValue = value.replace(/[^\d.,]/g, "");
                        setProductPrice(validValue);
                      }}
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
                      Quantidade Mínima <span className="text-red-500">*</span>
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
              {!idproduct ? (
                <div className="border-t pt-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="checkbox"
                      id="register-as-expense"
                      checked={productAsExpense}
                      onChange={(e) => setProductAsExpense(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label
                      htmlFor="register-as-expense"
                      className="font-medium"
                    >
                      Registrar também como despesa
                    </Label>
                  </div>

                  {productAsExpense && (
                    <div className="grid gap-6 md:grid-cols-2 mt-4 p-4 bg-muted/50 rounded-md">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="expense-user">
                            Responsável pela Despesa{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between"
                              >
                                {expenseUser
                                  ? users.find((u) => u.id === expenseUser)
                                      ?.name || "Selecione um usuário"
                                  : "Selecione um usuário"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Buscar usuário..." />
                                <CommandEmpty>
                                  Nenhum usuário encontrado.
                                </CommandEmpty>
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
                                            expenseUser === user.id
                                              ? "opacity-100"
                                              : "opacity-0"
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
                            Data da Despesa{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Popover
                            open={openExpenseDateCalendar}
                            onOpenChange={setOpenExpenseDateCalendar}
                          >
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={expenseDate}
                                onSelect={(date) => {
                                  setExpenseDate(date);
                                  setOpenExpenseDateCalendar(false);
                                }}
                                locale={ptBR}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="expense-category">Categoria</Label>
                          <Select
                            value={expenseCategory}
                            onValueChange={setExpenseCategory}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Produtos">Produtos</SelectItem>
                              <SelectItem value="Estoque">Estoque</SelectItem>
                              <SelectItem value="Ferramentas">
                                Ferramentas
                              </SelectItem>
                              <SelectItem value="Infraestrutura">
                                Infraestrutura
                              </SelectItem>
                              <SelectItem value="Outros">Outros</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="expense-payment">
                            Forma de Pagamento
                          </Label>
                          <Select
                            value={expensePaymentMethod}
                            onValueChange={setExpensePaymentMethod}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a forma de pagamento" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                              <SelectItem value="Cartão de Crédito">
                                Cartão de Crédito
                              </SelectItem>
                              <SelectItem value="Cartão de Débito">
                                Cartão de Débito
                              </SelectItem>
                              <SelectItem value="PIX">PIX</SelectItem>
                              <SelectItem value="Transferência">
                                Transferência
                              </SelectItem>
                              <SelectItem value="Boleto">Boleto</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="expense-status">Status</Label>
                          <Select
                            value={expenseStatus}
                            onValueChange={setExpenseStatus}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pago">Pago</SelectItem>
                              <SelectItem value="Pendente">Pendente</SelectItem>
                              <SelectItem value="Atrasado">Atrasado</SelectItem>
                              <SelectItem value="Cancelado">
                                Cancelado
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2 pt-2">
                          <div className="p-4 bg-primary/10 rounded-md">
                            <p className="text-sm font-medium">
                              Valor total da despesa:
                              <span className="text-primary ml-1">
                                R${" "}
                                {(
                                  (!isNaN(parseFloat(productPrice))
                                    ? parseFloat(productPrice)
                                    : 0) *
                                  (!isNaN(parseFloat(productAmount))
                                    ? parseFloat(productAmount)
                                    : 0)
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
              ) : (
                <></>
              )}
            </CardContent>
            <CardFooter>
              <ProductSubmitButton />
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
