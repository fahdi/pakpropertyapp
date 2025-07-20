import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import PrivacyPage from '../pages/PrivacyPage';

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
  FaEye: () => <div data-testid="fa-eye">Eye Icon</div>,
  FaLock: () => <div data-testid="fa-lock">Lock Icon</div>,
  FaInfoCircle: () => <div data-testid="fa-info-circle">Info Icon</div>,
  FaShieldAlt: () => <div data-testid="fa-shield-alt">Shield Icon</div>,
  FaCheckCircle: () => <div data-testid="fa-check-circle">Check Icon</div>,
  FaExclamationTriangle: () => <div data-testid="fa-exclamation-triangle">Exclamation Icon</div>,
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/privacy" element={component} />
        <Route path="/terms" element={<div>Terms Page</div>} />
        <Route path="/cookies" element={<div>Cookies Page</div>} />
        <Route path="/data-protection" element={<div>Data Protection Page</div>} />
        <Route path="/contact" element={<div>Contact Page</div>} />
      </Routes>
    </BrowserRouter>
  );
};

describe('PrivacyPage', () => {
  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = jest.fn();
  });

  test('renders privacy policy page with correct title and structure', () => {
    renderWithRouter(<PrivacyPage />);
    
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText(/Your privacy is important to us/)).toBeInTheDocument();
  });

  test('renders last updated information', () => {
    renderWithRouter(<PrivacyPage />);
    
    expect(screen.getByText('Last Updated:')).toBeInTheDocument();
    expect(screen.getByText(/January 15, 2024/)).toBeInTheDocument();
  });

  test('renders all main sections', () => {
    renderWithRouter(<PrivacyPage />);
    
    expect(screen.getByText('Information We Collect')).toBeInTheDocument();
    expect(screen.getByText('How We Use Your Information')).toBeInTheDocument();
    expect(screen.getByText('Information Sharing')).toBeInTheDocument();
    expect(screen.getByText('Data Security')).toBeInTheDocument();
    expect(screen.getByText('Your Rights')).toBeInTheDocument();
    expect(screen.getByText('Cookies and Tracking')).toBeInTheDocument();
    expect(screen.getByText('Third-Party Services')).toBeInTheDocument();
    expect(screen.getByText('Children\'s Privacy')).toBeInTheDocument();
    expect(screen.getByText('International Transfers')).toBeInTheDocument();
    expect(screen.getByText('Changes to This Policy')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  test('renders information collection details', () => {
    renderWithRouter(<PrivacyPage />);
    
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Account Information')).toBeInTheDocument();
    expect(screen.getByText('Property Information')).toBeInTheDocument();
    expect(screen.getByText('Usage Data')).toBeInTheDocument();
    expect(screen.getByText('Communication Data')).toBeInTheDocument();
  });

  test('renders data usage purposes', () => {
    renderWithRouter(<PrivacyPage />);
    
    expect(screen.getByText('Service Provision')).toBeInTheDocument();
    expect(screen.getByText('Communication')).toBeInTheDocument();
    expect(screen.getByText('Improvement and Analytics')).toBeInTheDocument();
    expect(screen.getByText('Legal Compliance')).toBeInTheDocument();
    expect(screen.getByText('Marketing')).toBeInTheDocument();
  });

  test('renders user rights section', () => {
    renderWithRouter(<PrivacyPage />);
    
    expect(screen.getByText('Access Your Data')).toBeInTheDocument();
    expect(screen.getByText('Correct Your Data')).toBeInTheDocument();
    expect(screen.getByText('Delete Your Data')).toBeInTheDocument();
    expect(screen.getByText('Data Portability')).toBeInTheDocument();
    expect(screen.getByText('Object to Processing')).toBeInTheDocument();
  });

  test('renders contact information', () => {
    renderWithRouter(<PrivacyPage />);
    
    expect(screen.getByText('privacy@pakproperty.com')).toBeInTheDocument();
    expect(screen.getByText('+92 300 123 4567')).toBeInTheDocument();
  });

  test('renders related legal documents section', () => {
    renderWithRouter(<PrivacyPage />);
    
    expect(screen.getByText('Related Legal Documents')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument();
    expect(screen.getByText('Data Protection')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  test('related links navigate to correct pages', () => {
    renderWithRouter(<PrivacyPage />);
    
    const termsLink = screen.getByText('Terms of Service').closest('a');
    const cookiesLink = screen.getByText('Cookie Policy').closest('a');
    const dataProtectionLink = screen.getByText('Data Protection').closest('a');
    const contactLink = screen.getByText('Contact Us').closest('a');
    
    expect(termsLink).toHaveAttribute('href', '/terms');
    expect(cookiesLink).toHaveAttribute('href', '/cookies');
    expect(dataProtectionLink).toHaveAttribute('href', '/data-protection');
    expect(contactLink).toHaveAttribute('href', '/contact');
  });

  test('renders data security information', () => {
    renderWithRouter(<PrivacyPage />);
    
    expect(screen.getByText('Encryption')).toBeInTheDocument();
    expect(screen.getByText('Access Controls')).toBeInTheDocument();
    expect(screen.getByText('Regular Audits')).toBeInTheDocument();
    expect(screen.getByText('Incident Response')).toBeInTheDocument();
  });

  test('renders cookie information', () => {
    renderWithRouter(<PrivacyPage />);
    
    expect(screen.getByText('Essential Cookies')).toBeInTheDocument();
    expect(screen.getByText('Analytics Cookies')).toBeInTheDocument();
    expect(screen.getByText('Marketing Cookies')).toBeInTheDocument();
    expect(screen.getByText('Cookie Management')).toBeInTheDocument();
  });

  test('renders third-party services information', () => {
    renderWithRouter(<PrivacyPage />);
    
    expect(screen.getByText('Payment Processors')).toBeInTheDocument();
    expect(screen.getByText('Analytics Services')).toBeInTheDocument();
    expect(screen.getByText('Communication Services')).toBeInTheDocument();
    expect(screen.getByText('Hosting Services')).toBeInTheDocument();
  });

  test('renders children privacy section', () => {
    renderWithRouter(<PrivacyPage />);
    
    expect(screen.getByText('Age Restrictions')).toBeInTheDocument();
    expect(screen.getByText('Parental Consent')).toBeInTheDocument();
    expect(screen.getByText('Data Protection')).toBeInTheDocument();
  });

  test('renders international transfers information', () => {
    renderWithRouter(<PrivacyPage />);
    
    expect(screen.getByText('Data Transfer')).toBeInTheDocument();
    expect(screen.getByText('Adequacy Decisions')).toBeInTheDocument();
    expect(screen.getByText('Safeguards')).toBeInTheDocument();
  });

  test('renders policy changes information', () => {
    renderWithRouter(<PrivacyPage />);
    
    expect(screen.getByText('Notification Process')).toBeInTheDocument();
    expect(screen.getByText('Continued Use')).toBeInTheDocument();
    expect(screen.getByText('Version History')).toBeInTheDocument();
  });

  test('renders proper accessibility attributes', () => {
    renderWithRouter(<PrivacyPage />);
    
    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    const h2Headings = screen.getAllByRole('heading', { level: 2 });
    expect(h2Headings.length).toBeGreaterThan(0);
  });

  test('renders contact links properly', () => {
    renderWithRouter(<PrivacyPage />);
    
    const emailLink = screen.getByText('privacy@pakproperty.com');
    const phoneLink = screen.getByText('+92 300 123 4567');
    
    expect(emailLink.closest('a')).toHaveAttribute('href', 'mailto:privacy@pakproperty.com');
    expect(phoneLink.closest('a')).toHaveAttribute('href', 'tel:+923001234567');
  });

  test('renders data retention information', () => {
    renderWithRouter(<PrivacyPage />);
    
    expect(screen.getByText('Retention Periods')).toBeInTheDocument();
    expect(screen.getByText('Account Data')).toBeInTheDocument();
    expect(screen.getByText('Property Listings')).toBeInTheDocument();
    expect(screen.getByText('Communication Records')).toBeInTheDocument();
  });

  test('renders data processing legal basis', () => {
    renderWithRouter(<PrivacyPage />);
    
    expect(screen.getByText('Legal Basis for Processing')).toBeInTheDocument();
    expect(screen.getByText('Contract Performance')).toBeInTheDocument();
    expect(screen.getByText('Legitimate Interest')).toBeInTheDocument();
    expect(screen.getByText('Consent')).toBeInTheDocument();
    expect(screen.getByText('Legal Obligation')).toBeInTheDocument();
  });
}); 