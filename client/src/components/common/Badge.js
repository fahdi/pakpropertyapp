import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-all duration-200';
  
  const variants = {
    default: 'bg-neutral-100 text-neutral-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    accent: 'bg-accent-100 text-accent-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    danger: 'bg-error-100 text-error-800',
    info: 'bg-teal-100 text-teal-800',
    purple: 'bg-purple-100 text-purple-800',
    teal: 'bg-teal-100 text-teal-800',
    rose: 'bg-rose-100 text-rose-800',
    featured: 'bg-accent-400 text-white shadow-soft',
    verified: 'bg-success-500 text-white shadow-soft',
    premium: 'bg-gradient-to-r from-accent-400 to-accent-500 text-white shadow-soft',
    new: 'bg-gradient-to-r from-primary-400 to-primary-500 text-white shadow-soft',
    hot: 'bg-gradient-to-r from-rose-400 to-rose-500 text-white shadow-soft',
    glass: 'bg-white/20 backdrop-blur-sm border border-white/30 text-white',
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };
  
  const iconSpacing = {
    sm: 'mr-1',
    md: 'mr-1',
    lg: 'mr-2'
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {Icon && (
        <Icon className={`${iconSizes[size]} ${iconSpacing[size]}`} />
      )}
      {children}
    </span>
  );
};

export default Badge; 