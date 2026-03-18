import { Request, Response } from "express";
import * as PipelineService from "../services/pipeline.service";

export const getPipelineLogs = async (req: Request, res: Response) => {
  try {
    const logs = await PipelineService.getPipelineLogs();

    res.json({
      success: true,
      data: logs
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Erreur récupération pipeline logs"
    });

  }
};