import React from 'react';
import { QuestionMarkingItem } from '../../../types';
import { X, BookOpen } from 'lucide-react';

interface ModelAnswerSchemeModalProps {
  question: QuestionMarkingItem;
  onClose: () => void;
}

export const ModelAnswerSchemeModal: React.FC<ModelAnswerSchemeModalProps> = ({
  question,
  onClose,
}) => {
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
                <BookOpen size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Official Evaluation Rubrics
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', fontWeight: 800 }}>
                  Question {question.questionNumber} Model Answer & Scheme
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
        <div style={{ padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Question Statement */}
          <div style={{ background: '#f8fafc', padding: '16px 18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                {question.section} • Question {question.questionNumber}
              </span>
              <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>Maximum Marks: {question.maxMarks} M</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
              {question.statement}
            </p>
          </div>

          {/* Scheme of Evaluation Breakdown */}
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              Step-Wise Marking Breakdown (Scheme of Evaluation):
            </h4>
            <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '10px', padding: '14px 16px', fontSize: '0.82rem', color: '#166534', lineHeight: 1.6 }}>
              {question.schemeOfEvaluation}
            </div>
          </div>

          {/* Model Answer Summary */}
          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              Expected Model Answer Key:
            </h4>
            <div style={{ background: '#fafbfc', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '14px 16px', fontSize: '0.82rem', color: '#334155', lineHeight: 1.6 }}>
              {question.modelAnswerSummary}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 30px', background: '#f8fafc', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{ padding: '8px 20px', background: '#48977f', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            Close Rubrics
          </button>
        </div>
      </div>
    </div>
  );
};
