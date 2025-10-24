"use client"

import { Button } from "@/shared/ui/components/button";
import { useRouter } from "next/navigation";

export default function NoUserPage() {
    const router = useRouter()
  const handleLogin = () => {
   router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800 px-6">
      <div className="max-w-md text-center bg-white shadow-md rounded-lg p-8 border border-gray-200">
        <h1 className="text-2xl font-semibold mb-4">Usuário não existe no Sistema</h1>
        <p className="mb-6 text-gray-600">
          Não foi possível identificar um usuário com esse email. <br />
          Por favor, faça login para acessar o sistema ou crie uma conta.
        </p>
        <Button
          onClick={handleLogin}
          className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Fazer Login
        </Button>
      </div>
    </div>
  );
}
