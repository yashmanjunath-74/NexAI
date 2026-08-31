import React, { useState } from 'react';
import { QuestionPaperSet } from '../types';
import { Badge } from '@/components/ui/Badge';
import { Unlock, Eye, Sparkles, Check, Copy, FileText, CheckCircle2 } from 'lucide-react';

interface PaperCardProps {
  paper: QuestionPaperSet;
  isSelectedForExam?: boolean;
  onInspect: (paper: QuestionPaperSet) => void;
  onSelectForExam: (paper: QuestionPaperSet) => void;
  onViewUnsealed?: (paper: QuestionPaperSet) => void;
}

const SET_COLORS: Record<string, string> = {
  'Set A': '#48977f',
  'Set B': '#3b82f6',
  'Set C': '#8b5cf6',
  'Set D': '#ed7245',
};

export const PaperCard: React.FC<PaperCardProps> = ({
  paper,
  isSelectedForExam = false,
  onInspect,
  onSelectForExam,
  onViewUnsealed,
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const color = SET_COLORS[paper.setLabel] || '#48977f';

  const handleCopyHash = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(paper.sha256Hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const isSelectedActive = paper.status === 'SELECTED_ACTIVE' || isSelectedForExam;

  return (
    <div
      style={{
        background: 'white',
        borderRadius: '16px',
        border: isSelectedActive ? `2px solid #48977f` : `1.5px solid ${color}33`,
        borderTop: `5px solid ${isSelectedActive ? '#48977f' : color}`,
        padding: '22px',
        boxShadow: isSelectedActive ? '0 8px 30px rgba(72,151,127,0.18)' : '0 2px 10px rgba(0,0,0,0.04)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 10px 28px ${color}22`;
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = isSelectedActive ? '0 8px 30px rgba(72,151,127,0.18)' : '0 2px 10px rgba(0,0,0,0.04)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Background vector watermark */}
      <svg style={{ position: 'absolute', right: -15, bottom: -15, opacity: 0.06, pointerEvents: 'none' }} viewBox="0 0 100 100" width="100" height="100">
        <rect x="20" y="20" width="60" height="70" rx="8" fill={color} />
        <circle cx="50" cy="50" r="14" fill="white" />
        <rect x="47" y="48" width="6" height="14" rx="2" fill={color} />
      </svg>

      {/* Card Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: `${color}18`,
              color: color,
              border: `1.5px solid ${color}44`,
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.5px'
            }}>
              {paper.setLabel}
            </span>

            {isSelectedActive && (
              <span style={{
                background: '#48977f18',
                color: '#48977f',
                border: '1px solid #48977f44',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <CheckCircle2 size={12} /> SELECTED
              </span>
            )}
          </div>

          <Badge variant={isSelectedActive ? 'success' : paper.status === 'VAULTED' ? 'success' : 'info'}>
            {isSelectedActive ? 'ACTIVE EXAM SET' : paper.status}
          </Badge>
        </div>

        {/* Paper title & Setter */}
        <h4 style={{ margin: '0 0 6px 0', fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
          {paper.title}
        </h4>
        <p style={{ margin: '0 0 14px 0', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
          Authored by: <strong style={{ color: 'var(--color-text-primary)' }}>{paper.setterName}</strong>
        </p>

        {/* AI & Quality Telemetry Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
          <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Difficulty</span>
            <strong style={{ fontSize: '0.82rem', color: color }}>{paper.difficulty}</strong>
          </div>
          <div style={{ background: '#f0fdf4', padding: '8px 10px', borderRadius: '8px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: '#166534', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>AI Quality</span>
            <strong style={{ fontSize: '0.82rem', color: '#15803d' }}>{paper.aiQualityScore}%</strong>
          </div>
          <div style={{ background: '#f8fafc', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', display: 'block', textTransform: 'uppercase', fontWeight: 600 }}>Similarity</span>
            <strong style={{ fontSize: '0.82rem', color: paper.similarityScore < 5 ? '#15803d' : '#b45309' }}>{paper.similarityScore}%</strong>
          </div>
        </div>

        {/* Cryptographic Hash info */}
        <div style={{
          background: '#0f172a08',
          border: '1px solid #0f172a15',
          borderRadius: '10px',
          padding: '10px 12px',
          marginBottom: '16px',
          fontSize: '0.72rem',
          fontFamily: 'monospace',
          color: 'var(--color-text-secondary)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>SHA-256 Digest:</span>
            <button
              onClick={handleCopyHash}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: copiedHash ? '#48977f' : 'var(--color-primary)',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                fontSize: '0.7rem',
                fontWeight: 600
              }}
            >
              {copiedHash ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
            </button>
          </div>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {paper.sha256Hash}
          </div>
          <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed #cbd5e1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>IPFS CID:</span>
            <span style={{ fontWeight: 600, color: color }}>{paper.ipfsCid.substring(0, 14)}...</span>
          </div>
        </div>

        {/* Summary tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '18px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FileText size={12} /> {paper.questionsCount} Questions ({paper.totalMarks} Marks)
          </span>
          <span>•</span>
          <span>{paper.durationMinutes} Minutes</span>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '8px', paddingTop: '14px', borderTop: '1px solid var(--color-border)' }}>
        <button
          onClick={() => onInspect(paper)}
          style={{
            flex: 1,
            padding: '9px 12px',
            background: 'white',
            border: '1.5px solid var(--color-border)',
            borderRadius: '8px',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            color: 'var(--color-text-primary)',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = color)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
        >
          <Eye size={13} /> Inspect Set
        </button>

        {isSelectedActive ? (
          <button
            onClick={() => onViewUnsealed && onViewUnsealed(paper)}
            style={{
              flex: 1.2,
              padding: '9px 14px',
              background: 'linear-gradient(135deg, #48977f, #2f6852)',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(72,151,127,0.3)'
            }}
          >
            <Unlock size={13} /> View Unsealed
          </button>
        ) : (
          <button
            onClick={() => onSelectForExam(paper)}
            style={{
              flex: 1.2,
              padding: '9px 14px',
              background: `linear-gradient(135deg, ${color}, #1e293b)`,
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: `0 4px 12px ${color}33`
            }}
          >
            <Sparkles size={13} /> Select Set
          </button>
        )}
      </div>
    </div>
  );
};
