import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { authMiddleware } from "../utils/authMiddleware.js";

const router = Router();

//router.post("/register", authController.register);
router.post("/login", authController.login);
router.get('/login', authController.loginForm);
export default router;
