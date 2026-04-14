import { Router } from 'express';
import { getDashboard, getAudits, getUsers, getReports, updateUserBlockedState } from '../Controller/adminPanel.controller.js';

const router = Router();

router.get('/dashboard', getDashboard);
router.get('/audits', getAudits);
router.get('/users', getUsers);
router.patch('/users/:id/block', updateUserBlockedState);
router.get('/reports', getReports);

export default router;
