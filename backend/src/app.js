import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import auditRoutes from "./Routes/audit.Routes.js";
import route from './Routes/userAuth.Routes.js';
import adminRoute from './Routes/adminAuth.route.js';
import adminPanelRoutes from './Routes/admin.panel.route.js';
import contactRoutes from './Routes/contact.route.js';
import paymentRoutes from './Routes/payment.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cookieParser());

const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = [clientOrigin, 'https://seoaudit.buimbdigital.com'];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Mount auth routes
app.use('/api/auth', route);
app.use('/api/auth', adminRoute);
app.use('/api/admin', adminPanelRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/payments', paymentRoutes);
app.use("/api/audit", auditRoutes);
app.get("/health", (req, res) => res.json({ status: "ok", message: "SeoAuditor API running" }));

// Health route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

export default app;