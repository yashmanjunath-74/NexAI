import React from 'react';

export const FacultyVectorBackground: React.FC = () => {
  return (
    <svg
      viewBox="0 0 340 340"
      width="420"
      height="420"
      style={{
        position: 'fixed',
        bottom: '-40px',
        right: '-40px',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.85,
      }}
    >
      <defs>
        <filter id="vector-glow-faculty" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="rgba(42, 107, 89, 0.25)" />
        </filter>
      </defs>
      <g filter="url(#vector-glow-faculty)">
        <path
          d="M 170,30 L 290,100 L 290,240 L 170,310 L 50,240 L 50,100 Z"
          fill="none"
          stroke="rgba(72, 151, 127, 0.45)"
          strokeWidth="2.5"
        />
        <path
          d="M 170,60 L 260,115 L 260,225 L 170,280 L 80,225 L 80,115 Z"
          fill="none"
          stroke="rgba(42, 107, 89, 0.35)"
          strokeWidth="2"
        />
        <path
          d="M 170,90 L 230,128 L 230,212 L 170,250 L 110,212 L 110,128 Z"
          fill="none"
          stroke="rgba(72, 151, 127, 0.25)"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
};
