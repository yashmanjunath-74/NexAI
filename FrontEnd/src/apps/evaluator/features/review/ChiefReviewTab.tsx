import React from 'react';
import { ScannedAnswerBooklet } from '../../types';
import { AlertTriangle, PenTool, CheckCircle2, Cpu } from 'lucide-react';

interface ChiefReviewTabProps {
  flaggedScripts: ScannedAnswerBooklet[];
  onOpenStudio: (script: ScannedAnswerBooklet) => void;
}

export const ChiefReviewTab: React.FC<ChiefReviewTabProps> = ({
  flaggedScripts,
  onOpenStudio,
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* ── Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
        borderRadius: '16px',
        border: '1.5px solid #fecdd3',
        padding: '22px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '12px',
            background: '#e11d48',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#9f1239' }}>
              Chief Examiner Deviation Review Desk
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#be123c' }}>
              University examination guidelines require referee review when evaluator marks deviate from AI baseline or dual valuation by &gt;15%.
            </p>
          </div>
        </div>

        <span style={{ fontSize: '0.78rem', background: '#9f1239', color: 'white', padding: '4px 12px', borderRadius: '12px', fontWeight: 800 }}>
          {flaggedScripts.length} Flagged Booklets
        </span>
      </div>

      {/* ── Flagged Scripts Table ── */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1.5px solid var(--color-border)',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <strong style={{ fontSize: '0.95rem' }}>Flagged Deviation Records</strong>
        </div>

        {flaggedScripts.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
            <CheckCircle2 size={36} color="#16a34a" style={{ margin: '0 auto 8px auto' }} />
            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#166534' }}>
              Zero Variance Anomalies Detected
            </p>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem' }}>
              All evaluated answer booklets align within the accepted ±15% threshold.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead style={{ background: '#f8fafc', color: 'var(--color-text-secondary)', fontWeight: 700, borderBottom: '1px solid var(--color-border)' }}>
                <tr>
                  <th style={{ padding: '14px 20px' }}>Dummy Barcode</th>
                  <th style={{ padding: '14px 16px' }}>Subject Course</th>
                  <th style={{ padding: '14px 16px' }}>Evaluator Score</th>
                  <th style={{ padding: '14px 16px' }}>AI Baseline Score</th>
                  <th style={{ padding: '14px 16px' }}>Calculated Deviation</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Review Action</th>
                </tr>
              </thead>
              <tbody>
                {flaggedScripts.map(script => (
                  <tr key={script.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 800, fontFamily: 'monospace' }}>
                      {script.dummyBarcode}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {script.subjectCode}: {script.subjectTitle}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <strong style={{ color: '#0f172a' }}>{script.evaluatorTotalScore} / {script.maxMarks} M</strong>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ color: '#7c3aed', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Cpu size={12} /> {script.aiTotalScore} / {script.maxMarks} M
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        background: '#fff1f2',
                        color: '#e11d48',
                        border: '1px solid #fecdd3',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                      }}>
                        Δ {script.deviationPercent}% Deviation
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => onOpenStudio(script)}
                        style={{
                          padding: '6px 14px',
                          background: 'white',
                          border: '1.5px solid #e11d48',
                          color: '#e11d48',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <PenTool size={12} /> Re-inspect Booklet
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
