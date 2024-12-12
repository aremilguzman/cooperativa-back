import { Router } from "express";
import { PartnerController } from "../controllers/partner.controller.js";
import { protection, verifyAdmin } from "../middlewares/jwt.middleware.js";

const router = Router();

//rutas para manejar socios
router.post("/", protection, PartnerController.createPartner);
router.get("/", protection, PartnerController.getAllPartners);
router.get("/:sid", protection, PartnerController.getPartnerById);
router.put("/:sid", protection, PartnerController.updatePartner);
router.delete("/:sid", protection, verifyAdmin, PartnerController.deletePartner);

export default router;
