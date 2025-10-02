"use server"
import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";
import db from "@/shared/lib/prisma";
import EdityUserPage from "./page_client";
import { Prisma } from "@prisma/client";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login");
  }
  const user = await db.user.findUnique({
    where: { id: userId },
    include:{addresses:{where:{isPrimary:true}}}
  }) as Prisma.UserGetPayload<{include: {addresses:{where:{isPrimary:true}}}}>;

  return <EdityUserPage user={user} />;
}
