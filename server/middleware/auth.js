const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  console.log('🔐 Auth middleware - Headers:', req.headers.authorization ? 'Authorization header present' : 'No Authorization header');
  console.log('🔐 Auth middleware - Cookies:', req.cookies ? 'Cookies present' : 'No cookies');

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log('🔐 Auth middleware - Token from header:', token ? 'Token present' : 'No token');
  } else if (req.cookies && req.cookies.token) {
    // Check for token in cookies
    token = req.cookies.token;
    console.log('🔐 Auth middleware - Token from cookie:', token ? 'Token present' : 'No token');
  }

  if (!token) {
    console.log('🔐 Auth middleware - No token found');
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    console.log('🔐 Auth middleware - JWT_SECRET:', process.env.JWT_SECRET ? 'Present' : 'Missing');
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('🔐 Auth middleware - Token decoded successfully, user ID:', decoded.id);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      console.log('🔐 Auth middleware - User not found in database');
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    console.log('🔐 Auth middleware - User found:', user.email, 'Active:', user.isActive, 'Locked:', user.isLocked);

    if (!user.isActive) {
      console.log('🔐 Auth middleware - User account is deactivated');
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      console.log('🔐 Auth middleware - User account is locked');
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts'
      });
    }

    req.user = user;
    console.log('🔐 Auth middleware - Authentication successful');
    next();
  } catch (error) {
    console.log('🔐 Auth middleware - JWT verification failed:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Middleware to authorize specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }

    next();
  };
};

// Middleware to check if user is verified
const requireVerification = (req, res, next) => {
  if (!req.user.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required to access this feature'
    });
  }
  next();
};

// Middleware to check if user is owner or agent
const isOwnerOrAgent = (req, res, next) => {
  if (!['owner', 'agent'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Only property owners and agents can access this route'
    });
  }
  next();
};

// Middleware to check if user is tenant
const isTenant = (req, res, next) => {
  if (req.user.role !== 'tenant') {
    return res.status(403).json({
      success: false,
      message: 'Only tenants can access this route'
    });
  }
  next();
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
  next();
};

// Optional authentication middleware
const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive && !user.isLocked) {
        req.user = user;
      }
    } catch (error) {
      // Token is invalid, but we don't want to block the request
      console.log('Invalid token in optional auth:', error.message);
    }
  }

  next();
};

// Rate limiting for authentication routes
const authRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs (increased for development)
  message: 'Too many authentication attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
};

// Generate JWT token
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  
  console.log('🎫 Generated token for user:', user.email);
  console.log('🎫 Token length:', token.length);
  console.log('🎫 Token preview:', token.substring(0, 20) + '...');

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  // Remove password from output
  user.password = undefined;

  res.status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user
    });
};

module.exports = {
  protect,
  authorize,
  requireVerification,
  isOwnerOrAgent,
  isTenant,
  isAdmin,
  optionalAuth,
  authRateLimit,
  generateToken,
  sendTokenResponse
}; 