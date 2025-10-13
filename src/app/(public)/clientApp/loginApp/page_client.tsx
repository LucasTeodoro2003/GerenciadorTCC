"use client";
import { LoginErrorMessage } from "@/features/actions/login/errorMensagens";
import { createVehicle } from "@/shared/lib/actionCreateVehicle";
import { loginActionClient } from "@/shared/lib/actionLoginClient";
import { createClient } from "@/shared/lib/actionsCreateClient";
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
import { Tabs, TabsContent } from "@/shared/ui/components/tabs";
import ThemeToggleV2 from "@/shared/ui/components/toggleDarkMode";
import { CircularProgress } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

export function TabsLoginClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [tabs, setTabs] = useState("account");
  const [color, setColor] = useState("");
  const [type, setType] = useState("");
  const [model, setModel] = useState("");
  const [plate, setPlate] = useState("");
  const [year, setYear] = useState("");
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false)
  const params = useSearchParams();

  const handleSend = async () => {
    setLoading(true)
    if (newpassword === password) {
      try {
        const formLogin = new FormData();
        formLogin.append("email", email);
        formLogin.append("password", newpassword);
        formLogin.append("name", name);

        const response = await createClient(formLogin);

        if (response && response.userId) {
          // Usuário criado com sucesso
          setUser(response.userId);

          toast.success("Usuário criado com sucesso!");

          setName("");
          setPassword("");
          setNewPassword("");
          setTabs("vehicle");
          setLoading(false)
        } else {
          toast.error("Email já cadastrado, logue ou solicite uma nova senha");
          //redirecionar para login depois
        }
      } catch (err) {
        console.error("Erro ao criar usuário:", err);
        toast.error("Erro ao criar usuário");
        setLoading(false)
      }
    } else {
      toast.error("As senhas são diferentes");
      setLoading(false)
    }
  };

  useEffect(() => {
    const tabsinitial = params.get("tabs");
    if (tabsinitial) {
      setTabs(tabsinitial);
    }
  }, [params]);

  const handleSendVehicle = async () => {
    setLoading(true)
    try {
      const formVehicle = new FormData();
      formVehicle.append("color", color);
      formVehicle.append("model", model);
      formVehicle.append("plate", plate);
      formVehicle.append("type", type);
      formVehicle.append("yearCar", year);
      formVehicle.append("user", user);
      formVehicle.append("enterpriseId", "1");

      await createVehicle(formVehicle);

      toast.success("Veículo criado com sucesso");
      setColor("");
      setModel("");
      setPlate("");
      setType("");
      setYear("");
      setTabs("login");
      setLoading(false)
    } catch (err) {
      console.error("Erro ao criar veículo:", err);
      toast.error("Erro ao criar veículo");
      setLoading(false)
    }
  };

  const handleLogin = async () => {
    setLoading(true)
    try {
      const loginForm = new FormData();
      loginForm.append("email", email || "");
      loginForm.append("password", password || "");
      await loginActionClient(loginForm);
      setEmail("");
      setPassword("");
      setLoading(false)
    } catch (err) {
      console.error("Erro ao logar: ", err);
      toast.error("Erro ao logar");
      setLoading(false)
    }
    toast.success("Logado com sucesso!");
  };

  return (
    <>
      <div className="absolute top-6 right-6">
        <ThemeToggleV2 />
      </div>
      <div className="flex justify-center items-center w-full h-screen -pt-10">
        <Toaster richColors position="top-center" />
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Tabs value={tabs}>
            {/* <Tabs value="login"> */}
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Criar Conta</CardTitle>
                  <CardDescription>
                    Para prosseguir e agendar os serviços, crie uma conta
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Nome</Label>
                    <Input
                      id="name"
                      placeholder="Digite seu nome"
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
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      placeholder="Digite sua senha"
                      type="password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="newpassword">Confirme sua Senha</Label>
                    <Input
                      id="newpassword"
                      placeholder="Digite sua senha igual a anterior"
                      type="password"
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                      }}
                    />
                  </div>
                  <span className="text-right text-sm">
                    Minimo de 8 caracteres
                  </span>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => {
                      handleSend();
                    }}
                    disabled={
                      !email ||
                      password.length < 8 ||
                      !name ||
                      newpassword.length < 8 ||
                      newpassword != password || loading
                    }
                  >
                    {!loading ? "Criar conta" : <CircularProgress size={20}/>}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="vehicle">
              <Card>
                <CardHeader>
                  <CardTitle>Veículo</CardTitle>
                  <CardDescription>
                    Digite as informações do seu veículo
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="plate">Placa *</Label>
                    <Input
                      id="plate"
                      maxLength={7}
                      placeholder="Digite a placa do seu veículo"
                      onChange={(e) => {
                        setPlate(e.target.value);
                      }}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="model">Modelo *</Label>
                    <Input
                      id="model"
                      placeholder="Digite o modelo do seu veículo"
                      onChange={(e) => {
                        setModel(e.target.value);
                      }}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="type">Tipo *</Label>
                    <Select onValueChange={(e) => setType(e)} value={type}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o produto" />
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
                      onChange={(e) => {
                        setColor(e.target.value);
                      }}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="year">Ano *</Label>
                    <Input
                      id="year"
                      placeholder="Digite o ano do seu veículo"
                      onChange={(e) => {
                        setYear(e.target.value);
                      }}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => {
                      handleSendVehicle();
                    }}
                    disabled={!model || !plate || !year || !type || !color || loading}
                  >
                    {!loading ? "Salvar" : <CircularProgress size={20}/>}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <Suspense>
                    <LoginErrorMessage />
                  </Suspense>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Para prosseguir digite o email e senha
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      placeholder="Digite seu email"
                      defaultValue={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      placeholder="Digite sua senha"
                      type="password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => {
                      handleLogin();
                    }}
                    disabled={!email || password.length < 8 || loading}
                  >
                    {!loading ? "Entrar" : <CircularProgress size={20}/>}
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
