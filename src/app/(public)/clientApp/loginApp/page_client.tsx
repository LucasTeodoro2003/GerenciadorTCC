"use client";
import { SignUpGitHub } from "@/app/api/auth/callback/github";
import { SignUpGoogle } from "@/app/api/auth/callback/google";
import { LoginErrorMessage } from "@/features/actions/login/errorMensagens";
import { LoginPasswordReset } from "@/features/Modal/loginPassword/login";
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
import { HomeIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

export function TabsLoginClient() {
  const router = useRouter();
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
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const [page, setPage] = useState(false);
  const [open, setOpen] = useState(false);

  router.prefetch("/clientApp");
  router.prefetch("/clientApp/calendarApp");
  router.prefetch("/clientApp/userApp");
  router.prefetch("/clientApp/loginApp");

  const handleSend = async () => {
    setLoading(true);
    if (newpassword === password) {
      try {
        const formLogin = new FormData();
        formLogin.append("email", email);
        formLogin.append("password", newpassword);
        formLogin.append("name", name);

        const response = await createClient(formLogin);

        if (response && response.userId) {
          setUser(response.userId);

          toast.success("Usuário criado com sucesso!");

          setName("");
          setPassword("");
          setNewPassword("");
          setTabs("vehicle");
          setLoading(false);
        } else {
          toast.error("Email já cadastrado, logue ou solicite uma nova senha");
        }
      } catch (err) {
        console.error("Erro ao criar usuário:", err);
        toast.error("Erro ao criar usuário");
        setLoading(false);
      }
    } else {
      toast.error("As senhas são diferentes");
      setLoading(false);
    }
  };

  useEffect(() => {
    const tabsinitial = params.get("tabs");
    if (tabsinitial) {
      setTabs(tabsinitial);
    }
  }, [params]);

  const handleSendVehicle = async () => {
    setLoading(true);
    try {
      const formVehicle = new FormData();
      formVehicle.append("color", color);
      formVehicle.append("model", model);
      formVehicle.append("plate", plate.toLocaleUpperCase());
      formVehicle.append("type", type);
      formVehicle.append("year", year);
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
      setLoading(false);
    } catch (err) {
      console.error("Erro ao criar veículo:", err);
      toast.error("Erro ao criar veículo");
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const loginForm = new FormData();
      loginForm.append("email", email || "");
      loginForm.append("password", password || "");
      await loginActionClient(loginForm);
      toast.success("Logado com sucesso!");
      setEmail("");
      setPassword("");
      setLoading(false);
      router.push("/clientApp/userApp");
    } catch (err) {
      console.error("Erro ao logar: ", err);
      setLoading(false);
    }
  };

  const handleHome = () => {
    setPage(true);
    router.push("/clientApp");
  };

  return (
    <>
      <div className="absolute top-6 right-6">
        <ThemeToggleV2 />
      </div>
      <div className="flex justify-center items-center w-full h-screen -pt-10">
        <Toaster richColors position="top-center" />
        <LoginPasswordReset open={open} onOpenChange={setOpen} />
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
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Criar Conta</CardTitle>
                  <CardDescription>
                    Para prosseguir e agendar os serviços, crie uma conta
                  </CardDescription>
                  <CardDescription className="justify-center flex">
                    Crie com sua conta de rede social favorita
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                  <div className="grid grid-cols-2 gap-4 -mt-5">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={SignUpGitHub}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="sr-only">GitHub</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={SignUpGoogle}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="sr-only">Google</span>
                    </Button>
                  </div>
                    <CardDescription className="justify-center flex -mt-3">
                      Ou crie com um email e senha
                    </CardDescription>
                  <div className="grid gap-3 -mt-5">
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
                      newpassword != password ||
                      loading
                    }
                  >
                    {!loading ? "Criar conta" : <CircularProgress size={20} />}
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
                    disabled={
                      !model || !plate || !year || !type || !color || loading
                    }
                  >
                    {!loading ? "Salvar" : <CircularProgress size={20} />}
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
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={SignUpGitHub}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="sr-only">GitHub</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={SignUpGoogle}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="sr-only">Google</span>
                    </Button>
                  </div>
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
                    <div>
                      <span
                        className="flex justify-end hover:cursor-pointer hover:underline hover:text-yellow-500 text-xs"
                        onClick={() => setOpen(true)}
                      >
                        Esqueceu a senha?
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => {
                      handleLogin();
                    }}
                    disabled={!email || password.length < 8 || loading}
                  >
                    {!loading ? "Entrar" : <CircularProgress size={20} />}
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
