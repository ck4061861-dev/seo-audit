import User from '../Models/userAuth.Model.js';
import Otp from '../Models/otp.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { sendOTPEmail } from '../utils/emailService.js';

// ─────────────────────────────────────────
// Helper: Generate Access + Refresh Tokens
// ─────────────────────────────────────────
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email },
    config.jwtSecret,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    config.refreshSecret,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};


// ─────────────────────────────────────────
// Helper: Set Cookies
// ─────────────────────────────────────────
const setAuthCookies = (res, accessToken, refreshToken) => {
  const sameSite = process.env.NODE_ENV === 'production' ? 'none' : 'lax';
  const secure = process.env.NODE_ENV === 'production';

  const cookieDomain = process.env.COOKIE_DOMAIN || undefined;
  const cookieOptions = {
    httpOnly: true,
    secure,
    sameSite,
  };

  res
    .cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
      domain: cookieDomain,
      path: '/',
    })
    .cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      domain: cookieDomain,
      path: '/',
    });
};


// ─────────────────────────────────────────
// Register User
// ─────────────────────────────────────────
async function registerUser(req, res) {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const normalizedPhone = phone.toString().replace(/\D/g, '');
    if (normalizedPhone.length !== 10) {
      return res.status(400).json({ message: 'Phone number must be exactly 10 digits.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const isAlreadyExist = await User.findOne({ email });
    if (isAlreadyExist) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // bcrypt hash (saltRounds = 12)
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone.toString().replace(/\D/g, ''),
    });

    const { accessToken, refreshToken } = generateTokens(newUser);
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      message: 'User registered successfully.',
      accessToken,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: 'User',
        premium: newUser.premium,
        auditsGenerated: newUser.auditsGenerated,
      },
    });

  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}


// ─────────────────────────────────────────
// Login User
// ─────────────────────────────────────────
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    if (user.blocked) {
      return res.status(403).json({ message: 'Account blocked by admin. Contact sales@buimbdigital.com' });
    }

    // bcrypt compare (automatically handles salt)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const { accessToken, refreshToken } = generateTokens(user);
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: 'Login successful.',
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: 'User',
        premium: user.premium,
        auditsGenerated: user.auditsGenerated,
      },
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}


// ─────────────────────────────────────────
// Refresh Token Controller (Token Rotation)
// Access token expire → verify refresh token
// → issue NEW access + NEW refresh token
// ─────────────────────────────────────────
async function refreshTokenController(req, res) {
  const oldRefreshToken = req.cookies.refreshToken;

  if (!oldRefreshToken) {
    return res.status(401).json({ message: 'No refresh token found. Please login again.' });
  }

  try {
    // Verify the old refresh token
    const decoded = jwt.verify(oldRefreshToken, config.refreshSecret);

    // Make sure user still exists in DB
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found. Please login again.' });
    }

    // 🔄 Rotate: issue brand new access + refresh tokens
    const { accessToken, refreshToken } = generateTokens(user);
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: 'Tokens refreshed successfully.',
      accessToken,
    });

  } catch (err) {
    // Refresh token expired or tampered → force re-login
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.status(403).json({
      message: 'Session expired. Please login again.',
    });
  }
}


// ─────────────────────────────────────────
// Logout
// ─────────────────────────────────────────
async function logoutUser(req, res) {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  return res.status(200).json({ message: 'Logged out successfully.' });
}


// ─────────────────────────────────────────
// Forgot Password - Send OTP
// ─────────────────────────────────────────
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No user found with this email.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTP for this email (to prevent duplicates)
    await Otp.deleteMany({ email });

    // Save new OTP with 5-minute expiry
    await Otp.create({
      email,
      otp,
    });

    // Send OTP via email
    await sendOTPEmail(email, otp);

    return res.status(200).json({
      message: 'OTP sent successfully to your email.',
      email: email.replace(/(.{2})(.*)(@.*)/, '$1***$3'), // Mask email
    });

  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
}


// ─────────────────────────────────────────
// Verify OTP & Reset Password
// ─────────────────────────────────────────
async function resetPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required.' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    // Verify OTP
    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // Find user and update password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    // Delete OTP after use
    await Otp.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({
      message: 'Password reset successfully. Please login with your new password.',
    });

  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ message: 'Failed to reset password. Please try again.' });
  }
}


export { registerUser, loginUser, refreshTokenController, logoutUser, forgotPassword, resetPassword };