import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { protect, restrictTo } from '../middlewares/authMiddleware';
import { uploadMiddleware } from '../middlewares/uploadMiddleware';

const router = Router();

router.use(protect);
router.use(restrictTo('ADMIN'));

router.post('/provision-client', uploadMiddleware.single('logo'), adminController.provisionB2BClient);
router.get('/companies', adminController.getAllCompanies);
router.patch('/companies/:id', uploadMiddleware.single('logo'), adminController.updateCompany);
router.delete('/companies/:id', adminController.deleteCompany);

export default router;