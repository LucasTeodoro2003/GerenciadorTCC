import { cn } from "@/shared/lib/utils";
import { Button } from "./components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/card";
import { Input } from "./components/input";
import { Label } from "./components/label";
import { SignUpGitHub } from "@/app/api/auth/callback/github";
import { signUp } from "../lib/actionsCreateuser";
import { redirect } from "next/navigation";

export function CreatedUser({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
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
              </div>
              <Button type="submit" className="w-full">
                CRIAR
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
