import React from 'react';
import { cn } from '@/lib/utils';

const ResponsiveContainer = ({ 
  children, 
  className, 
  padding = 'default',
  maxWidth = 'default',
  ...props 
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-2 sm:p-4',
    default: 'p-3 sm:p-4 md:p-6',
    lg: 'p-4 sm:p-6 md:p-8',
    xl: 'p-6 sm:p-8 md:p-10',
  };

  const maxWidthClasses = {
    none: '',
    sm: 'max-w-sm',
    default: 'max-w-7xl',
    lg: 'max-w-8xl',
    xl: 'max-w-none',
  };

  return (
    <div
      className={cn(
        'mx-auto w-full',
        paddingClasses[padding],
        maxWidthClasses[maxWidth],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;
