// src/components/Button/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  ...props
}) => {
  const baseStyles = 'font-bold py-2 px-4 rounded';
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-500 hover:bg-gray-700 text-white',
    danger: 'bg-red-500 hover:bg-red-700 text-white',
  };
  const sizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  };

  const allClassNames = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button className={allClassNames} {...props}>
      {children}
    </button>
  );
};

export default Button;
