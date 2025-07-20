import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import CookiesPage from '../pages/CookiesPage';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
    li: ({ children, ...props }) => <li {...props}>{children}</li>,
  },
}));

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaUserShield: () => <div data-testid="fa-user-shield">User Shield Icon</div>,
  FaHandshake: () => <div data-testid="fa-handshake">Handshake Icon</div>,
  FaShieldAlt: () => <div data-testid="fa-shield-alt">Shield Icon</div>,
  FaInfoCircle: () => <div data-testid="fa-info-circle">Info Icon</div>,
  FaEye: () => <div data-testid="fa-eye">Eye Icon</div>,
  FaCheckCircle: () => <div data-testid="fa-check-circle">Check Icon</div>,
  FaExclamationTriangle: () => <div data-testid="fa-exclamation-triangle">Exclamation Icon</div>,
  FaCog: () => <div data-testid="fa-cog">Cog Icon</div>,
  FaClock: () => <div data-testid="fa-clock">Clock Icon</div>,
  FaGlobe: () => <div data-testid="fa-globe">Globe Icon</div>,
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/cookies" element={component} />
        <Route path="/privacy" element={<div>Privacy Page</div>} />
        <Route path="/terms" element={<div>Terms Page</div>} />
        <Route path="/data-protection" element={<div>Data Protection Page</div>} />
        <Route path="/contact" element={<div>Contact Page</div>} />
      </Routes>
    </BrowserRouter>
  );
};

describe('CookiesPage', () => {
  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = jest.fn();
  });

  test('renders cookie policy page with correct title and structure', () => {
    renderWithRouter(<CookiesPage />);
    
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument();
    expect(screen.getByText(/We use cookies to enhance your experience/)).toBeInTheDocument();
  });

  test('renders last updated information', () => {
    renderWithRouter(<CookiesPage />);
    
    expect(screen.getByText('Last Updated:')).toBeInTheDocument();
    expect(screen.getByText(/January 15, 2024/)).toBeInTheDocument();
  });

  test('renders all main sections', () => {
    renderWithRouter(<CookiesPage />);
    
    expect(screen.getByText('What Are Cookies?')).toBeInTheDocument();
    expect(screen.getByText('Types of Cookies We Use')).toBeInTheDocument();
    expect(screen.getByText('How We Use Cookies')).toBeInTheDocument();
    expect(screen.getByText('Third-Party Cookies')).toBeInTheDocument();
    expect(screen.getByText('Cookie Management')).toBeInTheDocument();
    expect(screen.getByText('Cookie Consent')).toBeInTheDocument();
    expect(screen.getByText('Updates to This Policy')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  test('renders cookie types information', () => {
    renderWithRouter(<CookiesPage />);
    
    expect(screen.getByText('Essential Cookies')).toBeInTheDocument();
    expect(screen.getByText('Performance Cookies')).toBeInTheDocument();
    expect(screen.getByText('Functional Cookies')).toBeInTheDocument();
    expect(screen.getByText('Marketing Cookies')).toBeInTheDocument();
  });

  test('renders cookie purposes', () => {
    renderWithRouter(<CookiesPage />);
    
    expect(screen.getByText('Authentication')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Advertising')).toBeInTheDocument();
  });

  test('renders cookie management options', () => {
    renderWithRouter(<CookiesPage />);
    
    expect(screen.getByText('Browser Settings')).toBeInTheDocument();
    expect(screen.getByText('Cookie Preferences')).toBeInTheDocument();
    expect(screen.getByText('Opt-Out Options')).toBeInTheDocument();
    expect(screen.getByText('Cookie Deletion')).toBeInTheDocument();
  });

  test('renders contact information', () => {
    renderWithRouter(<CookiesPage />);
    
    expect(screen.getByText('cookies@pakproperty.com')).toBeInTheDocument();
    expect(screen.getByText('+92 300 123 4567')).toBeInTheDocument();
  });

  test('renders related legal documents section', () => {
    renderWithRouter(<CookiesPage />);
    
    expect(screen.getByText('Related Legal Documents')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Data Protection')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  test('related links navigate to correct pages', () => {
    renderWithRouter(<CookiesPage />);
    
    const privacyLink = screen.getByText('Privacy Policy').closest('a');
    const termsLink = screen.getByText('Terms of Service').closest('a');
    const dataProtectionLink = screen.getByText('Data Protection').closest('a');
    const contactLink = screen.getByText('Contact Us').closest('a');
    
    expect(privacyLink).toHaveAttribute('href', '/privacy');
    expect(termsLink).toHaveAttribute('href', '/terms');
    expect(dataProtectionLink).toHaveAttribute('href', '/data-protection');
    expect(contactLink).toHaveAttribute('href', '/contact');
  });

  test('renders cookie duration information', () => {
    renderWithRouter(<CookiesPage />);
    
    expect(screen.getByText('Session Cookies')).toBeInTheDocument();
    expect(screen.getByText('Persistent Cookies')).toBeInTheDocument();
    expect(screen.getByText('Temporary Cookies')).toBeInTheDocument();
  });

  test('renders third-party cookie information', () => {
    renderWithRouter(<CookiesPage />);
    
    expect(screen.getByText('Analytics Services')).toBeInTheDocument();
    expect(screen.getByText('Advertising Networks')).toBeInTheDocument();
    expect(screen.getByText('Social Media')).toBeInTheDocument();
    expect(screen.getByText('Payment Processors')).toBeInTheDocument();
  });

  test('renders consent management information', () => {
    renderWithRouter(<CookiesPage />);
    
    expect(screen.getByText('Consent Banner')).toBeInTheDocument();
    expect(screen.getByText('Granular Control')).toBeInTheDocument();
    expect(screen.getByText('Withdrawal of Consent')).toBeInTheDocument();
    expect(screen.getByText('Consent Records')).toBeInTheDocument();
  });

  test('renders cookie security information', () => {
    renderWithRouter(<CookiesPage />);
    
    expect(screen.getByText('Secure Transmission')).toBeInTheDocument();
    expect(screen.getByText('HttpOnly Flags')).toBeInTheDocument();
    expect(screen.getByText('SameSite Policy')).toBeInTheDocument();
    expect(screen.getByText('Data Encryption')).toBeInTheDocument();
  });

  test('renders proper accessibility attributes', () => {
    renderWithRouter(<CookiesPage />);
    
    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    const h2Headings = screen.getAllByRole('heading', { level: 2 });
    expect(h2Headings.length).toBeGreaterThan(0);
  });

  test('renders contact links properly', () => {
    renderWithRouter(<CookiesPage />);
    
    const emailLink = screen.getByText('cookies@pakproperty.com');
    const phoneLink = screen.getByText('+92 300 123 4567');
    
    expect(emailLink.closest('a')).toHaveAttribute('href', 'mailto:cookies@pakproperty.com');
    expect(phoneLink.closest('a')).toHaveAttribute('href', 'tel:+923001234567');
  });

  test('renders cookie categories with descriptions', () => {
    renderWithRouter(<CookiesPage />);
    
    // Check for essential cookies description
    expect(screen.getByText(/Essential cookies are necessary/)).toBeInTheDocument();
    
    // Check for performance cookies description
    expect(screen.getByText(/Performance cookies help us understand/)).toBeInTheDocument();
    
    // Check for functional cookies description
    expect(screen.getByText(/Functional cookies enable enhanced/)).toBeInTheDocument();
    
    // Check for marketing cookies description
    expect(screen.getByText(/Marketing cookies are used to track/)).toBeInTheDocument();
  });

  test('renders browser-specific instructions', () => {
    renderWithRouter(<CookiesPage />);
    
    expect(screen.getByText('Chrome')).toBeInTheDocument();
    expect(screen.getByText('Firefox')).toBeInTheDocument();
    expect(screen.getByText('Safari')).toBeInTheDocument();
    expect(screen.getByText('Edge')).toBeInTheDocument();
  });

  test('renders cookie policy updates section', () => {
    renderWithRouter(<CookiesPage />);
    
    expect(screen.getByText('Policy Changes')).toBeInTheDocument();
    expect(screen.getByText('Notification Methods')).toBeInTheDocument();
    expect(screen.getByText('Version History')).toBeInTheDocument();
  });

  test('renders cookie analytics information', () => {
    renderWithRouter(<CookiesPage />);
    
    expect(screen.getByText('Usage Analytics')).toBeInTheDocument();
    expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
    expect(screen.getByText('User Behavior')).toBeInTheDocument();
  });
}); 