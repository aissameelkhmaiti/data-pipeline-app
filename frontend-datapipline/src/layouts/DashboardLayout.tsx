"use client"

import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "../context/AuthContext"
import { AppSidebar } from "../components/app-sidebar"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "../components/ui/breadcrumb"
import { Separator } from "../components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../components/ui/sidebar"
import { Bell, User, Settings, LogOut, Search, Sun, Moon } from "lucide-react" // Ajout de Sun et Moon
import { Button } from "../components/ui/button"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { toast } from "sonner"
import { io } from "socket.io-client"
import { useEffect, useState } from "react"
import { useTheme } from "../components/theme-provider" // Import du hook theme

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { setTheme, theme } = useTheme() // Utilisation du theme

  const [notifications, setNotifications] = useState<string[]>([])

  const socket = io("http://localhost:3000")

  useEffect(() => {
    socket.on("import_status", (data: { message: string }) => {
      setNotifications(prev => [data.message, ...prev])
      toast.info(data.message)
    })

    return () => {
      socket.off("import_status")
    }
  }, [])

  const pageName = location.pathname.split("/").pop() || "Dashboard"
  const formattedPageName = pageName.charAt(0).toUpperCase() + pageName.slice(1)

  const handleLogout = () => {
    logout()
    navigate("/login")
    toast.success("Déconnexion réussie")
  }

  const getInitials = (name: string = "User") => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* HEADER */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 bg-background/95 backdrop-blur sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Pipeline Manager</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={location.pathname}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <BreadcrumbPage className="capitalize font-semibold">
                        {formattedPageName}
                      </BreadcrumbPage>
                    </motion.div>
                  </AnimatePresence>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* SEARCH */}
            <div className="hidden lg:flex relative group">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <motion.input
                whileFocus={{ width: 300 }}
                type="search"
                placeholder="Rechercher..."
                className="pl-9 h-9 w-64 rounded-full border bg-muted/50 px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            {/* DARK MODE TOGGLE */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Clair</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Sombre</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>Système</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* NOTIFICATIONS */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-9 w-9">
                  <Bell className="h-5 w-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                      <span className="animate-ping absolute h-full w-full rounded-full bg-destructive opacity-75"></span>
                      <span className="relative rounded-full h-2 w-2 bg-destructive"></span>
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                {notifications.length === 0 ? (
                  <DropdownMenuItem>Aucune notification</DropdownMenuItem>
                ) : (
                  notifications.map((msg, idx) => (
                    <DropdownMenuItem key={idx} className="text-sm">{msg}</DropdownMenuItem>
                  ))
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* USER MENU */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name || "Invité"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || "Pas d'email"}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex flex-1 flex-col gap-4 p-6 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}