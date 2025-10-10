import db from "@/shared/lib/prisma";
import Home from "./page_client";
import { Enterprise } from "@prisma/client";

export default async function HomePage() {
  const services = await db.services.findMany({
    where: { enterpriseId: "1" },
  });

  const enterprise = await db.enterprise.findUnique({
    where: {id: "1"}
  }) as Enterprise

  return <Home services={services} enterprise={enterprise}/>;
}
