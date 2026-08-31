import React from 'react';
import { SetterAssignment } from '../../../types';
import { Badge } from '@/components/ui/Badge';
import { BookOpen, PenTool, ArrowRight } from 'lucide-react';

interface AssignmentCardProps {
  assignment: SetterAssignment;
  onOpenStudio: (subjectCode: string) => void;
  onViewGuidelines: (assignment: SetterAssignment) => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  onOpenStudio,
  onViewGuidelines,
}) => {
  const isCompleted = assignment.status === 'COMPLETED';
  const progressPercent = Math.round((assignment.setsSubmitted / assignment.setsRequired) * 100);

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      border: isCompleted ? '1.5px solid #48977f44' : '1.5px solid var(--color-border)',
      borderTop: `5px solid ${isCompleted ? '#48977f' : '#3b82f6'}`,
      padding: '24px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.2s ease',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.05)';
    }}
    >
      {/* Background Vector */}
      <svg style={{ position: 'absolute', right: -15, bottom: -15, opacity: 0.05, pointerEvents: 'none' }} viewBox="0 0 100 100" width="110" height="110">
        <polygon points="50,15 90,85 10,85" fill="#3b82f6" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="#3b82f6" strokeWidth="4" />
      </svg>

      <div>
        {/* Top Badges */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: '#3b82f615',
              color: '#3b82f6',
              border: '1px solid #3b82f633',
              padding: '3px 10px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.5px'
            }}>
              {assignment.subjectCode}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
              {assignment.semester}
            </span>
          </div>

          <Badge variant={isCompleted ? 'success' : 'primary'}>
            {isCompleted ? 'COMPLETED' : `${assignment.daysRemaining} DAYS REMAINING`}
          </Badge>
        </div>

        {/* Title & Department */}
        <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
          {assignment.subjectTitle}
        </h3>
        <p style={{ margin: '0 0 16px 0', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
          {assignment.department}
        </p>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '18px' }}>
          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>Deadline</span>
            <strong style={{ fontSize: '0.82rem', color: assignment.daysRemaining <= 5 ? '#e11d48' : 'var(--color-text-primary)' }}>
              {assignment.deadline}
            </strong>
          </div>

          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>Format</span>
            <strong style={{ fontSize: '0.82rem', color: 'var(--color-text-primary)' }}>
              {assignment.maxMarks}M • 3 Hours
            </strong>
          </div>

          <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <span style={{ fontSize: '0.68rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600, display: 'block' }}>Honorarium</span>
            <strong style={{ fontSize: '0.82rem', color: '#16a34a' }}>
              {assignment.honorariumAmount}
            </strong>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '6px' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>Submission Progress</span>
            <span style={{ fontWeight: 700, color: isCompleted ? '#16a34a' : 'var(--color-primary)' }}>
              {assignment.setsSubmitted} / {assignment.setsRequired} Sets Vaulted ({progressPercent}%)
            </span>
          </div>
          <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: isCompleted ? '#16a34a' : 'linear-gradient(90deg, #3b82f6, #48977f)', borderRadius: '4px', transition: 'width 0.4s ease' }} />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
        <button
          onClick={() => onViewGuidelines(assignment)}
          style={{
            flex: 1,
            padding: '10px 14px',
            background: 'white',
            border: '1.5px solid var(--color-border)',
            borderRadius: '10px',
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--color-primary)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
        >
          <BookOpen size={15} /> Blueprint Guidelines
        </button>

        <button
          onClick={() => onOpenStudio(assignment.subjectCode)}
          style={{
            flex: 1.3,
            padding: '10px 18px',
            background: 'linear-gradient(135deg, #48977f 0%, #2f6852 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(72,151,127,0.3)',
            transition: 'all 0.2s ease',
          }}
        >
          <PenTool size={15} /> Open Authoring Studio <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
