import { db } from "./src/database/connection.js";

(async () => {
  try {
    const result = await db.query("SELECT NOW()");
    console.log("Conexión exitosa a la base de datos de pruebas:", result.rows);
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  } finally {
    await db.end();
  }
})();