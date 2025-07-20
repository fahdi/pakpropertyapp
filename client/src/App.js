import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useResizeObserverFix } from './utils/useResizeObserverFix';

// Import pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PropertiesPage from './pages/PropertiesPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import AddPropertyPage from './pages/dashboard/AddPropertyPage';
import EditPropertyPage from './pages/dashboard/EditPropertyPage';
import MyPropertiesPage from './pages/dashboard/MyPropertiesPage';
import SavedPropertiesPage from './pages/dashboard/SavedPropertiesPage';
import InquiriesPage from './pages/dashboard/InquiriesPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Import new pages
import ServicesPage from './pages/ServicesPage';
import HelpPage from './pages/HelpPage';
import FAQsPage from './pages/FAQsPage';
import SupportPage from './pages/SupportPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import CookiesPage from './pages/CookiesPage';
import DataProtectionPage from './pages/DataProtectionPage';

// Import admin pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import UserDetailPage from './pages/admin/UserDetailPage';

// Import components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ScrollToTop from './components/common/ScrollToTop';



// Global Error Boundary for ResizeObserver errors
class ResizeObserverErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Only catch ResizeObserver errors
    if (error.message && error.message.includes('ResizeObserver')) {
      return { hasError: false }; // Don't show error UI for ResizeObserver
    }
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Only log non-ResizeObserver errors
    if (!error.message || !error.message.includes('ResizeObserver')) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}

// Navigation-specific ResizeObserver handler (must be inside Router context)
const NavigationResizeObserverHandler = ({ children }) => {
  const location = useLocation();
  
  // Use the custom hook
  useResizeObserverFix();

  // Additional navigation-specific handling
  React.useEffect(() => {
    let navigationTimeout;

    const handleNavigation = () => {
      // Clear any existing timeout
      if (navigationTimeout) {
        clearTimeout(navigationTimeout);
      }

      // Set a timeout to handle post-navigation ResizeObserver issues
      navigationTimeout = setTimeout(() => {
        // Force a repaint to stabilize any ResizeObserver instances
        window.dispatchEvent(new Event('resize'));
        
        // Additional stabilization for Contact to Home navigation
        const currentPath = location.pathname;
        if (currentPath === '/') {
          // Force DOM repaint for Home page
          requestAnimationFrame(() => {
            window.dispatchEvent(new Event('resize'));
          });
        }
      }, 100);
    };

    // Listen for navigation events
    window.addEventListener('popstate', handleNavigation);
    
    // Also handle programmatic navigation using React Router
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args);
      handleNavigation();
    };

    const originalReplaceState = window.history.replaceState;
    window.history.replaceState = function(...args) {
      originalReplaceState.apply(window.history, args);
      handleNavigation();
    };

    return () => {
      if (navigationTimeout) {
        clearTimeout(navigationTimeout);
      }
      window.removeEventListener('popstate', handleNavigation);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [location.pathname]);

  return children;
};



function App() {
  return (
    <ResizeObserverErrorBoundary>
      <NavigationResizeObserverHandler>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/properties/:id" element={<PropertyDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/dashboard/add-property" element={<ProtectedRoute><AddPropertyPage /></ProtectedRoute>} />
              <Route path="/dashboard/edit-property/:id" element={<ProtectedRoute><EditPropertyPage /></ProtectedRoute>} />
              <Route path="/dashboard/my-properties" element={<ProtectedRoute><MyPropertiesPage /></ProtectedRoute>} />
              <Route path="/dashboard/saved-properties" element={<ProtectedRoute><SavedPropertiesPage /></ProtectedRoute>} />
              <Route path="/dashboard/inquiries" element={<ProtectedRoute><InquiriesPage /></ProtectedRoute>} />
              <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              
              {/* Service Routes */}
              <Route path="/services/:serviceType" element={<ServicesPage />} />
              <Route path="/services" element={<ServicesPage />} />
              
              {/* Support Routes */}
              <Route path="/help" element={<HelpPage />} />
              <Route path="/faqs" element={<FAQsPage />} />
              <Route path="/support" element={<SupportPage />} />
              
              {/* Legal Routes */}
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="/data-protection" element={<DataProtectionPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} />
              <Route path="/admin/users/:id" element={<ProtectedRoute><UserDetailPage /></ProtectedRoute>} />
              <Route path="/admin/agents" element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </NavigationResizeObserverHandler>
    </ResizeObserverErrorBoundary>
  );
}

export default App; // Test hot reloading
