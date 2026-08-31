import React, { useState } from 'react';
import { QuestionItem, QuestionPaperDraft } from '../../../types';
import { X, Sparkles, Wand2, CheckCircle2, Cpu } from 'lucide-react';

interface AIVariantGeneratorModalProps {
  draft: QuestionPaperDraft;
  onAddQuestionToDraft: (question: QuestionItem) => void;
  onClose: () => void;
}

export const AIVariantGeneratorModal: React.FC<AIVariantGeneratorModalProps> = ({
  draft,
  onAddQuestionToDraft,
  onClose,
}) => {
  const [selectedBaseQuestionId, setSelectedBaseQuestionId] = useState<string>(draft.questions[0]?.id || '');
  const [strategy, setStrategy] = useState<'NUMERICAL' | 'ALGORITHM_COUNTERPART' | 'INDUSTRY_CASE'>('NUMERICAL');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVariants, setGeneratedVariants] = useState<QuestionItem[]>([]);

  const baseQuestion = draft.questions.find(q => q.id === selectedBaseQuestionId) || draft.questions[0];

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      let variant1Text = '';
      let variant2Text = '';

      if (strategy === 'NUMERICAL') {
        variant1Text = `Formulate the 0/1 Knapsack problem with weights W = [3, 4, 6, 7], values V = [4, 5, 8, 9], and maximum capacity C = 11. Compute the dynamic programming table and list optimal items.`;
        variant2Text = `Given weights W = [1, 2, 5, 6, 7] with corresponding profits P = [1, 6, 18, 22, 28] and knapsack limit M = 10, solve using bottom-up tabulation DP.`;
      } else if (strategy === 'ALGORITHM_COUNTERPART') {
        variant1Text = `Develop Kruskal's Minimum Spanning Tree algorithm using Disjoint Set Union (DSU) with Path Compression and Union by Rank. Prove cycle detection in O(alpha(V)).`;
        variant2Text = `Contrast Prim's Algorithm vs Boruvka's Algorithm for distributed Minimum Spanning Trees on sparse graphs. Analyze time complexities with Fibonacci Heaps.`;
      } else {
        variant1Text = `Architect a real-time Geospatial Ride-Matching Service handling 50,000 requests/sec. Design a KD-Tree / R-Tree spatial indexing system for nearest neighbor driver dispatch.`;
        variant2Text = `Design an in-memory Time-Series Metric Aggregator utilizing Persistent Segment Trees to support historical latency percentile queries over sliding 24-hour windows.`;
      }

      setGeneratedVariants([
        {
          id: `var_${Date.now()}_1`,
          number: draft.questions.length + 1,
          section: baseQuestion ? baseQuestion.section : 'Part B',
          text: variant1Text,
          marks: baseQuestion ? baseQuestion.marks : 15,
          bloomsLevel: baseQuestion ? baseQuestion.bloomsLevel : 'Apply',
          module: baseQuestion ? baseQuestion.module : 3,
          coMapping: baseQuestion ? baseQuestion.coMapping : 'CO3',
          schemeNotes: '5 marks for formulation, 5 marks for table trace, 5 marks for solution extraction.'
        },
        {
          id: `var_${Date.now()}_2`,
          number: draft.questions.length + 1,
          section: baseQuestion ? baseQuestion.section : 'Part C',
          text: variant2Text,
          marks: baseQuestion ? baseQuestion.marks : 15,
          bloomsLevel: 'Analyze',
          module: baseQuestion ? baseQuestion.module : 4,
          coMapping: baseQuestion ? baseQuestion.coMapping : 'CO4',
          schemeNotes: '7 marks for algorithmic correctness, 8 marks for asymptotic space-time derivation.'
        },
      ]);

      setIsGenerating(false);
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
        maxWidth: '740px',
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
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
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
                <Wand2 size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#48977f', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  NexAI Copilot Synthesis
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', fontWeight: 800 }}>
                  AI Question Variant & Parallel Set Generator
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
          {/* Base Question Picker */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
              Select Source Question from {draft.setLabel}:
            </label>
            <select
              value={selectedBaseQuestionId}
              onChange={e => setSelectedBaseQuestionId(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid var(--color-border)', fontSize: '0.85rem', fontWeight: 600 }}
            >
              {draft.questions.map(q => (
                <option key={q.id} value={q.id}>
                  Q{q.number} ({q.section} • {q.marks}M): {q.text.substring(0, 80)}...
                </option>
              ))}
            </select>
          </div>

          {/* Strategy Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              Variation Synthesis Strategy:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { id: 'NUMERICAL', label: 'Parametric / Numerical Variation', desc: 'Preserves algorithm, changes mathematical inputs' },
                { id: 'ALGORITHM_COUNTERPART', label: 'Algorithmic Counterpart', desc: 'Pairs with dual algorithm (e.g. Prim vs Kruskal)' },
                { id: 'INDUSTRY_CASE', label: 'Industry System Scenario', desc: 'Frames theoretical algorithm in modern tech architecture' },
              ].map(s => (
                <div
                  key={s.id}
                  onClick={() => setStrategy(s.id as any)}
                  style={{
                    border: strategy === s.id ? '2px solid #48977f' : '1.5px solid #e2e8f0',
                    background: strategy === s.id ? '#48977f08' : '#f8fafc',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <strong style={{ fontSize: '0.8rem', color: strategy === s.id ? '#48977f' : 'var(--color-text-primary)', display: 'block', marginBottom: '4px' }}>
                    {s.label}
                  </strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', lineHeight: 1.3, display: 'block' }}>
                    {s.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            style={{
              padding: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: isGenerating ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(59,130,246,0.3)'
            }}
          >
            {isGenerating ? <><Cpu size={16} className="animate-spin" /> Synthesizing AI Question Candidates...</> : <><Sparkles size={16} /> Synthesize Parallel Question Variants</>}
          </button>

          {/* Generated Results */}
          {generatedVariants.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                Generated Alternate Candidates:
              </label>

              {generatedVariants.map((v, i) => (
                <div key={v.id} style={{ background: '#f8fafc', border: '1.5px solid #cbd5e1', borderRadius: '12px', padding: '16px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ background: '#3b82f615', color: '#3b82f6', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                        Candidate #{i + 1}
                      </span>
                      <span style={{ background: '#e2e8f0', color: '#334155', padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
                        {v.bloomsLevel} • {v.coMapping}
                      </span>
                    </div>
                    <span style={{ fontWeight: 800, color: '#059669', fontSize: '0.85rem' }}>{v.marks} Marks</span>
                  </div>

                  <p style={{ margin: '0 0 12px 0', fontSize: '0.88rem', color: '#1e293b', lineHeight: 1.5 }}>
                    {v.text}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      Scheme Key Included ✓
                    </span>

                    <button
                      onClick={() => {
                        onAddQuestionToDraft(v);
                        onClose();
                      }}
                      style={{
                        padding: '7px 16px',
                        background: 'linear-gradient(135deg, #48977f 0%, #2f6852 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <CheckCircle2 size={13} /> Insert into {draft.setLabel}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
