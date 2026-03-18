import { Router } from "express";
import {
    createMovieController,
    getAllMoviesController,
    getMovieByIdController,
    updateMovieController,

} from "../controllers/movie.controller";

import { authMiddleware } from "../middlewares/auth.middleware";



import multer from "multer";
import { importFileData } from "../controllers/import.controller";

import { fetchPopularMovies } from "../controllers/tmdb.controller";
import { syncExternalMovies } from "../controllers/tmdb.controller";


const upload = multer({ dest: "uploads/" }); // Stockage temporaire
const router = Router();

router.post("/import", upload.single("file"), importFileData);


router.get("/popular", fetchPopularMovies);
router.post("/sync-external", syncExternalMovies);

// CRUD Movies
router.post("/", authMiddleware, createMovieController); // protéger si nécessaire
router.get("/", getAllMoviesController);
router.get("/:id", getMovieByIdController);
router.put("/:id", authMiddleware, updateMovieController);
// router.delete("/:id", authMiddleware, deleteMovieController);

export default router;
