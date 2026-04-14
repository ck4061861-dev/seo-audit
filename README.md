# SEO Auditor - MERN Stack

**SEO · AEO · GEO Site Audit powered by Gemini AI**

A comprehensive SEO, AEO, and GEO site auditing tool featuring an 89-point check logic, PDF report export, and a modern, responsive user interface. This project is built using a robust MERN stack architecture.

---

## 🏗️ Project Structure

The workspace is divided into two main folders: rontend and ackend.

### 💻 Frontend (/frontend)
Built with **React**, **Vite**, and **Tailwind CSS**.
- **src/components/**: Contains the core UI elements (e.g., ActionPlanPanel, CompetitorsPanel, KeywordsPanel, Pricing, ResultsPage, AdminPanel, UserProfile).
- **src/Auth/**: User and Admin authentication components (UserLogin, UserRegister, AdminLogin, AdminRegister).
- **src/utils/**: Utilities including pdfExport.js (using html2canvas and jspdf) and Avatar generation (via @dicebear).
- **Routing**: Navigation managed by 
eact-router-dom.
- **Styling**: Tailored utility classes with 	ailwindcss and postcss.

**Key Commands:**
- 
pm run dev - Start Vite dev server.
- 
pm run build - Build for production.

---

### ⚙️ Backend (/backend)
Built with **Node.js**, **Express**, and **MongoDB** (via **Mongoose**).
- **src/Controller/**: Contains core business logic:
  - dminAuth.controller.js & userAuth.Controller.js (JWT & bcrypt-based authentication).
  - udit.Controller.js (Handles the AI auditing logic and check configurations).
  - payment.controller.js (Payment integration).
  - contact.controller.js (Handles communications).
- **src/Models/**: Mongoose schemas defining MongoDB collections (userAuth, dminAuth, udit, contact).
- **src/Routes/**: REST API endpoints for the respective controllers.
- **src/Middleware/**: Includes userAuth.Middleware.js for JWT route protection and authentication verification.
- **src/config/**: Database connection configuration and environment variables setup.

**Key Tools Used:**
- jsonwebtoken for secure stateless authentication.
- crypt for secure password hashing.
- express-rate-limit for API protection against spam/brute force.
- 
odemailer for email integrations.

**Key Commands:**
- 
pm run dev - Start the server dynamically using 
odemon.
- 
pm start - Start backend production server using 
ode.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js installed on your machine.
- MongoDB running locally or a MongoDB Atlas URI string.
- Environment API keys.

### 1. Setup Backend
1. Navigate into the folder: cd backend
2. Install dependencies: 
pm install
3. Configure the variables: Create a .env file in the ackend folder and add:
   - PORT=5000
   - MONGO_URI=your_mongodb_connection_string
   - JWT_SECRET=your_jwt_secret
4. Start the server: 
pm run dev

### 2. Setup Frontend
1. Navigate into the folder: cd frontend
2. Install dependencies: 
pm install
3. Start the dev server: 
pm run dev

---

## 🚀 Key Features

*   **Gemini AI Powered Audit**: Runs robust site audits tailored for Search Engine Optimization, Answer Engine Optimization, and Geographic Optimization.
*   **Comprehensive Dashboards**: Detailed displays mapping Keywords, Competitors, Strategies, Overview metrics, and actionable Module Panels.
*   **PDF Exports**: Direct-to-PDF report generation for users, giving them a physical/downloadable version of the audits.
*   **Multi-Role Auth**: Complete separation of functionalities between basic Users and Admins.
*   **Integrated Modules**: Supports Payment tracking, contact forms, and custom user settings profiles.
*   **Forgot Password Flow**: Secure OTP-based password reset via email with 5-minute expiry.
*   **Live Currency Conversion**: Automatic USD to INR conversion with real-time exchange rates for pricing.
*   **Dynamic Pricing Display**: Prices update based on live market exchange rates.
*   **Flexible UI**: Sidebar toggle for better space utilization and customizable layouts.

---

## 📋 Recent Implementations (v2.0)

### 1. **Forgot Password Feature** ✅
- **Email OTP Verification**: Users can reset passwords via OTP sent to email.
- **2-Step Process**:
  - Step 1: User enters email → receives 6-digit OTP
  - Step 2: User enters OTP + new password → password updated
- **Security**: OTP expires in 5 minutes, auto-deleted after use.
- **Routes**: 
  - `POST /api/auth/user/forgot-password` - Send OTP
  - `POST /api/auth/user/reset-password` - Verify OTP & update password
- **Frontend**: `src/Auth/ForgotPassword.jsx` component with smooth transitions.
- **Backend**: `src/Controller/userAuth.Controller.js` handles OTP generation and password reset logic.

### 2. **Live Exchange Rate Integration** ✅
- **Dynamic USD to INR Conversion**: Prices automatically update based on current market rates.
- **Dual API System**:
  - Primary: `api.exchangerate-api.com` (Real-time rates)
  - Fallback: `api.exchangerate.host` (Backup provider)
  - Default: 83 INR (if both APIs fail)
- **Real-time Display**: 
  - Exchange rate badge shown on pricing page
  - "Updating..." indicator while fetching rates
  - Live rate displayed in payment confirmation modal
- **Example Prices** (based on ~93.28 exchange rate):
  - Starter: $9 ≈ ₹840/month
  - Growth: $19 ≈ ₹1,772/month
  - Pro: $49 ≈ ₹4,571/month

### 3. **Payment improvements** ✅
- **Phone Number Field**: No longer pre-filled, user must enter manually each time for security.
- **Conversion Modal**: Shows clear USD → INR conversion before payment.
- **Razorpay Integration**: Seamless payment processing with live exchange rates.

### 4. **UI/UX Enhancements** ✅
- **Sidebar Visibility**: Sidebar hidden by default, can be toggled when needed.
- **Mobile Responsive**: Full mobile support with proper breakpoints.
- **Dark to Light Toggle**: Smooth transitions in navigation and modal displays.

---

## 🔐 Authentication Features

### User Authentication
- **Registration**: Email, name, phone, password validation.
- **Login**: JWT-based secure token system with refresh token rotation.
- **Password Reset**: OTP-based forgot password flow.
- **Token Management**: Auto-refresh tokens with 15-minute access token and 7-day refresh token.

### Admin Authentication
- Separate admin login and registration flows.
- Admin dashboard for user management and audit tracking.

---

## 💳 Payment & Pricing System

### Dynamic Pricing
- **Base Prices in USD**: Stored in cents to avoid floating-point issues.
- **Live Conversion**: USD → INR using current market exchange rates.
- **Plans Available**:
  1. **Starter** - Best for individuals
  2. **Growth** - For small teams
  3. **Pro** - For enterprises

### Payment Processing
- **Razorpay Integration**: Secure payment gateway with UPI, Cards, Netbanking, Wallets.
- **Order Creation**: Backend creates orders with INR amounts.
- **Payment Verification**: Secure webhook verification.
- **User Premium Status**: Auto-updated after successful payment.

---

## 📧 Email Service

**Nodemailer Integration**:
- Sends OTP emails for password reset.
- HTML-formatted email templates.
- Scheduled cleanup of expired OTPs (5-minute TTL on MongoDB).

---

## 🗄️ Database Models

### User Model (`userAuth.Model.js`)
- Email, name, phone, password (bcrypt hashed).
- Premium status, billing period, audit limits.
- Account status (active/blocked).

### OTP Model (`otp.model.js`)
- Email, OTP code.
- Auto-expires after 5 minutes (MongoDB TTL index).

### Payment Model
- Order tracking, payment verification.
- User subscription history.

---

## 🔧 Environment Variables Guide

### Backend (.env)
```
PORT=5000
MONGODB_URL=<your_mongodb_connection_uri>
jwtSecret=<your_jwt_secret_key>
refreshSecret=<your_refresh_token_secret>
RAZORPAY_KEY_ID=<your_razorpay_key>
RAZORPAY_KEY_SECRET=<your_razorpay_secret>
GMAIL_USER=<sender_email_for_otp>
GMAIL_PASSWORD=<app_password_for_gmail>
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

---

## 📦 Dependencies

### Frontend
- react, react-router-dom
- tailwindcss for styling
- @dicebear/avatars for avatar generation
- html2canvas, jspdf for PDF export
- axios/fetch for API calls

### Backend
- express for server framework
- mongoose for MongoDB ODM
- jsonwebtoken for JWT authentication
- bcrypt for password hashing
- nodemailer for email service
- express-rate-limit for API protection
- dotenv for environment variables

---

## 🚀 Deployment Checklist

- [ ] Update environment variables for production.
- [ ] Configure CORS for frontend domain.
- [ ] Enable HTTPS for all endpoints.
- [ ] Set up MongoDB Atlas for cloud database.
- [ ] Configure email service authentication.
- [ ] Test Razorpay in production mode.
- [ ] Set up error logging and monitoring.
- [ ] Enable rate limiting on all API endpoints.

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/user/register` - User registration
- `POST /api/auth/user/login` - User login
- `POST /api/auth/user/refresh` - Refresh access token
- `POST /api/auth/user/forgot-password` - Send password reset OTP
- `POST /api/auth/user/reset-password` - Reset password with OTP

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify payment

### Audit
- `POST /api/audit/run` - Run site audit
- `GET /api/audit/history` - Get user's audit history

---

## 🎯 Future Enhancements

- [ ] API documentation (Swagger/OpenAPI)
- [ ] Advanced analytics dashboard
- [ ] Scheduled audits
- [ ] Team collaboration features
- [ ] Custom report templates
- [ ] Database backups and recovery
- [ ] Performance monitoring and optimization
- [ ] Multi-language support

---

## 📄 License

This project is proprietary and confidential.
