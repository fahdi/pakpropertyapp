# 🏠 PakProperty - Pakistan's Leading Property Rental Platform

A comprehensive property rental platform designed specifically for the Pakistani market, connecting property owners, agents, and tenants through a secure, user-friendly web application.

## 🌟 Features

### For Property Owners & Agents
- **Property Management**: Create, edit, and manage multiple property listings
- **Analytics Dashboard**: Track property performance and inquiry rates
- **Lead Management**: Organize and respond to tenant inquiries
- **Multi-owner Support**: Agents can manage properties for multiple owners

### For Tenants
- **Advanced Search**: Find properties by location, price, amenities, and more
- **Saved Listings**: Save interesting properties for later review
- **Direct Communication**: Contact property owners through multiple channels
- **Map Integration**: View property locations on interactive maps

### Platform Features
- **Bilingual Support**: English and Urdu interface
- **Local Market Focus**: Pakistani property types, areas, and terminology
- **Mobile-First Design**: Responsive design for all devices
- **SEO Optimized**: Search engine friendly with structured data

## 🚀 Quick Start

### Prerequisites
- **Docker & Docker Compose** (Recommended)
- Node.js (v16 or higher) - for local development
- MongoDB
- Google Maps API key
- Cloudinary account (for image uploads)

## 🐳 Docker Setup (Recommended)

### Quick Start with Docker
```bash
# Clone the repository
git clone <repository-url>
cd pakpropertyapp

# Copy environment file
cp env.example .env
# Edit .env with your configuration

# Start all services with Docker
docker-compose up -d

# The application will be available at:
# Frontend: http://localhost:3000
# Backend API: http://localhost:5001
# MongoDB: localhost:27017
```

### Docker Services
- **Frontend**: React development server on port 3000
- **Backend**: Node.js API server on port 5001
- **Database**: MongoDB on port 27017
- **Health Checks**: Automatic service monitoring

### Docker Commands
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build -d

# Access specific service
docker-compose exec server bash
docker-compose exec client bash
```

## 🧪 Testing with Docker

### Run All Tests
```bash
# Run complete test suite in Docker
./test-docker.sh

# Or run specific test suites
./test-docker.sh backend    # Backend tests only
./test-docker.sh frontend   # Frontend tests only
```

### Test Environment
- **Test Database**: Separate MongoDB instance on port 27018
- **Test API**: Backend tests on port 5002
- **Test Frontend**: React tests on port 3001
- **Coverage Reports**: Generated automatically

## 📚 Documentation

### 📋 Core Documentation

### 🚀 Deployment

The application includes comprehensive deployment scripts for production deployment:

#### Deployment Files (Not in Version Control)
- `deploy.sh` - Main deployment script
- `setup-server.sh` - Server environment setup
- `quick-deploy.sh` - Combined setup and deployment
- `check-status.sh` - Deployment status monitoring
- `DEPLOYMENT.md` - Detailed deployment guide

#### Template Files (Safe to Commit)
- `deploy.sh.template` - Template for deployment script
- `setup-server.sh.template` - Template for server setup
- `quick-deploy.sh.template` - Template for quick deployment
- `check-status.sh.template` - Template for status monitoring
- `DEPLOYMENT_TEMPLATE.md` - Template deployment guide

**⚠️ Security Note**: The actual deployment files contain sensitive server information and are excluded from version control. Use the template files to create your own deployment scripts.

#### Docker Files (Safe to Commit)
- `docker-compose.yml` - Development Docker configuration
- `docker-compose.prod.yml` - Production Docker configuration
- `client/Dockerfile` - React client production build
- `client/nginx.conf` - Nginx configuration for React app

#### Quick Deployment
```bash
# 1. Copy template files and configure server details
cp deploy.sh.template deploy.sh
cp setup-server.sh.template setup-server.sh
cp quick-deploy.sh.template quick-deploy.sh
cp check-status.sh.template check-status.sh

# 2. Edit the scripts with your server details
# Update SERVER_IP, SERVER_USER, SERVER_PASSWORD, DOMAIN, SUBDOMAIN

# 3. Run quick deployment
./quick-deploy.sh

# 4. Check deployment status
./check-status.sh
```

#### Deployment Features
- ✅ **SSL Certificates** (Let's Encrypt)
- ✅ **Nginx Reverse Proxy**
- ✅ **Automatic Health Checks**
- ✅ **Daily Backups**
- ✅ **Firewall Protection**
- ✅ **Zero-Downtime Updates**

For detailed deployment instructions, see `DEPLOYMENT_TEMPLATE.md`.
- **[Testing Guide](TESTING.md)** - Comprehensive testing documentation
- **[Admin User Management](ADMIN_USER_MANAGEMENT.md)** - Admin features and user management
- **[Color Scheme Update](COLOR_SCHEME_UPDATE.md)** - UI/UX design system
- **[Seed Data Summary](SEED_DATA_SUMMARY.md)** - Database seeding and test data

### 🎯 Key Features Documentation

#### Admin Dashboard
- **User Management**: `/admin/users` - Manage all users
- **Agent Management**: `/admin/agents` - Manage property agents
- **Analytics**: `/admin/analytics` - Platform statistics
- **Dashboard**: `/admin` - Overview and quick actions

#### User Roles
- **Admin**: Full platform access and user management
- **Agent**: Property listing and management
- **Owner**: Property ownership and management
- **Tenant**: Property browsing and inquiries

## 🛠️ Local Development Setup

### Manual Installation
```bash
# Install dependencies
npm run install-all

# Environment setup
cp env.example .env
# Edit .env with your configuration

# Start development servers
npm run dev
```

### Environment Variables
```bash
# Required variables
MONGODB_URI=mongodb://localhost:27017/pakproperty
JWT_SECRET=your-secret-key
GOOGLE_MAPS_API_KEY=your-google-maps-key
CLOUDINARY_URL=your-cloudinary-url
SENDGRID_API_KEY=your-sendgrid-key

# Optional variables
NODE_ENV=development
PORT=5001
CLIENT_URL=http://localhost:3000
```

## 📁 Project Structure

```
pakpropertyapp/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── utils/         # Utility functions
│   │   └── tests/         # Frontend tests
│   ├── Dockerfile         # Frontend Docker config
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Configuration files
│   ├── middleware/        # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── tests/             # Backend tests
│   ├── Dockerfile         # Backend Docker config
│   └── package.json
├── docker-compose.yml      # Main Docker setup
├── docker-compose.test.yml # Test Docker setup
├── test-docker.sh         # Docker test runner
├── test-runner.sh         # Local test runner
└── package.json
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **React Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animations
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File uploads
- **Cloudinary** - Image storage

### DevOps & Testing
- **Docker** - Containerization
- **Docker Compose** - Multi-service orchestration
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **Supertest** - API testing

## 🎯 Key Features

### User Management
- Secure registration with email verification
- Role-based access (Owner/Agent, Tenant, Admin)
- Profile management with preferences
- Password reset functionality

### Property Listings
- Rich property information with multiple images
- Advanced filtering and sorting
- Location-based search with map integration
- Property categories (Apartment, House, Commercial, etc.)

### Communication
- Contact forms with structured inquiries
- WhatsApp integration
- Email notifications
- Internal messaging system

### Admin Features
- User management and role assignment
- Agent verification system
- Platform analytics and reporting
- Bulk operations and data export

## 📊 Analytics & Reporting

- User engagement metrics
- Property performance analytics
- Inquiry tracking and conversion rates
- Platform usage statistics
- Agent performance rankings

## 🔒 Security Features

- SSL encryption
- JWT authentication
- Rate limiting
- Input validation
- XSS protection
- CSRF protection
- Role-based access control

## 🚀 Deployment

### Production with Docker
```bash
# Build production images
docker-compose -f docker-compose.prod.yml up --build -d

# Or deploy to cloud platforms
docker-compose -f docker-compose.prod.yml push
```

### Environment Variables for Production
```bash
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-secret
GOOGLE_MAPS_API_KEY=your-production-key
CLOUDINARY_URL=your-production-cloudinary-url
SENDGRID_API_KEY=your-production-sendgrid-key
```

## 📈 Performance Optimization

- Image optimization and lazy loading
- Database query optimization
- CDN integration for static assets
- Caching strategies
- Code splitting and bundle optimization
- Docker layer caching

## 🧪 Testing

### Test Coverage
- **Backend**: 80%+ coverage target
- **Frontend**: 70%+ coverage target
- **Critical Paths**: 100% coverage

### Running Tests
```bash
# Local testing
./test-runner.sh

# Docker testing
./test-docker.sh

# Individual test suites
npm run test:backend
npm run test:frontend
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact the development team.

---

**Built with ❤️ for Pakistan's property market**

### 🔗 Quick Links
- [Testing Guide](TESTING.md)
- [Admin User Management](ADMIN_USER_MANAGEMENT.md)
- [Color Scheme Update](COLOR_SCHEME_UPDATE.md)
- [Seed Data Summary](SEED_DATA_SUMMARY.md) 