// src/components/Card/Card.tsx
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  // Add any specific card props here
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
  const allClassNames = `bg-white shadow-md rounded-lg p-4 ${className}`;
  return (
    <div className={allClassNames} {...props}>
      {children}
    </div>
  );
};

export default Card;
