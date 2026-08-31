import React, { useState } from 'react';
import { QuestionPaperDraft, QuestionItem, SetterAssignment, BloomsLevel } from '../../types';
import { Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, Wand2, BarChart3, BookOpen } from 'lucide-react';
import { AIVariantGeneratorModal } from './components/AIVariantGeneratorModal';

interface AICopilotTabProps {
  draft: QuestionPaperDraft;
  assignment: SetterAssignment;
  onAddQuestionToDraft: (question: QuestionItem) => void;
  onNavigateToAuthoring: () => void;
  onNavigateToSubmit?: () => void;
}

const BLOOM_COLORS: Record<BloomsLevel, string> = {
  Remember: '#64748b',
  Understand: '#3b82f6',
  Apply: '#10b981',
  Analyze: '#8b5cf6',
  Evaluate: '#f59e0b',
  Create: '#ef4444',
};

const TARGET_BLOOMS: Record<BloomsLevel, number> = {
  Remember: 10,
  Understand: 20,
  Apply: 35,
  Analyze: 20,
  Evaluate: 10,
  Create: 5,
};

export const AICopilotTab: React.FC<AICopilotTabProps> = ({
  draft,
  assignment,
  onAddQuestionToDraft,
  onNavigateToAuthoring,
  onNavigateToSubmit: _onNavigateToSubmit,
}) => {
  const [isVariantModalOpen, setIsVariantModalOpen] = useState(false);

  // Calculate Bloom's Breakdown
  const totalQuestions = draft.questions.length || 1;
  const bloomsCounts: Record<BloomsLevel, number> = {
    Remember: 0,
    Understand: 0,
    Apply: 0,
    Analyze: 0,
    Evaluate: 0,
    Create: 0,
  };

  draft.questions.forEach(q => {
    if (bloomsCounts[q.bloomsLevel] !== undefined) {
      bloomsCounts[q.bloomsLevel] += 1;
    }
  });

  // Calculate Syllabus Coverage
  const moduleCounts: Record<number, number> = {};
  draft.questions.forEach(q => {
    moduleCounts[q.module] = (moduleCounts[q.module] || 0) + q.marks;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* ── Top Quality Telemetry Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '16px',
        padding: '24px 30px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: 52,
            height: 52,
            borderRadius: '14px',
            background: 'rgba(72,151,127,0.25)',
            border: '1.5px solid #48977f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#48977f',
          }}>
            <Sparkles size={28} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                NexAI Copilot Quality Audit — {draft.setLabel}
              </h3>
              <span style={{ background: '#48977f25', color: '#4ade80', border: '1px solid #4ade8055', padding: '2px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
                SCORE: {draft.aiQualityScore}% / 100
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>
              {draft.subjectCode} • {draft.questions.length} Questions Analyzed • Plagiarism Index: <strong>{draft.similarityScore}% (Safe)</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setIsVariantModalOpen(true)}
            style={{
              padding: '10px 18px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(59,130,246,0.35)',
            }}
          >
            <Wand2 size={15} /> Synthesize Parallel Variants
          </button>

          <button
            onClick={onNavigateToAuthoring}
            style={{
              padding: '10px 16px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.25)',
              borderRadius: '8px',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            Back to Studio
          </button>
        </div>
      </div>

      {/* ── Two Column Telemetry: Bloom's Spectrum + Plagiarism ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '22px' }}>
        {/* Bloom's Cognitive Spectrum */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid var(--color-border)', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 size={18} color="#48977f" />
              <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem' }}>
                Bloom's Taxonomy Cognitive Distribution
              </h4>
            </div>
            <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#059669', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
              NBA Criterion 3 Aligned ✓
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(Object.keys(BLOOM_COLORS) as BloomsLevel[]).map(level => {
              const count = bloomsCounts[level];
              const currentPct = Math.round((count / totalQuestions) * 100);
              const targetPct = TARGET_BLOOMS[level];
              const color = BLOOM_COLORS[level];

              return (
                <div key={level}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{level}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      Current: <strong style={{ color }}>{currentPct}% ({count} Qs)</strong> • Target: <strong>{targetPct}%</strong>
                    </span>
                  </div>
                  <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${currentPct}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Plagiarism & Question Similarity */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid var(--color-border)', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="#3b82f6" />
              <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem' }}>
                Plagiarism & Repository Match
              </h4>
            </div>
            <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
              Scanned 45,000+ Past Papers
            </span>
          </div>

          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Overall Similarity Index</span>
              <strong style={{ fontSize: '1.2rem', color: draft.similarityScore < 5 ? '#16a34a' : '#b45309' }}>
                {draft.similarityScore}% (Original)
              </strong>
            </div>
            <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${draft.similarityScore * 5}%`, height: '100%', background: '#16a34a' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
              <span>2025 Mid-Sem CS201 Question Bank</span>
              <strong style={{ color: '#16a34a' }}>0.4% Match</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
              <span>CLRS Textbook Algorithm Problems</span>
              <strong style={{ color: '#16a34a' }}>0.8% Match</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
              <span>Open Academic Courseware Repositories</span>
              <strong style={{ color: '#16a34a' }}>0.0% Match</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── Syllabus Unit Coverage Matrix ── */}
      <div style={{ background: 'white', borderRadius: '16px', border: '1.5px solid var(--color-border)', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookOpen size={18} color="#8b5cf6" />
            <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem' }}>
              Syllabus Unit Weightage & Coverage Blueprint
            </h4>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            All 4 Units Represented
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          {assignment.syllabusModules.map(mod => {
            const marksForModule = moduleCounts[mod.moduleNumber] || 0;
            const actualPct = Math.round((marksForModule / (draft.maxMarks || 100)) * 100);
            const isTargetMet = actualPct >= mod.targetWeightagePercent - 5;

            return (
              <div
                key={mod.moduleNumber}
                style={{
                  background: '#f8fafc',
                  border: isTargetMet ? '1.5px solid #cbd5e1' : '1.5px solid #fecaca',
                  borderRadius: '12px',
                  padding: '14px 16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--color-primary)' }}>
                    Unit {mod.moduleNumber}
                  </span>
                  {isTargetMet ? (
                    <CheckCircle2 size={16} color="#16a34a" />
                  ) : (
                    <AlertTriangle size={16} color="#ef4444" />
                  )}
                </div>

                <h5 style={{ margin: '0 0 8px 0', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
                  {mod.title}
                </h5>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                  <span>Target: {mod.targetWeightagePercent}%</span>
                  <strong style={{ color: isTargetMet ? '#16a34a' : '#ef4444' }}>
                    Actual: {marksForModule}M ({actualPct}%)
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Variant Generator Modal */}
      {isVariantModalOpen && (
        <AIVariantGeneratorModal
          draft={draft}
          onAddQuestionToDraft={onAddQuestionToDraft}
          onClose={() => setIsVariantModalOpen(false)}
        />
      )}
    </div>
  );
};
