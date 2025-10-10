import { Enterprise, Services } from "@prisma/client";
import { ServiceGrid } from "./productGrid";

interface HomeProps{
    services: Services[]
    enterprise: Enterprise
}

export default function Home({services, enterprise}:HomeProps) {
  return (
    <main>
      <ServiceGrid services={services} enterprise={enterprise}/>
    </main>
  );
}