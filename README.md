# PakProperty - Pakistan's Leading Property Rental Platform

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
- Node.js (v16 or higher)
- MongoDB
- Google Maps API key
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pakpropertyapp
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
pakpropertyapp/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
│   │   └── styles/        # CSS and styling
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── utils/             # Utility functions
├── docs/                  # Documentation
└── package.json
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Query** - Data fetching and caching
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Multer** - File uploads
- **Cloudinary** - Image storage
- **Nodemailer** - Email service

### Third-Party Services
- **Google Maps API** - Location services
- **Cloudinary** - Image management
- **SendGrid** - Email delivery
- **Google Analytics** - User analytics

## 🎯 Key Features

### User Management
- Secure registration with email verification
- Role-based access (Owner/Agent, Tenant)
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

### Localization
- Bilingual interface (English/Urdu)
- Pakistani property terminology
- Local area units (Marla, Kanal, Sq. Ft)
- Regional formatting and currency

## 📊 Analytics & Reporting

- User engagement metrics
- Property performance analytics
- Inquiry tracking and conversion rates
- Platform usage statistics

## 🔒 Security Features

- SSL encryption
- JWT authentication
- Rate limiting
- Input validation
- XSS protection
- CSRF protection

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
Required environment variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `GOOGLE_MAPS_API_KEY` - Google Maps API key
- `CLOUDINARY_URL` - Cloudinary configuration
- `SENDGRID_API_KEY` - Email service API key

## 📈 Performance Optimization

- Image optimization and lazy loading
- Database query optimization
- CDN integration for static assets
- Caching strategies
- Code splitting and bundle optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact the development team.

---

**Built with ❤️ for Pakistan's property market** 