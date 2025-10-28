'use client';

import { useState, Suspense } from "react";
import { Card } from "@/shared/ui/components/card";
import { Input } from "@/shared/ui/components/input";
import { Button } from "@/shared/ui/components/button";
import { alterPasswordEmail } from "@/shared/lib/actionUpdatePasswordEmail";
import VerifyToken from "@/shared/lib/actionVeryToken";
import { toast, Toaster } from "sonner";
import { useSearchParams } from "next/navigation";

// Componente que usa useSearchParams
function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alter, setAlter] = useState(false);
  const params = useSearchParams();
  const token = params.get("token") || "";
  const email = params.get("email") || "";

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    try {
      const emailverify = await VerifyToken(token, email);
      const id = emailverify.userid;
      await alterPasswordEmail(id, formData.get("password")?.toString() || "");
      toast.success("Senha alterada com sucesso!");
      setAlter(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setPassword("");
      setConfirmPassword("");
    }
  }

  if (alter) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-green-50 to-white">
        <Card className="w-full max-w-md p-8 shadow-lg border-2 border-green-200">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-700">
              Senha alterada com sucesso!
            </h2>
            <p className="text-gray-600 text-lg">
              Você já pode fechar esta aba com segurança.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Toaster richColors position="top-center" />
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Redefinir Senha</h1>
          <p className="text-muted-foreground mt-2">Digite sua nova senha</p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password">Nova Senha</label>
            <Input
              id="password"
              name="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirme a Nova Senha</label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={
              loading ||
              password !== confirmPassword ||
              !password ||
              !confirmPassword
            }
          >
            {loading ? "Salvando..." : "Redefinir Senha"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

// Componente principal com Suspense
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Card className="w-full max-w-md p-6">
            <div className="text-center">Carregando...</div>
          </Card>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}