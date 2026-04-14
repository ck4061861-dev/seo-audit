import express from "express";
import rateLimit from "express-rate-limit";
import { runAudit } from "../Controller/audit.Controller.js";
import { protect } from "../Middleware/userAuth.Middleware.js";

const router = express.Router();

const auditLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 10,
  message: { error: "Too many audit requests. Please try again after 24 hours." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/run", protect, auditLimiter, runAudit);

export default router;
