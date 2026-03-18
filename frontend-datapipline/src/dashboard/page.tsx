import { useEffect, useState } from "react"
import axios from "axios"

import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Film, Activity, CheckCircle2, AlertCircle, Clock } from "lucide-react"
import { motion } from "framer-motion"

// Configuration des styles par statut
const statusConfig = {
  success: {
    icon: CheckCircle2,
    color: "text-green-600",
    bg: "bg-green-100",
    label: "Succès"
  },
  error: {
    icon: AlertCircle,
    color: "text-red-600",
    bg: "bg-red-100",
    label: "Erreur"
  },
  pending: {
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-100",
    label: "En cours"
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

const formatTimeAgo = (date: string) => {
  const now = new Date()
  const created = new Date(date)
  const diff = Math.floor((now.getTime() - created.getTime()) / 1000)

  const hours = Math.floor(diff / 3600)
  const minutes = Math.floor(diff / 60)

  if (hours > 0) return `Il y a ${hours}h`
  if (minutes > 0) return `Il y a ${minutes} min`
  return "À l'instant"
}

export default function DashboardPage() {
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/pipeline/logs")
        setLogs(res.data.data)
      } catch (error) {
        console.error("Erreur récupération pipeline logs", error)
      }
    }
    fetchLogs()
  }, [])

  return (
    <motion.div 
      className="space-y-4 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Films en Base</CardTitle>
              <Film className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <motion.div 
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold"
              >
                1,284
              </motion.div>
              <p className="text-xs text-muted-foreground">+12 depuis hier</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Séances Actives</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <motion.div 
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold"
              >
                452
              </motion.div>
              <p className="text-xs text-muted-foreground">Dans 8 cinémas</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Pipeline Activity */}
      <motion.div variants={itemVariants}>
        <Card className="flex-1 overflow-hidden">
          <CardHeader>
            <CardTitle>Dernières Activités du Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {logs.map((log, i) => {
                // On récupère la config selon le status (fallback sur 'error' si inconnu)
                const config = statusConfig[log.status as keyof typeof statusConfig] || statusConfig.error
                const Icon = config.icon

                return (
                  <motion.div 
                    key={log.id}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                    className="flex items-center justify-between border-b pb-4 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      {/* Icône Dynamique */}
                      <div className={`${config.bg} p-2 rounded-full transition-colors`}>
                        <Icon className={`h-4 w-4 ${config.color}`} />
                      </div>

                      <div>
                        <p className="font-medium text-sm">
                          {log.source_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {log.status === "success" 
                            ? `${log.rows_processed} lignes traitées` 
                            : "Erreur lors de l'importation"}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                       <div className="text-xs text-muted-foreground">
                          {formatTimeAgo(log.created_at)}
                       </div>
                       {/* Petit badge optionnel pour le statut textuel */}
                       <span className={`text-[10px] font-bold uppercase ${config.color}`}>
                         {config.label}
                       </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}