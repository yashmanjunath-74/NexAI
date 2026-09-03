import React, { useState } from 'react';
import { SeatedCandidate } from '../../types/allocationTypes';
import { Accessibility } from 'lucide-react';

interface BenchSeatProps {
  candidate: SeatedCandidate | null;
  seatNumber: number;
  hasAisleGap?: boolean;
}

export const BenchSeat: React.FC<BenchSeatProps> = ({
  candidate,
  seatNumber,
  hasAisleGap = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1',
        minWidth: '34px',
        maxWidth: '48px',
        borderRadius: '8px',
        background: candidate ? candidate.color : '#F1F5F9',
        border: candidate
          ? `1.5px solid ${candidate.color}`
          : '1.5px dashed #CBD5E1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: candidate ? 'pointer' : 'default',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        transform: isHovered && candidate ? 'scale(1.18) translateY(-2px)' : 'scale(1)',
        boxShadow: isHovered && candidate ? `0 6px 16px ${candidate.color}66` : 'none',
        marginRight: hasAisleGap ? '12px' : '0',
        zIndex: isHovered ? 50 : 1,
      }}
    >
      {candidate ? (
        <>
          {/* USN Initials */}
          <span style={{
            fontSize: '0.62rem',
            fontWeight: 900,
            color: 'white',
            letterSpacing: '0.5px',
            lineHeight: 1,
          }}>
            {candidate.department}
          </span>
          <span style={{
            fontSize: '0.52rem',
            fontWeight: 700,
            color: 'rgba(255,255,255,0.85)',
            marginTop: '2px',
          }}>
            {candidate.usn.slice(-3)}
          </span>

          {/* PWD icon tag if accommodated */}
          {candidate.isSpecialAccommodated && (
            <div style={{
              position: 'absolute',
              top: -3,
              right: -3,
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#047857',
              border: '1.5px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Accessibility size={8} color="white" />
            </div>
          )}
        </>
      ) : (
        <span style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 600 }}>
          {seatNumber}
        </span>
      )}

      {/* Interactive Tooltip Card */}
      {isHovered && candidate && (
        <div style={{
          position: 'absolute',
          bottom: '115%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#0F172A',
          color: 'white',
          padding: '10px 14px',
          borderRadius: '10px',
          fontSize: '0.75rem',
          whiteSpace: 'nowrap',
          zIndex: 100,
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          border: `1.5px solid ${candidate.color}`,
          pointerEvents: 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontWeight: 900, fontSize: '0.85rem', color: 'white' }}>
              {candidate.usn}
            </span>
            <span style={{
              background: candidate.color,
              color: 'white',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.65rem',
              fontWeight: 800,
            }}>
              {candidate.department}
            </span>
          </div>

          <div style={{ color: '#E2E8F0', fontWeight: 600, fontSize: '0.78rem' }}>
            {candidate.name}
          </div>

          <div style={{ color: '#94A3B8', marginTop: '4px', borderTop: '1px solid #334155', paddingTop: '4px' }}>
            Paper: <span style={{ color: candidate.color, fontWeight: 700 }}>{candidate.subjectCode}</span> • {candidate.subjectTitle}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.68rem', color: '#64748B' }}>
            <span>Bench #{candidate.benchNumber} (Desk {candidate.deskPosition})</span>
            <span>Seat #{seatNumber}</span>
          </div>

          {candidate.isSpecialAccommodated && (
            <div style={{ marginTop: '4px', color: '#34D399', fontWeight: 700, fontSize: '0.68rem' }}>
              ♿ PWD Accommodation Verified
            </div>
          )}
        </div>
      )}
    </div>
  );
};
