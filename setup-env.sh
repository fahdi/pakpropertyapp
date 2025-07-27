#!/bin/bash

# Create server .env file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "Creating server/.env file..."
    cat > server/.env << EOF
# Server Configuration
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3000

# Database Configuration (Updated for Docker with authentication)
MONGODB_URI=mongodb://admin:password123@mongo:27017/pakproperty?authSource=admin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d

# Session Configuration
SESSION_SECRET=your-session-secret-key-change-this-in-production

# Email Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google Maps API
GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# SendGrid Configuration (Alternative to Gmail)
SENDGRID_API_KEY=your-sendgrid-api-key

# Analytics (Optional)
GOOGLE_ANALYTICS_ID=your-ga-id

# Payment Gateway (Future Implementation)
JAZZCASH_MERCHANT_ID=your-jazzcash-merchant-id
JAZZCASH_PASSWORD=your-jazzcash-password
JAZZCASH_RETURN_URL=http://localhost:3000/payment/success
JAZZCASH_CANCEL_URL=http://localhost:3000/payment/cancel

# SMS Service (Future Implementation)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Limits
MAX_FILE_SIZE=5242880
MAX_FILES=10

# Security
CORS_ORIGIN=http://localhost:3000
SECURE_COOKIES=false

# Logging
LOG_LEVEL=debug
EOF
    echo "✅ server/.env file created successfully!"
else
    echo "⚠️  server/.env file already exists. Please update MONGODB_URI manually to:"
    echo "   MONGODB_URI=mongodb://admin:password123@mongo:27017/pakproperty?authSource=admin"
fi

echo ""
echo "🚀 To start the services with mongo-express:"
echo "   docker-compose up -d"
echo ""
echo "📊 Mongo Express will be available at:"
echo "   http://localhost:8081"
echo "   Username: admin"
echo "   Password: password123"
echo ""
echo "🔗 Other services:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:5001"
echo "   MongoDB: localhost:27017" 