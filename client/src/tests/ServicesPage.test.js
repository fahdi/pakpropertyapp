import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import ServicesPage from '../pages/ServicesPage';

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

const renderWithRouter = (component, { route = '/services/tenants' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/services/:serviceType" element={component} />
          <Route path="/services" element={component} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('ServicesPage', () => {
  beforeEach(() => {
    // Clear any previous renders
    jest.clearAllMocks();
  });

  test('renders tenants service page correctly', () => {
    renderWithRouter(<ServicesPage />, { route: '/services/tenants' });
    
    expect(screen.getByText('For Tenants')).toBeInTheDocument();
    expect(screen.getByText('Find Your Perfect Home')).toBeInTheDocument();
    expect(screen.getByText(/Discover verified properties/)).toBeInTheDocument();
  });

  test('renders owners service page correctly', () => {
    renderWithRouter(<ServicesPage />, { route: '/services/owners' });
    
    expect(screen.getByText('For Property Owners')).toBeInTheDocument();
    expect(screen.getByText('List Your Properties')).toBeInTheDocument();
    expect(screen.getByText(/Reach thousands of potential tenants/)).toBeInTheDocument();
  });

  test('renders agents service page correctly', () => {
    renderWithRouter(<ServicesPage />, { route: '/services/agents' });
    
    expect(screen.getByText('For Real Estate Agents')).toBeInTheDocument();
    expect(screen.getByText('Grow Your Business')).toBeInTheDocument();
    expect(screen.getByText(/Expand your reach/)).toBeInTheDocument();
  });

  test('renders management service page correctly', () => {
    renderWithRouter(<ServicesPage />, { route: '/services/management' });
    
    expect(screen.getByText('Property Management')).toBeInTheDocument();
    expect(screen.getByText('Professional Management Services')).toBeInTheDocument();
    expect(screen.getByText(/Comprehensive property management/)).toBeInTheDocument();
  });

  test('renders default service when no service type is provided', () => {
    renderWithRouter(<ServicesPage />, { route: '/services' });
    
    expect(screen.getByText('For Tenants')).toBeInTheDocument();
  });

  test('displays features for tenants service', () => {
    renderWithRouter(<ServicesPage />, { route: '/services/tenants' });
    
    expect(screen.getByText('Advanced Search')).toBeInTheDocument();
    expect(screen.getByText('Verified Listings')).toBeInTheDocument();
    expect(screen.getByText('Direct Contact')).toBeInTheDocument();
    expect(screen.getByText('Secure Process')).toBeInTheDocument();
  });

  test('displays features for owners service', () => {
    renderWithRouter(<ServicesPage />, { route: '/services/owners' });
    
    expect(screen.getByText('Easy Listing')).toBeInTheDocument();
    expect(screen.getByText('Wide Reach')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Management Tools')).toBeInTheDocument();
  });

  test('displays benefits for tenants service', () => {
    renderWithRouter(<ServicesPage />, { route: '/services/tenants' });
    
    expect(screen.getByText(/Browse thousands of verified properties/)).toBeInTheDocument();
    expect(screen.getByText(/Advanced search and filtering options/)).toBeInTheDocument();
    expect(screen.getByText(/Direct communication with owners/)).toBeInTheDocument();
  });

  test('displays benefits for owners service', () => {
    renderWithRouter(<ServicesPage />, { route: '/services/owners' });
    
    expect(screen.getByText(/Free property listing/)).toBeInTheDocument();
    expect(screen.getByText(/Professional property presentation/)).toBeInTheDocument();
    expect(screen.getByText(/Inquiry management system/)).toBeInTheDocument();
  });

  test('displays call-to-action section', () => {
    renderWithRouter(<ServicesPage />, { route: '/services/tenants' });
    
    expect(screen.getByText('Ready to Get Started?')).toBeInTheDocument();
    expect(screen.getByText(/Join thousands of users/)).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
  });

  test('displays service navigation section', () => {
    renderWithRouter(<ServicesPage />, { route: '/services/tenants' });
    
    expect(screen.getByText('Explore Our Services')).toBeInTheDocument();
    expect(screen.getByText('For Tenants')).toBeInTheDocument();
    expect(screen.getByText('For Property Owners')).toBeInTheDocument();
    expect(screen.getByText('For Real Estate Agents')).toBeInTheDocument();
    expect(screen.getByText('Property Management')).toBeInTheDocument();
  });

  test('navigates to different services when clicked', async () => {
    renderWithRouter(<ServicesPage />, { route: '/services/tenants' });
    
    const ownersLink = screen.getByText('For Property Owners').closest('a');
    expect(ownersLink).toHaveAttribute('href', '/services/owners');
    
    const agentsLink = screen.getByText('For Real Estate Agents').closest('a');
    expect(agentsLink).toHaveAttribute('href', '/services/agents');
    
    const managementLink = screen.getByText('Property Management').closest('a');
    expect(managementLink).toHaveAttribute('href', '/services/management');
  });

  test('displays correct service descriptions', () => {
    renderWithRouter(<ServicesPage />, { route: '/services/tenants' });
    
    const description = screen.getByText(/Discover verified properties and connect directly with owners/);
    expect(description).toBeInTheDocument();
  });

  test('displays correct service subtitles', () => {
    renderWithRouter(<ServicesPage />, { route: '/services/owners' });
    
    expect(screen.getByText('List Your Properties')).toBeInTheDocument();
  });

  test('renders with proper styling classes', () => {
    renderWithRouter(<ServicesPage />, { route: '/services/tenants' });
    
    const mainContainer = screen.getByText('For Tenants').closest('div');
    expect(mainContainer).toHaveClass('min-h-screen', 'bg-gray-50');
  });

  test('displays hero section with proper styling', () => {
    renderWithRouter(<ServicesPage />, { route: '/services/tenants' });
    
    const heroSection = screen.getByText('For Tenants').closest('div');
    expect(heroSection).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-blue-800');
  });

  test('displays features with proper styling', () => {
    renderWithRouter(<ServicesPage />, { route: '/services/tenants' });
    
    const featuresSection = screen.getByText('What We Offer').closest('div');
    expect(featuresSection).toBeInTheDocument();
  });

  test('displays benefits section with proper styling', () => {
    renderWithRouter(<ServicesPage />, { route: '/services/tenants' });
    
    const benefitsSection = screen.getByText('Key Benefits').closest('div');
    expect(benefitsSection).toBeInTheDocument();
  });

  test('handles invalid service type gracefully', () => {
    renderWithRouter(<ServicesPage />, { route: '/services/invalid' });
    
    // Should default to tenants service
    expect(screen.getByText('For Tenants')).toBeInTheDocument();
  });

  test('displays all service types in navigation', () => {
    renderWithRouter(<ServicesPage />, { route: '/services/tenants' });
    
    const serviceTypes = ['For Tenants', 'For Property Owners', 'For Real Estate Agents', 'Property Management'];
    serviceTypes.forEach(serviceType => {
      expect(screen.getByText(serviceType)).toBeInTheDocument();
    });
  });

  test('displays contact information in CTA section', () => {
    renderWithRouter(<ServicesPage />, { route: '/services/tenants' });
    
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  test('displays proper icons for each service', () => {
    renderWithRouter(<ServicesPage />, { route: '/services/tenants' });
    
    // Check if icons are present (they should be rendered as SVG elements)
    const iconContainers = document.querySelectorAll('[class*="text-3xl"]');
    expect(iconContainers.length).toBeGreaterThan(0);
  });

  test('displays feature descriptions correctly', () => {
    renderWithRouter(<ServicesPage />, { route: '/services/tenants' });
    
    expect(screen.getByText(/Filter by location, price, amenities/)).toBeInTheDocument();
    expect(screen.getByText(/All properties are verified/)).toBeInTheDocument();
    expect(screen.getByText(/Connect directly with property owners/)).toBeInTheDocument();
  });

  test('displays benefit descriptions correctly', () => {
    renderWithRouter(<ServicesPage />, { route: '/services/tenants' });
    
    expect(screen.getByText(/Browse thousands of verified properties/)).toBeInTheDocument();
    expect(screen.getByText(/Advanced search and filtering options/)).toBeInTheDocument();
    expect(screen.getByText(/Direct communication with owners/)).toBeInTheDocument();
  });
}); 