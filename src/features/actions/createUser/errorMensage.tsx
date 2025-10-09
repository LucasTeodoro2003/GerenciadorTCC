"use client";

import { useSearchParams } from "next/navigation";
import { toast, Toaster } from "sonner";

export function CreateErrorMessage() {
  return <LoginError />;
}

function LoginError() {
  const params = useSearchParams();
  const error = params.get("error");

  if (error) {
    return <span className="text-red-600 text-sm ">{error}</span>
  } else {
    return null
  }
}
