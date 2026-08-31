import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'dot';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: BadgeVariant;
  style?: React.CSSProperties;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', style }) => {
  const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
    success: { backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)' },
    warning: { backgroundColor: 'var(--color-warning-light)', color: 'var(--color-warning)' },
    danger:  { backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)' },
    info:    { backgroundColor: 'var(--color-info-light)', color: 'var(--color-info)' },
    primary: { backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' },
    dot: { 
      backgroundColor: 'var(--color-accent)', 
      color: 'transparent',
      width: '10px',
      height: '10px',
      padding: 0,
      display: 'inline-block'
    },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: variant === 'dot' ? 0 : '4px 12px',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.75rem',
        fontWeight: 600,
        ...variantStyles[variant],
        ...style
      }}
    >
      {children}
    </span>
  );
};
