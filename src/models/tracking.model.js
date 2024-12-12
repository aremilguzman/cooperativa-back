import { db } from "../database/connection.js";

const createTracking = async ({ t_date, notas, prestamo_id }) => {
  const query = {
    text: `
      INSERT INTO seguimientos (t_date, status, notas, prestamo_id)
      VALUES ($1, DEFAULT, $2, $3)
      RETURNING *
    `,
    values: [t_date, notas, prestamo_id],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

const getAllTrackings = async () => {
  const query = {
    text: `
      SELECT seguimientos.*, prestamos.amount AS prestamo_monto
      FROM seguimientos
      INNER JOIN prestamos ON seguimientos.prestamo_id = prestamos.pid
      ORDER BY seguimientos.created_at DESC
    `,
  };
  const { rows } = await db.query(query);
  return rows;
};

const getTrackingById = async (tid) => {
  const query = {
    text: `
      SELECT seguimientos.*, prestamos.amount AS prestamo_monto
      FROM seguimientos
      INNER JOIN prestamos ON seguimientos.prestamo_id = prestamos.pid
      WHERE seguimientos.tid = $1
    `,
    values: [tid],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

const updateTracking = async (tid, { t_date, status, notas }) => {
  const query = {
    text: `
      UPDATE seguimientos
      SET t_date = $1, status = $2, notas = $3
      WHERE tid = $4
      RETURNING *
    `,
    values: [t_date, status, notas, tid],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

const deleteTracking = async (tid) => {
  const query = {
    text: `DELETE FROM seguimientos WHERE tid = $1 RETURNING tid`,
    values: [tid],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

export const TrackingModel = {
  createTracking,
  getAllTrackings,
  getTrackingById,
  updateTracking,
  deleteTracking,
};
