import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const base =
    'inline-flex items-center justify-center px-8 py-4 rounded-full text-lg font-bold shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    primary:
      'bg-gradient-to-r from-[#fbbf24] via-[#f472b6] to-[#2563eb] text-white hover:from-[#f59e42] hover:to-[#a78bfa] focus:ring-[#fbbf24]',
    outline:
      'bg-white/20 border-2 border-white text-white hover:bg-white/40 focus:ring-[#fbbf24]',
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button; 