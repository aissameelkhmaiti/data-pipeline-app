import app from "./app";
import pool from "./config/db";
import http from "http";
import { Server } from "socket.io";

const PORT = process.env.PORT || 3000;

// Créer le serveur HTTP à partir de Express
const server = http.createServer(app);

// Configurer Socket.IO
export const io = new Server(server, {
  cors: {
    origin: "*",  
    methods: ["GET", "POST"]
  }
});

 

// Connexion à la DB
pool.connect()
  .then(() => {
    console.log("Database connected");

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  });