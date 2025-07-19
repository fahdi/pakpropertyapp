const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const userRoutes = require('./routes/users');
const inquiryRoutes = require('./routes/inquiries');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", "https://maps.googleapis.com"],
      connectSrc: ["'self'", "https://maps.googleapis.com"]
    }
  }
}));

// Rate limiting - Disabled for development
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true
}));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Session configuration - only create if MongoDB URI is available
let sessionConfig = {
  secret: process.env.SESSION_SECRET || 'pakproperty-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
};

// Only add MongoStore if MONGODB_URI is available
if (process.env.MONGODB_URI) {
  try {
    sessionConfig.store = MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      ttl: 24 * 60 * 60 // 1 day
    });
  } catch (error) {
    console.log('MongoStore creation failed, using memory store:', error.message);
  }
}

app.use(session(sessionConfig));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin', adminRoutes);

// TEMP: Debug route to list all users
app.get('/api/debug-users', async (req, res) => {
  try {
    const User = require('./models/User');
    const users = await User.find({}, { email: 1, _id: 0 });
    res.json({
      success: true,
      count: users.length,
      users: users.map(u => u.email)
    });
  } catch (error) {
    console.error('Debug users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'PakProperty API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Only start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 PakProperty server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API URL: http://localhost:${PORT}/api`);
    console.log(`📦 MongoDB Connected: ${process.env.MONGODB_URI ? 'Yes' : 'No'}`);
  });
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app; 