# 🧪 PakProperty Testing Guide

This document provides comprehensive information about the automated testing suite for the PakProperty application.

## 📋 Table of Contents

- [Overview](#overview)
- [Test Structure](#test-structure)
- [Running Tests](#running-tests)
- [Backend Tests](#backend-tests)
- [Frontend Tests](#frontend-tests)
- [Test Coverage](#test-coverage)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)

## 🎯 Overview

The PakProperty application includes a comprehensive automated testing suite covering both backend API endpoints and frontend React components. The testing strategy ensures:

- **Reliability**: All critical functionality is tested
- **Maintainability**: Tests are well-organized and documented
- **Coverage**: High test coverage for both backend and frontend
- **Performance**: Fast test execution with proper mocking

## 🏗️ Test Structure

```
pakpropertyapp/
├── server/
│   ├── tests/
│   │   ├── setup.js              # Test setup and configuration
│   │   ├── auth.test.js          # Authentication API tests
│   │   └── properties.test.js    # Property management API tests
│   └── package.json              # Backend test dependencies
├── client/
│   ├── src/
│   │   ├── tests/
│   │   │   ├── LoginPage.test.js     # Login component tests
│   │   │   ├── AuthContext.test.js   # Auth context tests
│   │   │   └── ProtectedRoute.test.js # Route protection tests
│   │   └── setupTests.js         # Frontend test setup
│   └── package.json              # Frontend test dependencies
├── test-runner.sh               # Test execution script
└── TESTING.md                   # This documentation
```

## 🚀 Running Tests

### Quick Start

Run all tests:
```bash
./test-runner.sh
```

Run specific test suites:
```bash
./test-runner.sh backend    # Backend tests only
./test-runner.sh frontend   # Frontend tests only
```

### Manual Execution

**Backend Tests:**
```bash
cd server
npm install
npm test
```

**Frontend Tests:**
```bash
cd client
npm install
npm test
```

**With Coverage:**
```bash
# Backend
cd server && npm run test:coverage

# Frontend
cd client && npm run test:coverage
```

## 📦 Backend Tests

### Test Setup

Backend tests use:
- **Jest**: Test framework
- **Supertest**: HTTP assertions
- **MongoDB Memory Server**: In-memory database for testing
- **Mongoose**: Database operations

### Test Categories

#### Authentication Tests (`auth.test.js`)
- ✅ User registration
- ✅ User login/logout
- ✅ Password validation
- ✅ Account lockout
- ✅ Token verification
- ✅ Profile updates
- ✅ Password changes

#### Property Management Tests (`properties.test.js`)
- ✅ Property CRUD operations
- ✅ Property filtering and search
- ✅ Role-based access control
- ✅ Input validation
- ✅ Error handling

### Example Backend Test

```javascript
describe('POST /api/auth/login', () => {
  it('should login successfully with valid credentials', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'TestPassword123'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
  });
});
```

## 🎨 Frontend Tests

### Test Setup

Frontend tests use:
- **Jest**: Test framework
- **React Testing Library**: Component testing
- **@testing-library/jest-dom**: Custom matchers
- **@testing-library/user-event**: User interactions

### Test Categories

#### Component Tests
- ✅ LoginPage: Form validation, API calls, user interactions
- ✅ AuthContext: State management, authentication flow
- ✅ ProtectedRoute: Route protection, role-based access

#### Integration Tests
- ✅ User authentication flow
- ✅ Form submission and validation
- ✅ Navigation and routing
- ✅ Error handling and user feedback

### Example Frontend Test

```javascript
describe('LoginPage', () => {
  it('should handle successful login', async () => {
    const mockApi = require('../utils/axios').default;
    mockApi.post.mockResolvedValue({
      data: {
        success: true,
        token: 'mock-token',
        user: { email: 'test@example.com' }
      }
    });

    renderLoginPage();
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(mockApi.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password'
      });
    });
  });
});
```

## 📊 Test Coverage

### Coverage Targets

- **Backend**: 80%+ coverage
- **Frontend**: 70%+ coverage
- **Critical Paths**: 100% coverage

### Coverage Reports

Generate coverage reports:
```bash
# Backend coverage
cd server && npm run test:coverage

# Frontend coverage
cd client && npm run test:coverage
```

Coverage reports are generated in:
- `server/coverage/`
- `client/coverage/`

## ✍️ Writing Tests

### Backend Test Guidelines

1. **Test Structure:**
   ```javascript
   describe('API Endpoint', () => {
     beforeEach(async () => {
       // Setup test data
     });

     it('should handle success case', async () => {
       // Test implementation
     });

     it('should handle error case', async () => {
       // Error test
     });
   });
   ```

2. **Database Testing:**
   - Use MongoDB Memory Server
   - Clean database between tests
   - Mock external services

3. **Authentication Testing:**
   - Test with valid/invalid tokens
   - Test role-based access
   - Test rate limiting

### Frontend Test Guidelines

1. **Component Testing:**
   ```javascript
   describe('ComponentName', () => {
     it('should render correctly', () => {
       render(<Component />);
       expect(screen.getByText('Expected Text')).toBeInTheDocument();
     });

     it('should handle user interactions', async () => {
       render(<Component />);
       fireEvent.click(screen.getByRole('button'));
       await waitFor(() => {
         expect(screen.getByText('Result')).toBeInTheDocument();
       });
     });
   });
   ```

2. **Context Testing:**
   - Test context providers
   - Test context consumers
   - Mock external dependencies

3. **Integration Testing:**
   - Test complete user flows
   - Test API integration
   - Test error scenarios

## 🎯 Best Practices

### General Guidelines

1. **Test Naming:**
   - Use descriptive test names
   - Follow "should" pattern
   - Include expected behavior

2. **Test Organization:**
   - Group related tests
   - Use beforeEach for setup
   - Clean up after tests

3. **Mocking:**
   - Mock external dependencies
   - Mock API calls
   - Mock browser APIs

4. **Assertions:**
   - Test one thing per test
   - Use specific assertions
   - Test both success and failure cases

### Backend Specific

1. **Database Testing:**
   ```javascript
   beforeEach(async () => {
     // Clear database
     const collections = mongoose.connection.collections;
     for (const key in collections) {
       await collections[key].deleteMany();
     }
   });
   ```

2. **API Testing:**
   ```javascript
   it('should return 400 for invalid data', async () => {
     const response = await request(app)
       .post('/api/endpoint')
       .send(invalidData)
       .expect(400);
     
     expect(response.body.success).toBe(false);
   });
   ```

### Frontend Specific

1. **Component Testing:**
   ```javascript
   const renderComponent = (props = {}) => {
     return render(
       <BrowserRouter>
         <Component {...props} />
       </BrowserRouter>
     );
   };
   ```

2. **User Interaction Testing:**
   ```javascript
   it('should handle form submission', async () => {
     render(<Form />);
     
     fireEvent.change(screen.getByLabelText('Email'), {
       target: { value: 'test@example.com' }
     });
     
     fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
     
     await waitFor(() => {
       expect(mockApi.post).toHaveBeenCalled();
     });
   });
   ```

## 🔧 Troubleshooting

### Common Issues

1. **Test Database Connection:**
   ```bash
   # Ensure MongoDB Memory Server is working
   cd server && npm test -- --verbose
   ```

2. **Frontend Test Environment:**
   ```bash
   # Clear Jest cache
   cd client && npm test -- --clearCache
   ```

3. **Mock Issues:**
   ```javascript
   // Ensure mocks are properly set up
   jest.clearAllMocks();
   ```

### Debugging Tests

1. **Backend Debugging:**
   ```bash
   npm test -- --verbose --detectOpenHandles
   ```

2. **Frontend Debugging:**
   ```bash
   npm test -- --verbose --no-coverage
   ```

## 📈 Continuous Integration

### GitHub Actions

The test suite is designed to run in CI/CD pipelines:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Backend Tests
        run: cd server && npm install && npm test
      - name: Run Frontend Tests
        run: cd client && npm install && npm test
```

### Pre-commit Hooks

Consider adding pre-commit hooks to run tests before commits:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test"
    }
  }
}
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)

---

**Happy Testing! 🧪✨** 