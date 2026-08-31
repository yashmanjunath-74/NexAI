import React from 'react';
import { Avatar } from '../ui/Avatar';

interface HeaderProps {
  userName: string;
  userRole?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ userName, userRole, onLogout }) => {
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header style={{
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '0 48px',
      marginTop: '16px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-primary)' }}>{userName}</div>
            {userRole && <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{userRole}</div>}
          </div>
          <Avatar initials={getInitials(userName)} bgColor="var(--color-primary)" color="white" />
          {onLogout && (
            <button 
              onClick={onLogout}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-accent)',
                fontSize: '0.875rem',
                marginLeft: '8px',
                fontWeight: 600
              }}
            >
              Log out
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
