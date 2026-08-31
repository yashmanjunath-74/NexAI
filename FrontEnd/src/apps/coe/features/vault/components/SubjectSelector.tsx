import React from 'react';
import { VaultSubject } from '../types';
import { ShieldCheck, Lock, Unlock, KeyRound, Calendar, Clock } from 'lucide-react';

interface SubjectSelectorProps {
  subjects: VaultSubject[];
  selectedSubjectCode: string;
  onSelectSubject: (code: string) => void;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  subjects,
  selectedSubjectCode,
  onSelectSubject,
}) => {
  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color="#48977f" />
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Select Subject Exam Vault
          </h3>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
          {subjects.length} Subjects in Active Exam Cycle
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '14px',
      }}>
        {subjects.map(sub => {
          const isSelected = sub.code === selectedSubjectCode;
          const isUnsealed = sub.vaultStatus === 'UNSEALED';
          const hasKey = sub.vaultStatus === 'KEY_GENERATED' || isUnsealed;

          const statusColor = isUnsealed ? '#48977f' : hasKey ? '#3b82f6' : '#ed7245';

          return (
            <div
              key={sub.code}
              onClick={() => onSelectSubject(sub.code)}
              style={{
                background: isSelected ? 'white' : '#ffffffcc',
                border: isSelected ? `2px solid ${statusColor}` : '1.5px solid var(--color-border)',
                borderLeft: `5px solid ${statusColor}`,
                borderRadius: '14px',
                padding: '16px 18px',
                cursor: 'pointer',
                boxShadow: isSelected ? `0 6px 20px ${statusColor}22` : '0 2px 8px rgba(0,0,0,0.03)',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  (e.currentTarget as HTMLDivElement).style.borderColor = `${statusColor}66`;
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                }
              }}
            >
              {/* Background watermark */}
              <svg style={{ position: 'absolute', right: -8, bottom: -8, opacity: 0.06, pointerEvents: 'none' }} viewBox="0 0 60 60" width="60" height="60">
                <circle cx="50" cy="50" r="38" fill={statusColor} />
              </svg>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', position: 'relative', zIndex: 1 }}>
                <span style={{
                  background: `${statusColor}15`,
                  color: statusColor,
                  border: `1px solid ${statusColor}33`,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  letterSpacing: '0.5px'
                }}>
                  {sub.code}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: 600, color: statusColor }}>
                  {isUnsealed ? (
                    <>
                      <Unlock size={12} /> Unsealed & Active
                    </>
                  ) : hasKey ? (
                    <>
                      <KeyRound size={12} /> Key Secured
                    </>
                  ) : (
                    <>
                      <Lock size={12} /> Vault Locked
                    </>
                  )}
                </div>
              </div>

              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.3, position: 'relative', zIndex: 1 }}>
                {sub.title}
              </h4>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '10px', position: 'relative', zIndex: 1 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={11} /> {sub.examDate}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={11} /> {sub.examSlot.split(' - ')[0]}
                </span>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '8px',
                borderTop: '1px dashed var(--color-border)',
                fontSize: '0.75rem',
                position: 'relative',
                zIndex: 1
              }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Sets Submitted:</span>
                <span style={{ fontWeight: 700, color: sub.setsAvailable >= sub.requiredSets ? '#48977f' : '#ed7245' }}>
                  {sub.setsAvailable} / {sub.requiredSets} Sets Ready
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
