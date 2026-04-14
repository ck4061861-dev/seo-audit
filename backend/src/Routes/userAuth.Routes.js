import { Router } from "express";
import { registerUser, loginUser, refreshTokenController, forgotPassword, resetPassword } from "../Controller/userAuth.Controller.js";

const authRouter = Router();

// Define routes for user registration, login, and token refresh
authRouter.post("/user/register", registerUser);
authRouter.post("/user/login", loginUser);
authRouter.post("/user/refresh", refreshTokenController);
authRouter.post("/user/forgot-password", forgotPassword);
authRouter.post("/user/reset-password", resetPassword);

export default authRouter;