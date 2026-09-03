import React from 'react';
import { DepartmentExamSession } from '../../../types';
import { Printer, Copy, X, Calendar, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  sessions: DepartmentExamSession[];
  onClose: () => void;
}

export const FacultyDutyChartModal: React.FC<Props> = ({ sessions, onClose }) => {
  const handleCopy = () => {
    const text = sessions.map(s => `
[${s.examType}] ${s.subjectCode} - ${s.subjectTitle}
Date: ${s.examDate} | Time: ${s.timeSlot} | Rooms: ${s.roomsAllocated.join(', ')}
• Paper Setter: ${s.paperSetterName}
• Invigilator: ${s.chiefInvigilatorName}
• Evaluator: ${s.evaluatorName} (Key: ${s.evaluatorSessionKey || 'N/A'})
--------------------------------------------------`).join('\n');

    navigator.clipboard.writeText(`DEPARTMENT OF COMPUTER SCIENCE & ENGINEERING\nEXAMINATION FACULTY DUTY ROSTER\n${text}`);
    toast.success('Examination Duty Notice copied to clipboard!');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1.5rem',
      fontFamily: 'var(--font-sans, inherit)',
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        maxWidth: '840px',
        width: '100%',
        maxHeight: '90vh',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          color: 'white',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              background: 'rgba(79, 70, 229, 0.2)',
              color: '#818CF8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Calendar size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 800 }}>
                Department of Computer Science & Engineering
              </div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>
                Official Examination Faculty Duty Chart
              </h3>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content Table */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          <div style={{
            background: '#F8FAFC',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '16px',
            border: '1px solid #E2E8F0',
            fontSize: '0.8rem',
            color: '#475569',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>Academic Term: <strong>Fall 2026</strong> • Approved by HOD for Departmental Notice Board</span>
            <span style={{ color: '#16A34A', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={14} /> Signed & Verified
            </span>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead style={{ background: '#F1F5F9', color: '#475569', fontWeight: 800, borderBottom: '1px solid #CBD5E1' }}>
              <tr>
                <th style={{ padding: '12px 14px' }}>Exam Event & Course</th>
                <th style={{ padding: '12px 14px' }}>Date & Timetable</th>
                <th style={{ padding: '12px 14px' }}>Allocated Rooms</th>
                <th style={{ padding: '12px 14px' }}>Paper Setter</th>
                <th style={{ padding: '12px 14px' }}>Room Proctor</th>
                <th style={{ padding: '12px 14px' }}>Evaluator & Key</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '14px' }}>
                    <span style={{
                      background: '#EEF2FF',
                      color: '#4F46E5',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      display: 'inline-block',
                      marginBottom: '4px',
                    }}>
                      {s.examType}
                    </span>
                    <div style={{ fontWeight: 800, color: '#0F172A' }}>{s.subjectCode}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{s.subjectTitle}</div>
                  </td>

                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{s.examDate}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{s.timeSlot}</div>
                  </td>

                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 600, color: '#0F172A' }}>{s.roomsAllocated.join(', ')}</div>
                    <div style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 700 }}>
                      {s.totalStudentsExpected} Students
                    </div>
                  </td>

                  <td style={{ padding: '14px', fontWeight: 700, color: '#0F172A' }}>
                    {s.paperSetterName}
                  </td>

                  <td style={{ padding: '14px', fontWeight: 700, color: '#0F172A' }}>
                    {s.chiefInvigilatorName}
                  </td>

                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 700, color: '#0F172A' }}>{s.evaluatorName}</div>
                    {s.evaluatorSessionKey && (
                      <code style={{ fontSize: '0.7rem', background: '#F1F5F9', color: '#4F46E5', padding: '2px 4px', borderRadius: '4px', display: 'inline-block', marginTop: '2px' }}>
                        {s.evaluatorSessionKey}
                      </code>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#F8FAFC',
        }}>
          <button
            onClick={handleCopy}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              background: 'white',
              color: '#334155',
              fontWeight: 700,
              fontSize: '0.8rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <Copy size={15} /> Copy Notice Text
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => window.print()}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: '#4F46E5',
                color: 'white',
                fontWeight: 800,
                fontSize: '0.82rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Printer size={15} /> Print Duty Roster
            </button>
            <button
              onClick={onClose}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', background: 'white', color: '#475569', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
