import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import DataProtectionPage from '../pages/DataProtectionPage';

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
  FaLock: () => <div data-testid="fa-lock">Lock Icon</div>,
  FaEye: () => <div data-testid="fa-eye">Eye Icon</div>,
  FaInfoCircle: () => <div data-testid="fa-info-circle">Info Icon</div>,
  FaShieldAlt: () => <div data-testid="fa-shield-alt">Shield Icon</div>,
  FaCheckCircle: () => <div data-testid="fa-check-circle">Check Icon</div>,
  FaExclamationTriangle: () => <div data-testid="fa-exclamation-triangle">Exclamation Icon</div>,
  FaDownload: () => <div data-testid="fa-download">Download Icon</div>,
  FaTrash: () => <div data-testid="fa-trash">Trash Icon</div>,
  FaEdit: () => <div data-testid="fa-edit">Edit Icon</div>,
  FaBan: () => <div data-testid="fa-ban">Ban Icon</div>,
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/data-protection" element={component} />
        <Route path="/privacy" element={<div>Privacy Page</div>} />
        <Route path="/terms" element={<div>Terms Page</div>} />
        <Route path="/cookies" element={<div>Cookies Page</div>} />
        <Route path="/contact" element={<div>Contact Page</div>} />
      </Routes>
    </BrowserRouter>
  );
};

describe('DataProtectionPage', () => {
  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = jest.fn();
  });

  test('renders data protection page with correct title and structure', () => {
    renderWithRouter(<DataProtectionPage />);
    
    expect(screen.getByText('Data Protection Rights')).toBeInTheDocument();
    expect(screen.getByText(/Your data protection rights are important to us/)).toBeInTheDocument();
  });

  test('renders last updated information', () => {
    renderWithRouter(<DataProtectionPage />);
    
    expect(screen.getByText('Last Updated:')).toBeInTheDocument();
    expect(screen.getByText(/January 15, 2024/)).toBeInTheDocument();
  });

  test('renders all main sections', () => {
    renderWithRouter(<DataProtectionPage />);
    
    expect(screen.getByText('Your Rights')).toBeInTheDocument();
    expect(screen.getByText('How to Exercise Your Rights')).toBeInTheDocument();
    expect(screen.getByText('Data Processing Information')).toBeInTheDocument();
    expect(screen.getByText('Data Security Measures')).toBeInTheDocument();
    expect(screen.getByText('Data Breach Procedures')).toBeInTheDocument();
    expect(screen.getByText('International Transfers')).toBeInTheDocument();
    expect(screen.getByText('Complaints and Appeals')).toBeInTheDocument();
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
  });

  test('renders user rights information', () => {
    renderWithRouter(<DataProtectionPage />);
    
    expect(screen.getByText('Right to Access')).toBeInTheDocument();
    expect(screen.getByText('Right to Rectification')).toBeInTheDocument();
    expect(screen.getByText('Right to Erasure')).toBeInTheDocument();
    expect(screen.getByText('Right to Portability')).toBeInTheDocument();
    expect(screen.getByText('Right to Object')).toBeInTheDocument();
    expect(screen.getByText('Right to Restriction')).toBeInTheDocument();
  });

  test('renders exercise rights information', () => {
    renderWithRouter(<DataProtectionPage />);
    
    expect(screen.getByText('Request Process')).toBeInTheDocument();
    expect(screen.getByText('Verification Requirements')).toBeInTheDocument();
    expect(screen.getByText('Response Timeline')).toBeInTheDocument();
    expect(screen.getByText('Request Methods')).toBeInTheDocument();
  });

  test('renders data processing information', () => {
    renderWithRouter(<DataProtectionPage />);
    
    expect(screen.getByText('Legal Basis')).toBeInTheDocument();
    expect(screen.getByText('Data Categories')).toBeInTheDocument();
    expect(screen.getByText('Retention Periods')).toBeInTheDocument();
    expect(screen.getByText('Data Sources')).toBeInTheDocument();
  });

  test('renders security measures information', () => {
    renderWithRouter(<DataProtectionPage />);
    
    expect(screen.getByText('Technical Measures')).toBeInTheDocument();
    expect(screen.getByText('Organizational Measures')).toBeInTheDocument();
    expect(screen.getByText('Access Controls')).toBeInTheDocument();
    expect(screen.getByText('Encryption')).toBeInTheDocument();
  });

  test('renders contact information', () => {
    renderWithRouter(<DataProtectionPage />);
    
    expect(screen.getByText('dpo@pakproperty.com')).toBeInTheDocument();
    expect(screen.getByText('+92 300 123 4567')).toBeInTheDocument();
  });

  test('renders related legal documents section', () => {
    renderWithRouter(<DataProtectionPage />);
    
    expect(screen.getByText('Related Legal Documents')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  test('related links navigate to correct pages', () => {
    renderWithRouter(<DataProtectionPage />);
    
    const privacyLink = screen.getByText('Privacy Policy').closest('a');
    const termsLink = screen.getByText('Terms of Service').closest('a');
    const cookiesLink = screen.getByText('Cookie Policy').closest('a');
    const contactLink = screen.getByText('Contact Us').closest('a');
    
    expect(privacyLink).toHaveAttribute('href', '/privacy');
    expect(termsLink).toHaveAttribute('href', '/terms');
    expect(cookiesLink).toHaveAttribute('href', '/cookies');
    expect(contactLink).toHaveAttribute('href', '/contact');
  });

  test('renders data breach procedures', () => {
    renderWithRouter(<DataProtectionPage />);
    
    expect(screen.getByText('Breach Detection')).toBeInTheDocument();
    expect(screen.getByText('Notification Process')).toBeInTheDocument();
    expect(screen.getByText('Mitigation Measures')).toBeInTheDocument();
    expect(screen.getByText('Regulatory Reporting')).toBeInTheDocument();
  });

  test('renders international transfers information', () => {
    renderWithRouter(<DataProtectionPage />);
    
    expect(screen.getByText('Transfer Mechanisms')).toBeInTheDocument();
    expect(screen.getByText('Adequacy Decisions')).toBeInTheDocument();
    expect(screen.getByText('Standard Contractual Clauses')).toBeInTheDocument();
    expect(screen.getByText('Binding Corporate Rules')).toBeInTheDocument();
  });

  test('renders complaints and appeals information', () => {
    renderWithRouter(<DataProtectionPage />);
    
    expect(screen.getByText('Internal Complaints')).toBeInTheDocument();
    expect(screen.getByText('Supervisory Authority')).toBeInTheDocument();
    expect(screen.getByText('Appeal Process')).toBeInTheDocument();
    expect(screen.getByText('Alternative Dispute Resolution')).toBeInTheDocument();
  });

  test('renders proper accessibility attributes', () => {
    renderWithRouter(<DataProtectionPage />);
    
    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    const h2Headings = screen.getAllByRole('heading', { level: 2 });
    expect(h2Headings.length).toBeGreaterThan(0);
  });

  test('renders contact links properly', () => {
    renderWithRouter(<DataProtectionPage />);
    
    const emailLink = screen.getByText('dpo@pakproperty.com');
    const phoneLink = screen.getByText('+92 300 123 4567');
    
    expect(emailLink.closest('a')).toHaveAttribute('href', 'mailto:dpo@pakproperty.com');
    expect(phoneLink.closest('a')).toHaveAttribute('href', 'tel:+923001234567');
  });

  test('renders data subject rights descriptions', () => {
    renderWithRouter(<DataProtectionPage />);
    
    // Check for right to access description
    expect(screen.getByText(/You have the right to request/)).toBeInTheDocument();
    
    // Check for right to rectification description
    expect(screen.getByText(/You have the right to request correction/)).toBeInTheDocument();
    
    // Check for right to erasure description
    expect(screen.getByText(/You have the right to request deletion/)).toBeInTheDocument();
  });

  test('renders request methods information', () => {
    renderWithRouter(<DataProtectionPage />);
    
    expect(screen.getByText('Email Request')).toBeInTheDocument();
    expect(screen.getByText('Online Form')).toBeInTheDocument();
    expect(screen.getByText('Postal Mail')).toBeInTheDocument();
    expect(screen.getByText('Phone Request')).toBeInTheDocument();
  });

  test('renders verification requirements', () => {
    renderWithRouter(<DataProtectionPage />);
    
    expect(screen.getByText('Identity Verification')).toBeInTheDocument();
    expect(screen.getByText('Documentation Required')).toBeInTheDocument();
    expect(screen.getByText('Security Measures')).toBeInTheDocument();
  });

  test('renders response timeline information', () => {
    renderWithRouter(<DataProtectionPage />);
    
    expect(screen.getByText('Standard Response Time')).toBeInTheDocument();
    expect(screen.getByText('Extension Periods')).toBeInTheDocument();
    expect(screen.getByText('Complex Requests')).toBeInTheDocument();
  });

  test('renders data categories information', () => {
    renderWithRouter(<DataProtectionPage />);
    
    expect(screen.getByText('Personal Data')).toBeInTheDocument();
    expect(screen.getByText('Sensitive Data')).toBeInTheDocument();
    expect(screen.getByText('Special Categories')).toBeInTheDocument();
    expect(screen.getByText('Criminal Data')).toBeInTheDocument();
  });

  test('renders legal basis information', () => {
    renderWithRouter(<DataProtectionPage />);
    
    expect(screen.getByText('Consent')).toBeInTheDocument();
    expect(screen.getByText('Contract Performance')).toBeInTheDocument();
    expect(screen.getByText('Legitimate Interest')).toBeInTheDocument();
    expect(screen.getByText('Legal Obligation')).toBeInTheDocument();
    expect(screen.getByText('Vital Interests')).toBeInTheDocument();
  });
}); 