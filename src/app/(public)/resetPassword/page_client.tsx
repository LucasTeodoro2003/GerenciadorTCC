"use client";

import { useState } from "react";
import { Card } from "@/shared/ui/components/card";
import { Input } from "@/shared/ui/components/input";
import { Button } from "@/shared/ui/components/button";
import { alterPasswordEmail } from "@/shared/lib/actionUpdatePasswordEmail";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    try {
      await alterPasswordEmail(formData.get("email") as string, formData.get("password") as string);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Redefinir Senha</h1>
          <p className="text-muted-foreground mt-2">
            Digite sua nova senha
          </p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password">Nova Senha</label>
            <Input
              id="password"
              name="password"
              type="password"
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
            disabled={loading}
          >
            {loading ? "Salvando..." : "Redefinir Senha"}
          </Button>
        </form>
      </Card>
    </div>
  );
}