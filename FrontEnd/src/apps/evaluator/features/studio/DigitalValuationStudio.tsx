import React, { useState } from 'react';
import { ScannedAnswerBooklet, CanvasAnnotation } from '../../types';
import { ScriptCanvasViewer } from './components/ScriptCanvasViewer';
import { QuestionScoringPanel } from './components/QuestionScoringPanel';
import { MarksTallySummaryBar } from './components/MarksTallySummaryBar';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

interface DigitalValuationStudioProps {
  script: ScannedAnswerBooklet;
  onUpdateScript: (updatedScript: ScannedAnswerBooklet) => void;
  onCloseStudio: () => void;
  onSubmitSuccess: () => void;
}

export const DigitalValuationStudio: React.FC<DigitalValuationStudioProps> = ({
  script,
  onUpdateScript,
  onCloseStudio,
  onSubmitSuccess,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Annotation handlers
  const handleAddAnnotation = (annotation: CanvasAnnotation) => {
    const updated: ScannedAnswerBooklet = {
      ...script,
      annotations: [...script.annotations, annotation],
    };
    onUpdateScript(updated);
  };

  const handleRemoveAnnotation = (annotationId: string) => {
    const updated: ScannedAnswerBooklet = {
      ...script,
      annotations: script.annotations.filter(a => a.id !== annotationId),
    };
    onUpdateScript(updated);
  };

  // Score update handler
  const handleUpdateQuestionScore = (questionId: string, score: number, notes?: string) => {
    const updatedQuestions = script.questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          evaluatorScore: score,
          evaluatorNotes: notes,
          isValued: true,
        };
      }
      return q;
    });

    const newTotalEvaluatorScore = updatedQuestions.reduce((sum, q) => sum + (q.evaluatorScore || 0), 0);

    const updated: ScannedAnswerBooklet = {
      ...script,
      status: 'IN_PROGRESS',
      questions: updatedQuestions,
      evaluatorTotalScore: newTotalEvaluatorScore,
    };
    onUpdateScript(updated);
  };

  const handleSubmitValuation = () => {
    const totalAwarded = script.questions.reduce((sum, q) => sum + (q.evaluatorScore || 0), 0);
    const deviation = Math.abs(totalAwarded - script.aiTotalScore);
    const deviationPercent = script.aiTotalScore > 0 ? (deviation / script.aiTotalScore) * 100 : 0;

    const updated: ScannedAnswerBooklet = {
      ...script,
      status: deviationPercent > 15 ? 'DEVIATION_FLAGGED' : 'VALUED',
      evaluatorTotalScore: totalAwarded,
      valuedDate: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' IST',
      deviationPercent: Math.round(deviationPercent * 10) / 10,
    };

    onUpdateScript(updated);
    onSubmitSuccess();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '88vh' }}>
      {/* ── Studio Top Bar ── */}
      <div style={{
        background: 'white',
        borderRadius: '14px',
        border: '1.5px solid var(--color-border)',
        padding: '12px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onCloseStudio}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-secondary)',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ArrowLeft size={15} /> Back to Worklist
          </button>

          <div style={{ height: '18px', width: '1px', background: '#cbd5e1' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, fontFamily: 'monospace', color: '#0f172a' }}>
              {script.dummyBarcode}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
              ({script.subjectCode}: {script.subjectTitle})
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            background: '#eff6ff',
            color: '#1d4ed8',
            border: '1px solid #bfdbfe',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '0.72rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            <ShieldCheck size={13} /> Double-Blind Zero-Knowledge Active
          </span>
        </div>
      </div>

      {/* ── Split Screen: Left Canvas Viewer & Right Scoring Panel ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '16px',
        height: 'calc(100vh - 280px)',
        minHeight: '520px',
      }}>
        {/* Left: Canvas Viewer */}
        <ScriptCanvasViewer
          totalPages={script.totalPages}
          currentPage={currentPage}
          annotations={script.annotations}
          onPageChange={setCurrentPage}
          onAddAnnotation={handleAddAnnotation}
          onRemoveAnnotation={handleRemoveAnnotation}
        />

        {/* Right: Question Scoring & AI Panel */}
        <QuestionScoringPanel
          questions={script.questions}
          activeQuestionIndex={activeQuestionIndex}
          onSelectQuestion={setActiveQuestionIndex}
          onUpdateQuestionScore={handleUpdateQuestionScore}
        />
      </div>

      {/* ── Bottom Sticky Marks Tally Bar ── */}
      <MarksTallySummaryBar
        script={script}
        onExit={onCloseStudio}
        onSubmitValuation={handleSubmitValuation}
      />
    </div>
  );
};
