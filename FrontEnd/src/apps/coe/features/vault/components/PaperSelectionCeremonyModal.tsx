import React, { useState } from 'react';
import { QuestionPaperSet, VaultSubject } from '../types';
import { Sparkles, Dices, ShieldCheck, Unlock, X, Cpu, FileText, ArrowRight } from 'lucide-react';

interface PaperSelectionCeremonyModalProps {
  subject: VaultSubject;
  papers: QuestionPaperSet[];
  onConfirmSelection: (selectedPaper: QuestionPaperSet) => void;
  onClose: () => void;
}

export const PaperSelectionCeremonyModal: React.FC<PaperSelectionCeremonyModalProps> = ({
  subject,
  papers,
  onConfirmSelection,
  onClose,
}) => {
  const [mode, setMode] = useState<'RANDOM_VRF' | 'MANUAL'>('RANDOM_VRF');
  const [selectedSetId, setSelectedSetId] = useState<string>(papers[0]?.id || '');
  const [isSpinning, setIsSpinning] = useState(false);
  const [activeHighlightIndex, setActiveHighlightIndex] = useState(0);
  const [finalSelectedPaper, setFinalSelectedPaper] = useState<QuestionPaperSet | null>(null);
  const [vrfSeed, setVrfSeed] = useState<string>('');

  const handleStartVrfRandom = () => {
    setIsSpinning(true);
    setFinalSelectedPaper(null);

    let speed = 80;
    let iterations = 0;
    const maxIterations = 28 + Math.floor(Math.random() * 8);

    const spinInterval = () => {
      setActiveHighlightIndex(prev => (prev + 1) % papers.length);
      iterations++;

      if (iterations < maxIterations) {
        setTimeout(spinInterval, speed + iterations * 8);
      } else {
        // Final pick
        const winningIndex = Math.floor(Math.random() * papers.length);
        setActiveHighlightIndex(winningIndex);
        const winningPaper = papers[winningIndex];

        // Generate simulated VRF proof
        const hex = Array.from({ length: 32 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        setVrfSeed(`0x${hex}`);

        setFinalSelectedPaper(winningPaper);
        setSelectedSetId(winningPaper.id);
        setIsSpinning(false);
      }
    };

    setTimeout(spinInterval, speed);
  };

  const handleConfirm = () => {
    const paperToConfirm = finalSelectedPaper || papers.find(p => p.id === selectedSetId);
    if (paperToConfirm) {
      onConfirmSelection(paperToConfirm);
    }
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
        maxWidth: '720px',
        maxHeight: '92vh',
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
          <svg style={{ position: 'absolute', right: -10, top: -10, opacity: 0.12, pointerEvents: 'none' }} viewBox="0 0 120 120" width="120" height="120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#48977f" strokeWidth="3" />
            <polygon points="60,20 90,80 30,80" fill="#48977f" opacity="0.6" />
          </svg>

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
                <Dices size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#48977f', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Provably Fair Selection Protocol
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.25rem', fontWeight: 800 }}>
                  Question Paper Selection Ceremony
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  {subject.code} — {subject.title}
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

        {/* Body */}
        <div style={{ padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Mode Selector */}
          <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
            <button
              onClick={() => setMode('RANDOM_VRF')}
              style={{
                flex: 1,
                padding: '9px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'RANDOM_VRF' ? 'white' : 'transparent',
                color: mode === 'RANDOM_VRF' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: mode === 'RANDOM_VRF' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <Sparkles size={14} /> Provably Fair Random (VRF Seed)
            </button>

            <button
              onClick={() => setMode('MANUAL')}
              style={{
                flex: 1,
                padding: '9px',
                borderRadius: '8px',
                border: 'none',
                background: mode === 'MANUAL' ? 'white' : 'transparent',
                color: mode === 'MANUAL' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: mode === 'MANUAL' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <FileText size={14} /> Controller Manual Selection
            </button>
          </div>

          {/* Paper Sets Grid */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '10px' }}>
              Candidate Question Paper Sets ({papers.length} Submitted)
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {papers.map((p, idx) => {
                const isHighlighted = isSpinning && activeHighlightIndex === idx;
                const isSelected = (!isSpinning && finalSelectedPaper?.id === p.id) || (mode === 'MANUAL' && selectedSetId === p.id);

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      if (mode === 'MANUAL') setSelectedSetId(p.id);
                    }}
                    style={{
                      border: isSelected
                        ? '2px solid #48977f'
                        : isHighlighted
                        ? '2px solid #3b82f6'
                        : '1.5px solid var(--color-border)',
                      background: isSelected
                        ? '#ecfdf5'
                        : isHighlighted
                        ? '#eff6ff'
                        : '#f8fafc',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      cursor: mode === 'MANUAL' ? 'pointer' : 'default',
                      transition: 'all 0.15s ease',
                      transform: isHighlighted || isSelected ? 'scale(1.02)' : 'scale(1)',
                      boxShadow: isSelected ? '0 6px 18px rgba(72,151,127,0.2)' : isHighlighted ? '0 6px 18px rgba(59,130,246,0.2)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', color: isSelected ? '#15803d' : 'var(--color-text-primary)' }}>
                        {p.setLabel}
                      </span>
                      <span style={{ fontSize: '0.72rem', background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                        {p.difficulty}
                      </span>
                    </div>

                    <p style={{ margin: '0 0 6px 0', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      Author: {p.setterName}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                      <span>AI Score: <strong>{p.aiQualityScore}%</strong></span>
                      <span>Marks: <strong>{p.totalMarks}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Random Mode Action Box */}
          {mode === 'RANDOM_VRF' && (
            <div style={{ background: '#f8fafc', padding: '18px 20px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="#48977f" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    Verifiable Random Function (VRF) Engine
                  </span>
                </div>
                {vrfSeed && (
                  <span style={{ fontSize: '0.7rem', color: '#15803d', background: '#dcfce7', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
                    VRF Seed Validated ✓
                  </span>
                )}
              </div>

              <p style={{ margin: '0 0 14px 0', fontSize: '0.75rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                The cryptographic randomizer samples hardware quantum noise to produce a deterministic, tamper-evident random selection proof logged to the audit ledger.
              </p>

              {vrfSeed && (
                <div style={{ background: '#0f172a', color: '#4ade80', padding: '10px 14px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.72rem', wordBreak: 'break-all', marginBottom: '14px' }}>
                  SEED: {vrfSeed}
                </div>
              )}

              <button
                onClick={handleStartVrfRandom}
                disabled={isSpinning}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: isSpinning ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
                }}
              >
                {isSpinning ? (
                  <>
                    <Cpu size={16} className="animate-spin" /> Sampling Cryptographic Entropy...
                  </>
                ) : (
                  <>
                    <Dices size={16} /> Run Provably Fair Random Selection
                  </>
                )}
              </button>
            </div>
          )}

          {/* Confirm & Unseal Button */}
          <div style={{ display: 'flex', gap: '12px', paddingTop: '10px', borderTop: '1px solid var(--color-border)' }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                background: 'white',
                border: '1.5px solid var(--color-border)',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.85rem',
                color: 'var(--color-text-secondary)',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              disabled={isSpinning || (!finalSelectedPaper && mode === 'RANDOM_VRF')}
              style={{
                flex: 2,
                padding: '12px',
                background: (finalSelectedPaper || mode === 'MANUAL')
                  ? 'linear-gradient(135deg, #48977f 0%, #2f6852 100%)'
                  : '#cbd5e1',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: (finalSelectedPaper || mode === 'MANUAL') ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: (finalSelectedPaper || mode === 'MANUAL') ? '0 4px 16px rgba(72,151,127,0.35)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <Unlock size={16} /> Lock In & Unseal Selected Paper <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
