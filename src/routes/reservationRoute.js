import * as reservationController from "../controllers/reservationsController.js";
import { Router } from "express";

import { authMiddleware } from "../utils/authMiddleware.js";
const router = Router();

router.post("/", authMiddleware, reservationController.createReservation);
router.delete("/:id", authMiddleware, reservationController.deleteReservationById);
router.get("/:id", authMiddleware, reservationController.getReservationById);
router.put("/:id", authMiddleware, reservationController.updateReservation);

export default router;
