import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  /** Color stop for gradient, e.g. '#48977f' */
  accentColor?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  icon,
  accentColor = '#48977f',
  action,
}) => {
  return (
    <div style={{
      position: 'relative',
      borderRadius: '16px',
      overflow: 'hidden',
      marginBottom: '32px',
      background: `linear-gradient(135deg, ${accentColor}ee 0%, ${accentColor}88 60%, ${accentColor}44 100%)`,
      padding: '28px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: `0 8px 32px ${accentColor}44`,
    }}>
      {/* Decorative SVG Vector Art */}
      <svg
        style={{ position: 'absolute', top: 0, right: 0, height: '100%', width: '55%', pointerEvents: 'none' }}
        viewBox="0 0 400 120"
        preserveAspectRatio="xMaxYMid meet"
      >
        {/* Concentric rings */}
        <circle cx="380" cy="60" r="90"  fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
        <circle cx="380" cy="60" r="65"  fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <circle cx="380" cy="60" r="42"  fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
        <circle cx="380" cy="60" r="22"  fill="rgba(255,255,255,0.08)" />

        {/* Diagonal beam */}
        <line x1="40" y1="0"  x2="400" y2="120" stroke="rgba(255,255,255,0.06)" strokeWidth="40" />

        {/* Wave lines */}
        <path d="M 0,100 Q 100,80 200,100 Q 300,120 400,95" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <path d="M 0,108 Q 100,88 200,108 Q 300,128 400,103" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />

        {/* Floating dots */}
        <circle cx="150" cy="25" r="3" fill="rgba(255,255,255,0.2)" />
        <circle cx="220" cy="55" r="2" fill="rgba(255,255,255,0.15)" />
        <circle cx="280" cy="20" r="2.5" fill="rgba(255,255,255,0.18)" />
        <circle cx="320" cy="80" r="2" fill="rgba(255,255,255,0.15)" />

        {/* Diamond accents */}
        <rect x="110" y="70" width="8" height="8" fill="rgba(255,255,255,0.12)" transform="rotate(45 114 74)" />
        <rect x="260" y="40" width="6" height="6" fill="rgba(255,255,255,0.1)" transform="rotate(45 263 43)" />
      </svg>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Icon bubble */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <div>
          <h2 style={{ margin: 0, color: 'white', fontWeight: 700, fontSize: '1.4rem', letterSpacing: '-0.3px' }}>
            {title}
          </h2>
          <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>
            {subtitle}
          </p>
        </div>
      </div>

      {action && (
        <div style={{ position: 'relative', zIndex: 1 }}>
          {action}
        </div>
      )}
    </div>
  );
};
