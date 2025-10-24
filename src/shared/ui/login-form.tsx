"use client";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/components/button";
import { Card, CardContent } from "@/shared/ui/components/card";
import { Input } from "@/shared/ui/components/input";
import { Label } from "@/shared/ui/components/label";
import { SignUpGitHub } from "@/app/api/auth/callback/github";
import { loginAction } from "@/features/actions/login/loginAction";
import { LoginErrorMessage } from "@/features/actions/login/errorMensagens";
import { Suspense, useState } from "react";
import { useFormStatus } from "react-dom";
import { SignUpGoogle } from "@/app/api/auth/callback/google";
import CircularProgress from "@mui/material/CircularProgress";
import { LoginPasswordReset } from "@/features/Modal/loginPassword/login";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [open, setOpen] = useState(false);

  function SumitButton() {
    const { pending } = useFormStatus();

    return (
      <Button
        type="submit"
        className={cn("w-full", pending && "flex items-center justify-center")}
        disabled={pending}
      >
        {pending ? <CircularProgress size={20} /> : "Login"}
      </Button>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <LoginPasswordReset open={open} onOpenChange={setOpen} />
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" action={loginAction}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Seja Bem-Vindo</h1>
                <p className="text-balance text-muted-foreground">
                  Conecte-se para acesso aos serviços
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                </div>
                <Input id="password" name="password" type="password" required />
                <span className="flex justify-end hover:cursor-pointer hover:underline hover:text-yellow-500 text-xs" onClick={() => setOpen(true)}>Esqueceu a senha?</span>
              </div>
              <SumitButton />
              <div className="text-center">
                <Suspense>
                  <LoginErrorMessage />
                </Suspense>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Ou faça login com
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={SignUpGitHub}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Google</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                Não têm uma conta?{" "}
                <a
                  href="/createUser"
                  className="underline underline-offset-4 hover:text-yellow-500"
                >
                  Cadastre-se aqui
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="car2.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.5] dark:grayscale-[0.2]"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        <div className="justify-center flex items-center gap-2">
        <img src="/icon.png" className="w-8 h-8 "/> <span className="text-xl">EstetiCar</span>
        </div>
      </div>
    </div>
  );
}
