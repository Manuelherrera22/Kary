import React from 'react';
import { cn } from '@/lib/utils';

const ResponsiveTable = ({ children, className, ...props }) => {
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className={cn("min-w-full divide-y divide-gray-300", className)} {...props}>
            {children}
          </table>
        </div>
      </div>
    </div>
  );
};

const ResponsiveTableHeader = ({ children, className, ...props }) => {
  return (
    <thead className={cn("bg-gray-50", className)} {...props}>
      {children}
    </thead>
  );
};

const ResponsiveTableBody = ({ children, className, ...props }) => {
  return (
    <tbody className={cn("bg-white divide-y divide-gray-200", className)} {...props}>
      {children}
    </tbody>
  );
};

const ResponsiveTableRow = ({ children, className, ...props }) => {
  return (
    <tr className={cn("hover:bg-gray-50", className)} {...props}>
      {children}
    </tr>
  );
};

const ResponsiveTableCell = ({ children, className, header = false, ...props }) => {
  const Component = header ? 'th' : 'td';
  return (
    <Component
      className={cn(
        header
          ? "px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wide sm:px-6"
          : "px-3 py-4 text-sm text-gray-900 sm:px-6",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export {
  ResponsiveTable,
  ResponsiveTableHeader,
  ResponsiveTableBody,
  ResponsiveTableRow,
  ResponsiveTableCell,
};
