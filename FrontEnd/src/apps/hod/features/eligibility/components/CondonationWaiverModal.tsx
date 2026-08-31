import React, { useState } from 'react';
import { StudentEligibilityRecord } from '../../../types';
import { X, Award, Check } from 'lucide-react';

interface CondonationWaiverModalProps {
  student: StudentEligibilityRecord;
  onApproveCondonation: (studentId: string) => void;
  onClose: () => void;
}

export const CondonationWaiverModal: React.FC<CondonationWaiverModalProps> = ({
  student,
  onApproveCondonation,
  onClose,
}) => {
  const [hodNotes, setHodNotes] = useState('Medical / Co-curricular participation documents verified and found genuine. Approved under University Regulation Section 4.2.');

  const handleApprove = () => {
    onApproveCondonation(student.id);
    onClose();
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
        maxWidth: '620px',
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
                background: 'rgba(245, 158, 11, 0.25)',
                border: '1.5px solid rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f59e0b'
              }}>
                <Award size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Academic Regulation Waiver
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', fontWeight: 800 }}>
                  Attendance Condonation Approval
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
        <div style={{ padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Student Bio Card */}
          <div style={{ background: '#f8fafc', padding: '16px 18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                {student.name} ({student.usn})
              </span>
              <span style={{ fontWeight: 700, color: '#d97706', fontSize: '0.85rem' }}>
                {student.attendancePercent}% Attendance ({student.classesAttended}/{student.totalClassesHeld} Classes)
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
              {student.department} • {student.semester} (Section {student.section}) • CIE Score: <strong>{student.cieMarksAvg}/50</strong>
            </p>
          </div>

          {/* Justification Reason */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
              Submitted Leave / Condonation Grounds:
            </label>
            <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '10px', padding: '12px 14px', fontSize: '0.82rem', color: '#92400e', lineHeight: 1.5 }}>
              {student.condonationReason || 'Official Medical Leave submitted under University Ordinance.'}
            </div>
          </div>

          {/* HOD Endorsement Note */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
              HOD Verification & Approval Endorsement:
            </label>
            <textarea
              rows={3}
              value={hodNotes}
              onChange={e => setHodNotes(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: '1.5px solid var(--color-border)',
                fontSize: '0.82rem',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ background: '#f0fdf4', padding: '12px 14px', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.75rem', color: '#166534' }}>
            ✓ Approving this condonation updates the candidate status to <strong>ELIGIBLE</strong> and authorizes the generation of their examination Hall Ticket.
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 30px', background: '#f8fafc', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{ padding: '8px 18px', background: 'white', border: '1.5px solid var(--color-border)', borderRadius: '8px', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            Cancel
          </button>

          <button
            onClick={handleApprove}
            style={{
              padding: '8px 22px',
              background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(22,163,74,0.3)',
            }}
          >
            <Check size={15} /> Grant Official Condonation ✓
          </button>
        </div>
      </div>
    </div>
  );
};
