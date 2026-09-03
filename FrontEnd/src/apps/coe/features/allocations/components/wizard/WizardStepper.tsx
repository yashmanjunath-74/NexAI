import React from 'react';
import { Check, Sparkles } from 'lucide-react';

interface WizardStepperProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export const WIZARD_STEPS = [
  { step: 1, label: 'Scope & Schedule', desc: 'Depts, Sems & Slots' },
  { step: 2, label: 'Subject Matrix', desc: 'Candidate Headcount' },
  { step: 3, label: 'Exam Halls', desc: 'Capacity & Floor Plan' },
  { step: 4, label: 'Invigilator Roster', desc: 'Equal Duty Balancer' },
  { step: 5, label: 'AI Optimization', desc: 'Interleaving & Solve' },
];

export const WizardStepper: React.FC<WizardStepperProps> = ({ currentStep, onStepClick }) => {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      border: '1px solid var(--color-border)',
      padding: '16px 24px',
      marginBottom: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '8px',
        position: 'relative',
      }}>
        {WIZARD_STEPS.map((s, idx) => {
          const isDone = currentStep > s.step;
          const isActive = currentStep === s.step;
          const isClickable = isDone && onStepClick;

          return (
            <div
              key={s.step}
              onClick={() => isClickable && onStepClick(s.step)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: isClickable ? 'pointer' : 'default',
                padding: '8px 10px',
                borderRadius: '10px',
                background: isActive ? 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)' : 'transparent',
                border: isActive ? '1px solid #C7D2FE' : '1px solid transparent',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Step indicator circle */}
              <div style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontWeight: 800,
                fontSize: '0.85rem',
                background: isDone
                  ? 'linear-gradient(135deg, #10B981, #059669)'
                  : isActive
                  ? 'linear-gradient(135deg, #6366F1, #8B5CF6)'
                  : '#F1F5F9',
                color: (isDone || isActive) ? 'white' : '#64748B',
                boxShadow: isActive ? '0 4px 12px rgba(99,102,241,0.3)' : 'none',
                transition: 'all 0.3s ease',
              }}>
                {isDone ? (
                  <Check size={16} strokeWidth={3} />
                ) : s.step === 5 ? (
                  <Sparkles size={16} />
                ) : (
                  s.step
                )}
              </div>

              {/* Text info */}
              <div style={{ overflow: 'hidden' }}>
                <div style={{
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 800 : isDone ? 700 : 500,
                  color: isActive ? '#4F46E5' : isDone ? '#0F172A' : '#64748B',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}>
                  {s.label}
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: '#94A3B8',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}>
                  {s.desc}
                </div>
              </div>

              {/* Connector line on right (if not last item) */}
              {idx < WIZARD_STEPS.length - 1 && (
                <div style={{
                  position: 'absolute',
                  right: `calc(${100 - (idx + 1) * 20}% - 4px)`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '8px',
                  height: '2px',
                  background: currentStep > s.step ? '#10B981' : '#E2E8F0',
                  pointerEvents: 'none',
                }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
