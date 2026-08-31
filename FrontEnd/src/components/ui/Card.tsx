import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  noPadding?: boolean;
  variant?: 'default' | 'elevated' | 'flat';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  noPadding = false, 
  variant = 'default',
  ...props 
}) => {
  const variantStyles = {
    default: {
      backgroundColor: 'var(--color-bg-surface)',
      border: '1px solid var(--color-border)',
      boxShadow: 'none'
    },
    elevated: {
      backgroundColor: 'var(--color-bg-surface)',
      border: 'none',
      boxShadow: 'var(--shadow-md)'
    },
    flat: {
      backgroundColor: 'var(--color-bg-card)',
      border: 'none',
      boxShadow: 'none'
    }
  };

  return (
    <div 
      style={{
        borderRadius: 'var(--radius-lg)',
        padding: noPadding ? '0' : '24px',
        ...variantStyles[variant],
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};
