import { Router } from "express";
import * as assemblyTypesService from '../controllers/assemblyTypesController.js';
import { authMiddleware } from "../utils/authMiddleware.js";

const router = Router();
router.get('', authMiddleware, assemblyTypesService.getAssemblyTypes);
export default router;