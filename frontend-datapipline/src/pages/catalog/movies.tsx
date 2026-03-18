"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { Plus, Search, Pencil, Trash2, Film } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/ui/pagination"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { Skeleton } from "../../components/ui/skeleton"

// --- TYPES ---
interface Movie {
  id: number
  title: string
  genre: string
  duration: number
  release_date: string
}

const MotionTableRow = motion(TableRow)

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

export default function MoviesPage() {
  // États des données
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // États de la pagination Shadcn
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 5 

  const fetchMovies = async (page: number) => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:3000/api/movies", {
        params: { page, limit }
      })
      // On attend du backend: { movies: [], totalPages: x }
      setMovies(Array.isArray(res.data.movies) ? res.data.movies : [])
      setTotalPages(res.data.totalPages || 1)
    } catch (error) {
      console.error("Erreur chargement films :", error)
    } finally {
      setTimeout(() => setLoading(false), 500)
    }
  }

  useEffect(() => {
    fetchMovies(currentPage)
  }, [currentPage])

  // Filtrage local (optionnel si géré par le backend)
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 p-6"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catalogue Films</h1>
          <p className="text-muted-foreground">Liste paginée depuis PostgreSQL</p>
        </div>
        
        <Button className="gap-2 shadow-lg">
          <Plus className="h-4 w-4" /> Ajouter un Film
        </Button>
      </div>

      {/* SEARCH */}
      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher un film..." 
            className="pl-9 bg-card"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-[300px]">Film</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Durée</TableHead>
              {/* <TableHead>Date sortie</TableHead> */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: limit }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`}>
                    <TableCell><div className="flex items-center gap-3"><Skeleton className="h-9 w-9 rounded-lg" /><Skeleton className="h-4 w-[150px]" /></div></TableCell>
                    <TableCell><Skeleton className="h-5 w-[80px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[60px]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
                    <TableCell className="text-right"><div className="flex justify-end gap-2"><Skeleton className="h-8 w-8 rounded-md" /><Skeleton className="h-8 w-8 rounded-md" /></div></TableCell>
                  </TableRow>
                ))
              ) : (
                filteredMovies.map((movie, index) => (
                  <MotionTableRow 
                    key={movie.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <Film className="h-5 w-5" />
                        </div>
                        {movie.title}
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="secondary">{movie.genre}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{movie.duration} min</TableCell>
                    {/* <TableCell className="text-muted-foreground">{movie.release_date}</TableCell> */}
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1   group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600"><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </MotionTableRow>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>

        {/* --- SHADCN PAGINATION --- */}
        <div className="py-4 border-t bg-muted/10">
          <Pagination>
            <PaginationContent>
              {/* Bouton Précédent */}
              <PaginationItem>
                <PaginationPrevious 
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                />
              </PaginationItem>

              {/* Numéros de page dynamiques */}
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                // On affiche la page 1, la dernière, et celles autour de la page courante
                if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink 
                        isActive={currentPage === pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  )
                }
                // Ellipsis si écart
                if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                  return <PaginationItem key={pageNum}><PaginationEllipsis /></PaginationItem>
                }
                return null;
              })}

              {/* Bouton Suivant */}
              <PaginationItem>
                <PaginationNext 
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      
      {!loading && filteredMovies.length === 0 && (
        <p className="text-center text-muted-foreground py-10">Aucun film trouvé.</p>
      )}
    </motion.div>
  )
}