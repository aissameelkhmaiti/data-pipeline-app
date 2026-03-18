import * as PipelineRepo from "../repositories/pipeline.repository";

export const getPipelineLogs = async () => {
  return await PipelineRepo.getPipelineLogs();
};