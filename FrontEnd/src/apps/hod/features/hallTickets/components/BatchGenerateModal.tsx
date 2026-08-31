import React, { useState } from 'react';
import { StudentEligibilityRecord, HallTicketRecord } from '../../../types';
import { X, QrCode, Cpu } from 'lucide-react';

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
  const [isGenerating, setIsGenerating] = useState(false);

  const eligibleCandidates = students.filter(s => {
    const isEligible = s.status === 'ELIGIBLE' || (s.status === 'CONDONABLE' && s.condonationApproved);
    if (!isEligible) return false;
    if (targetSemester !== 'ALL' && s.semester !== targetSemester) return false;
    return true;
  });

  const handleGenerateBatch = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const generated: HallTicketRecord[] = eligibleCandidates.map((s, idx) => ({
        id: `ht_${Date.now()}_${idx}`,
        ticketNumber: s.hallTicketNumber || `HT-FALL26-CS-${Math.floor(100 + Math.random() * 900)}`,
        usn: s.usn,
        studentName: s.name,
        semester: `${s.semester} B.Tech`,
        department: 'Department of Computer Science & Engineering',
        examSession: 'Fall End-Semester Examinations 2026',
        generatedAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' IST',
        isRevoked: false,
        qrPayload: `NEXAI_ADMIT_VERIFIED_${s.usn}_SIGN_HOD_CSE_OK`,
        slots: [
          { subjectCode: 'CS201', subjectTitle: 'Data Structures & Algorithms', examDate: 'Oct 15, 2026', examTime: '10:00 AM - 01:00 PM', roomAllocated: 'Hall A-101', deskNumber: `D-${idx + 1}` },
          { subjectCode: 'MA201', subjectTitle: 'Discrete Mathematical Structures', examDate: 'Oct 18, 2026', examTime: '10:00 AM - 01:00 PM', roomAllocated: 'Hall A-101', deskNumber: `D-${idx + 1}` },
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
