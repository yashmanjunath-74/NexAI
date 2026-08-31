import React, { useState } from 'react';
import { QuestionMarkingItem } from '../../../types';
import {
  Sparkles,
  BookOpen,
  Check,
  ChevronRight,
  Cpu
} from 'lucide-react';
import { ModelAnswerSchemeModal } from './ModelAnswerSchemeModal';

interface QuestionScoringPanelProps {
  questions: QuestionMarkingItem[];
  activeQuestionIndex: number;
  onSelectQuestion: (index: number) => void;
  onUpdateQuestionScore: (questionId: string, score: number, notes?: string) => void;
}

export const QuestionScoringPanel: React.FC<QuestionScoringPanelProps> = ({
  questions,
  activeQuestionIndex,
  onSelectQuestion,
  onUpdateQuestionScore,
}) => {
  const [isSchemeModalOpen, setIsSchemeModalOpen] = useState(false);
  const currentQ = questions[activeQuestionIndex];

  const [inputScore, setInputScore] = useState<string>(
    currentQ.evaluatorScore !== null ? String(currentQ.evaluatorScore) : ''
  );
  const [notes, setNotes] = useState<string>(currentQ.evaluatorNotes || '');

  // Keep local state synced when active question changes
  React.useEffect(() => {
    setInputScore(currentQ.evaluatorScore !== null ? String(currentQ.evaluatorScore) : '');
    setNotes(currentQ.evaluatorNotes || '');
  }, [currentQ]);

  const handleSaveScore = (scoreVal: number) => {
    if (scoreVal < 0 || scoreVal > currentQ.maxMarks) return;
    onUpdateQuestionScore(currentQ.id, scoreVal, notes);
  };

  const handleQuickAdd = (increment: number) => {
    const current = Number(inputScore) || 0;
    const newScore = Math.min(currentQ.maxMarks, current + increment);
    setInputScore(String(newScore));
    handleSaveScore(newScore);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'white',
      borderRadius: '16px',
      border: '1.5px solid var(--color-border)',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
    }}>
      {/* ── Top Question Number Strip ── */}
      <div style={{
        background: '#f8fafc',
        padding: '12px 18px',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
      }}>
        {questions.map((q, idx) => {
          const isSelected = idx === activeQuestionIndex;
          const isMarked = q.evaluatorScore !== null;

          return (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(idx)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: isSelected ? '2px solid #48977f' : '1px solid var(--color-border)',
                background: isSelected ? '#48977f' : isMarked ? '#ecfdf5' : 'white',
                color: isSelected ? 'white' : isMarked ? '#059669' : 'var(--color-text-primary)',
                fontWeight: isSelected ? 800 : 700,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <span>Q{q.questionNumber}</span>
              {isMarked ? (
                <span style={{ fontSize: '0.7rem', opacity: isSelected ? 0.9 : 1 }}>
                  ({q.evaluatorScore}/{q.maxMarks})
                </span>
              ) : (
                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>({q.maxMarks}M)</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Question Body & Scoring Canvas ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Question Statement Header */}
        <div style={{
          background: '#f8fafc',
          padding: '16px 18px',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ background: '#3b82f615', color: '#3b82f6', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>
                {currentQ.section}
              </span>
              <strong style={{ fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>
                Question {currentQ.questionNumber}
              </strong>
            </div>

            <button
              onClick={() => setIsSchemeModalOpen(true)}
              style={{
                background: 'white',
                border: '1.5px solid var(--color-border)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#48977f',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <BookOpen size={12} /> Model Answer & Scheme
            </button>
          </div>

          <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
            {currentQ.statement}
          </p>
        </div>

        {/* NexAI Step-Wise Recommendation Copilot */}
        <div style={{
          background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
          borderRadius: '12px',
          border: '1.5px solid #ddd6fe',
          padding: '16px 18px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={16} color="#7c3aed" />
              <strong style={{ fontSize: '0.85rem', color: '#6d28d9' }}>
                NexAI Handwriting & Step Analysis
              </strong>
            </div>

            <span style={{ fontSize: '0.72rem', background: '#7c3aed', color: 'white', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
              {currentQ.aiConfidence}% Match Confidence
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
            {currentQ.aiStepAnalysis.map((step, idx) => (
              <div key={idx} style={{ fontSize: '0.78rem', color: '#4c1d95', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <Check size={13} color="#16a34a" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{step}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #ddd6fe' }}>
            <span style={{ fontSize: '0.78rem', color: '#6d28d9', fontWeight: 700 }}>
              Suggested Score: <strong>{currentQ.aiSuggestedScore} / {currentQ.maxMarks} Marks</strong>
            </span>

            <button
              onClick={() => {
                setInputScore(String(currentQ.aiSuggestedScore));
                handleSaveScore(currentQ.aiSuggestedScore);
              }}
              style={{
                padding: '5px 12px',
                background: '#7c3aed',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Sparkles size={12} /> Accept AI Score
            </button>
          </div>
        </div>

        {/* Evaluator Marks Input & Quick Increment Buttons */}
        <div style={{
          background: 'white',
          border: '1.5px solid var(--color-border)',
          borderRadius: '12px',
          padding: '18px 20px',
        }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '10px' }}>
            Evaluator Awarded Marks (Maximum: {currentQ.maxMarks} Marks):
          </label>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <input
              type="number"
              min="0"
              max={currentQ.maxMarks}
              value={inputScore}
              onChange={e => {
                const val = e.target.value;
                setInputScore(val);
                if (val !== '') {
                  handleSaveScore(Number(val));
                }
              }}
              placeholder="0"
              style={{
                width: '90px',
                padding: '10px 14px',
                fontSize: '1.4rem',
                fontWeight: 900,
                textAlign: 'center',
                borderRadius: '8px',
                border: '2px solid #48977f',
                color: '#166534',
                outline: 'none',
              }}
            />
            <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-secondary)' }}>
              / {currentQ.maxMarks} Marks
            </span>
          </div>

          {/* Quick-tap Increment Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <button
              onClick={() => handleQuickAdd(1)}
              style={{ padding: '6px 12px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              +1 Mark
            </button>
            <button
              onClick={() => handleQuickAdd(2)}
              style={{ padding: '6px 12px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              +2 Marks
            </button>
            <button
              onClick={() => handleQuickAdd(5)}
              style={{ padding: '6px 12px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              +5 Marks
            </button>
            <button
              onClick={() => {
                setInputScore(String(currentQ.maxMarks));
                handleSaveScore(currentQ.maxMarks);
              }}
              style={{ padding: '6px 12px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer' }}
            >
              Full Marks ({currentQ.maxMarks}M)
            </button>
            <button
              onClick={() => {
                setInputScore('0');
                handleSaveScore(0);
              }}
              style={{ padding: '6px 12px', background: '#fff1f2', border: '1px solid #fecdd3', color: '#e11d48', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Zero (0M)
            </button>
          </div>

          {/* Evaluator Notes / Reason */}
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
              Examiner Marking Remarks / Deductions Justification:
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => {
                setNotes(e.target.value);
                if (inputScore !== '') {
                  onUpdateQuestionScore(currentQ.id, Number(inputScore), e.target.value);
                }
              }}
              placeholder="e.g. Correct logic, step 2 calculation error..."
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1.5px solid var(--color-border)',
                fontSize: '0.78rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Bottom Next Question Button ── */}
      <div style={{
        padding: '14px 24px',
        background: '#f8fafc',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
          Question {activeQuestionIndex + 1} of {questions.length}
        </span>

        {activeQuestionIndex < questions.length - 1 ? (
          <button
            onClick={() => onSelectQuestion(activeQuestionIndex + 1)}
            style={{
              padding: '8px 16px',
              background: '#0f172a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            Next Question (Q{questions[activeQuestionIndex + 1].questionNumber}) <ChevronRight size={14} />
          </button>
        ) : (
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>
            All Questions Reached ✓
          </span>
        )}
      </div>

      {/* Model Answer Scheme Modal */}
      {isSchemeModalOpen && (
        <ModelAnswerSchemeModal
          question={currentQ}
          onClose={() => setIsSchemeModalOpen(false)}
        />
      )}
    </div>
  );
};
