import React, { useState } from 'react';
import { CanvasAnnotation } from '../../../types';
import {
  Check,
  X,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ScriptCanvasViewerProps {
  totalPages: number;
  currentPage: number;
  annotations: CanvasAnnotation[];
  onPageChange: (page: number) => void;
  onAddAnnotation: (annotation: CanvasAnnotation) => void;
  onRemoveAnnotation: (annotationId: string) => void;
}

type AnnotationTool = 'TICK' | 'CROSS' | 'STEP_2' | 'STEP_5' | 'COMMENT';

export const ScriptCanvasViewer: React.FC<ScriptCanvasViewerProps> = ({
  totalPages,
  currentPage,
  annotations,
  onPageChange,
  onAddAnnotation,
  onRemoveAnnotation,
}) => {
  const [activeTool, setActiveTool] = useState<AnnotationTool>('TICK');
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  const pageAnnotations = annotations.filter(a => a.pageNumber === currentPage);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    let newAnnotation: CanvasAnnotation;

    if (activeTool === 'TICK') {
      newAnnotation = { id: `ann_${Date.now()}`, pageNumber: currentPage, type: 'TICK', x, y };
    } else if (activeTool === 'CROSS') {
      newAnnotation = { id: `ann_${Date.now()}`, pageNumber: currentPage, type: 'CROSS', x, y };
    } else if (activeTool === 'STEP_2') {
      newAnnotation = { id: `ann_${Date.now()}`, pageNumber: currentPage, type: 'STEP_MARK', x, y, marksValue: 2 };
    } else if (activeTool === 'STEP_5') {
      newAnnotation = { id: `ann_${Date.now()}`, pageNumber: currentPage, type: 'STEP_MARK', x, y, marksValue: 5 };
    } else {
      newAnnotation = { id: `ann_${Date.now()}`, pageNumber: currentPage, type: 'COMMENT', x, y, text: 'Evaluator Note' };
    }

    onAddAnnotation(newAnnotation);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#0f172a',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1.5px solid #334155',
    }}>
      {/* ── Top Canvas Annotation Bar ── */}
      <div style={{
        background: '#1e293b',
        padding: '12px 18px',
        borderBottom: '1px solid #334155',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        {/* Annotation Tool Selection */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Marking Tools:</span>

          <button
            onClick={() => setActiveTool('TICK')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: activeTool === 'TICK' ? '2px solid #22c55e' : '1px solid #475569',
              background: activeTool === 'TICK' ? '#14532d' : '#334155',
              color: '#4ade80',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Check size={14} /> Tick (✓)
          </button>

          <button
            onClick={() => setActiveTool('CROSS')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: activeTool === 'CROSS' ? '2px solid #ef4444' : '1px solid #475569',
              background: activeTool === 'CROSS' ? '#7f1d1d' : '#334155',
              color: '#f87171',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <X size={14} /> Cross (✗)
          </button>

          <button
            onClick={() => setActiveTool('STEP_2')}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: activeTool === 'STEP_2' ? '2px solid #3b82f6' : '1px solid #475569',
              background: activeTool === 'STEP_2' ? '#1e3a8a' : '#334155',
              color: '#93c5fd',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
            }}
          >
            +2 Marks
          </button>

          <button
            onClick={() => setActiveTool('STEP_5')}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: activeTool === 'STEP_5' ? '2px solid #8b5cf6' : '1px solid #475569',
              background: activeTool === 'STEP_5' ? '#581c87' : '#334155',
              color: '#d8b4fe',
              fontWeight: 800,
              fontSize: '0.78rem',
              cursor: 'pointer',
            }}
          >
            +5 Marks
          </button>
        </div>

        {/* Zoom & Page Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#334155', borderRadius: '6px', overflow: 'hidden' }}>
            <button
              onClick={() => setZoomLevel(Math.max(70, zoomLevel - 15))}
              style={{ padding: '6px 10px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <ZoomOut size={14} />
            </button>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0 6px' }}>{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
              style={{ padding: '6px 10px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
            >
              <ZoomIn size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '6px',
                background: '#334155',
                border: 'none',
                borderRadius: '6px',
                color: currentPage === 1 ? '#64748b' : 'white',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeft size={16} />
            </button>

            <span style={{ fontSize: '0.78rem', fontWeight: 800, minWidth: '70px', textAlign: 'center' }}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '6px',
                background: '#334155',
                border: 'none',
                borderRadius: '6px',
                color: currentPage === totalPages ? '#64748b' : 'white',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Interactive Script Canvas Area ── */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        padding: '24px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        background: '#090d16',
      }}>
        <div
          onClick={handleCanvasClick}
          style={{
            width: `${Math.round(620 * (zoomLevel / 100))}px`,
            minHeight: `${Math.round(820 * (zoomLevel / 100))}px`,
            background: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 15px 40px rgba(0,0,0,0.6)',
            position: 'relative',
            cursor: 'crosshair',
            padding: '36px 40px',
            boxSizing: 'border-box',
            fontFamily: 'cursive',
            color: '#1e293b',
            lineHeight: 1.8,
            fontSize: '0.92rem',
            userSelect: 'none',
          }}
        >
          {/* Watermark */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            fontSize: '2rem',
            fontWeight: 800,
            color: 'rgba(0,0,0,0.03)',
            transform: 'rotate(-25deg)',
            fontFamily: 'sans-serif',
          }}>
            OFFICIAL EVALUATION SCRIPT • PAGE {currentPage}
          </div>

          {/* Simulated Handwritten Content by Page */}
          {currentPage === 1 && (
            <div>
              <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '8px', marginBottom: '16px', fontFamily: 'sans-serif' }}>
                <strong style={{ fontSize: '0.85rem' }}>Section A: Question 1</strong>
              </div>
              <p style={{ margin: '0 0 12px 0' }}>
                <strong>Ans 1:</strong> Data structures are broadly classified into two categories:
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                1. <u>Linear Data Structures:</u> Elements are arranged sequentially or linearly where each element has a unique predecessor and successor (except first and last). Memory allocation is contiguous or linked.
                <br /><em>Examples:</em> Arrays, Stacks, Queues, Linked Lists.
              </p>
              <p style={{ margin: '0 0 8px 0' }}>
                2. <u>Non-Linear Data Structures:</u> Elements are organized hierarchically or interconnected where an element can connect to multiple items. Traversal is non-sequential.
                <br /><em>Examples:</em> Binary Search Trees, Graphs, Heaps.
              </p>
            </div>
          )}

          {currentPage === 2 && (
            <div>
              <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '8px', marginBottom: '16px', fontFamily: 'sans-serif' }}>
                <strong style={{ fontSize: '0.85rem' }}>Section A: Question 2</strong>
              </div>
              <p style={{ margin: '0 0 8px 0' }}>
                <strong>Ans 2: Postfix Evaluation Algorithm:</strong>
              </p>
              <pre style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'monospace', border: '1px solid #e2e8f0' }}>
{`1. Create an empty operand stack S.
2. Scan postfix string from Left to Right:
   a. If token is operand: Push(S, token)
   b. If token is operator op:
      op2 = Pop(S)
      op1 = Pop(S)
      val = op1 op op2
      Push(S, val)
3. Return Pop(S) as result.`}
              </pre>
            </div>
          )}

          {currentPage >= 3 && (
            <div>
              <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '8px', marginBottom: '16px', fontFamily: 'sans-serif' }}>
                <strong style={{ fontSize: '0.85rem' }}>Section B / C Working Sheet (Page {currentPage})</strong>
              </div>
              <p style={{ margin: '0 0 12px 0' }}>
                <strong>AVL Tree Construction & Rotations:</strong>
              </p>
              <div style={{ border: '1px dashed #cbd5e1', padding: '16px', borderRadius: '8px', textAlign: 'center', margin: '14px 0', background: '#fafbfc' }}>
                [Candidate Hand-drawn AVL Balance Factor Diagram: Root (30, BF=0) & Left Child (20, LR-Rotation Applied)]
              </div>
              <p>
                Balance Factor = Height(Left Subtree) - Height(Right Subtree). Since BF of node 20 became -2 after inserting 28, double LR rotation restored balance property.
              </p>
            </div>
          )}

          {/* Render Active Annotations Stamps on Canvas */}
          {pageAnnotations.map(ann => (
            <div
              key={ann.id}
              onClick={e => {
                e.stopPropagation();
                onRemoveAnnotation(ann.id);
              }}
              style={{
                position: 'absolute',
                left: `${ann.x}%`,
                top: `${ann.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: 10,
              }}
              title="Click to remove markup"
            >
              {ann.type === 'TICK' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(34, 197, 94, 0.9)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  fontWeight: 900,
                }}>
                  <Check size={20} strokeWidth={3} />
                </div>
              )}

              {ann.type === 'CROSS' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.9)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                  fontWeight: 900,
                }}>
                  <X size={20} strokeWidth={3} />
                </div>
              )}

              {ann.type === 'STEP_MARK' && (
                <div style={{
                  background: '#2563eb',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  fontFamily: 'sans-serif',
                  boxShadow: '0 2px 8px rgba(37,99,235,0.4)',
                }}>
                  +{ann.marksValue}M
                </div>
              )}

              {ann.type === 'COMMENT' && (
                <div style={{
                  background: '#fef08a',
                  color: '#854d0e',
                  border: '1px solid #facc15',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}>
                  💬 {ann.text}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
