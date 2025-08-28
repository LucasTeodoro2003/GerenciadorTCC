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
import { useState } from "react";

export function NavMain({
  items,
  onSetSkeleton,
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
  onSetSkeleton?: (isActive: boolean) => void;
}) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState()

  function handleSearch(term: string) {
    console.log(term)
    
    console.log("ERA PRA FUNCIONAR")
    if (term === "table" && onSetSkeleton) {
      onSetSkeleton(true);
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
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a className="hover:cursor-pointer"
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
