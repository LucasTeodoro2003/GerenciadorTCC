"use client"
import { CircularProgress } from "@mui/material";
import { Button } from "./button";
import { useFormStatus } from "react-dom";


export default function ButtonCreateUser() {
    const {pending} = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <CircularProgress size={20} /> : "CRIAR"}
    </Button>
  );
}
