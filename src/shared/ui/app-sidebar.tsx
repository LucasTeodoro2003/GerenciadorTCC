"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Home,
  Settings2,
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
import { User } from "@prisma/client"
import { LogoLavaJato } from "../../../public/lavajato";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: User,
  users: User[]
}

export function AppSidebar({user, users, ...props }: AppSidebarProps) {

const dataUser = {
  user:{
    name: user.name,
    email: user.email,
    avatar: user.image
  },
  teams: [
    {
      name: "Alvorada Estética Automotiva",
      logo: LogoLavaJato,
      plan: "Empresa"
    },
  ]
}

  // This is sample data.
const data = {
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
      page: "#",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Home",
          page: "",
        },
        {
          title: "Tabela Usuários",
          page: "table",
        },
        {
          title: "Settings",
          page: "#",
        },
      ],
    },
    {
      title: "Models",
      page: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          page: "#",
        },
        {
          title: "Explorer",
          page: "#",
        },
        {
          title: "Quantum",
          page: "#",
        },
      ],
    },
    {
      title: "Documentation",
      page: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
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
    {
      title: "Settings",
      page: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          page: "#",
        },
        {
          title: "Team",
          page: "#",
        },
        {
          title: "Billing",
          page: "#",
        },
        {
          title: "Limits",
          page: "#",
        },
      ],
    },
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
        <NavMain items={data.navMain}/>
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} users={users}/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
