import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  as: Component = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-soft hover:shadow-medium',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-soft hover:shadow-medium',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 shadow-soft hover:shadow-medium',
    danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 shadow-soft hover:shadow-medium',
    warning: 'bg-warning-500 text-neutral-900 hover:bg-warning-600 focus:ring-warning-500 shadow-soft hover:shadow-medium',
    accent: 'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500 shadow-soft hover:shadow-medium',
    purple: 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 shadow-soft hover:shadow-medium',
    teal: 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500 shadow-soft hover:shadow-medium',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white focus:ring-primary-500 bg-transparent',
    outlineSecondary: 'border-2 border-secondary-600 text-secondary-600 hover:bg-secondary-600 hover:text-white focus:ring-secondary-500 bg-transparent',
    outlineAccent: 'border-2 border-accent-500 text-accent-500 hover:bg-accent-500 hover:text-white focus:ring-accent-500 bg-transparent',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500 bg-transparent',
    ghostSecondary: 'text-secondary-600 hover:bg-secondary-50 focus:ring-secondary-500 bg-transparent',
    ghostAccent: 'text-accent-500 hover:bg-accent-50 focus:ring-accent-500 bg-transparent',
    white: 'bg-white text-primary-600 hover:bg-neutral-50 focus:ring-primary-500 shadow-soft hover:shadow-medium',
    glass: 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 focus:ring-white/50',
    gradient: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 focus:ring-primary-500 shadow-soft hover:shadow-medium',
    gradientSecondary: 'bg-gradient-to-r from-secondary-600 to-secondary-700 text-white hover:from-secondary-700 hover:to-secondary-800 focus:ring-secondary-500 shadow-soft hover:shadow-medium',
    gradientAccent: 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 focus:ring-accent-500 shadow-soft hover:shadow-medium',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };
  
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };
  
  const iconSpacing = {
    sm: 'mr-2',
    md: 'mr-2',
    lg: 'mr-3',
    xl: 'mr-3'
  };
  
  const iconSpacingRight = {
    sm: 'ml-2',
    md: 'ml-2',
    lg: 'ml-3',
    xl: 'ml-3'
  };

  // Handle Link components specially
  if (Component === 'a' || Component === Link) {
    const LinkComponent = Component === 'a' ? motion.a : motion(Component);
    return (
      <LinkComponent
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
        onClick={onClick}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </>
        ) : (
          <>
            {Icon && iconPosition === 'left' && (
              <Icon className={`${iconSizes[size]} ${iconSpacing[size]}`} />
            )}
            {children}
            {Icon && iconPosition === 'right' && (
              <Icon className={`${iconSizes[size]} ${iconSpacingRight[size]}`} />
            )}
          </>
        )}
      </LinkComponent>
    );
  }

  const motionComponent = motion[Component] || motion.div;
  const MotionComponent = motionComponent;

  return (
    <MotionComponent
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      type={Component === 'button' ? type : undefined}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon className={`${iconSizes[size]} ${iconSpacing[size]}`} />
          )}
          {children}
          {Icon && iconPosition === 'right' && (
            <Icon className={`${iconSizes[size]} ${iconSpacingRight[size]}`} />
          )}
        </>
      )}
    </MotionComponent>
  );
};

export default Button; 