import "dotenv/config";
import cors from "cors";
import express from "express";
import userRouter from "./src/routes/user.route.js";
import PartnerRouter from "./src/routes/partner.route.js";
import LoanRouter from "./src/routes/loan.route.js";
import TrackingRouter from "./src/routes/tracking.route.js";

const app = express();

//Documentacion con Swagger
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";
const require = createRequire(import.meta.url); // Necesario para archivos JSON
const swaggerDocumentation = require("./swagger.json");

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocumentation));
app.use("/api/users", userRouter);
app.use("/api/partners", PartnerRouter);
app.use("/api/loans", LoanRouter);
app.use("/api/trackings", TrackingRouter);

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log("Servidor corriendo en el puerto", PORT));
}
export default app;
