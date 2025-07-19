import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  variant = 'default',
  className = '',
  hover = true,
  onClick,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-2xl shadow-soft transition-all duration-300';
  
  const variants = {
    default: 'border border-neutral-200',
    elevated: 'shadow-medium hover:shadow-strong',
    outlined: 'border-2 border-neutral-300',
    glass: 'bg-white/10 backdrop-blur-sm border border-white/20',
    dark: 'bg-neutral-800 text-white border border-neutral-700',
    primary: 'border border-primary-200 bg-primary-50/30',
    secondary: 'border border-secondary-200 bg-secondary-50/30',
    accent: 'border border-accent-200 bg-accent-50/30',
    purple: 'border border-purple-200 bg-purple-50/30',
    teal: 'border border-teal-200 bg-teal-50/30',
    gradient: 'bg-gradient-to-br from-primary-50 to-secondary-50 border border-primary-200',
    gradientSecondary: 'bg-gradient-to-br from-secondary-50 to-accent-50 border border-secondary-200',
    gradientAccent: 'bg-gradient-to-br from-accent-50 to-warning-50 border border-accent-200',
  };
  
  const hoverClasses = hover ? 'hover:shadow-medium hover:-translate-y-1' : '';

  const Component = onClick ? motion.button : motion.div;

  return (
    <Component
      className={`${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      {...props}
    >
      {children}
    </Component>
  );
};

// Card sub-components
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`p-6 border-b border-neutral-200 ${className}`} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`p-6 border-t border-neutral-200 bg-neutral-50 rounded-b-2xl ${className}`} {...props}>
    {children}
  </div>
);

Card.Image = ({ src, alt, className = '', ...props }) => (
  <div className={`relative overflow-hidden rounded-t-2xl ${className}`} {...props}>
    <img 
      src={src} 
      alt={alt} 
      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
    />
  </div>
);

export default Card; 