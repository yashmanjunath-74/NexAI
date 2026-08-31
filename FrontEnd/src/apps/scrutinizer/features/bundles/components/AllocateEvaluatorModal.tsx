import React, { useState } from 'react';
import { ScrutinyBundle, EvaluatorProfile } from '../../../types';
import { X, UserCheck } from 'lucide-react';

interface AllocateEvaluatorModalProps {
  bundle: ScrutinyBundle;
  evaluators: EvaluatorProfile[];
  onAllocateSuccess: (bundleId: string, evaluatorId: string, evaluatorName: string, deadline: string) => void;
  onClose: () => void;
}

export const AllocateEvaluatorModal: React.FC<AllocateEvaluatorModalProps> = ({
  bundle,
  evaluators,
  onAllocateSuccess,
  onClose,
}) => {
  const [selectedEvaluatorId, setSelectedEvaluatorId] = useState<string>(evaluators[0]?.id || '');
  const [deadline, setDeadline] = useState<string>('2026-09-05');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedEval = evaluators.find(e => e.id === selectedEvaluatorId);

  const handleConfirmAllocation = () => {
    if (!selectedEval) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onAllocateSuccess(bundle.id, selectedEval.id, selectedEval.name, deadline);
      setIsSubmitting(false);
      onClose();
    }, 1000);
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
                background: 'rgba(59, 130, 246, 0.25)',
                border: '1.5px solid rgba(59, 130, 246, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6'
              }}>
                <UserCheck size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#60a5fa', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Valuation Custodian Dispatch
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', fontWeight: 800 }}>
                  Allocate Bundle: {bundle.bundleCode}
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
          {/* Bundle Summary */}
          <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                {bundle.subjectCode} — {bundle.subjectTitle}
              </strong>
              <span style={{ fontWeight: 800, color: '#3b82f6', fontSize: '0.85rem' }}>
                {bundle.totalScripts} Answer Booklets
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              {bundle.semester} • Exam Date: {bundle.examDate}
            </p>
          </div>

          {/* Select Evaluator Dropdown */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
              Select Appointed Department Evaluator:
            </label>
            <select
              value={selectedEvaluatorId}
              onChange={e => setSelectedEvaluatorId(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1.5px solid var(--color-border)',
                fontSize: '0.85rem',
                fontWeight: 600,
                fontFamily: 'inherit',
              }}
            >
              {evaluators.map(evaluator => (
                <option key={evaluator.id} value={evaluator.id}>
                  {evaluator.name} ({evaluator.designation}) — {evaluator.assignedBundlesCount}/{evaluator.maxBundleQuota} Bundles Assigned
                </option>
              ))}
            </select>
          </div>

          {/* Evaluator Lab & Profile Details */}
          {selectedEval && (
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '12px 16px', fontSize: '0.78rem', color: '#1e40af' }}>
              <div><strong>Valuation Station:</strong> {selectedEval.valuationCenterLab}</div>
              <div style={{ marginTop: '2px' }}><strong>Faculty Email:</strong> {selectedEval.email} ({selectedEval.experienceYears} Years Exp)</div>
            </div>
          )}

          {/* Valuation Deadline */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
              Target Valuation Completion Deadline:
            </label>
            <input
              type="date"
              value={deadline}
              onChange={e => setDeadline(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1.5px solid var(--color-border)',
                fontSize: '0.85rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ background: '#f0fdf4', padding: '12px 14px', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.75rem', color: '#166534' }}>
            ✓ Allocating this bundle immediately routes the <strong>{bundle.totalScripts} double-blind anonymized scripts</strong> to the valuer's On-Screen Marking Studio.
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
            onClick={handleConfirmAllocation}
            disabled={isSubmitting}
            style={{
              padding: '10px 22px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: isSubmitting ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
            }}
          >
            {isSubmitting ? 'Allocating Bundle...' : <><UserCheck size={16} /> Confirm & Dispatch Bundle ✓</>}
          </button>
        </div>
      </div>
    </div>
  );
};
