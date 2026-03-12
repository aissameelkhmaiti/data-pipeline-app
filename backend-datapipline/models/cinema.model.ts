// src/models/cinema.model.ts

export interface Cinema {
  id: number;
  name: string;
  city: string;
  country: string;
  created_at: Date;
  la_salle:string;
  
}

// Interface pour créer un nouveau cinéma
export interface CreateCinemaInput {
  name: string;
  city: string;
  country: string;
  la_salle:string;
}

// Interface pour mettre à jour un cinéma (optionnel)
export interface UpdateCinemaInput {
  name?: string;
  city?: string;
  country?: string;
  la_salle?:string;
}