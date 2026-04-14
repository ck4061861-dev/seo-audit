import Admin from "../Models/adminAuth.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../config/config.js";


// ─────────────────────────────────────────
// Generate Tokens
// ─────────────────────────────────────────
const generateTokens = (admin) => {
  const accessToken = jwt.sign(
    { id: admin._id, email: admin.email },
    config.jwtSecret,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: admin._id },
    config.refreshSecret,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};


// ─────────────────────────────────────────
// Set Cookies
// ─────────────────────────────────────────
const setAuthCookies = (res, accessToken, refreshToken) => {
  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};


// ─────────────────────────────────────────
// Register Admin
// ─────────────────────────────────────────
async function registerAdmin(req, res) {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne();
    if (existingAdmin) {
      return res.status(403).json({
        message: "Only one admin is allowed.",
      });
    }

    // 🔥 bcrypt hash
    const hashedPassword = await bcrypt.hash(password, 12);

    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = generateTokens(newAdmin);
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      message: "Admin registered successfully.",
      accessToken,
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: "admin",
      },
    });

  } catch (err) {
    console.error("Register Admin Error:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}





// ─────────────────────────────────────────
// Login Admin
// ─────────────────────────────────────────
async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    // 🔥 bcrypt compare
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    const { accessToken, refreshToken } = generateTokens(admin);
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: "Admin logged in successfully.",
      accessToken,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });

  } catch (err) {
    console.error("Login Admin Error:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
}


// ─────────────────────────────────────────
// Refresh Token
// ─────────────────────────────────────────
async function refreshAdminToken(req, res) {
  const oldRefreshToken = req.cookies.refreshToken;

  if (!oldRefreshToken) {
    return res.status(401).json({
      message: "No refresh token. Please login again.",
    });
  }

  try {
    const decoded = jwt.verify(oldRefreshToken, config.refreshSecret);

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({
        message: "Admin not found.",
      });
    }

    const { accessToken, refreshToken } = generateTokens(admin);
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: "Admin tokens refreshed.",
    });

  } catch (err) {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(403).json({
      message: "Session expired. Please login again.",
    });
  }
}


// ─────────────────────────────────────────
// Logout
// ─────────────────────────────────────────
async function logoutAdmin(req, res) {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.status(200).json({
    message: "Admin logged out successfully.",
  });
}


export {
  registerAdmin,
  loginAdmin,
  refreshAdminToken,
  logoutAdmin,
};