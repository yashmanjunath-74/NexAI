import React, { useState } from 'react';
import { StudentEligibilityRecord, HallTicketRecord, ExamCycleType } from '../../../types';
import { X, QrCode, Cpu, ShieldCheck } from 'lucide-react';

interface BatchGenerateModalProps {
  students: StudentEligibilityRecord[];
  onBatchGenerateSuccess: (newTickets: HallTicketRecord[]) => void;
  onClose: () => void;
}

export const BatchGenerateModal: React.FC<BatchGenerateModalProps> = ({
  students,
  onBatchGenerateSuccess,
  onClose,
}) => {
  const [targetSemester, setTargetSemester] = useState<string>('ALL');
  const [targetExamCycle, setTargetExamCycle] = useState<ExamCycleType>('CIE-1');
  const [isGenerating, setIsGenerating] = useState(false);

  const eligibleCandidates = students.filter(s => {
    // 1. Basic attendance clearance & fee clearance
    const hasAttendanceClearance = s.status === 'ELIGIBLE' || (s.status === 'CONDONABLE' && s.condonationApproved);
    if (!hasAttendanceClearance) return false;
    if (s.status === 'FEE_BLOCKED') return false;

    // 2. Semester filter
    if (targetSemester !== 'ALL' && s.semester !== targetSemester) return false;

    // 3. For SEE Final Examination: Requires minimum passing CIE average of 20/50 (40%)
    if (targetExamCycle === 'SEE_FINAL') {
      if (s.cieMarksAvg < 20) return false;
    }

    return true;
  });

  const handleGenerateBatch = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const generated: HallTicketRecord[] = eligibleCandidates.map((s, idx) => ({
        id: `ht_${Date.now()}_${idx}`,
        ticketNumber: `HT-${targetExamCycle}-FALL26-CS-${s.usn.slice(-3)}`,
        usn: s.usn,
        studentName: s.name,
        semester: `${s.semester} B.Tech`,
        department: 'Department of Computer Science & Engineering',
        examSession: targetExamCycle === 'SEE_FINAL'
          ? 'Fall Semester End Examination (SEE) 2026'
          : `Fall 2026 Continuous Internal Evaluation (${targetExamCycle})`,
        examCycle: targetExamCycle,
        generatedAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' IST',
        isRevoked: false,
        qrPayload: `NEXAI_ADMIT_${targetExamCycle}_VERIFIED_${s.usn}_SIGN_HOD_CSE_OK`,
        slots: s.subjectCode ? [
          {
            subjectCode: s.subjectCode,
            subjectTitle: s.subjectTitle || 'Course',
            examDate: targetExamCycle === 'CIE-1' ? 'Oct 15, 2026' : targetExamCycle === 'CIE-2' ? 'Nov 12, 2026' : 'Dec 08, 2026',
            examTime: '10:00 AM - 01:00 PM',
            roomAllocated: 'Hall A-101',
            deskNumber: `D-${idx + 1}`
          }
        ] : [
          { subjectCode: 'CS201', subjectTitle: 'Data Structures & Algorithms', examDate: 'Oct 15, 2026', examTime: '10:00 AM - 01:00 PM', roomAllocated: 'Hall A-101', deskNumber: `D-${idx + 1}` },
        ],
      }));

      onBatchGenerateSuccess(generated);
      setIsGenerating(false);
      onClose();
    }, 1400);
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
                background: 'rgba(72, 151, 127, 0.25)',
                border: '1.5px solid rgba(72, 151, 127, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#48977f'
              }}>
                <QrCode size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Cryptographic Batch Issuance
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.2rem', fontWeight: 800 }}>
                  Batch Generate Hall Tickets
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
          
          {/* Target Examination / CIE Series Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              Select Examination / CIE Series for Hall Ticket Issuance:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {(['CIE-1', 'CIE-2', 'SEE_FINAL'] as const).map(cycle => (
                <button
                  key={cycle}
                  type="button"
                  onClick={() => setTargetExamCycle(cycle)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: targetExamCycle === cycle ? '2px solid #4F46E5' : '1.5px solid #E2E8F0',
                    background: targetExamCycle === cycle ? '#EEF2FF' : '#F8FAFC',
                    color: targetExamCycle === cycle ? '#4338CA' : '#475569',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{cycle === 'SEE_FINAL' ? 'SEE Final' : cycle}</span>
                  <span style={{ fontSize: '0.68rem', fontWeight: 600, color: targetExamCycle === cycle ? '#6366F1' : '#94A3B8' }}>
                    {cycle === 'SEE_FINAL' ? 'Semester End Final' : cycle === 'CIE-1' ? 'Internal Test 1' : 'Internal Test 2'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Gateway Eligibility Rule for Selected CIE */}
          <div style={{
            background: targetExamCycle === 'SEE_FINAL' ? '#F0FDF4' : '#FFFBEB',
            border: `1.5px solid ${targetExamCycle === 'SEE_FINAL' ? '#BBF7D0' : '#FDE68A'}`,
            borderRadius: '10px',
            padding: '10px 14px',
            fontSize: '0.75rem',
            color: targetExamCycle === 'SEE_FINAL' ? '#14532D' : '#92400E',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldCheck size={18} flex-shrink="0" />
            <span>
              <strong>Gate Rule for {targetExamCycle === 'SEE_FINAL' ? 'SEE Final Examination' : targetExamCycle}:</strong>{' '}
              {targetExamCycle === 'SEE_FINAL'
                ? 'Requires minimum 75% Attendance AND minimum 20/50 (40%) Cumulative CIE Average.'
                : 'Requires minimum 75% Attendance (or approved condonation waiver) and cleared fee dues.'}
            </span>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '6px' }}>
              Select Target Semester Cohort:
            </label>
            <select
              value={targetSemester}
              onChange={e => setTargetSemester(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid var(--color-border)', fontSize: '0.85rem', fontWeight: 600 }}
            >
              <option value="ALL">All Eligible Semesters (3rd, 5th, 7th)</option>
              <option value="3rd Sem">3rd Semester B.Tech</option>
              <option value="5th Sem">5th Semester B.Tech</option>
              <option value="7th Sem">7th Semester B.Tech</option>
            </select>
          </div>

          {/* Telemetry Summary */}
          <div style={{ background: '#f8fafc', padding: '16px 18px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', fontWeight: 600 }}>Eligible Candidates Found</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#16a34a' }}>
                {eligibleCandidates.length} Students Qualified
              </div>
            </div>

            <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
              Attendance & Fee Cleared ✓
            </span>
          </div>

          {/* Candidates Passing Gateway Preview */}
          <div style={{
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            overflow: 'hidden',
            maxHeight: '160px',
            overflowY: 'auto'
          }}>
            <div style={{ background: '#f8fafc', padding: '8px 12px', fontSize: '0.72rem', fontWeight: 800, color: '#475569', borderBottom: '1px solid #e2e8f0' }}>
              GATEWAY QUALIFIED CANDIDATES ROSTER ({eligibleCandidates.length})
            </div>
            {eligibleCandidates.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem' }}>
                No students qualify under the current semester criteria.
              </div>
            ) : (
              eligibleCandidates.map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid #f1f5f9', fontSize: '0.75rem' }}>
                  <div>
                    <strong style={{ fontFamily: 'monospace', color: '#1E293B' }}>{c.usn}</strong> - {c.name} ({c.semester})
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: '#16A34A', fontWeight: 700 }}>{c.attendancePercent}% Att.</span>
                    <span style={{ background: '#DCFCE7', color: '#15803D', padding: '1px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800 }}>
                      {c.condonationApproved ? 'CONDONED ✓' : 'CLEARED ✓'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={{ background: '#eff6ff', padding: '14px', borderRadius: '10px', border: '1px solid #bfdbfe', fontSize: '0.75rem', color: '#1e40af', lineHeight: 1.5 }}>
            🛡️ <strong>Issuance Protocol:</strong> Generating hall tickets digitally signs each candidate's admit card with the HOD seal, embeds an encrypted verification QR code, and makes the ticket instantly downloadable on the Student Portal.
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
            onClick={handleGenerateBatch}
            disabled={isGenerating || eligibleCandidates.length === 0}
            style={{
              padding: '10px 24px',
              background: eligibleCandidates.length > 0 ? 'linear-gradient(135deg, #48977f 0%, #2f6852 100%)' : '#cbd5e1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: eligibleCandidates.length > 0 ? (isGenerating ? 'wait' : 'pointer') : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: eligibleCandidates.length > 0 ? '0 4px 14px rgba(72,151,127,0.35)' : 'none',
            }}
          >
            {isGenerating ? <><Cpu size={16} className="animate-spin" /> Signing & Generating Admit Cards...</> : <><QrCode size={16} /> Batch Issue {eligibleCandidates.length} Hall Tickets</>}
          </button>
        </div>
      </div>
    </div>
  );
};
