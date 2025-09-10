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
import { LogoLavaJato } from "../../../public/lavajato";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: Prisma.UserGetPayload<{include: {enterprise: {}}}>;  users: User[],
  onSetSkeletonTable: (isActive: boolean) => void;
  onSetSkeletonHome: (isActive: boolean) => void;
  onSetSkeletonMessage: (isActive: boolean) => void;
  onSetSkeletonExpense: (isActive: boolean) => void;
}

export function AppSidebar({user, users, onSetSkeletonTable, onSetSkeletonHome, onSetSkeletonMessage,onSetSkeletonExpense, ...props }: AppSidebarProps) {
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

  // This is sample data.
const data = !dataUserPage ? {
  // user: {
  //   name: "shadcn",
  //   email: "m@example.com",
  //   avatar: "usuario.png",
  // },
  // teams: [
  //   {
  //     name: "Acme Inc",
  //     logo: GalleryVerticalEnd,
  //     plan: "Enterprise",
  //   },
  //   {
  //     name: "Acme Corp.",
  //     logo: AudioWaveform,
  //     plan: "Startup",
  //   },
  //   {
  //     name: "Evil Corp.",
  //     logo: Command,
  //     plan: "Free",
  //   },
  // ],
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
        // {
        //   title: "Settings?",
        //   page: "#",
        // },
      ],
    },
    {
      title: "Clientes",
      page: "#",
      icon: Bot,
      items: [
        // {
        //   title: "Editar Usuários",
        //   page: "table",
        // },
        // {
        //   title: "Mensagens Automáticas",
        //   page: "message",
        // },
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
        // {
        //   title: "Get Started",
        //   page: "#",
        // },
        // {
        //   title: "Tutorials",
        //   page: "#",
        // },
        // {
        //   title: "Changelog",
        //   page: "#",
        // },
      ],
    },
    // {
    //   title: "Settings",
    //   page: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       page: "#",
    //     },
    //     {
    //       title: "Team",
    //       page: "#",
    //     },
    //     {
    //       title: "Billing",
    //       page: "#",
    //     },
    //     {
    //       title: "Limits",
    //       page: "#",
    //     },
    //   ],
    // },
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     page: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     page: "#",
  //     icon: PieChart,
  //   },
  // ],
}:{
  // user: {
  //   name: "shadcn",
  //   email: "m@example.com",
  //   avatar: "usuario.png",
  // },
  // teams: [
  //   {
  //     name: "Acme Inc",
  //     logo: GalleryVerticalEnd,
  //     plan: "Enterprise",
  //   },
  //   {
  //     name: "Acme Corp.",
  //     logo: AudioWaveform,
  //     plan: "Startup",
  //   },
  //   {
  //     name: "Evil Corp.",
  //     logo: Command,
  //     plan: "Free",
  //   },
  // ],
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
          title: "Settings?",
          page: "#",
        },
      ],
    },
    {
      title: "Clientes",
      page: "#",
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
      title: "Mensagens",
      page: "#",
      icon: MessageCircleMoreIcon,
      items: [
        {
          title: "sei la",
          page: "#",
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
    // {
    //   title: "Settings",
    //   page: "#",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       page: "#",
    //     },
    //     {
    //       title: "Team",
    //       page: "#",
    //     },
    //     {
    //       title: "Billing",
    //       page: "#",
    //     },
    //     {
    //       title: "Limits",
    //       page: "#",
    //     },
    //   ],
    // },
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     page: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     page: "#",
  //     icon: PieChart,
  //   },
  // ],
}

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={dataUser.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} onSetSkeletonTable={onSetSkeletonTable} onSetSkeletonHome={onSetSkeletonHome} onSetSkeletonMessage={onSetSkeletonMessage} onSetSkeletonExpense={onSetSkeletonExpense}/>
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} users={users}/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
