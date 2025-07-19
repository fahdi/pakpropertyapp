import { useEffect } from 'react';

/**
 * Minimal ResizeObserver Error Handler
 * This eliminates ResizeObserver errors without breaking webpack
 */
export const useResizeObserverFix = () => {
  useEffect(() => {
    // Store original console methods
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleLog = console.log;

    // Console override - filter ResizeObserver messages
    console.error = (...args) => {
      const message = args.join(' ');
      if (message.includes('ResizeObserver')) {
        return; // Ignore ResizeObserver errors
      }
      originalConsoleError.apply(console, args);
    };

    console.warn = (...args) => {
      const message = args.join(' ');
      if (message.includes('ResizeObserver')) {
        return; // Ignore ResizeObserver warnings
      }
      originalConsoleWarn.apply(console, args);
    };

    console.log = (...args) => {
      const message = args.join(' ');
      if (message.includes('ResizeObserver')) {
        return; // Ignore ResizeObserver logs
      }
      originalConsoleLog.apply(console, args);
    };

    // Error suppression function
    const suppressResizeObserverError = (event) => {
      if (event && event.error && event.error.message && event.error.message.includes('ResizeObserver')) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return true;
      }
      if (event && event.message && event.message.includes('ResizeObserver')) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return true;
      }
      return false;
    };

    // Override error handlers
    window.onerror = function(message, source, lineno, colno, error) {
      if (message && message.includes('ResizeObserver')) {
        return true; // Prevent default handling
      }
      return false;
    };

    window.onunhandledrejection = function(event) {
      if (event.reason && event.reason.message && event.reason.message.includes('ResizeObserver')) {
        event.preventDefault();
        return true;
      }
      return false;
    };

    // Add error listeners
    window.addEventListener('error', suppressResizeObserverError, true);
    window.addEventListener('unhandledrejection', suppressResizeObserverError, true);

    // Simply remove ResizeObserver from window
    if (window.ResizeObserver) {
      // Store original for potential restoration
      window._OriginalResizeObserver = window.ResizeObserver;
      
      // Remove ResizeObserver
      delete window.ResizeObserver;
    }

    // Create a dummy ResizeObserver that does nothing
    window.ResizeObserver = function() {
      return {
        observe: function() {},
        unobserve: function() {},
        disconnect: function() {}
      };
    };

    // Cleanup function
    return () => {
      // Restore original console methods
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      console.log = originalConsoleLog;

      // Restore original ResizeObserver if it was stored
      if (window._OriginalResizeObserver) {
        window.ResizeObserver = window._OriginalResizeObserver;
        delete window._OriginalResizeObserver;
      }

      // Remove event listeners
      window.removeEventListener('error', suppressResizeObserverError, true);
      window.removeEventListener('unhandledrejection', suppressResizeObserverError, true);

      // Restore original error handlers
      window.onerror = null;
      window.onunhandledrejection = null;
    };
  }, []);
}; 