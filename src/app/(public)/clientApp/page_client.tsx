import { Enterprise, Services, User } from "@prisma/client";
import { ServiceGrid } from "./productGrid";

interface HomeProps{
    services: Services[]
    enterprise: Enterprise
    user: User | null
}

export default function Home({services, enterprise, user}:HomeProps) {
  return (
    <main>
      <ServiceGrid services={services} enterprise={enterprise} user={user}/>
    </main>
  );
}