import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
}));

// Mock axios
const mockAxios = {
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() }
  }
};

jest.mock('../utils/axios', () => ({
  __esModule: true,
  default: mockAxios
}));

// Test component to access auth context
const TestComponent = () => {
  const { user, isAuthenticated, loading, login, logout } = useAuth();
  
  return (
    <div>
      <div data-testid="user">{user ? user.email : 'no-user'}</div>
      <div data-testid="authenticated">{isAuthenticated ? 'true' : 'false'}</div>
      <div data-testid="loading">{loading ? 'true' : 'false'}</div>
      <button onClick={() => login('test@example.com', 'password')} data-testid="login-btn">
        Login
      </button>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
};

const renderTestComponent = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('provides initial state correctly', () => {
    renderTestComponent();
    
    expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('handles successful login', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'tenant'
    };

    mockAxios.post.mockResolvedValue({
      data: {
        success: true,
        token: 'mock-token',
        user: mockUser
      }
    });

    renderTestComponent();
    
    const loginButton = screen.getByTestId('login-btn');
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password'
      });
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });
  });

  it('handles login failure', async () => {
    mockAxios.post.mockRejectedValue({
      response: {
        data: {
          message: 'Invalid credentials'
        }
      }
    });

    renderTestComponent();
    
    const loginButton = screen.getByTestId('login-btn');
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@example.com',
        password: 'password'
      });
    });

    // Should remain unauthenticated
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });

  it('handles logout', async () => {
    // First login
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'tenant'
    };

    mockAxios.post.mockResolvedValue({
      data: {
        success: true,
        token: 'mock-token',
        user: mockUser
      }
    });

    renderTestComponent();
    
    const loginButton = screen.getByTestId('login-btn');
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });

    // Then logout
    const logoutButton = screen.getByTestId('logout-btn');
    fireEvent.click(logoutButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('no-user');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
    });
  });

  it('loads user from localStorage on mount', async () => {
    const mockUser = {
      id: '1',
      email: 'stored@example.com',
      firstName: 'Stored',
      lastName: 'User',
      role: 'tenant'
    };

    // Mock localStorage
    localStorage.getItem.mockReturnValue('stored-token');
    
    mockAxios.get.mockResolvedValue({
      data: {
        success: true,
        data: mockUser
      }
    });

    renderTestComponent();
    
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith('/auth/me');
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('stored@example.com');
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true');
    });
  });

  it('handles auth check failure', async () => {
    localStorage.getItem.mockReturnValue('invalid-token');
    
    mockAxios.get.mockRejectedValue({
      response: {
        status: 401,
        data: {
          message: 'Invalid token'
        }
      }
    });

    renderTestComponent();
    
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith('/auth/me');
    });

    // Should remain unauthenticated after failed auth check
    expect(screen.getByTestId('authenticated')).toHaveTextContent('false');
  });

  it('handles registration', async () => {
    const mockUser = {
      id: '1',
      email: 'new@example.com',
      firstName: 'New',
      lastName: 'User',
      role: 'tenant'
    };

    mockAxios.post.mockResolvedValue({
      data: {
        success: true,
        token: 'mock-token',
        user: mockUser
      }
    });

    const { useAuth } = require('../contexts/AuthContext');
    const TestRegisterComponent = () => {
      const { register } = useAuth();
      
      const handleRegister = async () => {
        await register({
          email: 'new@example.com',
          password: 'password123',
          firstName: 'New',
          lastName: 'User',
          role: 'tenant'
        });
      };
      
      return (
        <button onClick={handleRegister} data-testid="register-btn">
          Register
        </button>
      );
    };

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestRegisterComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    const registerButton = screen.getByTestId('register-btn');
    fireEvent.click(registerButton);
    
    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith('/auth/register', {
        email: 'new@example.com',
        password: 'password123',
        firstName: 'New',
        lastName: 'User',
        role: 'tenant'
      });
    });
  });

  it('provides role-based helpers', () => {
    const { useAuth } = require('../contexts/AuthContext');
    const TestRoleComponent = () => {
      const { isAdmin, isOwner, isAgent, isTenant } = useAuth();
      
      return (
        <div>
          <div data-testid="is-admin">{isAdmin ? 'true' : 'false'}</div>
          <div data-testid="is-owner">{isOwner ? 'true' : 'false'}</div>
          <div data-testid="is-agent">{isAgent ? 'true' : 'false'}</div>
          <div data-testid="is-tenant">{isTenant ? 'true' : 'false'}</div>
        </div>
      );
    };

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestRoleComponent />
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('is-admin')).toHaveTextContent('false');
    expect(screen.getByTestId('is-owner')).toHaveTextContent('false');
    expect(screen.getByTestId('is-agent')).toHaveTextContent('false');
    expect(screen.getByTestId('is-tenant')).toHaveTextContent('false');
  });
}); 