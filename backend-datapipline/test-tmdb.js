require('dotenv').config();
const axios = require('axios');

async function testTMDB() {
    const apiKey = process.env.TMDB_API_KEY;
    console.log()
    const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=fr-FR&page=1`;

    try {
        const response = await axios.get(url);
        const movies = response.data.results;

        console.log(` Connexion réussie ! ${movies.length} films récupérés.`);
        
        // On affiche les 3 premiers pour voir la structure
        movies.slice(0, 3).forEach(movie => {
            console.log(`- ${movie.title} (Sortie le : ${movie.release_date})`);
        });

    } catch (error) {
        console.error(" Erreur lors du test :", error.response ? error.response.data : error.message);
    }
}

testTMDB();