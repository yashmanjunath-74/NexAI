import React from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';

export interface SidebarItem {
  id: string;
  label: string;
  path?: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
  activeItemId?: string;
  onItemClick?: (id: string) => void;
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ items, title = "NexAI", activeItemId, onItemClick, userName, userRole, onLogout }) => {
  const getInitials = (name: string) => name.substring(0, 2).toUpperCase();
  return (
    <aside style={{
      width: '260px',
      height: '100vh',
      background: 'linear-gradient(180deg, var(--color-primary) 0%, var(--color-bg-base) 100%)',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '32px 0',
      zIndex: 10,
      borderTopRightRadius: '32px',
      borderBottomRightRadius: '32px',
      overflow: 'hidden'
    }}>
      {/* Rich Decorative Vector Background */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}>
        <svg viewBox="0 0 260 900" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="sideGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <linearGradient id="sideGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <pattern id="sideHex" x="0" y="0" width="26" height="30" patternUnits="userSpaceOnUse">
              <polygon points="13,1 25,7 25,20 13,26 1,20 1,7" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Hex-grid background */}
          <rect width="260" height="900" fill="url(#sideHex)" />

          {/* Flowing curve - top section */}
          <path d="M-10,0 C80,80 180,40 270,160 L270,0 Z" fill="url(#sideGrad1)" />

          {/* Flowing curve - bottom section */}
          <path d="M-10,700 C100,750 160,640 270,750 L270,900 L-10,900 Z" fill="url(#sideGrad2)" />

          {/* Concentric ring stack - upper area */}
          <circle cx="230" cy="120" r="90"  fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1.2" />
          <circle cx="230" cy="120" r="65"  fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          <circle cx="230" cy="120" r="40"  fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" />
          <circle cx="230" cy="120" r="18"  fill="rgba(255,255,255,0.06)" />

          {/* Concentric ring stack - lower area */}
          <circle cx="30" cy="780" r="110" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <circle cx="30" cy="780" r="75"  fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />
          <circle cx="30" cy="780" r="44"  fill="rgba(255,255,255,0.04)" />

          {/* Circuit-style horizontal connector lines - mid area */}
          <line x1="20"  y1="440" x2="80"  y2="440" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="80"  y1="440" x2="80"  y2="470" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <line x1="80"  y1="470" x2="160" y2="470" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          <circle cx="20"  cy="440" r="3"  fill="rgba(255,255,255,0.15)" />
          <circle cx="80"  cy="440" r="3"  fill="rgba(255,255,255,0.12)" />
          <circle cx="160" cy="470" r="3"  fill="rgba(255,255,255,0.15)" />

          <line x1="100" y1="530" x2="180" y2="530" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <line x1="180" y1="530" x2="180" y2="550" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <line x1="100" y1="530" x2="100" y2="555" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <circle cx="100" cy="530" r="2.5" fill="rgba(255,255,255,0.12)" />
          <circle cx="180" cy="550" r="2.5" fill="rgba(255,255,255,0.12)" />

          {/* Floating diamond shapes */}
          <rect x="40"  y="200" width="12" height="12" fill="rgba(255,255,255,0.08)" transform="rotate(45 46 206)" />
          <rect x="190" y="340" width="10" height="10" fill="rgba(255,255,255,0.07)" transform="rotate(45 195 345)" />
          <rect x="60"  y="620" width="8"  height="8"  fill="rgba(255,255,255,0.06)" transform="rotate(45 64 624)" />

          {/* Wave arcs - decorative sweeps */}
          <path d="M -10,300 Q 90,250 190,320 Q 250,350 280,300" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.2" />
          <path d="M -10,315 Q 90,265 190,335 Q 250,365 280,315" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.8" />

          {/* Star dots scattered */}
          <circle cx="55"  cy="160" r="1.8" fill="rgba(255,255,255,0.2)" />
          <circle cx="130" cy="90"  r="1.4" fill="rgba(255,255,255,0.18)" />
          <circle cx="200" cy="250" r="1.6" fill="rgba(255,255,255,0.15)" />
          <circle cx="30"  cy="500" r="1.5" fill="rgba(255,255,255,0.15)" />
          <circle cx="220" cy="650" r="1.8" fill="rgba(255,255,255,0.18)" />
          <circle cx="100" cy="820" r="1.4" fill="rgba(255,255,255,0.15)" />
        </svg>
      </div>

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: userName ? '24px' : '48px',
        color: 'white',
        position: 'relative',
        zIndex: 1,
        padding: '0 32px'
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" width="180px" height="auto">
          <defs>
            <linearGradient id="nexGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>
          <path d="M 20 75 L 20 25 L 45 65 L 45 25" fill="none" stroke="url(#nexGradient)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="55" cy="25" r="8" fill="#06B6D4" />
          <text x="85" y="65" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" fontSize="42" fontWeight="800" fill="white" letterSpacing="-1">Nex<tspan fill="#4F46E5">AI</tspan></text>
        </svg>
      </div>



      {/* Navigation (Horizontal Text) */}
      <nav style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        flex: 1
      }}>
        {items.map((item) => {
          const isActive = activeItemId ? activeItemId === item.id : false; // We will handle route active states later if needed

          const content = (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 32px',
              color: 'var(--color-text-inverse)',
              transition: 'all var(--transition-fast)',
              position: 'relative',
              opacity: isActive ? 1 : 0.6,
              cursor: 'pointer',
              background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
              borderRight: isActive ? '4px solid white' : '4px solid transparent'
            }}
            onClick={() => onItemClick && onItemClick(item.id)}
            >
              {item.icon && <span style={{ marginRight: '16px', fontSize: '1.2rem' }}>{item.icon}</span>}
              <span style={{
                fontSize: '1rem',
                fontWeight: isActive ? 600 : 400,
                letterSpacing: '0.5px'
              }}>
                {item.label}
              </span>
            </div>
          );

          return item.path ? (
            <NavLink
              key={item.id}
              to={item.path}
              style={{ textDecoration: 'none' }}
              onClick={(e) => {
                if (onItemClick) {
                  e.preventDefault();
                  onItemClick(item.id);
                }
              }}
            >
              {content}
            </NavLink>
          ) : (
            <div key={item.id}>{content}</div>
          );
        })}
      </nav>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', padding: '0 32px 32px 32px' }}>
        {userName && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: 'white',
          }}>
            <Avatar initials={getInitials(userName)} size={36} bgColor="rgba(255,255,255,0.2)" color="white" />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{userName}</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{userRole}</span>
            </div>
          </div>
        )}

        {onLogout && (
          <button 
            onClick={onLogout}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              cursor: 'pointer',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              width: '100%',
              transition: 'all 0.2s ease'
            }}
          >
            Log out
          </button>
        )}
      </div>
      </div>
    </aside>
  );
};
