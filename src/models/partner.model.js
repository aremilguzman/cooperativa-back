import { db } from "../database/connection.js";

//modelo para crear socios
const createPartner = async ({ full_name, email, phone, address }) => {
  const query = {
    text: `
            INSERT INTO socios (full_name, email, phone, address )
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `,
    values: [full_name, email, phone, address],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

//obtener listado de socios
const getAllPartners = async () => {
  const query = {
    text: `
    SELECT * FROM socios`,
  };
  const { rows } = await db.query(query);
  return rows;
};

//obtener socio por ID
const getPartnerById = async (sid) => {
  const query = {
    text: `SELECT * FROM socios WHERE sid = $1`,
    values: [sid],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

//Actualizar informacion de un socio
const updatePartner = async (sid, { full_name, email, phone, address }) => {
  const query = {
    text: `
      UPDATE socios
      SET full_name = $1, email = $2, phone = $3, address = $4
      WHERE sid = $5
      RETURNING sid, full_name, email, phone, address, created_at
    `,
    values: [full_name, email, phone, address, sid],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

//Borrar socio
const deletePartner = async (sid) => {
  const query = {
    text: `DELETE FROM socios WHERE sid = $1 RETURNING sid`,
    values: [sid],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

//exportar modelos
export const PartnerModel = {
  createPartner,
  getAllPartners,
  getPartnerById,
  updatePartner,
  deletePartner,
};
