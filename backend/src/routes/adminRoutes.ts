import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { protect, restrictTo } from '../middlewares/authMiddleware';

const router = Router();

// ==========================================
// ALL ROUTES HERE ARE STRICTLY FOR ADMINS
// ==========================================
router.use(protect);
router.use(restrictTo('ADMIN'));

/**
 * @route POST /api/admin/provision-client
 * @description Creates a company and its initial recruiter account
 */
router.post('/provision-client', adminController.provisionB2BClient);

export default router;