import jwt from 'jsonwebtoken';
import config from '../config/config.js';

export const protect = (req, res, next) => {
  let token = null;

  const authHeader = req.headers.authorization;
  console.log('Auth Header:', authHeader);
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token && req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  console.log('Token extracted:', token);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token missing',
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token invalid',
    });
  }
};

export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden',
    });
  }

  next();
};
