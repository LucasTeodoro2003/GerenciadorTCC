"use server";
import { redirect } from "next/navigation";
import { Card } from "@/shared/ui/components/card";
import ResetPasswordPage from "./page_client";
import VerifyToken from "@/shared/lib/actionVeryToken";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const token = searchParams.token as string;
  const email = searchParams.email as string;
  
  if (!token || !email) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md p-6">
          <div className="text-center text-red-500">
            Link inválido ou expirado
          </div>
        </Card>
      </div>
    );
  }

  try {
    const exist = await VerifyToken(token, email);
    if (!exist) {
      redirect("/noUser");
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    redirect("/noUser");
  }

  return <ResetPasswordPage />;
}