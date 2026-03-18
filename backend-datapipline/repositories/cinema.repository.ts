import pool from "../config/db";

export const CinemaRepository = {
  getAll: async () => {
    const result = await pool.query("SELECT * FROM cinemas ORDER BY id ASC");
    return result.rows;
  },

  getById: async (id: number) => {
    const result = await pool.query("SELECT * FROM cinemas WHERE id = $1", [id]);
    return result.rows[0];
  },

  create: async (cinema: { name: string; city: string; country: string ;la_salle :string ; capacite?: string}) => {
    console.log(cinema)
    const result = await pool.query(
      "INSERT INTO cinemas (name, city, country,la_salle,capacite ) VALUES ($1, $2, $3,$4,$5) RETURNING *",
      [cinema.name, cinema.city, cinema.country,cinema.la_salle,cinema.capacite]
    );
    return result.rows[0];
  },

  update: async (id: number, cinema: { name?: string; city?: string; country?: string ;la_salle ?:string ;   capacite?: string}) => {
    const current = await CinemaRepository.getById(id);
    if (!current) return null;

    const updated = {
      name: cinema.name || current.name,
      city: cinema.city || current.city,
      country: cinema.country || current.country,
      la_salle: cinema.la_salle || current.la_salle,
       capacite: cinema.capacite || current.capacite,
    };

    const result = await pool.query(
      "UPDATE cinemas SET name=$1, city=$2, country=$3,la_salle=$4 ,capacite=$5  WHERE id=$4 RETURNING *",
      [updated.name, updated.city, updated.country,updated.la_salle,updated.capacite, id]
    );

    return result.rows[0];
  },

  delete: async (id: number) => {
    const result = await pool.query("DELETE FROM cinemas WHERE id=$1 RETURNING *", [id]);
    return result.rows[0];
  },
};