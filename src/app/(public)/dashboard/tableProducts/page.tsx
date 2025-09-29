import { redirect } from "next/navigation";
import TableProdutctPage from "./page_client";
import { auth } from "@/shared/lib/auth";
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
  const enterpriseId = user?.enterpriseId || "";
  const products = await db.products.findMany({
    where: { enterpriseId: enterpriseId },
  });

  return <TableProdutctPage products={products} />;
}
