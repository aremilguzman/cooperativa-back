import { db } from "../database/connection.js";

//modelo para crear usuarios
const create = async ({ email, password, username }) => {
  const query = {
    text: `
        INSERT INTO users (email, password, username)
        VALUES ($1, $2, $3)
        RETURNING uid, email, username, role_id
        `,
    values: [email, password, username],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

//modelo para buscar usuario por email
const findUserByEmail = async (email) => {
  const query = {
    text: `
            SELECT * FROM users
            WHERE email = $1
            `,
    values: [email],
  };
  const { rows } = await db.query(query);
  return rows[0];
};

//exportar los modelos
export const UserModel = {
  create,
  findUserByEmail,
};
