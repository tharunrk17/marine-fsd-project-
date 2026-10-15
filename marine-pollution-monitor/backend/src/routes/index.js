import { Router } from 'express';
import auth from './auth.js';
import reports from './reports.js';
import cleanup from './cleanup.js';
import { makeCrudRoutes } from './generic.js';
import WaterQuality from '../models/WaterQuality.js';
import EnvironmentalIndicator from '../models/EnvironmentalIndicator.js';
import { dashboard } from '../controllers/dashboardController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.use('/auth', auth);
router.get('/dashboard', protect, dashboard);
router.use('/reports', reports);
router.use('/cleanup', cleanup);
router.use('/water-quality', makeCrudRoutes(WaterQuality, 'recordedBy', '', ['officer', 'ngo', 'admin']));
router.use('/indicators', makeCrudRoutes(EnvironmentalIndicator, 'recordedBy', '', ['officer', 'ngo', 'admin']));

export default router;
