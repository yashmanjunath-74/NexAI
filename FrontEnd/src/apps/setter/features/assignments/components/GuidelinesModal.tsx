import React from 'react';
import { X, BookOpen, ShieldAlert } from 'lucide-react';
import { SetterAssignment } from '../../../types';

interface GuidelinesModalProps {
  assignment: SetterAssignment;
  onClose: () => void;
}

export const GuidelinesModal: React.FC<GuidelinesModalProps> = ({ assignment, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          padding: '24px 30px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'rgba(72, 151, 127, 0.25)',
                border: '1.5px solid rgba(72, 151, 127, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#48977f'
              }}>
                <BookOpen size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#48977f', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Official CoE Examination Directives
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.25rem', fontWeight: 800 }}>
                  Question Paper Setter Guidelines & Blueprint
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  {assignment.subjectCode} — {assignment.subjectTitle}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#cbd5e1',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Summary Box */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', background: '#f8fafc', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Sets Required</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary)' }}>{assignment.setsRequired} Parallel Sets</div>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Max Marks / Time</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{assignment.maxMarks}M / 3 Hours</div>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Remuneration</span>
              <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#16a34a' }}>{assignment.honorariumAmount}</div>
            </div>
          </div>

          {/* Core Rules */}
          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              1. Bloom's Taxonomy Distribution Target
            </h4>
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#334155', lineHeight: 1.6 }}>
              • <strong>Remember & Understand (20 - 25%)</strong>: Basic definitions, core conceptual bounds, and foundational algorithms.<br />
              • <strong>Apply & Analyze (50 - 55%)</strong>: Trace problems, algorithm design, derivation proofs, and code synthesis.<br />
              • <strong>Evaluate & Create (20 - 25%)</strong>: Real-world design scenarios, comparative evaluation, and architectural solutions.
            </div>
          </div>

          {/* Syllabus Unit Weightages */}
          <div>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              2. Syllabus Unit Mapping Blueprint
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {assignment.syllabusModules.map(mod => (
                <div key={mod.moduleNumber} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
                  <div>
                    <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>Unit {mod.moduleNumber}: </span>
                    <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{mod.title}</span>
                    <p style={{ margin: '2px 0 0 0', fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{mod.description}</p>
                  </div>
                  <span style={{ background: '#48977f15', color: '#48977f', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                    {mod.targetWeightagePercent}% Target
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Confidentiality Oath */}
          <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '12px', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <ShieldAlert size={20} color="#b45309" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h5 style={{ margin: '0 0 4px 0', fontSize: '0.82rem', fontWeight: 800, color: '#92400e' }}>
                Zero-Trust Confidentiality Protocol
              </h5>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#78350f', lineHeight: 1.5 }}>
                Questions must be authored exclusively inside this tamper-evident workspace. All question papers are locally signed and client-side encrypted before vaulting into IPFS. No copies must be stored on external devices.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 30px', background: '#f8fafc', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 22px',
              background: 'linear-gradient(135deg, #48977f 0%, #2f6852 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            I Acknowledge Guidelines ✓
          </button>
        </div>
      </div>
    </div>
  );
};
