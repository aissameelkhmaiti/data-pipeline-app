import express from "express";
import * as PipelineController from "../controllers/pipeline.controller";

const router = express.Router();

router.get("/logs", PipelineController.getPipelineLogs);

export default router;