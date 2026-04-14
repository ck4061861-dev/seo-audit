import { Router } from 'express';   

import { registerAdmin, loginAdmin } from '../Controller/adminAuth.controller.js';

const adminAuthRouter = Router();


// Define routes for admin registration and login
adminAuthRouter.post('/admin/register', registerAdmin);
adminAuthRouter.post('/admin/login', loginAdmin);

export default adminAuthRouter;