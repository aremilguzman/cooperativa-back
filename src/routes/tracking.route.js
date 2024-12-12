import { Router } from "express";
import { TrackingController } from "../controllers/tracking.controller.js";
import { protection, verifyAdmin } from "../middlewares/jwt.middleware.js";

const router = Router();

router.post("/", protection, verifyAdmin, TrackingController.createTracking);
router.get("/", protection, TrackingController.getAllTrackings);
router.get("/:tid", protection, TrackingController.getTrackingById);
router.put("/:tid", protection, verifyAdmin, TrackingController.updateTracking);
router.delete("/:tid", protection, verifyAdmin, TrackingController.deleteTracking);

export default router;