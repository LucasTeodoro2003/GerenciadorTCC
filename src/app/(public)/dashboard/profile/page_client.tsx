"use client"

import { EdityUser } from "@/features/actions/users/edityUser";
import { Prisma } from "@prisma/client";

interface EdityPageProps {
  user: Prisma.UserGetPayload<{include: {addresses:{where:{isPrimary:true}}}}>;
}

export default function EdityUserPage({ user }: EdityPageProps) {
    console.log("CLIENTE: ",user)

  return <EdityUser user={user} />;
}
