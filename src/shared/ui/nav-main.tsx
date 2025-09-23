"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/ui/components/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/shared/ui/components/sidebar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export function NavMain({
  items,
  onSetSkeletonTable,
  onSetSkeletonHome,
  onSetSkeletonMessage,
  onSetSkeletonExpense,
  onSetSkeletonRevenue,
  onSetSkeletonCreate,
  onSetSkeletonClient,
  onSetSkeletonEnterprise,
  onSetSkeletonCalendar,
}: {
  items: {
    title: string;
    page: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      page: string;
    }[];
  }[];
  onSetSkeletonTable?: (isActive: boolean) => void;
  onSetSkeletonHome?: (isActive: boolean) => void;
  onSetSkeletonMessage?: (isActive: boolean) => void;
  onSetSkeletonExpense?: (isActive: boolean) => void;
  onSetSkeletonRevenue?: (isActive: boolean) => void;
  onSetSkeletonCreate?: (isActive: boolean) => void;
  onSetSkeletonClient?: (isActive: boolean) => void;
  onSetSkeletonEnterprise?: (isActive: boolean) => void;
  onSetSkeletonCalendar?: (isActive: boolean) => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  function handleSearch(term: string) {
    if (term === "table" && onSetSkeletonTable) {
      onSetSkeletonTable(true);
      if (onSetSkeletonHome) onSetSkeletonHome(false);
      if (onSetSkeletonMessage) onSetSkeletonMessage(false);
      if (onSetSkeletonRevenue) onSetSkeletonRevenue(false);
      if (onSetSkeletonExpense) onSetSkeletonExpense(false);
      if (onSetSkeletonCreate) onSetSkeletonCreate(false);
      if (onSetSkeletonClient) onSetSkeletonClient(false);
      if (onSetSkeletonEnterprise) onSetSkeletonEnterprise(false);
      if (onSetSkeletonCalendar) onSetSkeletonCalendar(false);
    }

    if (term === "" && onSetSkeletonHome) {
      onSetSkeletonHome(true);
      if (onSetSkeletonTable) onSetSkeletonTable(false);
      if (onSetSkeletonMessage) onSetSkeletonMessage(false);
      if (onSetSkeletonExpense) onSetSkeletonExpense(false);
      if (onSetSkeletonRevenue) onSetSkeletonRevenue(false);
      if (onSetSkeletonCreate) onSetSkeletonCreate(false);
      if (onSetSkeletonClient) onSetSkeletonClient(false);
      if (onSetSkeletonEnterprise) onSetSkeletonEnterprise(false);
      if (onSetSkeletonCalendar) onSetSkeletonCalendar(false);
    }

    if (term === "message" && onSetSkeletonMessage) {
      onSetSkeletonMessage(true);
      if (onSetSkeletonTable) onSetSkeletonTable(false);
      if (onSetSkeletonHome) onSetSkeletonHome(false);
      if (onSetSkeletonExpense) onSetSkeletonExpense(false);
      if (onSetSkeletonRevenue) onSetSkeletonRevenue(false);
      if (onSetSkeletonCreate) onSetSkeletonCreate(false);
      if (onSetSkeletonClient) onSetSkeletonClient(false);
      if (onSetSkeletonEnterprise) onSetSkeletonEnterprise(false);
      if (onSetSkeletonCalendar) onSetSkeletonCalendar(false);
    }

    if (term === "expense" && onSetSkeletonExpense) {
      onSetSkeletonExpense(true);
      if (onSetSkeletonTable) onSetSkeletonTable(false);
      if (onSetSkeletonHome) onSetSkeletonHome(false);
      if (onSetSkeletonMessage) onSetSkeletonMessage(false);
      if (onSetSkeletonRevenue) onSetSkeletonRevenue(false);
      if (onSetSkeletonCreate) onSetSkeletonCreate(false);
      if (onSetSkeletonClient) onSetSkeletonClient(false);
      if (onSetSkeletonEnterprise) onSetSkeletonEnterprise(false);
      if (onSetSkeletonCalendar) onSetSkeletonCalendar(false);
    }

    if (term === "revenue" && onSetSkeletonRevenue) {
      onSetSkeletonRevenue(true);
      if (onSetSkeletonTable) onSetSkeletonTable(false);
      if (onSetSkeletonHome) onSetSkeletonHome(false);
      if (onSetSkeletonMessage) onSetSkeletonMessage(false);
      if (onSetSkeletonExpense) onSetSkeletonExpense(false);
      if (onSetSkeletonCreate) onSetSkeletonCreate(false);
      if (onSetSkeletonClient) onSetSkeletonClient(false);
      if (onSetSkeletonEnterprise) onSetSkeletonEnterprise(false);
      if (onSetSkeletonCalendar) onSetSkeletonCalendar(false);
    }

    if (term === "create" && onSetSkeletonCreate) {
      onSetSkeletonCreate(true);
      if (onSetSkeletonTable) onSetSkeletonTable(false);
      if (onSetSkeletonHome) onSetSkeletonHome(false);
      if (onSetSkeletonMessage) onSetSkeletonMessage(false);
      if (onSetSkeletonExpense) onSetSkeletonExpense(false);
      if (onSetSkeletonRevenue) onSetSkeletonRevenue(false);
      if (onSetSkeletonClient) onSetSkeletonClient(false);
      if (onSetSkeletonEnterprise) onSetSkeletonEnterprise(false);
      if (onSetSkeletonCalendar) onSetSkeletonCalendar(false);
    }

    if (term === "clients" && onSetSkeletonClient) {
      onSetSkeletonClient(true);
      if (onSetSkeletonTable) onSetSkeletonTable(false);
      if (onSetSkeletonHome) onSetSkeletonHome(false);
      if (onSetSkeletonMessage) onSetSkeletonMessage(false);
      if (onSetSkeletonExpense) onSetSkeletonExpense(false);
      if (onSetSkeletonRevenue) onSetSkeletonRevenue(false);
      if (onSetSkeletonCreate) onSetSkeletonCreate(false);
      if (onSetSkeletonEnterprise) onSetSkeletonEnterprise(false);
      if (onSetSkeletonCalendar) onSetSkeletonCalendar(false);
    }

    if (term === "enterprise" && onSetSkeletonEnterprise) {
      onSetSkeletonEnterprise(true);
      if (onSetSkeletonTable) onSetSkeletonTable(false);
      if (onSetSkeletonHome) onSetSkeletonHome(false);
      if (onSetSkeletonMessage) onSetSkeletonMessage(false);
      if (onSetSkeletonExpense) onSetSkeletonExpense(false);
      if (onSetSkeletonRevenue) onSetSkeletonRevenue(false);
      if (onSetSkeletonCreate) onSetSkeletonCreate(false);
      if (onSetSkeletonClient) onSetSkeletonClient(false);
      if (onSetSkeletonCalendar) onSetSkeletonCalendar(false);
    }

    if (term === "calendar" && onSetSkeletonCalendar) {
      onSetSkeletonCalendar(true);
      if (onSetSkeletonTable) onSetSkeletonTable(false);
      if (onSetSkeletonHome) onSetSkeletonHome(false);
      if (onSetSkeletonMessage) onSetSkeletonMessage(false);
      if (onSetSkeletonExpense) onSetSkeletonExpense(false);
      if (onSetSkeletonRevenue) onSetSkeletonRevenue(false);
      if (onSetSkeletonCreate) onSetSkeletonCreate(false);
      if (onSetSkeletonClient) onSetSkeletonClient(false);
      if (onSetSkeletonEnterprise) onSetSkeletonEnterprise(false);
    }

    router.push("/dashboard/" + term);
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Itens</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && (
                    <Link
                      href={"/dashboard/" + item.page}
                      className="bg-red-500"
                    >
                      <item.icon />
                    </Link>
                  )}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link
                          className="hover:cursor-pointer hover:bg-gray-600 hover:bg-opacity-35"
                          href={"/dashboard/" + subItem.page}
                        >
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
