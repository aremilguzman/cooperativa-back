import { Router } from "express";
import { LoanController } from "../controllers/loan.controller.js";
import { protection, verifyAdmin } from "../middlewares/jwt.middleware.js";

const router = Router();

//rutas para prestamos
router.post("/", protection, LoanController.createLoan);
router.get("/", protection, LoanController.getAllLoans);
router.get("/:pid", protection, LoanController.getLoanById);
router.put("/:pid", protection, LoanController.updateLoan);
router.delete("/:pid", protection, verifyAdmin, LoanController.deleteLoan);

export default router;
