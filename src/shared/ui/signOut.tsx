"use client";
import { Button } from "./components/button";
import { signOut } from "next-auth/react";

export default function SignOut() {
  const handleSignOut = async() => {
    await signOut();
  };

  return (
    <Button
      onClick={handleSignOut}
      variant="outline"
      className="bg-slate-800 hover:bg-red-400"
    >
      SAIR
    </Button>
  );
}
