"use client"

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Clock, 
  Calendar as CalendarIcon, 
  Trash2, 
  Film, 
  Building2, 
  Search,
  CheckCircle2
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";

// --- TYPES ---
interface Showtime {
  id: number;
  movie_id: number;
  cinema_id: number;
  la_salle: string;
  start_time: string;
  end_time: string;
  format: "2D" | "3D" | "IMAX";
}

interface Movie {
  id: number;
  title: string;
}

interface Cinema {
  id: number;
  name: string;
  la_salle: string;
}

const MotionTableRow = motion(TableRow);

export default function ShowtimesPage() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [movieRes, cinemaRes, showtimeRes] = await Promise.all([
          axios.get("http://localhost:3000/api/movies"),
          axios.get("http://localhost:3000/api/cinemas"),
          axios.get("http://localhost:3000/api/showtimes"),
        ]);

        setMovies(movieRes.data.movies || []);
        setCinemas(cinemaRes.data.cinemas || []);
        setShowtimes(showtimeRes.data.showtimes || []);
      } catch (err) {
        console.error("Erreur data fetching :", err);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };
    fetchData();
  }, []);

  // Helpers pour le lookup rapide
  const getMovieTitle = (id: number) => movies.find(m => m.id === id)?.title || "Film inconnu";
  const getCinemaName = (id: number) => cinemas.find(c => c.id === id)?.name || "Cinéma inconnu";
  const getCinemaSalle = (id: number) => cinemas.find(c => c.id === id)?.la_salle || "Cinéma inconnu";

  const filteredShowtimes = showtimes.filter(s => 
    getMovieTitle(s.movie_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCinemaName(s.cinema_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="space-y-6 p-6"
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Séances</h1>
          <p className="text-muted-foreground">Planifiez la diffusion des films dans vos cinémas.</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-md hover:scale-105 transition-transform">
              <Plus className="h-4 w-4" /> Programmer une séance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Nouvelle Programmation</DialogTitle>
              <DialogDescription>Associez un film à une salle et un horaire précis.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Film</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Choisir un film" /></SelectTrigger>
                    <SelectContent>
                      {movies.map((m) => <SelectItem key={m.id} value={m.id.toString()}>{m.title}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Cinéma</Label>
                  <Select>
                    <SelectTrigger><SelectValue placeholder="Choisir un cinéma" /></SelectTrigger>
                    <SelectContent>
                      {cinemas.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label>Date</Label>
                  <Input type="date" className="focus-visible:ring-primary" />
                </div>
                <div className="grid gap-2">
                  <Label>Heure de début</Label>
                  <Input type="time" />
                </div>
                <div className="grid gap-2">
                  <Label>Format</Label>
                  <Select defaultValue="2D">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2D">2D Standard</SelectItem>
                      <SelectItem value="3D">3D Digital</SelectItem>
                      <SelectItem value="IMAX">IMAX 4K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">Confirmer la séance</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* FILTRES */}
      <div className="relative w-full max-w-sm group">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input 
          placeholder="Rechercher un film ou un lieu..." 
          className="pl-9 bg-card shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLEAU */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Programmation</TableHead>
              <TableHead>Lieu & Salle</TableHead>
              <TableHead>Date & Heure</TableHead>
             
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`sk-${i}`}>
                    <TableCell><div className="flex items-center gap-3"><Skeleton className="h-9 w-9 rounded-full" /><Skeleton className="h-4 w-32" /></div></TableCell>
                    <TableCell><div className="space-y-2"><Skeleton className="h-3 w-24" /><Skeleton className="h-3 w-16" /></div></TableCell>
                    <TableCell><div className="space-y-2"><Skeleton className="h-3 w-20" /><Skeleton className="h-4 w-12" /></div></TableCell>
                    <TableCell><Skeleton className="h-6 w-12 rounded-md" /></TableCell>
                    <TableCell><div className="flex justify-end"><Skeleton className="h-8 w-8 rounded-md" /></div></TableCell>
                  </TableRow>
                ))
              ) : (
                filteredShowtimes.map((s, index) => (
                  <MotionTableRow 
                    key={s.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.04 }}
                    className="group"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                          <Film className="h-4 w-4" />
                        </div>
                        <span className="font-semibold group-hover:text-blue-600 transition-colors">
                          {getMovieTitle(s.movie_id)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="flex items-center text-sm font-medium">
                          <Building2 className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                          {getCinemaName(s.cinema_id)}
                        </span>
                        <span className="text-xs text-muted-foreground pl-5 italic">{getCinemaSalle(s.cinema_id)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <span className="flex items-center text-xs text-muted-foreground">
                          <CalendarIcon className="mr-1.5 h-3 w-3" />
                          {new Date(s.start_time).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </span>
                        <span className="flex items-center text-sm font-bold text-primary">
                          <Clock className="mr-1.5 h-3.5 w-3.5" />
                          {new Date(s.start_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </TableCell>
                     
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="text-destructive   group-hover:opacity-100 transition-opacity hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </MotionTableRow>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
        
        {!loading && filteredShowtimes.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center gap-2">
            <div className="bg-muted p-4 rounded-full mb-2">
              <Search className="h-8 w-8 text-muted-foreground opacity-20" />
            </div>
            <p className="text-muted-foreground font-medium">Aucune séance trouvée</p>
            <p className="text-xs text-muted-foreground">Essayez de modifier vos filtres ou de programmer une séance.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}