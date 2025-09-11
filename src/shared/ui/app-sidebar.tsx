"use client"

import * as React from "react"
import {
  Bot,
  Home,
  MessageCircleMoreIcon,
} from "lucide-react"
import { NavMain } from "@/shared/ui/nav-main"
import { NavUser } from "@/shared/ui/nav-user"
import { TeamSwitcher } from "@/shared/ui/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/shared/ui/components/sidebar"
import { Prisma, User } from "@prisma/client"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: Prisma.UserGetPayload<{include: {enterprise: {}}}>;  users: User[],
  onSetSkeletonTable: (isActive: boolean) => void;
  onSetSkeletonHome: (isActive: boolean) => void;
  onSetSkeletonMessage: (isActive: boolean) => void;
  onSetSkeletonExpense: (isActive: boolean) => void;
  onSetSkeletonRevenue: (isActive: boolean) => void;
  onSetSkeletonCreate: (isActive: boolean) => void;
}

export function AppSidebar({user, users, onSetSkeletonTable, onSetSkeletonHome, onSetSkeletonMessage,onSetSkeletonExpense, onSetSkeletonRevenue, onSetSkeletonCreate, ...props }: AppSidebarProps) {
const permissionUser = user.permission;
const dataUserPage = permissionUser === 1;
const firtNameEnterprise = user.enterprise?.name.split(" ")[0];

const dataUser = {
  user:{
    name: user.name,
    email: user.email,
    avatar: user.image
  },
  teams: [
    {
      name: firtNameEnterprise || "",
      logo: user.enterprise?.image || "user.png",
      plan: (user.enterprise?.name.split(" ").slice(1,3).join(" ")) || ""
    },
  ]
}

const data = !dataUserPage ? {
  navMain: [
    {
      title: "Pagina Inicial",
      page: "",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Home",
          page: "",
        },
      ],
    },
    {
      title: "Clientes",
      page: "#",
      icon: Bot,
      items: [
        {
          title: "Quantum",
          page: "#",
        },
      ],
    },
    {
      title: "Mensagens",
      page: "#",
      icon: MessageCircleMoreIcon,
      items: [
        {
          title: "sei la",
          page: "#",
        },
      ],
    },
  ],
}
:
{
  navMain: [
    {
      title: "Pagina Inicial",
      page: "",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Home",
          page: "",
        },
        {
          title: "Despesas",
          page: "expense",
        },
        {
          title: "Receitas",
          page: "revenue",
        },
      ],
    },
    {
      title: "Clientes",
      page: "table",
      icon: Bot,
      items: [
        {
          title: "Editar Usuários",
          page: "table",
        },
        {
          title: "Mensagens Automáticas",
          page: "message",
        },
        {
          title: "Quantum",
          page: "#",
        },
      ],
    },
    {
      title: "Criar",
      page: "create",
      icon: MessageCircleMoreIcon,
      items: [
        {
          title: "Serviços",
          page: "create",
        },
        {
          title: "Get Started",
          page: "#",
        },
        {
          title: "Tutorials",
          page: "#",
        },
        {
          title: "Changelog",
          page: "#",
        },
      ],
    },
  ],
}

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={dataUser.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} onSetSkeletonTable={onSetSkeletonTable} onSetSkeletonHome={onSetSkeletonHome} onSetSkeletonMessage={onSetSkeletonMessage} onSetSkeletonExpense={onSetSkeletonExpense} onSetSkeletonRevenue={onSetSkeletonRevenue} onSetSkeletonCreate={onSetSkeletonCreate}/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} users={users}/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
