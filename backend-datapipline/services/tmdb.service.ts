import axios from "axios";

const TMDB_API_KEY = process.env.MOVIE_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Mapping genre_ids -> noms (exemple)
const genreMap: Record<number, string> = {
   28: "Action",
  878: "Science-Fiction",
  53: "Thriller",
  80: "Crime",
  16: "Animation",
  35: "Comédie",
  12: "Aventure",
  10751: "Famille",
  9648: "Mystère"
};

export const getPopularMovies = async (page: number = 1) => {
  try {
    const url = `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=fr-FR&page=${page}`;
    const response = await axios.get(url);
    const tmdbMovies = response.data.results;

    // Mapping sûr vers "genre" et "duration"
    const movies = tmdbMovies.map((m: any) => ({
      title: m.title,
      release_date: m.release_date,
      duration: m.runtime || 0, // TMDB popular ne fournit pas toujours la durée
      genre:
        m.genre_ids && m.genre_ids.length > 0
          ? m.genre_ids.map((id: number) => genreMap[id] || "Inconnu").join(", ")
          : "Inconnu",
    }));

    return movies;
  } catch (error: any) {
    console.error("Erreur TMDB :", error.response?.data || error.message);
    throw error;
  }
};