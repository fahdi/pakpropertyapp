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
  const baseClasses = 'bg-white rounded-2xl shadow-lg transition-all duration-300';
  
  const variants = {
    default: 'border border-gray-100',
    elevated: 'shadow-xl hover:shadow-2xl',
    outlined: 'border-2 border-gray-200',
    glass: 'bg-white/10 backdrop-blur-sm border border-white/20',
    dark: 'bg-gray-800 text-white border border-gray-700'
  };
  
  const hoverClasses = hover ? 'hover:shadow-xl hover:-translate-y-1' : '';

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
  <div className={`p-6 border-b border-gray-100 ${className}`} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl ${className}`} {...props}>
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