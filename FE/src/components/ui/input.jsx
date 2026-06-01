import React from 'react';

export default function InputFields({ type = 'text', placeholder, value, onChange, className = '', ...props }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-sm outline-none transition-all duration-300 hover:border-blue-400 hover:shadow-[0_2px_8px_rgba(57,117,230,0.1)] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 text-black placeholder:text-gray-400 ${className}`}
      {...props}
    />
  );
}