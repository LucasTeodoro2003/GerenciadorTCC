import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/components/button";
import { Card, CardContent } from "@/shared/ui/components/card";
import { Input } from "@/shared/ui/components/input";
import { Label } from "@/shared/ui/components/label";
import { executeActionDB } from "../lib/executeActionDB";
import { signIn } from "../lib/auth";
import { SignUpGitHub } from "@/app/api/auth/callback/github";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            action={async (formData: FormData) => {
              "use server";
              await executeActionDB({
                actionFn: async () => {
                  await signIn("credentials", formData);
                },
              });
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Acme Inc account
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
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Apple</span>
                </Button>
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
                  <span className="sr-only">Login with Meta</span>
                </Button>
                <Button variant="outline" className="w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="sr-only">Login with Google</span>
                </Button>
              </div>
              <div className="text-center text-sm">
                Não têm uma conta?{" "}
                <a href="/createUser" className="underline underline-offset-4 hover:text-yellow-500">
                  Cadastre-se aqui
                </a>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="data:image/png;base64,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"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
       Alvorada Estetica Automotiva
      </div>
    </div>
  );
}
