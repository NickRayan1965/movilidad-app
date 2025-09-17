import { Router } from "express";
import * as assembliesController from '../controllers/assembliesController.js';
import { authMiddleware } from "../utils/authMiddleware.js";

const router = Router();
router.get('/dashboard', assembliesController.assembliesDashboard);
router.get('/edit/:id', assembliesController.editAssemblyView);
router.get('/:id', authMiddleware, assembliesController.getAssemblyById);
router.post('', authMiddleware, assembliesController.createAssembly);
router.get('', authMiddleware, assembliesController.getActiveAssemblies);
export default router;