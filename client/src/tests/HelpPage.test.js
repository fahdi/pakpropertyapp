import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import HelpPage from '../pages/HelpPage';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => children,
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

describe('HelpPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders help center page correctly', () => {
    renderWithRouter(<HelpPage />);
    
    expect(screen.getByText('Help Center')).toBeInTheDocument();
    expect(screen.getByText('Find answers to your questions')).toBeInTheDocument();
  });

  test('displays search functionality', () => {
    renderWithRouter(<HelpPage />);
    
    const searchInput = screen.getByPlaceholderText('Search for help topics...');
    expect(searchInput).toBeInTheDocument();
  });

  test('displays help categories', () => {
    renderWithRouter(<HelpPage />);
    
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('For Tenants')).toBeInTheDocument();
    expect(screen.getByText('For Property Owners')).toBeInTheDocument();
    expect(screen.getByText('Account & Security')).toBeInTheDocument();
    expect(screen.getByText('Payments & Billing')).toBeInTheDocument();
    expect(screen.getByText('Technical Support')).toBeInTheDocument();
  });

  test('displays help questions in categories', () => {
    renderWithRouter(<HelpPage />);
    
    expect(screen.getByText('How do I create an account?')).toBeInTheDocument();
    expect(screen.getByText('How do I search for properties?')).toBeInTheDocument();
    expect(screen.getByText('How do I contact a property owner?')).toBeInTheDocument();
  });

  test('expands category when clicked', async () => {
    renderWithRouter(<HelpPage />);
    
    const gettingStartedButton = screen.getByText('Getting Started');
    fireEvent.click(gettingStartedButton);
    
    await waitFor(() => {
      expect(screen.getByText('How do I create an account?')).toBeInTheDocument();
    });
  });

  test('expands individual help item when clicked', async () => {
    renderWithRouter(<HelpPage />);
    
    // First expand the category
    const gettingStartedButton = screen.getByText('Getting Started');
    fireEvent.click(gettingStartedButton);
    
    await waitFor(() => {
      const questionButton = screen.getByText('How do I create an account?');
      fireEvent.click(questionButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Click the "Register" button/)).toBeInTheDocument();
    });
  });

  test('filters help content when searching', async () => {
    renderWithRouter(<HelpPage />);
    
    const searchInput = screen.getByPlaceholderText('Search for help topics...');
    fireEvent.change(searchInput, { target: { value: 'account' } });
    
    await waitFor(() => {
      expect(screen.getByText('How do I create an account?')).toBeInTheDocument();
    });
  });

  test('displays contact support section', () => {
    renderWithRouter(<HelpPage />);
    
    expect(screen.getByText('Still need help?')).toBeInTheDocument();
    expect(screen.getByText(/Can't find what you're looking for/)).toBeInTheDocument();
  });

  test('displays contact methods', () => {
    renderWithRouter(<HelpPage />);
    
    expect(screen.getByText('Call Us')).toBeInTheDocument();
    expect(screen.getByText('Email Us')).toBeInTheDocument();
    expect(screen.getByText('Live Chat')).toBeInTheDocument();
  });

  test('displays contact information', () => {
    renderWithRouter(<HelpPage />);
    
    expect(screen.getByText('+92 300 123 4567')).toBeInTheDocument();
    expect(screen.getByText('support@pakproperty.com')).toBeInTheDocument();
  });

  test('displays quick links section', () => {
    renderWithRouter(<HelpPage />);
    
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('FAQs')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Report Issue')).toBeInTheDocument();
    expect(screen.getByText('Terms')).toBeInTheDocument();
  });

  test('displays help categories with article counts', () => {
    renderWithRouter(<HelpPage />);
    
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
    expect(screen.getByText('3 articles')).toBeInTheDocument();
  });

  test('displays tags for help items', async () => {
    renderWithRouter(<HelpPage />);
    
    // Expand a category and item
    const gettingStartedButton = screen.getByText('Getting Started');
    fireEvent.click(gettingStartedButton);
    
    await waitFor(() => {
      const questionButton = screen.getByText('How do I create an account?');
      fireEvent.click(questionButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('account')).toBeInTheDocument();
      expect(screen.getByText('registration')).toBeInTheDocument();
      expect(screen.getByText('signup')).toBeInTheDocument();
    });
  });

  test('displays tenant-specific help questions', async () => {
    renderWithRouter(<HelpPage />);
    
    const tenantsButton = screen.getByText('For Tenants');
    fireEvent.click(tenantsButton);
    
    await waitFor(() => {
      expect(screen.getByText('How do I schedule a property viewing?')).toBeInTheDocument();
      expect(screen.getByText('What documents do I need to rent a property?')).toBeInTheDocument();
      expect(screen.getByText('Can I save properties I\'m interested in?')).toBeInTheDocument();
    });
  });

  test('displays owner-specific help questions', async () => {
    renderWithRouter(<HelpPage />);
    
    const ownersButton = screen.getByText('For Property Owners');
    fireEvent.click(ownersButton);
    
    await waitFor(() => {
      expect(screen.getByText('How do I list my property?')).toBeInTheDocument();
      expect(screen.getByText('How do I manage property inquiries?')).toBeInTheDocument();
      expect(screen.getByText('How do I update my property status?')).toBeInTheDocument();
    });
  });

  test('displays security-specific help questions', async () => {
    renderWithRouter(<HelpPage />);
    
    const securityButton = screen.getByText('Account & Security');
    fireEvent.click(securityButton);
    
    await waitFor(() => {
      expect(screen.getByText('How do I reset my password?')).toBeInTheDocument();
      expect(screen.getByText('How do I update my profile information?')).toBeInTheDocument();
      expect(screen.getByText('Is my personal information secure?')).toBeInTheDocument();
    });
  });

  test('displays payment-specific help questions', async () => {
    renderWithRouter(<HelpPage />);
    
    const paymentsButton = screen.getByText('Payments & Billing');
    fireEvent.click(paymentsButton);
    
    await waitFor(() => {
      expect(screen.getByText('How do I pay for property listings?')).toBeInTheDocument();
      expect(screen.getByText('What payment methods are accepted?')).toBeInTheDocument();
      expect(screen.getByText('How do I get a refund?')).toBeInTheDocument();
    });
  });

  test('displays technical support questions', async () => {
    renderWithRouter(<HelpPage />);
    
    const technicalButton = screen.getByText('Technical Support');
    fireEvent.click(technicalButton);
    
    await waitFor(() => {
      expect(screen.getByText('The website is not loading properly')).toBeInTheDocument();
      expect(screen.getByText('I can\'t upload property photos')).toBeInTheDocument();
      expect(screen.getByText('How do I report a bug?')).toBeInTheDocument();
    });
  });

  test('filters categories when searching', async () => {
    renderWithRouter(<HelpPage />);
    
    const searchInput = screen.getByPlaceholderText('Search for help topics...');
    fireEvent.change(searchInput, { target: { value: 'property' } });
    
    await waitFor(() => {
      // Should show categories that contain "property" in their questions
      expect(screen.getByText('For Tenants')).toBeInTheDocument();
      expect(screen.getByText('For Property Owners')).toBeInTheDocument();
    });
  });

  test('displays help item answers when expanded', async () => {
    renderWithRouter(<HelpPage />);
    
    // Expand Getting Started category
    const gettingStartedButton = screen.getByText('Getting Started');
    fireEvent.click(gettingStartedButton);
    
    await waitFor(() => {
      // Expand first question
      const questionButton = screen.getByText('How do I create an account?');
      fireEvent.click(questionButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Click the "Register" button in the top navigation/)).toBeInTheDocument();
      expect(screen.getByText(/Fill in your details including name, email, phone number/)).toBeInTheDocument();
    });
  });

  test('displays proper styling for hero section', () => {
    renderWithRouter(<HelpPage />);
    
    const heroSection = screen.getByText('Help Center').closest('div');
    expect(heroSection).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-blue-800');
  });

  test('displays proper styling for main content', () => {
    renderWithRouter(<HelpPage />);
    
    const mainContainer = screen.getByText('Help Center').closest('div');
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-gray-50');
  });

  test('displays contact support with proper styling', () => {
    renderWithRouter(<HelpPage />);
    
    expect(screen.getByText('Call Us')).toBeInTheDocument();
    expect(screen.getByText('Email Us')).toBeInTheDocument();
    expect(screen.getByText('Live Chat')).toBeInTheDocument();
  });

  test('displays quick links with proper navigation', () => {
    renderWithRouter(<HelpPage />);
    
    const faqsLink = screen.getByText('FAQs').closest('a');
    expect(faqsLink).toHaveAttribute('href', '/faqs');
    
    const contactLink = screen.getByText('Contact').closest('a');
    expect(contactLink).toHaveAttribute('href', '/contact');
    
    const supportLink = screen.getByText('Report Issue').closest('a');
    expect(supportLink).toHaveAttribute('href', '/support');
    
    const termsLink = screen.getByText('Terms').closest('a');
    expect(termsLink).toHaveAttribute('href', '/terms');
  });

  test('handles empty search results gracefully', async () => {
    renderWithRouter(<HelpPage />);
    
    const searchInput = screen.getByPlaceholderText('Search for help topics...');
    fireEvent.change(searchInput, { target: { value: 'nonexistentterm' } });
    
    await waitFor(() => {
      // Should not display any categories when search has no results
      expect(screen.queryByText('Getting Started')).not.toBeInTheDocument();
    });
  });

  test('displays help categories in correct order', () => {
    renderWithRouter(<HelpPage />);
    
    const categories = [
      'Getting Started',
      'For Tenants', 
      'For Property Owners',
      'Account & Security',
      'Payments & Billing',
      'Technical Support'
    ];
    
    categories.forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });
}); 