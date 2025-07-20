# Admin User Management System

## Overview
The admin user management system provides comprehensive tools for managing users, agents, and platform analytics. This system includes dashboard overview, user management, agent management, and detailed user profiles.

## Features

### 🔐 **Authentication & Authorization**
- Admin-only access to management features
- Role-based permissions (admin, agent, owner, tenant)
- Secure API endpoints with middleware protection

### 📊 **Dashboard Overview**
- Platform statistics (users, properties, inquiries)
- User growth analytics
- Recent activities tracking
- Property distribution by city
- Agent performance metrics

### 👥 **User Management**
- **List Users**: View all users with filtering and search
- **Create Users**: Add new users with role assignment
- **Edit Users**: Modify user information and permissions
- **Delete Users**: Remove users with safety checks
- **Bulk Operations**: Mass update user status and verification

### 🏢 **Agent Management**
- **Agent List**: View all agents with performance metrics
- **Agent Verification**: Verify agent credentials and licenses
- **Agent Analytics**: Track agent performance and property listings
- **Agent Details**: View detailed agent information and activities

### 📈 **Analytics & Reporting**
- User growth over time
- User registration by role and city
- Agent performance rankings
- User activity tracking
- Export capabilities

## API Endpoints

### Dashboard & Analytics
```
GET /api/admin/dashboard          # Dashboard statistics
GET /api/admin/analytics         # Platform analytics
GET /api/admin/users/analytics   # User-specific analytics
```

### User Management
```
GET    /api/admin/users          # List all users
POST   /api/admin/users          # Create new user
GET    /api/admin/users/:id      # Get user details
PUT    /api/admin/users/:id      # Update user
DELETE /api/admin/users/:id      # Delete user
PUT    /api/admin/users/bulk     # Bulk update users
```

### Agent Management
```
GET /api/admin/agents                    # List all agents
PUT /api/admin/agents/:id/verify        # Verify agent
```

## Frontend Components

### 📱 **Admin Dashboard Page** (`/admin`)
- Platform overview with key metrics
- Recent activities feed
- Quick action buttons
- Navigation to detailed management tools

### 👥 **User Management Page** (`/admin/users`)
- Comprehensive user listing with filters
- Search and sort functionality
- Bulk operations (verify, activate, deactivate)
- Create new user modal
- Edit user functionality

### 👤 **User Detail Page** (`/admin/users/:id`)
- Detailed user information
- Related data (properties, inquiries, saved properties)
- Edit user form
- User statistics and activity

## User Roles & Permissions

### 🔑 **Admin**
- Full access to all management features
- Can create, edit, and delete users
- Can verify agents and manage properties
- Access to analytics and reporting

### 🏢 **Agent**
- Can list and manage properties
- Can respond to inquiries
- Limited to their own data and properties
- Requires verification by admin

### 🏠 **Owner**
- Can list properties they own
- Can manage their property listings
- Limited to their own data

### 👤 **Tenant**
- Can browse properties
- Can save properties and send inquiries
- Limited to their own data

## Key Features

### 🔍 **Advanced Filtering**
- Search by name, email, phone
- Filter by role, status, city
- Sort by various criteria
- Pagination support

### 📊 **Real-time Statistics**
- User counts by role
- Verification status tracking
- Activity monitoring
- Performance metrics

### 🛡️ **Safety Features**
- Cannot delete users with associated properties
- Cannot delete users with pending inquiries
- Cannot change admin users to non-admin roles
- Confirmation dialogs for destructive actions

### 📱 **Responsive Design**
- Mobile-friendly interface
- Touch-optimized controls
- Responsive data tables
- Adaptive layouts

## Database Schema

### User Model Enhancements
```javascript
{
  // Basic Information
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  password: String,
  
  // Role and Status
  role: ['owner', 'agent', 'tenant', 'admin'],
  isVerified: Boolean,
  isActive: Boolean,
  
  // Agent Specific
  agentInfo: {
    licenseNumber: String,
    companyName: String,
    experience: Number,
    specializations: [String],
    isVerified: Boolean
  },
  
  // Analytics
  lastLogin: Date,
  lastActive: Date,
  loginAttempts: Number,
  
  // Relationships
  savedProperties: [Property],
  inquiries: [Inquiry]
}
```

## Usage Examples

### Creating a New Agent
```javascript
const newAgent = {
  firstName: "Ahmed",
  lastName: "Khan",
  email: "ahmed@khanproperties.com",
  phone: "03001234567",
  password: "securepassword123",
  role: "agent",
  agentInfo: {
    licenseNumber: "AG123456",
    companyName: "Khan Properties",
    experience: 8,
    specializations: ["residential", "commercial"],
    isVerified: false
  }
};
```

### Bulk User Operations
```javascript
// Verify multiple users
await api.put('/admin/users/bulk', {
  userIds: ['user1', 'user2', 'user3'],
  updates: { isVerified: true }
});

// Activate users
await api.put('/admin/users/bulk', {
  userIds: ['user1', 'user2'],
  updates: { isActive: true }
});
```

### Getting User Analytics
```javascript
// Get user growth over 30 days
const analytics = await api.get('/admin/users/analytics?period=30');

// Get agent performance
const agents = await api.get('/admin/agents');
```

## Security Considerations

### 🔐 **Authentication**
- JWT token-based authentication
- Token expiration and refresh
- Secure password hashing with bcrypt

### 🛡️ **Authorization**
- Role-based access control
- Admin-only endpoints protection
- Input validation and sanitization

### 🔒 **Data Protection**
- Password fields excluded from responses
- Sensitive data encryption
- SQL injection prevention
- XSS protection

## Error Handling

### 📝 **Validation Errors**
- Detailed error messages
- Field-specific validation
- User-friendly error display

### 🚨 **Security Errors**
- Unauthorized access handling
- Invalid token responses
- Rate limiting protection

### ⚠️ **Business Logic Errors**
- Cannot delete users with dependencies
- Cannot modify admin users incorrectly
- Confirmation for destructive actions

## Testing

### 🧪 **API Testing**
```bash
# Test admin dashboard
curl -H "Authorization: Bearer <token>" \
     http://localhost:5000/api/admin/dashboard

# Test user creation
curl -X POST -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"firstName":"Test","lastName":"User",...}' \
     http://localhost:5000/api/admin/users
```

### 🎯 **Frontend Testing**
- Component unit tests
- Integration tests for user flows
- E2E tests for admin workflows

## Deployment

### 🚀 **Environment Setup**
```bash
# Install dependencies
npm install

# Set environment variables
NODE_ENV=production
JWT_SECRET=your-secret-key
MONGODB_URI=your-mongodb-uri

# Start the application
npm start
```

### 📦 **Docker Deployment**
```dockerfile
# Build and run with Docker
docker build -t pakproperty-admin .
docker run -p 3000:3000 pakproperty-admin
```

## Future Enhancements

### 🔮 **Planned Features**
- Advanced analytics dashboard
- Email notifications for admin actions
- Audit logging for all admin operations
- Multi-language support
- Advanced reporting and exports
- Real-time notifications
- Mobile admin app

### 📈 **Performance Optimizations**
- Database indexing for faster queries
- Caching for frequently accessed data
- Pagination for large datasets
- Lazy loading for better UX

## Support & Maintenance

### 🛠️ **Troubleshooting**
- Check server logs for errors
- Verify database connections
- Test API endpoints directly
- Monitor user activity and performance

### 📞 **Contact**
For technical support or feature requests, please contact the development team.

---

**Note**: This admin user management system is designed to be secure, scalable, and user-friendly. All operations are logged and can be audited for compliance purposes. 