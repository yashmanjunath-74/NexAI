import React from 'react';
import { ScannedAnswerBooklet } from '../../../types';
import {
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Cpu
} from 'lucide-react';

interface MarksTallySummaryBarProps {
  script: ScannedAnswerBooklet;
  onExit: () => void;
  onSubmitValuation: () => void;
}

export const MarksTallySummaryBar: React.FC<MarksTallySummaryBarProps> = ({
  script,
  onExit,
  onSubmitValuation,
}) => {
  const totalAwarded = script.questions.reduce((sum, q) => sum + (q.evaluatorScore || 0), 0);
  const totalMarkedQuestions = script.questions.filter(q => q.evaluatorScore !== null).length;
  const totalQuestions = script.questions.length;
  const isFullyMarked = totalMarkedQuestions === totalQuestions && totalQuestions > 0;

  // Calculate deviation from AI
  const deviation = Math.abs(totalAwarded - script.aiTotalScore);
  const deviationPercent = script.aiTotalScore > 0 ? (deviation / script.aiTotalScore) * 100 : 0;
  const hasHighDeviation = deviationPercent > 15;

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      border: '1.5px solid var(--color-border)',
      padding: '16px 24px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '16px',
    }}>
      {/* Left: Back & Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onExit}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-text-secondary)',
            fontWeight: 600,
            fontSize: '0.82rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <ArrowLeft size={16} /> Save & Return
        </button>

        <div style={{ height: '24px', width: '1px', background: '#cbd5e1' }} />

        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Marking Progress:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <strong style={{ fontSize: '0.9rem', color: isFullyMarked ? '#16a34a' : '#d97706' }}>
              {totalMarkedQuestions} of {totalQuestions} Questions Marked
            </strong>
            {isFullyMarked && <CheckCircle2 size={15} color="#16a34a" />}
          </div>
        </div>
      </div>

      {/* Center: Live Total Marks & AI Comparison */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>AI Suggested Aggregate</span>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#7c3aed', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
            <Cpu size={14} /> {script.aiTotalScore} / {script.maxMarks} M
          </div>
        </div>

        <div style={{ textAlign: 'right', background: '#f8fafc', padding: '6px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 700 }}>EVALUATOR TOTAL SCORE</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#16a34a' }}>
            {totalAwarded} <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>/ {script.maxMarks} Marks</span>
          </div>
        </div>

        {hasHighDeviation && (
          <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', padding: '6px 10px', borderRadius: '6px', fontSize: '0.72rem', color: '#e11d48', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <AlertTriangle size={14} /> &gt;15% AI Deviation Flagged
          </div>
        )}
      </div>

      {/* Right: Submit & Seal Action */}
      <div>
        <button
          onClick={onSubmitValuation}
          disabled={!isFullyMarked}
          style={{
            padding: '10px 24px',
            background: isFullyMarked ? 'linear-gradient(135deg, #48977f 0%, #2f6852 100%)' : '#cbd5e1',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: isFullyMarked ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: isFullyMarked ? '0 4px 14px rgba(72,151,127,0.35)' : 'none',
          }}
        >
          <ShieldCheck size={16} /> Submit & Seal Digital Valuation <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
