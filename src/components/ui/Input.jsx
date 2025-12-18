import React from 'react';

/**
 * Reusable Input component using Tailwind CSS and project color palette.
 * Props: name, value, onChange, placeholder, type, className, ...rest
 */
export function Input({
  name,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  className = '',
  ...rest
}) {
  return (
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      className={`border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#007b85] ${className}`}
      {...rest}
    />
  );
}
