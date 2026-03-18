import db from "../config/db"

export const createPipelineLog = async (
  source: string,
  rows: number,
  type: string,
  status: string
) => {
  const result = await db.query(
    `INSERT INTO pipeline_logs (source_name, rows_processed, type, status)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [source, rows, type, status]
  )

  return result.rows[0]
}


export const getPipelineLogs = async () => {
  const result = await db.query(`
    SELECT *
    FROM pipeline_logs
    ORDER BY created_at DESC
    LIMIT 10
  `);

  return result.rows;
};