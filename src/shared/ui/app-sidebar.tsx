"use client"
import * as React from "react"
import {
  Bot,
  Building2,
  CogIcon,
  Home,
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
}

export function AppSidebar({user, users, ...props }: AppSidebarProps) {
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
                {
          title: "Calendário",
          page: "calendar",
        },
      ],
    },
        {
      title: "Empresa",
      page: "message",
      icon: Building2,
      isActive: true,
      items: [
        {
          title: "Finalizar Serviços",
          page: "message",
        },
      ],
    },
    {
      title: "Clientes",
      page: "table",
      icon: Bot,
      items: [
        {
          title: "Agendar",
          page: "create",
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
          title: "Calendário",
          page: "calendar",
        },
      ],
    },
        {
      title: "Empresa",
      page: "message",
      icon: Building2,
      isActive: true,
      items: [
        {
          title: "Despesas",
          page: "expense",
        },
        {
          title: "Receitas",
          page: "revenue",
        },
        {
          title: "Finalizar Serviços",
          page: "message",
        },
                {
          title: "Produtos",
          page: "tableProducts",
        },
                {
          title: "Serviços",
          page: "tableServices",
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
          title: "Agendar",
          page: "create",
        },
        {
          title: "Veículos",
          page: "tableCar",
        },
      ],
    },
    {
      title: "Criar",
      page: "create",
      icon: CogIcon,
      items: [
        {
          title: "Clientes",
          page: "clients",
        },
        {
          title: "Gerenciar",
          page: "enterprise",
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
        <NavMain items={data.navMain}/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} users={users}/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
