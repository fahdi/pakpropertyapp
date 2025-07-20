import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import SupportPage from '../pages/SupportPage';

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
    form: ({ children, ...props }) => <form {...props}>{children}</form>,
    textarea: ({ children, ...props }) => <textarea {...props}>{children}</textarea>,
    select: ({ children, ...props }) => <select {...props}>{children}</select>,
    option: ({ children, ...props }) => <option {...props}>{children}</option>,
  },
}));

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaHeadset: () => <div data-testid="fa-headset">Headset Icon</div>,
  FaEnvelope: () => <div data-testid="fa-envelope">Envelope Icon</div>,
  FaPhone: () => <div data-testid="fa-phone">Phone Icon</div>,
  FaExclamationTriangle: () => <div data-testid="fa-exclamation-triangle">Exclamation Icon</div>,
  FaQuestionCircle: () => <div data-testid="fa-question-circle">Question Icon</div>,
  FaInfoCircle: () => <div data-testid="fa-info-circle">Info Icon</div>,
  FaFileAlt: () => <div data-testid="fa-file-alt">File Icon</div>,
  FaUser: () => <div data-testid="fa-user">User Icon</div>,
  FaTag: () => <div data-testid="fa-tag">Tag Icon</div>,
  FaCalendar: () => <div data-testid="fa-calendar">Calendar Icon</div>,
  FaMapMarkerAlt: () => <div data-testid="fa-map-marker-alt">Map Icon</div>,
  FaGlobe: () => <div data-testid="fa-globe">Globe Icon</div>,
  FaShieldAlt: () => <div data-testid="fa-shield-alt">Shield Icon</div>,
  FaCheckCircle: () => <div data-testid="fa-check-circle">Check Icon</div>,
  FaTimesCircle: () => <div data-testid="fa-times-circle">Times Icon</div>,
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/support" element={component} />
        <Route path="/help" element={<div>Help Page</div>} />
        <Route path="/faqs" element={<div>FAQs Page</div>} />
        <Route path="/contact" element={<div>Contact Page</div>} />
        <Route path="/terms" element={<div>Terms Page</div>} />
      </Routes>
    </BrowserRouter>
  );
};

describe('SupportPage', () => {
  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = jest.fn();
  });

  test('renders support page with correct title and structure', () => {
    renderWithRouter(<SupportPage />);
    
    expect(screen.getByText('Support Center')).toBeInTheDocument();
    expect(screen.getByText(/We\'re here to help/)).toBeInTheDocument();
  });

  test('renders issue reporting form', () => {
    renderWithRouter(<SupportPage />);
    
    expect(screen.getByText('Report an Issue')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address *')).toBeInTheDocument();
    expect(screen.getByLabelText('Issue Type *')).toBeInTheDocument();
    expect(screen.getByLabelText('Subject *')).toBeInTheDocument();
    expect(screen.getByLabelText('Description *')).toBeInTheDocument();
  });

  test('form validation works correctly', async () => {
    renderWithRouter(<SupportPage />);
    
    const submitButton = screen.getByText('Submit Report');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Please fill in all required fields.')).toBeInTheDocument();
    });
  });

  test('form submission with valid data', async () => {
    renderWithRouter(<SupportPage />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText('Full Name *'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText('Email Address *'), {
      target: { value: 'john@example.com' }
    });
    fireEvent.change(screen.getByLabelText('Issue Type *'), {
      target: { value: 'technical' }
    });
    fireEvent.change(screen.getByLabelText('Subject *'), {
      target: { value: 'Test Issue' }
    });
    fireEvent.change(screen.getByLabelText('Description *'), {
      target: { value: 'This is a test issue description.' }
    });
    
    const submitButton = screen.getByText('Submit Report');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Thank you for your report!')).toBeInTheDocument();
    });
  });

  test('renders alternative support options', () => {
    renderWithRouter(<SupportPage />);
    
    expect(screen.getByText('Alternative Support Options')).toBeInTheDocument();
    expect(screen.getByText('Call Us')).toBeInTheDocument();
    expect(screen.getByText('Email Us')).toBeInTheDocument();
    expect(screen.getByText('Live Chat')).toBeInTheDocument();
  });

  test('displays contact information correctly', () => {
    renderWithRouter(<SupportPage />);
    
    expect(screen.getByText('+92 300 123 4567')).toBeInTheDocument();
    expect(screen.getByText('support@pakproperty.com')).toBeInTheDocument();
  });

  test('renders quick links section', () => {
    renderWithRouter(<SupportPage />);
    
    expect(screen.getByText('Related Resources')).toBeInTheDocument();
    expect(screen.getByText('Help Center')).toBeInTheDocument();
    expect(screen.getByText('FAQs')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Terms')).toBeInTheDocument();
  });

  test('quick links navigate to correct pages', () => {
    renderWithRouter(<SupportPage />);
    
    const helpLink = screen.getByText('Help Center').closest('a');
    const faqsLink = screen.getByText('FAQs').closest('a');
    const contactLink = screen.getByText('Contact').closest('a');
    const termsLink = screen.getByText('Terms').closest('a');
    
    expect(helpLink).toHaveAttribute('href', '/help');
    expect(faqsLink).toHaveAttribute('href', '/faqs');
    expect(contactLink).toHaveAttribute('href', '/contact');
    expect(termsLink).toHaveAttribute('href', '/terms');
  });

  test('renders issue type options', () => {
    renderWithRouter(<SupportPage />);
    
    const issueTypeSelect = screen.getByLabelText('Issue Type *');
    expect(issueTypeSelect).toBeInTheDocument();
    
    // Check for issue type options
    expect(screen.getByText('Technical Issue')).toBeInTheDocument();
    expect(screen.getByText('Account Problem')).toBeInTheDocument();
    expect(screen.getByText('Property Listing Issue')).toBeInTheDocument();
    expect(screen.getByText('Payment Problem')).toBeInTheDocument();
    expect(screen.getByText('General Inquiry')).toBeInTheDocument();
  });

  test('form resets after successful submission', async () => {
    renderWithRouter(<SupportPage />);
    
    // Fill in the form
    const nameInput = screen.getByLabelText('Full Name *');
    const emailInput = screen.getByLabelText('Email Address *');
    const subjectInput = screen.getByLabelText('Subject *');
    const descriptionInput = screen.getByLabelText('Description *');
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Issue Type *'), { target: { value: 'technical' } });
    fireEvent.change(subjectInput, { target: { value: 'Test Issue' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    
    const submitButton = screen.getByText('Submit Report');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Thank you for your report!')).toBeInTheDocument();
    });
    
    // Check that form is reset
    expect(nameInput.value).toBe('');
    expect(emailInput.value).toBe('');
    expect(subjectInput.value).toBe('');
    expect(descriptionInput.value).toBe('');
  });

  test('handles form validation errors properly', async () => {
    renderWithRouter(<SupportPage />);
    
    // Try to submit with only some fields filled
    fireEvent.change(screen.getByLabelText('Full Name *'), {
      target: { value: 'John Doe' }
    });
    
    const submitButton = screen.getByText('Submit Report');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Please fill in all required fields.')).toBeInTheDocument();
    });
  });

  test('renders support statistics', () => {
    renderWithRouter(<SupportPage />);
    
    expect(screen.getByText('Support Statistics')).toBeInTheDocument();
    expect(screen.getByText('24/7 Support')).toBeInTheDocument();
    expect(screen.getByText('Average Response Time')).toBeInTheDocument();
    expect(screen.getByText('Customer Satisfaction')).toBeInTheDocument();
  });

  test('renders proper accessibility attributes', () => {
    renderWithRouter(<SupportPage />);
    
    const nameInput = screen.getByLabelText('Full Name *');
    const emailInput = screen.getByLabelText('Email Address *');
    const issueTypeSelect = screen.getByLabelText('Issue Type *');
    const subjectInput = screen.getByLabelText('Subject *');
    const descriptionInput = screen.getByLabelText('Description *');
    
    expect(nameInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('required');
    expect(issueTypeSelect).toHaveAttribute('required');
    expect(subjectInput).toHaveAttribute('required');
    expect(descriptionInput).toHaveAttribute('required');
  });

  test('email validation works correctly', async () => {
    renderWithRouter(<SupportPage />);
    
    // Fill form with invalid email
    fireEvent.change(screen.getByLabelText('Full Name *'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText('Email Address *'), {
      target: { value: 'invalid-email' }
    });
    fireEvent.change(screen.getByLabelText('Issue Type *'), {
      target: { value: 'technical' }
    });
    fireEvent.change(screen.getByLabelText('Subject *'), {
      target: { value: 'Test Issue' }
    });
    fireEvent.change(screen.getByLabelText('Description *'), {
      target: { value: 'Test description' }
    });
    
    const submitButton = screen.getByText('Submit Report');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
    });
  });

  test('renders support features section', () => {
    renderWithRouter(<SupportPage />);
    
    expect(screen.getByText('Why Choose Our Support?')).toBeInTheDocument();
    expect(screen.getByText('24/7 Availability')).toBeInTheDocument();
    expect(screen.getByText('Expert Team')).toBeInTheDocument();
    expect(screen.getByText('Quick Resolution')).toBeInTheDocument();
    expect(screen.getByText('Multiple Channels')).toBeInTheDocument();
  });

  test('contact methods are properly linked', () => {
    renderWithRouter(<SupportPage />);
    
    const phoneLink = screen.getByText('+92 300 123 4567');
    const emailLink = screen.getByText('support@pakproperty.com');
    const chatLink = screen.getByText('Start Chat');
    
    expect(phoneLink.closest('a')).toHaveAttribute('href', 'tel:+923001234567');
    expect(emailLink.closest('a')).toHaveAttribute('href', 'mailto:support@pakproperty.com');
    expect(chatLink.closest('a')).toHaveAttribute('href', '/contact');
  });
}); 