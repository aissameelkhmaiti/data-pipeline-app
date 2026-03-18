"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react" // Import de Framer Motion
import {
  DatabaseIcon,
  FilmIcon,
  LayoutDashboardIcon,
  MapPinIcon,
  ClapperboardIcon,
  BarChart3Icon,
  FileJsonIcon,
  ShieldCheckIcon
} from "lucide-react"

import { NavMain } from "../components/nav-main"
import { NavProjects } from "../components/nav-projects"
import { TeamSwitcher } from "../components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "../components/ui/sidebar"

const data = {
  teams: [
    { name: "Movie Pipeline", logo: ClapperboardIcon, plan: "Production" },
    { name: "Dev Environment", logo: DatabaseIcon, plan: "Staging" },
  ],
  navMain: [
    { title: "Tableau de Bord", url: "/dashboard", icon: LayoutDashboardIcon, isActive: true, isCollapsible: false },
    { title: "Data Pipeline", url: "/import/upload", icon: DatabaseIcon, isCollapsible: false },
    {
      title: "Gestion Catalogue",
      url: "/movies",
      icon: FilmIcon,
      isCollapsible: true,
      items: [
        { title: "Tous les Films", url: "/movies" },
        { title: "Cinémas & Salles", url: "/cinemas", icon: MapPinIcon },
        { title: "Séances (Showtimes)", url: "/showtimes" },
      ],
    },
  ],
  projects: [
    { name: "Analytics", url: "/analytics", icon: BarChart3Icon },
    { name: "Exports JSON", url: "/exports", icon: FileJsonIcon },
    { name: "Sécurité & Auth", url: "/settings/security", icon: ShieldCheckIcon },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      
      {/* Animation du contenu lors de l'apparition */}
      <SidebarContent>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <NavMain items={data.navMain} />
          {/* <NavProjects projects={data.projects} /> */}
        </motion.div>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  )
}