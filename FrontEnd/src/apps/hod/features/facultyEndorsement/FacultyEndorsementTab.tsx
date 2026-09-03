import React, { useState } from 'react';
import { CIEMarksSheet, FacultyNomination, CIEQuestionPaper } from '../../types';
import {
  FileCheck,
  Eye,
  Check,
  X,
  RotateCw,
  AlertTriangle,
  MessageSquare,
  Send,
  Bell
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FacultyEndorsementTabProps {
  cieSheets?: CIEMarksSheet[];
  facultyNominations?: FacultyNomination[];
  ciePapers?: CIEQuestionPaper[];
  onUpdateCIESheets?: (updatedSheets: CIEMarksSheet[]) => void;
  onUpdateNominations?: (updatedNominations: FacultyNomination[]) => void;
  onUpdateCIEPapers?: (papers: CIEQuestionPaper[]) => void;
}

export const FacultyEndorsementTab: React.FC<FacultyEndorsementTabProps> = ({
  cieSheets: _cieSheets,
  facultyNominations: _facultyNominations,
  ciePapers = [],
  onUpdateCIESheets: _onUpdateCIESheets,
  onUpdateNominations: _onUpdateNominations,
  onUpdateCIEPapers,
}) => {
  const [inspectingPaper, setInspectingPaper] = useState<CIEQuestionPaper | null>(null);
  const [remarksText, setRemarksText] = useState<string>('');

  const openInspection = (paper: CIEQuestionPaper) => {
    setInspectingPaper(paper);
    setRemarksText(paper.hodRemarks || '');
  };

  const notifyFaculty = (paper: CIEQuestionPaper, actionType: 'REVISION_REQUESTED' | 'APPROVED', remarks: string) => {
    try {
      const existingNotifs = JSON.parse(localStorage.getItem('nexai_faculty_paper_notifications') || '[]');
      const newNotif = {
        id: 'notif-' + Date.now(),
        paperId: paper.id,
        courseCode: paper.courseCode,
        courseTitle: paper.courseTitle,
        testType: paper.testType,
        type: actionType,
        message: remarks,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        facultyName: paper.facultyName,
        read: false
      };
      localStorage.setItem('nexai_faculty_paper_notifications', JSON.stringify([newNotif, ...existingNotifs]));
    } catch (e) {
      console.error(e);
    }
  };

  const handleRequestRevision = () => {
    if (!inspectingPaper) return;
    const finalRemarks = remarksText.trim() || 'Revision requested: Please review Bloom levels & question mark distribution and resubmit for re-audit.';
    const updated = ciePapers.map(p =>
      p.id === inspectingPaper.id
        ? {
            ...p,
            status: 'REVISION_REQUESTED' as const,
            hodRemarks: finalRemarks,
            auditedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
          }
        : p
    );

    if (onUpdateCIEPapers) {
      onUpdateCIEPapers(updated);
    }
    notifyFaculty(inspectingPaper, 'REVISION_REQUESTED', finalRemarks);
    toast.error(`Revision Requested for ${inspectingPaper.courseCode}! Faculty (${inspectingPaper.facultyName}) notified to resubmit for re-audit.`, {
      icon: '🔔',
      duration: 5000,
    });
    setInspectingPaper(null);
  };

  const handleApprovePaper = () => {
    if (!inspectingPaper) return;
    const finalRemarks = remarksText.trim() || 'Approved by HOD — meets OBE and Bloom taxonomy standards.';
    const updated = ciePapers.map(p =>
      p.id === inspectingPaper.id
        ? {
            ...p,
            status: 'APPROVED' as const,
            hodRemarks: finalRemarks,
            auditedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
          }
        : p
    );

    if (onUpdateCIEPapers) {
      onUpdateCIEPapers(updated);
    }
    notifyFaculty(inspectingPaper, 'APPROVED', finalRemarks);
    toast.success(`CIE Paper for ${inspectingPaper.courseCode} Approved! Faculty author notified.`, {
      icon: '✓',
      duration: 4000,
    });
    setInspectingPaper(null);
  };

  const quickRemarkTemplates = [
    '⚠️ Bloom Mismatch: Q2 requires higher-order analysis (Bloom Level L3/L4).',
    '⚠️ Rebalance Marks: Question 1 exceeds single-concept weightage.',
    '⚠️ Alignment: Strengthen alignment with Course Outcome CO3.',
    '✓ Verified: Fully complies with Bloom Taxonomy & OBE Guidelines.',
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* ── Section: CIE Question Papers Submitted by Faculty ── */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1.5px solid var(--color-border)',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      }}>
        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              Faculty Internal Test (CIE) Question Papers
            </h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Inspect question papers, verify Bloom's taxonomy & Course Outcomes, provide audit remarks, and request revisions for re-audit.
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#4F46E5', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <FileCheck size={14} /> OBE & Bloom Level Quality Check
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>PAPER ID & TEST</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>SUBJECT & SEM</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>FACULTY AUTHOR & REMARKS</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>QUESTIONS & MARKS</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>AUDIT STATUS</th>
                <th style={{ padding: '12px 20px', fontWeight: 700, textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {ciePapers.map(paper => {
                const isApproved = paper.status === 'APPROVED';
                const isRevisionReq = paper.status === 'REVISION_REQUESTED';
                const isReAudit = paper.status === 'SUBMITTED_TO_HOD' && paper.hodRemarks && (paper.hodRemarks.includes('Revision') || paper.hodRemarks.includes('re-audit'));

                return (
                  <tr key={paper.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 800, color: '#0F172A' }}>{paper.testType}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{paper.id}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#4F46E5' }}>{paper.courseCode}</div>
                      <div style={{ fontSize: '0.75rem', color: '#334155' }}>{paper.courseTitle}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#0F172A' }}>{paper.facultyName}</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Submitted: {paper.submittedAt}</div>
                      {paper.hodRemarks && (
                        <div style={{
                          marginTop: '4px',
                          fontSize: '0.73rem',
                          color: isRevisionReq ? '#B91C1C' : isApproved ? '#15803D' : '#475569',
                          background: isRevisionReq ? '#FEE2E2' : isApproved ? '#DCFCE7' : '#F1F5F9',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          display: 'inline-block',
                          maxWidth: '260px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          💬 HOD: {paper.hodRemarks}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontWeight: 800, color: '#0F172A' }}>{paper.questions.length} Questions</span>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Total: {paper.maxMarks} Marks</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {isApproved && (
                        <span style={{
                          background: '#DCFCE7',
                          color: '#15803D',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Check size={12} /> APPROVED ✓
                        </span>
                      )}
                      {isRevisionReq && (
                        <span style={{
                          background: '#FEE2E2',
                          color: '#B91C1C',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <AlertTriangle size={12} /> REVISION REQUESTED
                        </span>
                      )}
                      {isReAudit && (
                        <span style={{
                          background: '#FEF3C7',
                          color: '#B45309',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <RotateCw size={12} /> RE-AUDIT PENDING ⏳
                        </span>
                      )}
                      {!isApproved && !isRevisionReq && !isReAudit && (
                        <span style={{
                          background: '#EFF6FF',
                          color: '#1D4ED8',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontWeight: 800,
                          fontSize: '0.72rem'
                        }}>
                          PENDING REVIEW ⏳
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => openInspection(paper)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#EEF2FF',
                          border: '1px solid #C7D2FE',
                          color: '#4F46E5',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        <Eye size={13} /> Inspect & Audit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Inspection & Re-Audit Modal for HOD ── */}
      {inspectingPaper && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            maxWidth: '740px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '90vh'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#F8FAFC',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ background: '#4F46E5', color: 'white', fontWeight: 900, fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px' }}>
                    {inspectingPaper.courseCode}
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                    {inspectingPaper.testType} Paper Audit & Remarks
                  </h3>
                </div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>
                  Course Faculty: <strong>{inspectingPaper.facultyName}</strong> ({inspectingPaper.facultyEmail}) • Max Marks: {inspectingPaper.maxMarks}
                </p>
              </div>
              <button onClick={() => setInspectingPaper(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Question Breakdown List */}
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Question Structure & Bloom/CO Mapping:</span>
                  <span style={{ color: '#64748B', fontWeight: 600 }}>{inspectingPaper.questions.length} Questions Submitted</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {inspectingPaper.questions.map((q, idx) => (
                    <div key={q.id || idx} style={{
                      background: '#F8FAFC',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.82rem' }}>Question {q.qNumber}</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>{q.co}</span>
                          <span style={{ background: '#F3E8FF', color: '#7E22CE', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>Bloom {q.bloomsLevel}</span>
                          <span style={{ background: '#E0F2FE', color: '#0369A1', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>{q.marks} Marks</span>
                        </div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#334155', lineHeight: 1.35 }}>
                        {q.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* HOD Audit Remarks & Directives Section */}
              <div style={{
                background: '#F1F5F9',
                borderRadius: '12px',
                border: '1.5px solid #CBD5E1',
                padding: '16px 18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MessageSquare size={15} color="#4F46E5" /> HOD Audit Feedback & Revision Instructions:
                  </label>
                  <span style={{ fontSize: '0.7rem', color: '#64748B' }}>Dispatched directly to Faculty Portal</span>
                </div>

                <textarea
                  value={remarksText}
                  onChange={e => setRemarksText(e.target.value)}
                  placeholder="Enter specific audit remarks or revision directives (e.g. Please revise Question 2 to test Bloom Level 3 application, rebalance question marks, and resubmit for re-audit)..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid #94A3B8',
                    fontSize: '0.82rem',
                    fontFamily: 'inherit',
                    color: '#0F172A',
                    resize: 'vertical',
                    background: 'white',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />

                {/* Quick Directive Templates */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748B' }}>Quick Templates:</span>
                  {quickRemarkTemplates.map((template, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRemarksText(template)}
                      style={{
                        background: 'white',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        padding: '3px 8px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: '#334155',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {template.slice(0, 32)}...
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Action Footer */}
            <div style={{
              padding: '14px 24px',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#F8FAFC',
            }}>
              <button
                onClick={() => setInspectingPaper(null)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  background: 'white',
                  color: '#475569',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                {/* Request Revision & Send for Re-Audit */}
                <button
                  onClick={handleRequestRevision}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #F87171',
                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 6px rgba(220, 38, 38, 0.25)'
                  }}
                >
                  <RotateCw size={14} /> Request Revision & Re-Audit 🔄
                </button>

                {/* Approve & Notify Faculty */}
                <button
                  onClick={handleApprovePaper}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 6px rgba(22, 163, 74, 0.25)'
                  }}
                >
                  <Check size={14} /> Approve Paper & Notify Faculty ✓
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
