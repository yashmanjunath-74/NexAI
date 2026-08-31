import React from 'react';

type ButtonVariant = 'primary' | 'outline' | 'outline-inverse' | 'ghost' | 'danger' | 'accent' | 'fab';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  icon,
  style,
  ...props 
}) => {
  const isFab = variant === 'fab';

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: isFab ? '50%' : 'var(--radius-full)', // Pill shape by default
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    border: '1px solid transparent',
    fontFamily: 'var(--font-sans)',
  };

  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-text-inverse)',
      boxShadow: 'var(--shadow-sm)',
    },
    accent: {
      backgroundColor: 'var(--color-accent)',
      color: 'var(--color-text-inverse)',
      boxShadow: 'var(--shadow-sm)',
    },
    fab: {
      backgroundColor: 'var(--color-accent)',
      color: 'var(--color-text-inverse)',
      boxShadow: 'var(--shadow-md)',
      padding: 0, // FAB handles its own size
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: 'var(--color-primary)',
      color: 'var(--color-primary)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-text-secondary)',
    },
    'outline-inverse': {
      backgroundColor: 'rgba(255,255,255,0.2)',
      backdropFilter: 'blur(8px)',
      borderColor: 'rgba(255,255,255,0.5)',
      color: 'white',
    },
    danger: {
      backgroundColor: 'var(--color-danger-light)',
      color: 'var(--color-danger)',
    }
  };

  const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
    sm: isFab ? { width: '32px', height: '32px', fontSize: '1.25rem' } : { padding: '6px 16px', fontSize: '0.875rem' },
    md: isFab ? { width: '48px', height: '48px', fontSize: '1.5rem' } : { padding: '8px 24px', fontSize: '0.875rem' },
    lg: isFab ? { width: '64px', height: '64px', fontSize: '2rem' } : { padding: '12px 32px', fontSize: '1rem' },
  };

  return (
    <button 
      style={{ ...baseStyle, ...variantStyles[variant], ...sizeStyles[size], ...style }} 
      onMouseOver={(e) => {
        if (!props.disabled) {
          if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
          if (variant === 'outline') e.currentTarget.style.backgroundColor = 'var(--color-bg-base)';
          if (variant === 'outline-inverse') e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)';
          if (variant === 'ghost') e.currentTarget.style.color = 'var(--color-primary)';
          if (variant === 'accent' || variant === 'fab') e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)';
        }
      }}
      onMouseOut={(e) => {
        if (variant === 'primary') e.currentTarget.style.backgroundColor = 'var(--color-primary)';
        if (variant === 'outline') e.currentTarget.style.backgroundColor = 'transparent';
        if (variant === 'ghost') e.currentTarget.style.color = 'var(--color-text-secondary)';
        if (variant === 'accent' || variant === 'fab') e.currentTarget.style.backgroundColor = 'var(--color-accent)';
      }}
      {...props}
    >
      {icon && <span style={{ display: 'flex' }}>{icon}</span>}
      {children}
    </button>
  );
};
