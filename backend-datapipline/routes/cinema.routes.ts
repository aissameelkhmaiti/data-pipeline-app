import { Router } from "express";
import { CinemaController } from "../controllers/cenema.controller";
import { authMiddleware } from "../middlewares/auth.middleware"; // si tu veux protéger les routes

const router = Router();

router.get("/", CinemaController.getAll);
router.get("/:id", CinemaController.getById);
router.post("/", authMiddleware, CinemaController.create);
router.put("/:id", authMiddleware, CinemaController.update);
router.delete("/:id", authMiddleware, CinemaController.delete);

export default router;