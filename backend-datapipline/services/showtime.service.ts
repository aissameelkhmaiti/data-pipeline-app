import { ShowtimeRepository } from "../repositories/showtime.repository";
import { Showtime } from "../models/showtime.model";

export const ShowtimeService = {
  create: (data: Omit<Showtime, "id" | "created_at">) => ShowtimeRepository.create(data),
  findAll: () => ShowtimeRepository.findAll(),
  findById: (id: number) => ShowtimeRepository.findById(id),
  update: (id: number, data: Partial<Showtime>) => ShowtimeRepository.update(id, data),
  delete: (id: number) => ShowtimeRepository.delete(id),
};