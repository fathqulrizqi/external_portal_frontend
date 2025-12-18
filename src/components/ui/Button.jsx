import React from 'react';

/**
 * Reusable Button component using Tailwind CSS and project color palette.
 * Props: type, className, children, onClick, size, ...rest
 * - size: 'sm' | 'md' | 'lg' (default: 'md')
 */
export function Button({
  type = 'button',
  className = '',
  children,
  onClick,
  size = 'md',
  ...rest
}) {
  let sizeClasses = '';
  switch (size) {
    case 'sm':
      sizeClasses = 'px-2 py-1 text-sm';
      break;
    case 'lg':
      sizeClasses = 'px-6 py-3 text-lg';
      break;
    default:
      sizeClasses = 'px-4 py-2';
  }
  return (
    <button
      type={type}
      className={`bg-[#007b85] text-white rounded hover:bg-[#005f66] transition ${sizeClasses} ${className}`}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
}
