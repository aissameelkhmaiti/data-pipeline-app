import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import movieRoutes from "./routes/movie.routes";
import cinemaRoutes from "./routes/cinema.routes"
import ShowtimeRoutes from "./routes/showtime.routes"
import pipelineRoutes from "./routes/pipeline.routes";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/cinemas", cinemaRoutes);
app.use("/api/showtimes", ShowtimeRoutes);
app.use("/api/pipeline", pipelineRoutes);


export default app;