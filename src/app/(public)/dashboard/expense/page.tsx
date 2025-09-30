import { auth } from "@/shared/lib/auth";
import { redirect } from "next/navigation";
import ExpensePageClient from "./page_client";
import db from "@/shared/lib/prisma";
import { Prisma } from "@prisma/client";

export default async function Page() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login");
  }
  const user = (await db.user.findUnique({
    where: { id: userId },
    include: {
      enterprise: {},
    },
  })) as Prisma.UserGetPayload<{ include: { enterprise: {} } }>;
  const expense = await db.expense.findMany({
    where:
      user?.permission === 1 && user.enterpriseId
        ? {
            user: {
              enterpriseId: user.enterpriseId,
            },
          }
        : { userId: userId },
    include: {
      user: {
        select: {
          email: true,
          name: true,
          id: true,
        },
      },
    },
  });

  console.log("Aqui", expense);

  return <ExpensePageClient expenses={expense} user={user} />;
}
