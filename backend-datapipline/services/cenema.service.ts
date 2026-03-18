import { CinemaRepository } from "../repositories/cinema.repository";

export const CinemaService = {
  getAllCinemas: async () => {
    return await CinemaRepository.getAll();
  },

  getCinemaById: async (id: number) => {
    return await CinemaRepository.getById(id);
  },

  createCinema: async (data: { name: string; city: string; country: string ; la_salle: string ; capacite: string}) => {
    return await CinemaRepository.create(data);
  },

  updateCinema: async (id: number, data: { name?: string; city?: string; country?: string ;la_salle?: string ;capacite?: string}) => {
    return await CinemaRepository.update(id, data);
  },

  deleteCinema: async (id: number) => {
    return await CinemaRepository.delete(id);
  },
};