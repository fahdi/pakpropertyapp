import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import TermsPage from '../pages/TermsPage';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithRouter = (component) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('TermsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders terms of service page correctly', () => {
    renderWithRouter(<TermsPage />);
    
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText(/Please read these terms carefully/)).toBeInTheDocument();
  });

  test('displays last updated date', () => {
    renderWithRouter(<TermsPage />);
    
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    expect(screen.getByText(`Last updated: ${currentDate}`)).toBeInTheDocument();
  });

  test('displays all terms sections', () => {
    renderWithRouter(<TermsPage />);
    
    expect(screen.getByText('1. Acceptance of Terms')).toBeInTheDocument();
    expect(screen.getByText('2. Description of Service')).toBeInTheDocument();
    expect(screen.getByText('3. User Accounts and Registration')).toBeInTheDocument();
    expect(screen.getByText('4. User Responsibilities')).toBeInTheDocument();
    expect(screen.getByText('5. Property Listings and Content')).toBeInTheDocument();
    expect(screen.getByText('6. Privacy and Data Protection')).toBeInTheDocument();
    expect(screen.getByText('7. Intellectual Property Rights')).toBeInTheDocument();
    expect(screen.getByText('8. Disclaimers and Limitations')).toBeInTheDocument();
    expect(screen.getByText('9. Limitation of Liability')).toBeInTheDocument();
    expect(screen.getByText('10. Indemnification')).toBeInTheDocument();
    expect(screen.getByText('11. Termination')).toBeInTheDocument();
    expect(screen.getByText('12. Governing Law')).toBeInTheDocument();
    expect(screen.getByText('13. Changes to Terms')).toBeInTheDocument();
    expect(screen.getByText('14. Contact Information')).toBeInTheDocument();
  });

  test('displays service description', () => {
    renderWithRouter(<TermsPage />);
    
    expect(screen.getByText(/PakProperty is a property rental platform/)).toBeInTheDocument();
    expect(screen.getByText(/Property listings and search functionality/)).toBeInTheDocument();
    expect(screen.getByText(/User registration and profile management/)).toBeInTheDocument();
    expect(screen.getByText(/Communication tools between tenants and owners/)).toBeInTheDocument();
    expect(screen.getByText(/Property management tools for owners and agents/)).toBeInTheDocument();
    expect(screen.getByText(/Inquiry and viewing coordination/)).toBeInTheDocument();
  });

  test('displays user account requirements', () => {
    renderWithRouter(<TermsPage />);
    
    expect(screen.getByText(/Provide accurate, current, and complete information/)).toBeInTheDocument();
    expect(screen.getByText(/Maintain and update your account information/)).toBeInTheDocument();
    expect(screen.getByText(/Keep your password secure and confidential/)).toBeInTheDocument();
    expect(screen.getByText(/Accept responsibility for all activities under your account/)).toBeInTheDocument();
    expect(screen.getByText(/Notify us immediately of any unauthorized use/)).toBeInTheDocument();
  });

  test('displays user responsibilities', () => {
    renderWithRouter(<TermsPage />);
    
    expect(screen.getByText(/Use the Platform only for lawful purposes/)).toBeInTheDocument();
    expect(screen.getByText(/Provide accurate and truthful information/)).toBeInTheDocument();
    expect(screen.getByText(/Respect the rights of other users/)).toBeInTheDocument();
    expect(screen.getByText(/Not engage in fraudulent or deceptive practices/)).toBeInTheDocument();
    expect(screen.getByText(/Not interfere with the Platform's functionality/)).toBeInTheDocument();
    expect(screen.getByText(/Not attempt to gain unauthorized access to the Platform/)).toBeInTheDocument();
  });

  test('displays property listing responsibilities', () => {
    renderWithRouter(<TermsPage />);
    
    expect(screen.getByText(/Providing accurate and up-to-date property information/)).toBeInTheDocument();
    expect(screen.getByText(/Ensuring they have the right to list the property/)).toBeInTheDocument();
    expect(screen.getByText(/Maintaining current contact information/)).toBeInTheDocument();
    expect(screen.getByText(/Responding to inquiries in a timely manner/)).toBeInTheDocument();
    expect(screen.getByText(/Updating property status/)).toBeInTheDocument();
  });

  test('displays privacy policy reference', () => {
    renderWithRouter(<TermsPage />);
    
    expect(screen.getByText(/Our collection and use of personal information is governed by our Privacy Policy/)).toBeInTheDocument();
  });

  test('displays intellectual property rights', () => {
    renderWithRouter(<TermsPage />);
    
    expect(screen.getByText(/The Platform and its original content, features, and functionality are owned by PakProperty/)).toBeInTheDocument();
    expect(screen.getByText(/protected by international copyright, trademark, patent, trade secret, and other intellectual property laws/)).toBeInTheDocument();
  });

  test('displays disclaimers and limitations', () => {
    renderWithRouter(<TermsPage />);
    
    expect(screen.getByText(/PakProperty provides the Platform "as is"/)).toBeInTheDocument();
    expect(screen.getByText(/The accuracy of property information/)).toBeInTheDocument();
    expect(screen.getByText(/The availability of the Platform/)).toBeInTheDocument();
    expect(screen.getByText(/The conduct of other users/)).toBeInTheDocument();
    expect(screen.getByText(/The outcome of rental transactions/)).toBeInTheDocument();
  });

  test('displays limitation of liability', () => {
    renderWithRouter(<TermsPage />);
    
    expect(screen.getByText(/PakProperty shall not be liable for any indirect, incidental, special, consequential, or punitive damages/)).toBeInTheDocument();
  });

  test('displays indemnification clause', () => {
    renderWithRouter(<TermsPage />);
    
    expect(screen.getByText(/You agree to defend, indemnify, and hold harmless PakProperty/)).toBeInTheDocument();
  });

  test('displays termination clause', () => {
    renderWithRouter(<TermsPage />);
    
    expect(screen.getByText(/We may terminate or suspend your account and bar access to the Platform immediately/)).toBeInTheDocument();
  });

  test('displays governing law', () => {
    renderWithRouter(<TermsPage />);
    
    expect(screen.getByText(/These Terms shall be interpreted and governed by the laws of Pakistan/)).toBeInTheDocument();
  });

  test('displays changes to terms clause', () => {
    renderWithRouter(<TermsPage />);
    
    expect(screen.getByText(/We reserve the right to modify or replace these Terms at any time/)).toBeInTheDocument();
    expect(screen.getByText(/we will provide at least 30 days notice prior to any new terms taking effect/)).toBeInTheDocument();
  });

  test('displays contact information', () => {
    renderWithRouter(<TermsPage />);
    
    expect(screen.getByText('legal@pakproperty.com')).toBeInTheDocument();
    expect(screen.getByText('+92 300 123 4567')).toBeInTheDocument();
    expect(screen.getByText('Karachi, Pakistan')).toBeInTheDocument();
  });

  test('displays related legal documents section', () => {
    renderWithRouter(<TermsPage />);
    
    expect(screen.getByText('Related Legal Documents')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument();
    expect(screen.getByText('Data Protection')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  test('displays proper navigation links', () => {
    renderWithRouter(<TermsPage />);
    
    const privacyLink = screen.getByText('Privacy Policy').closest('a');
    expect(privacyLink).toHaveAttribute('href', '/privacy');
    
    const cookiesLink = screen.getByText('Cookie Policy').closest('a');
    expect(cookiesLink).toHaveAttribute('href', '/cookies');
    
    const dataProtectionLink = screen.getByText('Data Protection').closest('a');
    expect(dataProtectionLink).toHaveAttribute('href', '/data-protection');
    
    const contactLink = screen.getByText('Contact Us').closest('a');
    expect(contactLink).toHaveAttribute('href', '/contact');
  });

  test('displays proper styling for hero section', () => {
    renderWithRouter(<TermsPage />);
    
    const heroSection = screen.getByText('Terms of Service').closest('div');
    expect(heroSection).toHaveClass('bg-gradient-to-r', 'from-gray-700', 'to-gray-900');
  });

  test('displays proper styling for main content', () => {
    renderWithRouter(<TermsPage />);
    
    const mainContainer = screen.getByText('Terms of Service').closest('div');
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-gray-50');
  });

  test('displays contact information with proper styling', () => {
    renderWithRouter(<TermsPage />);
    
    const contactSection = screen.getByText('legal@pakproperty.com').closest('div');
    expect(contactSection).toHaveClass('bg-gray-50', 'p-6', 'rounded-lg');
  });

  test('displays terms content with proper structure', () => {
    renderWithRouter(<TermsPage />);
    
    // Check that all major sections are present
    const sections = [
      'Acceptance of Terms',
      'Description of Service',
      'User Accounts and Registration',
      'User Responsibilities',
      'Property Listings and Content',
      'Privacy and Data Protection',
      'Intellectual Property Rights',
      'Disclaimers and Limitations',
      'Limitation of Liability',
      'Indemnification',
      'Termination',
      'Governing Law',
      'Changes to Terms',
      'Contact Information'
    ];
    
    sections.forEach(section => {
      expect(screen.getByText(new RegExp(section))).toBeInTheDocument();
    });
  });

  test('displays proper document structure', () => {
    renderWithRouter(<TermsPage />);
    
    // Check that the document has proper heading hierarchy
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toHaveTextContent('Terms of Service');
    
    const h2s = screen.getAllByRole('heading', { level: 2 });
    expect(h2s.length).toBeGreaterThan(10); // Should have multiple sections
  });

  test('displays contact information with icons', () => {
    renderWithRouter(<TermsPage />);
    
    // Check that contact information is displayed with proper structure
    expect(screen.getByText('legal@pakproperty.com')).toBeInTheDocument();
    expect(screen.getByText('+92 300 123 4567')).toBeInTheDocument();
    expect(screen.getByText('Karachi, Pakistan')).toBeInTheDocument();
  });

  test('displays related documents with proper descriptions', () => {
    renderWithRouter(<TermsPage />);
    
    expect(screen.getByText('How we protect your data')).toBeInTheDocument();
    expect(screen.getByText('How we use cookies')).toBeInTheDocument();
    expect(screen.getByText('Your data rights')).toBeInTheDocument();
    expect(screen.getByText('Get in touch')).toBeInTheDocument();
  });
}); 