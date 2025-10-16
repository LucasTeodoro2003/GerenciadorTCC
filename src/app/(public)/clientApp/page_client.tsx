"use client";
import { Enterprise, Services, User } from "@prisma/client";
import { ServiceGrid } from "./productGrid";
import { useRouter } from "next/navigation";

interface HomeProps{
    services: Services[]
    enterprise: Enterprise
    user: User | null
}

export default function Home({services, enterprise, user}:HomeProps) {
  const router = useRouter()
  router.prefetch("/clientApp")
  router.prefetch("/clientApp/calendarApp")
  router.prefetch("/clientApp/userApp")
  router.prefetch("/clientApp/loginApp")
  return (
    <main>
      <ServiceGrid services={services} enterprise={enterprise} user={user}/>
    </main>
  );
}