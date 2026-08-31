import React from 'react';

interface AvatarProps {
  initials: string;
  size?: number;
  color?: string;
  bgColor?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  initials, 
  size = 40, 
  color = 'var(--color-primary)', 
  bgColor = 'var(--color-primary-light)' 
}) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: bgColor,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: size * 0.4,
        flexShrink: 0
      }}
    >
      {initials.toUpperCase()}
    </div>
  );
};
