/**
 * PakProperty App - Color Theme Configuration
 * 
 * This file contains the color scheme used throughout the application.
 * The colors are designed to be warm, professional, and accessible.
 */

export const colors = {
  // Primary Colors (Royal Purple)
  primary: {
    50: '#f7f5fa',
    100: '#ede3f5',
    200: '#d6b8ea',
    300: '#b47ad6',
    400: '#8d3ebd',
    500: '#6B1E9A', // Royal purple
    600: '#58197e',
    700: '#471364',
    800: '#35104a',
    900: '#230a2f',
  },
  // Secondary Colors (Deep Indigo/Navy)
  secondary: {
    50: '#f5f6fa',
    100: '#e5e7f0',
    200: '#c3c7db',
    300: '#8e91b3',
    400: '#5a5e7a',
    500: '#2D2A4A', // Deep indigo/navy
    600: '#23203a',
    700: '#19162a',
    800: '#13101f',
    900: '#0a0710',
  },
  // Accent Colors (Gold)
  accent: {
    50: '#fffbea',
    100: '#fff3c4',
    200: '#ffe082',
    300: '#ffd54f',
    400: '#ffd700', // Gold
    500: '#FFC300',
    600: '#e6b800',
    700: '#b38f00',
    800: '#806600',
    900: '#4d3d00',
  },
  // Neutral Colors (Gray scale)
  neutral: {
    50: '#f5f5f7',
    100: '#e5e5ea',
    200: '#d1d1d6',
    300: '#a1a1aa',
    400: '#6e6e73',
    500: '#232323', // Main neutral color
    600: '#1a1a1a',
    700: '#141414',
    800: '#0f0f0f',
    900: '#050505',
  },
  // Status Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbea',
    100: '#fff3c4',
    200: '#ffe082',
    300: '#ffd54f',
    400: '#ffd700', // Gold for warning
    500: '#FFC300',
    600: '#e6b800',
    700: '#b38f00',
    800: '#806600',
    900: '#4d3d00',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
};

/**
 * Usage Examples:
 * 
 * CSS Classes:
 * - bg-primary-600 (primary background)
 * - text-primary-600 (primary text)
 * - border-primary-600 (primary border)
 * - hover:bg-primary-700 (hover state)
 * - focus:ring-primary-500 (focus ring)
 * 
 * Component Classes:
 * - btn-primary (primary button)
 * - btn-secondary (secondary button)
 * - btn-outline (outline button)
 * - card (white card with neutral borders)
 * - badge-primary (primary badge)
 * - alert-success (success alert)
 * 
 * Semantic Usage:
 * - Primary: Main brand color, CTAs, important actions
 * - Secondary: Supporting elements, links, info states
 * - Accent: Success states, positive actions, highlights
 * - Neutral: Text, backgrounds, borders, disabled states
 * - Success: Confirmations, success messages
 * - Warning: Cautions, warnings, pending states
 * - Error: Errors, destructive actions, alerts
 */

export const fontFamilies = {
  primary: ['Inter', 'sans-serif'],
  secondary: ['Poppins', 'sans-serif'],
};

export const animations = {
  fadeIn: 'fadeIn 0.5s ease-in-out',
  slideUp: 'slideUp 0.5s ease-out',
  scaleIn: 'scaleIn 0.3s ease-out',
};

export default colors;
