import { auth } from "@/shared/lib/auth";
import { LoginForm } from "@/shared/ui/login-form"
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
    if (session) redirect("/dashboard");
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  )
}
