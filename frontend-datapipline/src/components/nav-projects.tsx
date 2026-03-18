"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../components/ui/sidebar"
import { 
  MoreHorizontalIcon, 
  ExternalLinkIcon, 
  ArrowUpRightIcon, 
  Trash2Icon,
  type LucideIcon 
} from "lucide-react"

export function NavProjects({
  projects,
}: {
  projects: {
    name: string
    url: string
    icon: LucideIcon // Utilisation du type de composant d'icône
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Outils & Analytics</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => {
          const Icon = item.icon // On instancie le composant d'icône
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <Icon className="size-4" />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction
                    showOnHover
                    className="aria-expanded:bg-muted"
                  >
                    <MoreHorizontalIcon />
                    <span className="sr-only">Plus</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <ExternalLinkIcon className="mr-2 size-4 text-muted-foreground" />
                    <span>Ouvrir dans un onglet</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ArrowUpRightIcon className="mr-2 size-4 text-muted-foreground" />
                    <span>Partager le rapport</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2Icon className="mr-2 size-4" />
                    <span>Supprimer du raccourci</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          )
        })}
       
      </SidebarMenu>
    </SidebarGroup>
  )
}