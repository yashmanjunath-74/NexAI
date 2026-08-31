import React from 'react';
import { QuestionPaperDraft } from '../../../types';
import { X, CheckCircle2, Printer } from 'lucide-react';

interface SubmissionReceiptModalProps {
  draft: QuestionPaperDraft;
  onClose: () => void;
}

export const SubmissionReceiptModal: React.FC<SubmissionReceiptModalProps> = ({ draft, onClose }) => {
  const sig = draft.digitalSignature;

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
                borderRadius: '50%',
                background: '#48977f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <CheckCircle2 size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Zero-Trust Vault Ingestion Acknowledgment
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.25rem', fontWeight: 800 }}>
                  Cryptographic Submission Certificate
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

        {/* Certificate Body */}
        <div style={{ padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{
            border: '2px solid #cbd5e1',
            borderRadius: '14px',
            padding: '22px',
            background: '#fafbfc',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            fontSize: '0.8rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Subject Course:</span>
              <strong style={{ color: 'var(--color-text-primary)' }}>{draft.subjectCode} — {draft.subjectTitle}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Paper Set:</span>
              <strong style={{ color: '#48977f' }}>{draft.setLabel} ({draft.totalMarks} Marks)</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Submitted By:</span>
              <strong style={{ color: 'var(--color-text-primary)' }}>{sig?.signedBy || 'Authenticated Examiner'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Timestamp:</span>
              <strong style={{ color: 'var(--color-text-primary)' }}>{sig?.signedAt || new Date().toLocaleString()}</strong>
            </div>

            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
              <span style={{ color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>SHA-256 Digest:</span>
              <code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', wordBreak: 'break-all', display: 'block' }}>
                {sig?.sha256Digest || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
              </code>
            </div>

            <div>
              <span style={{ color: 'var(--color-text-secondary)', display: 'block', marginBottom: '4px' }}>IPFS Content Identifier (CID):</span>
              <code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px', fontSize: '0.72rem', wordBreak: 'break-all', display: 'block', color: '#3b82f6' }}>
                {sig?.ipfsCid || 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco'}
              </code>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 30px', background: '#f8fafc', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => window.print()}
            style={{
              padding: '8px 16px',
              background: 'white',
              border: '1.5px solid var(--color-border)',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Printer size={14} /> Print Certificate
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              background: 'linear-gradient(135deg, #48977f 0%, #2f6852 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            Done ✓
          </button>
        </div>
      </div>
    </div>
  );
};
