"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  Search, 
  MapPin, 
  Pencil, 
  Trash2, 
  Building2, 
  Users,
  Theater,
  Loader2
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"

import { Label } from "../../components/ui/label"
import { Badge } from "../../components/ui/badge"
import { Skeleton } from "../../components/ui/skeleton"

interface Cinema {
  id: number
  name: string
  city: string
  la_salle: string
  capacite: string
  status: string
}

// Composant TableRow animé
const MotionTableRow = motion(TableRow)

export default function CinemasPage() {
  const [cinemas, setCinemas] = useState<Cinema[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchCinemas = async () => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:3000/api/cinemas")
      console.log(res.data)
      setCinemas(res.data.cinemas || [])
    } catch (error) {
      console.error("Erreur chargement cinemas:", error)
    } finally {
      // Petit délai pour fluidifier l'animation
      setTimeout(() => setLoading(false), 500)
    }
  }

  useEffect(() => {
    fetchCinemas()
  }, [])

  const filteredCinemas = cinemas.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6"
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Cinémas</h1>
          <p className="text-muted-foreground">Configurez les lieux de diffusion et leurs capacités.</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button className="gap-2 bg-primary shadow-md">
                <Plus className="h-4 w-4" /> Ajouter un Cinéma
              </Button>
            </motion.div>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter un établissement</DialogTitle>
              <DialogDescription>Créez un nouveau point de diffusion dans votre réseau.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom du cinéma</Label>
                <Input id="name" placeholder="Ex: Pathé California" className="focus-visible:ring-primary" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Ville / Adresse</Label>
                <Input id="location" placeholder="Ex: Casablanca" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="rooms">Nombre de salles</Label>
                  <Input type="number" id="rooms" placeholder="0" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacity">Capacité totale</Label>
                  <Input type="number" id="capacity" placeholder="0" />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" className="w-full sm:w-auto">Créer le cinéma</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* SEARCH */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4"
      >
        <div className="relative w-full max-w-sm group">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Rechercher un cinéma ou une ville..." 
            className="pl-9 bg-card focus-visible:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      {/* TABLE */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Établissement</TableHead>
              <TableHead>Localisation</TableHead>
              <TableHead>Salles</TableHead>
              <TableHead>Capacité</TableHead>
              {/* <TableHead>Status</TableHead> */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <AnimatePresence mode="wait">
              {loading ? (
                // SKELETON LOADING
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    <TableCell><div className="flex gap-3"><Skeleton className="h-9 w-9" /><Skeleton className="h-4 w-32 mt-2" /></div></TableCell>
                    <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                    <TableCell><div className="flex justify-end gap-2"><Skeleton className="h-8 w-8" /><Skeleton className="h-8 w-8" /></div></TableCell>
                  </TableRow>
                ))
              ) : (
                filteredCinemas.map((cinema, index) => (
                  <MotionTableRow 
                    key={cinema.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group transition-colors"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary text-secondary-foreground"
                        >
                          <Building2 className="h-5 w-5" />
                        </motion.div>
                        <span className="group-hover:text-primary transition-colors">{cinema.name}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="mr-1 h-3.5 w-3.5 text-red-500" />
                        {cinema.city}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center">
                        <Theater className="mr-1.5 h-4 w-4 text-muted-foreground" />
                        {cinema.la_salle}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center">
                        <Users className="mr-1.5 h-4 w-4 text-muted-foreground" />
                        {cinema.capacite}
                      </div>
                    </TableCell>

                    {/* <TableCell>
                      <Badge 
                        variant={cinema.status === "Actif" ? "default" : "secondary"}
                        className={cinema.status === "Actif" ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-none" : ""}
                      >
                        {cinema.status}
                      </Badge>
                    </TableCell> */}

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1   group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-600 hover:bg-blue-50">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </MotionTableRow>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>

        {!loading && filteredCinemas.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-12 text-center text-muted-foreground"
          >
            Aucun cinéma trouvé.
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}