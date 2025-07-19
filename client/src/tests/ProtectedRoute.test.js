import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
}));

const TestComponent = () => <div>Protected Content</div>;

const renderProtectedRoute = (props = {}) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <ProtectedRoute {...props}>
          <TestComponent />
        </ProtectedRoute>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('ProtectedRoute', () => {
  it('renders children when user is authenticated', () => {
    // Mock authenticated user
    const mockAuthContext = {
      user: { id: '1', email: 'test@example.com', role: 'tenant' },
      isAuthenticated: true,
      loading: false
    };

    jest.spyOn(require('../contexts/AuthContext'), 'useAuth').mockReturnValue(mockAuthContext);

    renderProtectedRoute();
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows loading spinner when loading', () => {
    const mockAuthContext = {
      user: null,
      isAuthenticated: false,
      loading: true
    };

    jest.spyOn(require('../contexts/AuthContext'), 'useAuth').mockReturnValue(mockAuthContext);

    renderProtectedRoute();
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    const mockAuthContext = {
      user: null,
      isAuthenticated: false,
      loading: false
    };

    jest.spyOn(require('../contexts/AuthContext'), 'useAuth').mockReturnValue(mockAuthContext);

    // Mock useNavigate
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    renderProtectedRoute();
    
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('shows access denied for insufficient role', () => {
    const mockAuthContext = {
      user: { id: '1', email: 'test@example.com', role: 'tenant' },
      isAuthenticated: true,
      loading: false
    };

    jest.spyOn(require('../contexts/AuthContext'), 'useAuth').mockReturnValue(mockAuthContext);

    renderProtectedRoute({ allowedRoles: ['admin'] });
    
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
    expect(screen.getByText('You don\'t have permission to access this page.')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('allows access for correct role', () => {
    const mockAuthContext = {
      user: { id: '1', email: 'admin@example.com', role: 'admin' },
      isAuthenticated: true,
      loading: false
    };

    jest.spyOn(require('../contexts/AuthContext'), 'useAuth').mockReturnValue(mockAuthContext);

    renderProtectedRoute({ allowedRoles: ['admin'] });
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('allows access for multiple roles', () => {
    const mockAuthContext = {
      user: { id: '1', email: 'owner@example.com', role: 'owner' },
      isAuthenticated: true,
      loading: false
    };

    jest.spyOn(require('../contexts/AuthContext'), 'useAuth').mockReturnValue(mockAuthContext);

    renderProtectedRoute({ allowedRoles: ['admin', 'owner'] });
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows verification required message', () => {
    const mockAuthContext = {
      user: { 
        id: '1', 
        email: 'test@example.com', 
        role: 'tenant',
        isVerified: false 
      },
      isAuthenticated: true,
      loading: false
    };

    jest.spyOn(require('../contexts/AuthContext'), 'useAuth').mockReturnValue(mockAuthContext);

    renderProtectedRoute({ requireVerification: true });
    
    expect(screen.getByText('Email Verification Required')).toBeInTheDocument();
    expect(screen.getByText('Please verify your email address to access this page.')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('allows access when verification is not required', () => {
    const mockAuthContext = {
      user: { 
        id: '1', 
        email: 'test@example.com', 
        role: 'tenant',
        isVerified: false 
      },
      isAuthenticated: true,
      loading: false
    };

    jest.spyOn(require('../contexts/AuthContext'), 'useAuth').mockReturnValue(mockAuthContext);

    renderProtectedRoute({ requireVerification: false });
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('allows access when user is verified', () => {
    const mockAuthContext = {
      user: { 
        id: '1', 
        email: 'test@example.com', 
        role: 'tenant',
        isVerified: true 
      },
      isAuthenticated: true,
      loading: false
    };

    jest.spyOn(require('../contexts/AuthContext'), 'useAuth').mockReturnValue(mockAuthContext);

    renderProtectedRoute({ requireVerification: true });
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('shows correct role information in access denied message', () => {
    const mockAuthContext = {
      user: { id: '1', email: 'test@example.com', role: 'tenant' },
      isAuthenticated: true,
      loading: false
    };

    jest.spyOn(require('../contexts/AuthContext'), 'useAuth').mockReturnValue(mockAuthContext);

    renderProtectedRoute({ allowedRoles: ['admin', 'owner'] });
    
    expect(screen.getByText(/This page requires one of the following roles: admin, owner/)).toBeInTheDocument();
    expect(screen.getByText(/Your current role: tenant/)).toBeInTheDocument();
  });

  it('provides navigation buttons in access denied', () => {
    const mockAuthContext = {
      user: { id: '1', email: 'test@example.com', role: 'tenant' },
      isAuthenticated: true,
      loading: false
    };

    jest.spyOn(require('../contexts/AuthContext'), 'useAuth').mockReturnValue(mockAuthContext);

    renderProtectedRoute({ allowedRoles: ['admin'] });
    
    expect(screen.getByText('Go Back')).toBeInTheDocument();
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument();
  });

  it('provides navigation buttons in verification required', () => {
    const mockAuthContext = {
      user: { 
        id: '1', 
        email: 'test@example.com', 
        role: 'tenant',
        isVerified: false 
      },
      isAuthenticated: true,
      loading: false
    };

    jest.spyOn(require('../contexts/AuthContext'), 'useAuth').mockReturnValue(mockAuthContext);

    renderProtectedRoute({ requireVerification: true });
    
    expect(screen.getByText('Resend Verification Email')).toBeInTheDocument();
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument();
  });
}); 