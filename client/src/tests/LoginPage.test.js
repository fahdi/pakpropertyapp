import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import LoginPage from '../pages/auth/LoginPage';

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

// Mock useAuth hook
const mockUseAuth = {
  login: jest.fn(),
  user: null,
  isAuthenticated: false,
  loading: false
};

jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const renderLoginPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.user = null;
    mockUseAuth.isAuthenticated = false;
    mockUseAuth.loading = false;
  });

  it('renders login form correctly', () => {
    renderLoginPage();
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      role: 'tenant'
    };

    mockUseAuth.login.mockResolvedValue({
      success: true,
      user: mockUser
    });

    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUseAuth.login).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles login failure', async () => {
    mockUseAuth.login.mockRejectedValue({
      response: {
        data: {
          message: 'Invalid credentials'
        }
      }
    });

    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUseAuth.login).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
    });

    // Should not navigate on failure
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('validates required fields', async () => {
    renderLoginPage();
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });

    expect(mockUseAuth.login).not.toHaveBeenCalled();
  });

  it('validates email format', async () => {
    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });

    expect(mockUseAuth.login).not.toHaveBeenCalled();
  });

  it('validates password length', async () => {
    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });

    expect(mockUseAuth.login).not.toHaveBeenCalled();
  });

  it('shows loading state during login', async () => {
    mockUseAuth.login.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/signing in/i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('redirects to dashboard if already authenticated', () => {
    mockUseAuth.isAuthenticated = true;
    mockUseAuth.user = { email: 'test@example.com' };

    renderLoginPage();

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('handles network errors', async () => {
    mockUseAuth.login.mockRejectedValue(new Error('Network error'));

    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUseAuth.login).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles server errors', async () => {
    mockUseAuth.login.mockRejectedValue({
      response: {
        status: 500,
        data: {
          message: 'Internal server error'
        }
      }
    });

    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUseAuth.login).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles account locked error', async () => {
    mockUseAuth.login.mockRejectedValue({
      response: {
        status: 423,
        data: {
          message: 'Account is locked due to multiple failed attempts'
        }
      }
    });

    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUseAuth.login).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles inactive account error', async () => {
    mockUseAuth.login.mockRejectedValue({
      response: {
        status: 401,
        data: {
          message: 'Account is inactive'
        }
      }
    });

    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUseAuth.login).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('clears form errors when user starts typing', async () => {
    renderLoginPage();
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    // Trigger validation error
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    // Start typing to clear error
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    await waitFor(() => {
      expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
    });
  });

  it('toggles password visibility', () => {
    renderLoginPage();
    
    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });

    // Password should be hidden by default
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click to hide password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('navigates to register page', () => {
    renderLoginPage();
    
    const registerLink = screen.getByRole('link', { name: /register/i });
    fireEvent.click(registerLink);

    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });

  it('navigates to forgot password page', () => {
    renderLoginPage();
    
    const forgotPasswordLink = screen.getByRole('link', { name: /forgot password/i });
    fireEvent.click(forgotPasswordLink);

    expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
  });
}); 