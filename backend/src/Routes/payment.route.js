import { Router } from 'express';
import { protect } from '../Middleware/userAuth.Middleware.js';
import { createRazorpayOrder, verifyRazorpayPayment } from '../Controller/payment.controller.js';

const router = Router();

router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyRazorpayPayment);

export default router;
