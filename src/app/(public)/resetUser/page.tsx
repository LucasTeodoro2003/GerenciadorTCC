import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";
import PageReset from "./page_client";
import db from "@/shared/lib/prisma";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: userId },
  });

  const users = await db.user.findMany();
  console.log(users);

  if (!user || user.permission === 3) {
    redirect("/noAcess");
  }

  const firstname = user.name?.split(" ")[0] ?? "Sem Nome";

  return <PageReset />;
}
