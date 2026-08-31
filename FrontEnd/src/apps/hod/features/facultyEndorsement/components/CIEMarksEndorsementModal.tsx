import React, { useState } from 'react';
import { CIEMarksSheet } from '../../../types';
import { X, FileCheck, Check } from 'lucide-react';

interface CIEMarksEndorsementModalProps {
  sheet: CIEMarksSheet;
  onEndorseSuccess: (subjectCode: string) => void;
  onClose: () => void;
}

export const CIEMarksEndorsementModal: React.FC<CIEMarksEndorsementModalProps> = ({
  sheet,
  onEndorseSuccess,
  onClose,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEndorse = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onEndorseSuccess(sheet.subjectCode);
      setIsProcessing(false);
      onClose();
    }, 1200);
  };

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
        maxWidth: '640px',
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
          padding: '22px 30px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: 'rgba(72, 151, 127, 0.25)',
                border: '1.5px solid rgba(72, 151, 127, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#48977f'
              }}>
                <FileCheck size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Continuous Internal Evaluation (CIE)
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', fontWeight: 800 }}>
                  Endorse & Freeze Internal Marks
                </h3>
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

        {/* Body */}
        <div style={{ padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ background: '#f8fafc', padding: '16px 18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                {sheet.subjectCode} — {sheet.subjectTitle}
              </span>
              <span style={{ fontWeight: 700, color: '#16a34a', fontSize: '0.85rem' }}>
                Class Avg: {sheet.averageScore} / {sheet.maxMarks}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
              Faculty in Charge: <strong>{sheet.facultyInCharge}</strong> • {sheet.semester} ({sheet.totalStudents} Students Enrolled)
            </p>
          </div>

          {/* Grade Distribution */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              Internal Marks Distribution (Out of {sheet.maxMarks}):
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 12px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 700, display: 'block' }}>40 - 50 Marks</span>
                <strong style={{ fontSize: '1.1rem', color: '#15803d' }}>65 Students</strong>
              </div>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px 12px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#1e40af', fontWeight: 700, display: 'block' }}>30 - 39 Marks</span>
                <strong style={{ fontSize: '1.1rem', color: '#1d4ed8' }}>42 Students</strong>
              </div>
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '10px 12px', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#92400e', fontWeight: 700, display: 'block' }}>&lt; 30 Marks</span>
                <strong style={{ fontSize: '1.1rem', color: '#b45309' }}>8 Students</strong>
              </div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#475569', lineHeight: 1.5 }}>
            🔒 <strong>Permanent Record Freeze:</strong> Endorsing this sheet officially freezes the Continuous Internal Evaluation (CIE) marks and transmits an immutable cryptographic ledger record to the Controller of Examinations (CoE) database for final SGPA / CGPA computation.
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 30px', background: '#f8fafc', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{ padding: '8px 18px', background: 'white', border: '1.5px solid var(--color-border)', borderRadius: '8px', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            Cancel
          </button>

          <button
            onClick={handleEndorse}
            disabled={isProcessing}
            style={{
              padding: '10px 22px',
              background: 'linear-gradient(135deg, #48977f 0%, #2f6852 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: isProcessing ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(72,151,127,0.3)',
            }}
          >
            {isProcessing ? 'Transmitting Endorsement...' : <><Check size={16} /> Endorse & Freeze CIE Marks ✓</>}
          </button>
        </div>
      </div>
    </div>
  );
};
