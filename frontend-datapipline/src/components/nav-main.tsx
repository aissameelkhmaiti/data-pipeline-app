"use client"

import * as React from "react"
import { ChevronRightIcon, type LucideIcon } from "lucide-react"
import { motion } from "framer-motion"
import { Link, useLocation } from "react-router-dom"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../components/ui/collapsible"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    isCollapsible?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {

  const location = useLocation()
  const currentPath = location.pathname

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
        Gestion des Données
      </SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item, index) => {
          const Icon = item.icon

          const isGroupActive =
            currentPath === item.url ||
            item.items?.some((sub) => sub.url === currentPath)

          // =========================
          // Lien simple
          // =========================
          if (!item.isCollapsible) {
            return (
              <motion.div
                key={item.title}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={currentPath === item.url}
                    className="hover:bg-accent transition-all duration-200"
                  >
                    <Link to={item.url} className="flex items-center gap-3">
                      {Icon && (
                        <motion.div whileHover={{ scale: 1.2 }}>
                          <Icon className="size-4 shrink-0" />
                        </motion.div>
                      )}

                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>
            )
          }

          // =========================
          // Menu dropdown
          // =========================
          return (
            <motion.div
              key={item.title}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Collapsible
                asChild
                defaultOpen={isGroupActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="hover:bg-accent"
                      isActive={isGroupActive}
                    >
                      
                      {Icon && (
                        <Icon className="size-4 shrink-0 transition-transform group-hover/collapsible:scale-110" />
                      )}

                      <span className="font-medium">{item.title}</span>

                      <ChevronRightIcon className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent asChild>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <SidebarMenuSub>
                        {item.items?.map((subItem, subIndex) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={currentPath === subItem.url}
                            >
                              <Link to={subItem.url} className="group/sub">
                                <motion.span
                                  initial={{ x: -5, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{
                                    delay:
                                      index * 0.05 + subIndex * 0.03,
                                  }}
                                  className="text-muted-foreground group-hover/sub:text-foreground group-data-[active=true]:text-foreground group-hover/sub:translate-x-1 transition-all duration-200"
                                >
                                  {subItem.title}
                                </motion.span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </motion.div>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </motion.div>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}