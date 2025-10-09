import { cn } from "@/shared/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/card";
import { Input } from "./components/input";
import { Label } from "./components/label";
import { signUp } from "../lib/actionsCreateuser";
import { redirect} from "next/navigation";
import { HomeIcon } from "lucide-react";
import ButtonCreateUser from "./components/buttonCreate";
import { CreateErrorMessage } from "@/features/actions/createUser/errorMensage";
import { Suspense } from "react";

export function CreatedUser({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex items-center justify-center text-center">
      <a href="/login"><HomeIcon /></a>
      </div>
      <Card>
        <CardHeader>
          <CardDescription className="justify-center text-center"><Suspense><CreateErrorMessage /></Suspense></CardDescription>
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
          <CardDescription>
            Entre com seu email para criar uma conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData: FormData) => {
              "use server";
              const res = await signUp(formData);
              if (res.success) {
                redirect("/login");
              }if(res.message !== "Senha deve conter no minimo 8 caracteres!"){                
                console.error(res.message)
                redirect("/createUser?error=" + "Email j%C3%A1 cadastrado")
              }else{
                console.error("AQUI: ", res.message)
                redirect("/createUser?error=" + res.message)
              }
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Digite seu e-mail"
                  name="email"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Digite sua senha"
                  required
                />
                <span className="text-right text-sm">Minimo de 8 caracteres</span>
              </div>
              <ButtonCreateUser/>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
