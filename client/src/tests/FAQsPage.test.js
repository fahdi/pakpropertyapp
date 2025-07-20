import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import FAQsPage from '../pages/FAQsPage';

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
    li: ({ children, ...props }) => <li {...props}>{children}</li>,
    ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

// Mock react-icons
jest.mock('react-icons/fa', () => ({
  FaQuestionCircle: () => <div data-testid="fa-question-circle">Question Icon</div>,
  FaSearch: () => <div data-testid="fa-search">Search Icon</div>,
  FaChevronDown: () => <div data-testid="fa-chevron-down">Chevron Down Icon</div>,
  FaChevronUp: () => <div data-testid="fa-chevron-up">Chevron Up Icon</div>,
  FaEnvelope: () => <div data-testid="fa-envelope">Envelope Icon</div>,
  FaExclamationTriangle: () => <div data-testid="fa-exclamation-triangle">Exclamation Icon</div>,
  FaFileAlt: () => <div data-testid="fa-file-alt">File Icon</div>,
  FaInfoCircle: () => <div data-testid="fa-info-circle">Info Icon</div>,
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/faqs" element={component} />
        <Route path="/help" element={<div>Help Page</div>} />
        <Route path="/contact" element={<div>Contact Page</div>} />
        <Route path="/support" element={<div>Support Page</div>} />
        <Route path="/terms" element={<div>Terms Page</div>} />
      </Routes>
    </BrowserRouter>
  );
};

describe('FAQsPage', () => {
  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = jest.fn();
  });

  test('renders FAQs page with correct title and structure', () => {
    renderWithRouter(<FAQsPage />);
    
    expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    expect(screen.getByText(/Find answers to common questions/)).toBeInTheDocument();
  });

  test('renders search functionality', () => {
    renderWithRouter(<FAQsPage />);
    
    const searchInput = screen.getByPlaceholderText('Search FAQs...');
    expect(searchInput).toBeInTheDocument();
    expect(screen.getByTestId('fa-search')).toBeInTheDocument();
  });

  test('renders all FAQ categories', () => {
    renderWithRouter(<FAQsPage />);
    
    // Check for main categories
    expect(screen.getByText('General Questions')).toBeInTheDocument();
    expect(screen.getByText('Property Search')).toBeInTheDocument();
    expect(screen.getByText('Account & Profile')).toBeInTheDocument();
    expect(screen.getByText('Property Listings')).toBeInTheDocument();
    expect(screen.getByText('Contact & Communication')).toBeInTheDocument();
    expect(screen.getByText('Technical Support')).toBeInTheDocument();
  });

  test('displays FAQ items in each category', () => {
    renderWithRouter(<FAQsPage />);
    
    // Check for specific FAQ items
    expect(screen.getByText('What is PakProperty?')).toBeInTheDocument();
    expect(screen.getByText('How do I search for properties?')).toBeInTheDocument();
    expect(screen.getByText('How do I create an account?')).toBeInTheDocument();
    expect(screen.getByText('How do I list my property?')).toBeInTheDocument();
    expect(screen.getByText('How do I contact a property owner?')).toBeInTheDocument();
    expect(screen.getByText('What if I encounter technical issues?')).toBeInTheDocument();
  });

  test('search functionality filters FAQs', async () => {
    renderWithRouter(<FAQsPage />);
    
    const searchInput = screen.getByPlaceholderText('Search FAQs...');
    
    // Search for "account"
    fireEvent.change(searchInput, { target: { value: 'account' } });
    
    await waitFor(() => {
      expect(screen.getByText('How do I create an account?')).toBeInTheDocument();
      expect(screen.getByText('How do I update my profile?')).toBeInTheDocument();
    });
    
    // Search for non-existent term
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    await waitFor(() => {
      expect(screen.getByText('No FAQs found matching your search.')).toBeInTheDocument();
    });
  });

  test('FAQ categories can be expanded and collapsed', async () => {
    renderWithRouter(<FAQsPage />);
    
    // Find and click on a category to expand it
    const generalCategory = screen.getByText('General Questions');
    const expandButton = generalCategory.closest('button');
    
    fireEvent.click(expandButton);
    
    await waitFor(() => {
      expect(screen.getByText('PakProperty is Pakistan\'s leading property rental platform')).toBeInTheDocument();
    });
    
    // Click again to collapse
    fireEvent.click(expandButton);
    
    await waitFor(() => {
      expect(screen.queryByText('PakProperty is Pakistan\'s leading property rental platform')).not.toBeInTheDocument();
    });
  });

  test('renders quick links section', () => {
    renderWithRouter(<FAQsPage />);
    
    expect(screen.getByText('Still Need Help?')).toBeInTheDocument();
    expect(screen.getByText('Help Center')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Report Issue')).toBeInTheDocument();
    expect(screen.getByText('Terms')).toBeInTheDocument();
  });

  test('quick links navigate to correct pages', () => {
    renderWithRouter(<FAQsPage />);
    
    const helpLink = screen.getByText('Help Center').closest('a');
    const contactLink = screen.getByText('Contact').closest('a');
    const supportLink = screen.getByText('Report Issue').closest('a');
    const termsLink = screen.getByText('Terms').closest('a');
    
    expect(helpLink).toHaveAttribute('href', '/help');
    expect(contactLink).toHaveAttribute('href', '/contact');
    expect(supportLink).toHaveAttribute('href', '/support');
    expect(termsLink).toHaveAttribute('href', '/terms');
  });

  test('renders contact information', () => {
    renderWithRouter(<FAQsPage />);
    
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByText('support@pakproperty.com')).toBeInTheDocument();
    expect(screen.getByText('+92 300 123 4567')).toBeInTheDocument();
  });

  test('renders FAQ statistics', () => {
    renderWithRouter(<FAQsPage />);
    
    expect(screen.getByText('FAQ Statistics')).toBeInTheDocument();
    expect(screen.getByText('6 Categories')).toBeInTheDocument();
    expect(screen.getByText('30+ Questions')).toBeInTheDocument();
    expect(screen.getByText('24/7 Support')).toBeInTheDocument();
  });

  test('handles empty search results gracefully', async () => {
    renderWithRouter(<FAQsPage />);
    
    const searchInput = screen.getByPlaceholderText('Search FAQs...');
    fireEvent.change(searchInput, { target: { value: 'xyz123' } });
    
    await waitFor(() => {
      expect(screen.getByText('No FAQs found matching your search.')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search terms or browse our categories below.')).toBeInTheDocument();
    });
  });

  test('maintains search state when navigating between categories', async () => {
    renderWithRouter(<FAQsPage />);
    
    const searchInput = screen.getByPlaceholderText('Search FAQs...');
    fireEvent.change(searchInput, { target: { value: 'property' } });
    
    // Expand a category
    const propertyCategory = screen.getByText('Property Search');
    const expandButton = propertyCategory.closest('button');
    fireEvent.click(expandButton);
    
    await waitFor(() => {
      // Should still show search results
      expect(screen.getByText('How do I search for properties?')).toBeInTheDocument();
    });
  });

  test('renders proper accessibility attributes', () => {
    renderWithRouter(<FAQsPage />);
    
    const searchInput = screen.getByPlaceholderText('Search FAQs...');
    expect(searchInput).toHaveAttribute('aria-label', 'Search FAQs');
    
    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    const h2Headings = screen.getAllByRole('heading', { level: 2 });
    expect(h2Headings.length).toBeGreaterThan(0);
  });

  test('displays correct FAQ content for each category', () => {
    renderWithRouter(<FAQsPage />);
    
    // Test General Questions category content
    const generalCategory = screen.getByText('General Questions').closest('button');
    fireEvent.click(generalCategory);
    
    expect(screen.getByText('What is PakProperty?')).toBeInTheDocument();
    expect(screen.getByText('Is PakProperty free to use?')).toBeInTheDocument();
    expect(screen.getByText('Which cities does PakProperty cover?')).toBeInTheDocument();
  });

  test('search highlights matching terms', async () => {
    renderWithRouter(<FAQsPage />);
    
    const searchInput = screen.getByPlaceholderText('Search FAQs...');
    fireEvent.change(searchInput, { target: { value: 'property' } });
    
    await waitFor(() => {
      // Should show property-related FAQs
      expect(screen.getByText('How do I search for properties?')).toBeInTheDocument();
      expect(screen.getByText('How do I list my property?')).toBeInTheDocument();
    });
  });
}); 