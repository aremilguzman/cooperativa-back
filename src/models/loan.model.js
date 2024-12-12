import { db } from "../database/connection.js";

//modelo para crear prestamos
const createLoan = async ({ amount, interest_rate, duration, socio_id }) => {
  const query = {
    text: `
        INSERT INTO prestamos (amount, interest_rate, duration, socio_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `,
    values: [amount, interest_rate, duration, socio_id],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

//modelo para visualizar todos los prestamos existentes
const getAllLoans = async () => {
  const query = {
    text: `
        SELECT prestamos.*, socios.full_name AS socio_nombre
        FROM prestamos
        INNER JOIN socios ON prestamos.socio_id = socios.sid
        ORDER BY prestamos.fecha_creacion DESC
      `,
  };
  const { rows } = await db.query(query);
  return rows;
};

//visualizar prestamo por ID
const getLoanById = async (pid) => {
  const query = {
    text: `
        SELECT prestamos.*, socios.full_name AS socio_nombre
        FROM prestamos
        INNER JOIN socios ON prestamos.socio_id = socios.sid
        WHERE prestamos.pid = $1
      `,
    values: [pid],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

//actualizar prestamo
const updateLoan = async (
  pid,
  { amount, interest_rate, duration, socio_id }
) => {
  const query = {
    text: `
        UPDATE prestamos
        SET amount = $1, interest_rate = $2, duration = $3, socio_id = $4
        WHERE pid = $5
        RETURNING *
      `,
    values: [amount, interest_rate, duration, socio_id, pid],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

//eliminar prestamo
const deleteLoan = async (pid) => {
  const query = {
    text: `DELETE FROM prestamos WHERE pid = $1 RETURNING pid`,
    values: [pid],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

//exportar modelos
export const LoanModel = {
  createLoan,
  getAllLoans,
  getLoanById,
  updateLoan,
  deleteLoan,
};
