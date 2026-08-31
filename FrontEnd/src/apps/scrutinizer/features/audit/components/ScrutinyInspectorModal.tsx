import React, { useState } from 'react';
import { ScriptScrutinyItem } from '../../../types';
import { X, AlertTriangle, Check, FileCheck } from 'lucide-react';

interface ScrutinyInspectorModalProps {
  script: ScriptScrutinyItem;
  onApproveCorrection: (scriptId: string, correctedScore: number, remarks: string) => void;
  onClose: () => void;
}

export const ScrutinyInspectorModal: React.FC<ScrutinyInspectorModalProps> = ({
  script,
  onApproveCorrection,
  onClose,
}) => {
  const hasMismatch = script.frontPageTotal !== script.summedQuestionMarks;
  const [correctedScore, setCorrectedScore] = useState<number>(script.summedQuestionMarks);
  const [notes, setNotes] = useState<string>(
    script.scrutinizerNotes || (hasMismatch ? `Corrected cover page totaling error from ${script.frontPageTotal} to ${script.summedQuestionMarks} Marks.` : 'All question marks and cover page totals verified accurate.')
  );

  const handleConfirm = () => {
    onApproveCorrection(script.id, correctedScore, notes);
    onClose();
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
        maxWidth: '660px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          background: hasMismatch ? 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)' : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          padding: '22px 30px',
          color: 'white',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                {hasMismatch ? <AlertTriangle size={22} /> : <FileCheck size={22} />}
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: hasMismatch ? '#fca5a5' : '#4ade80', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  {hasMismatch ? 'Totaling Discrepancy Detected' : 'Marks Verification Audit'}
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', fontWeight: 800 }}>
                  Script Scrutiny: {script.dummyBarcode}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Valuer Bio */}
          <div style={{ background: '#f8fafc', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Valued By: <strong>{script.evaluatorName}</strong></span>
              <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.78rem' }}>Course: {script.subjectCode} • {script.totalPages} Pages</span>
            </div>
          </div>

          {/* Arithmetic Comparison Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ background: '#fafbfc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>
                Front Cover Grand Total
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: hasMismatch ? '#e11d48' : '#0f172a', marginTop: '4px' }}>
                {script.frontPageTotal} Marks
              </div>
            </div>

            <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: '#166534', textTransform: 'uppercase', fontWeight: 700 }}>
                Sum of Question Scores (Q1..Q5)
              </span>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803d', marginTop: '4px' }}>
                {script.summedQuestionMarks} Marks
              </div>
            </div>
          </div>

          {/* Discrepancy Alert */}
          {hasMismatch && (
            <div style={{ background: '#fff1f2', border: '1.5px solid #fecdd3', borderRadius: '10px', padding: '14px 16px', fontSize: '0.8rem', color: '#9f1239', lineHeight: 1.5 }}>
              ⚠️ <strong>Arithmetic Discrepancy Found:</strong> {script.discrepancyDetails || `The sum of individual question marks (${script.summedQuestionMarks} Marks) differs from the cover page entered total (${script.frontPageTotal} Marks).`}
            </div>
          )}

          {/* Final Certified Marks Input */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
              Certified Final Marks (After Scrutiny Verification):
            </label>
            <input
              type="number"
              value={correctedScore}
              onChange={e => setCorrectedScore(Number(e.target.value))}
              style={{
                width: '120px',
                padding: '10px 14px',
                fontSize: '1.3rem',
                fontWeight: 900,
                color: '#16a34a',
                borderRadius: '8px',
                border: '2px solid #48977f',
                outline: 'none',
              }}
            />
          </div>

          {/* Scrutinizer Audit Remarks */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
              Scrutinizer Audit Endorsement & Correction Notes:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1.5px solid var(--color-border)',
                fontSize: '0.82rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
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
            onClick={handleConfirm}
            style={{
              padding: '10px 22px',
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(22,163,74,0.3)',
            }}
          >
            <Check size={16} /> Certify Scrutiny Score ({correctedScore} M) ✓
          </button>
        </div>
      </div>
    </div>
  );
};
