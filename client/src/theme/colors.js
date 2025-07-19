/**
 * PakProperty App - Enhanced Color Theme Configuration
 * 
 * This file contains the improved color scheme used throughout the application.
 * The colors are designed to be modern, vibrant, professional, and accessible.
 */

export const colors = {
  // Primary Colors (Modern Blue)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3B82F6', // Modern blue
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  // Secondary Colors (Emerald Green)
  secondary: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10B981', // Emerald green
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  // Accent Colors (Warm Orange)
  accent: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#F97316', // Warm orange
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  // Neutral Colors (Modern Gray scale)
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
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
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#F59E0B', // Amber
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
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
  // Additional Colors
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  },
  teal: {
    50: '#f0fdfa',
    100: '#ccfbf1',
    200: '#99f6e4',
    300: '#5eead4',
    400: '#2dd4bf',
    500: '#14b8a6',
    600: '#0d9488',
    700: '#0f766e',
    800: '#115e59',
    900: '#134e4a',
  },
  rose: {
    50: '#fff1f2',
    100: '#ffe4e6',
    200: '#fecdd3',
    300: '#fda4af',
    400: '#fb7185',
    500: '#f43f5e',
    600: '#e11d48',
    700: '#be123c',
    800: '#9f1239',
    900: '#881337',
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
