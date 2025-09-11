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

export function NavMain({
  items,
  onSetSkeletonTable,
  onSetSkeletonHome,
  onSetSkeletonMessage,
  onSetSkeletonExpense,
  onSetSkeletonRevenue,
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
}) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  function handleSearch(term: string) {
    //VERIFICAR QUAL PAGINA CARREGA O SKELETON \\

    if (term === "table" && onSetSkeletonTable) {
      onSetSkeletonTable(true);
      if (onSetSkeletonHome) onSetSkeletonHome(false);
      if (onSetSkeletonMessage) onSetSkeletonMessage(false);
      if (onSetSkeletonRevenue) onSetSkeletonRevenue(false);
      if (onSetSkeletonExpense) onSetSkeletonExpense(false);
    }

    if (term === "" && onSetSkeletonHome) {
      onSetSkeletonHome(true);
      if (onSetSkeletonTable) onSetSkeletonTable(false);
      if (onSetSkeletonMessage) onSetSkeletonMessage(false);
      if (onSetSkeletonExpense) onSetSkeletonExpense(false);
      if (onSetSkeletonRevenue) onSetSkeletonRevenue(false);
    }

    if (term === "message" && onSetSkeletonMessage) {
      onSetSkeletonMessage(true);
      if (onSetSkeletonTable) onSetSkeletonTable(false);
      if (onSetSkeletonHome) onSetSkeletonHome(false);
      if (onSetSkeletonExpense) onSetSkeletonExpense(false);
      if (onSetSkeletonRevenue) onSetSkeletonRevenue(false);
    }

    if (term === "expense" && onSetSkeletonExpense) {
      onSetSkeletonExpense(true);
      if (onSetSkeletonTable) onSetSkeletonTable(false);
      if (onSetSkeletonHome) onSetSkeletonHome(false);
      if (onSetSkeletonMessage) onSetSkeletonMessage(false);
      if (onSetSkeletonRevenue) onSetSkeletonRevenue(false);
    }

    if (term === "revenue" && onSetSkeletonRevenue) {
      onSetSkeletonRevenue(true);
      if (onSetSkeletonTable) onSetSkeletonTable(false);
      if (onSetSkeletonHome) onSetSkeletonHome(false);
      if (onSetSkeletonMessage) onSetSkeletonMessage(false);
      if (onSetSkeletonExpense) onSetSkeletonExpense(false);
    }

    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("page", term);
    } else {
      params.delete("page");
    }
    replace(`${pathname}?${params.toString()}`);
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
                  {item.icon && <item.icon onClick={()=>{handleSearch(item.page)}}/>}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a
                          className="hover:cursor-pointer hover:bg-gray-600 hover:bg-opacity-35"
                          onClick={() => {
                            handleSearch(subItem.page);
                          }}
                        >
                          <span>{subItem.title}</span>
                        </a>
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
