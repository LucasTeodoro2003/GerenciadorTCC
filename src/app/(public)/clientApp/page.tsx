// HomePage - Arquivo server component
import db from "@/shared/lib/prisma";
import Home from "./page_client";
import { Enterprise, User } from "@prisma/client";
import { auth } from "@/shared/lib/auth";

export default async function HomePage() {
  const session = await auth();
  const userId = session?.user?.id;
  
  let user = null;

  if (userId) {
    user = await db.user.findUnique({
      where: { id: userId }
    }) as User;
  }

  const services = await db.services.findMany({
    where: { enterpriseId: "1" },
  });

  const enterprise = (await db.enterprise.findUnique({
    where: { id: "1" },
  })) as Enterprise;

  return <Home services={services} enterprise={enterprise} user={user} />;
}