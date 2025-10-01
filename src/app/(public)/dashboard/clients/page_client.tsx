"use client"

import { EdityUser } from "@/features/actions/users/edityUser";
import { Prisma } from "@prisma/client";

interface EdityPageProps {
  user: Prisma.UserGetPayload<{include: {addresses:{where:{isPrimary:true}}}}>;
}

export default function EdityUserPage({ user }: EdityPageProps) {
  return <EdityUser user={user} />;
}
