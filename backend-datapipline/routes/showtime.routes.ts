import { Router } from "express";
import { ShowtimeController } from "../controllers/showtime.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, ShowtimeController.create);
router.get("/", ShowtimeController.getAll);
router.get("/:id", ShowtimeController.getById);
router.put("/:id", authMiddleware, ShowtimeController.update);
// router.delete("/:id", authMiddleware, ShowtimeController.delete);

export default router;