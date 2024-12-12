import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

export const db = new Pool({
  allowExitOnIdle: true,
  connectionString,
});

//Probar conexion a la base de datos
try {
  await db.query("SELECT NOW()");
  console.log("Base de datos conectada");
} catch (error) {
  console.log(error);
}
