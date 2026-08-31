import React, { useState } from 'react';
import { ScrutinyBundle } from '../../../types';
import { X, Layers, QrCode } from 'lucide-react';

interface BundleIntakeModalProps {
  onIntakeSuccess: (newBundle: ScrutinyBundle) => void;
  onClose: () => void;
}

export const BundleIntakeModal: React.FC<BundleIntakeModalProps> = ({
  onIntakeSuccess,
  onClose,
}) => {
  const [subjectCode, setSubjectCode] = useState('CS302');
  const [subjectTitle, setSubjectTitle] = useState('Database Management Systems');
  const [semester, setSemester] = useState('5th Semester B.Tech');
  const [examDate] = useState('2026-08-28');
  const [totalScripts, setTotalScripts] = useState(40);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmIntake = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const bundleCode = `BUNDLE-${subjectCode}-0${Math.floor(1 + Math.random() * 9)}`;
      const newBundle: ScrutinyBundle = {
        id: `BUN_${Date.now()}`,
        bundleCode,
        subjectCode,
        subjectTitle,
        semester,
        examSession: 'Fall End-Semester 2026',
        examDate,
        totalScripts,
        completedScripts: 0,
        valuationDeadline: '2026-09-10',
        status: 'UNASSIGNED',
        scrutinyStatus: 'PENDING',
        auditedScriptsCount: 0,
        scripts: [],
      };

      onIntakeSuccess(newBundle);
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
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                <Layers size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Examination Center Handover
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', fontWeight: 800 }}>
                  Ingest New Answer Script Bundle
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                Course Code:
              </label>
              <input
                type="text"
                value={subjectCode}
                onChange={e => setSubjectCode(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid var(--color-border)', fontSize: '0.85rem', boxSizing: 'border-box', fontWeight: 700 }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                Subject Course Title:
              </label>
              <input
                type="text"
                value={subjectTitle}
                onChange={e => setSubjectTitle(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid var(--color-border)', fontSize: '0.85rem', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                Semester / Cohort:
              </label>
              <select
                value={semester}
                onChange={e => setSemester(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid var(--color-border)', fontSize: '0.85rem', fontWeight: 600 }}
              >
                <option value="3rd Semester B.Tech">3rd Semester B.Tech</option>
                <option value="5th Semester B.Tech">5th Semester B.Tech</option>
                <option value="7th Semester B.Tech">7th Semester B.Tech</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                Physical Booklet Count:
              </label>
              <input
                type="number"
                value={totalScripts}
                onChange={e => setTotalScripts(Number(e.target.value))}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid var(--color-border)', fontSize: '0.85rem', boxSizing: 'border-box', fontWeight: 800 }}
              />
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#475569', lineHeight: 1.5 }}>
            🛡️ <strong>Zero-Knowledge Secrecy:</strong> Ingestion automatically decouples student identity from the answer booklets by minting encrypted dummy barcodes (e.g. <code>ANON-{subjectCode}-XXXX</code>) before passing the bundle to the evaluation queue.
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
            onClick={handleConfirmIntake}
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
            {isProcessing ? 'Minting Barcodes...' : <><QrCode size={16} /> Mint Barcodes & Ingest Bundle ✓</>}
          </button>
        </div>
      </div>
    </div>
  );
};
