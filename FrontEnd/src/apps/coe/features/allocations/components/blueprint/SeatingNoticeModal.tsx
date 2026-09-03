import React from 'react';
import { X, Printer, Shield } from 'lucide-react';
import { RoomAllocationResult, SessionScopeConfig } from '../../types/allocationTypes';

interface SeatingNoticeModalProps {
  roomResults: RoomAllocationResult[];
  scopeConfig?: SessionScopeConfig;
  onClose: () => void;
}

export const SeatingNoticeModal: React.FC<SeatingNoticeModalProps> = ({
  roomResults,
  scopeConfig,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const sessionTitle = scopeConfig?.sessionName || 'SEE Semester End Examination — Autumn 2026';
  const examDate = scopeConfig?.startDate || new Date().toISOString().split('T')[0];
  const slotName = scopeConfig?.selectedSlots[0]?.name || 'Morning Forenoon Slot (09:30 AM - 12:30 PM)';

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '850px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
        overflow: 'hidden',
      }}>
        {/* Modal Action Bar */}
        <div style={{
          padding: '16px 24px',
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={18} color="#4F46E5" />
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1E293B' }}>
              Printable Examination Seating Notice
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handlePrint}
              style={{
                background: 'linear-gradient(135deg, #4F46E5, #6366F1)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Printer size={14} /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              style={{
                background: '#E2E8F0',
                border: 'none',
                borderRadius: '8px',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#475569',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Notice Paper Content */}
        <div style={{ padding: '36px', overflowY: 'auto', flex: 1, background: 'white' }}>
          {/* Institutional Header */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid #0F172A', paddingBottom: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <Shield size={24} color="#4338CA" />
              <span style={{ fontSize: '1.2rem', fontWeight: 900, letterSpacing: '1px', color: '#1E1B4B' }}>
                AUTONOMOUS INSTITUTION OF ENGINEERING & TECHNOLOGY
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#4338CA', textTransform: 'uppercase' }}>
              Office of the Controller of Examinations (CoE)
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748B', marginTop: '2px' }}>
              Accredited by NAAC with A++ Grade • Approved by AICTE
            </div>
          </div>

          {/* Notice Title Banner */}
          <div style={{
            background: '#F1F5F9',
            borderRadius: '8px',
            padding: '12px 18px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.82rem',
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>
                {sessionTitle}
              </div>
              <div style={{ color: '#475569', marginTop: '2px' }}>
                Exam Date: <strong>{examDate}</strong> • Timing: <strong>{slotName}</strong>
              </div>
            </div>
            <span style={{
              background: '#4338CA',
              color: 'white',
              padding: '4px 10px',
              borderRadius: '6px',
              fontWeight: 800,
              fontSize: '0.75rem',
            }}>
              OFFICIAL NOTICE
            </span>
          </div>

          {/* Halls Seating Distribution Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginBottom: '24px' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #0F172A' }}>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #CBD5E1' }}>Hall No.</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #CBD5E1' }}>Building & Floor</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #CBD5E1' }}>Participating Branches</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #CBD5E1' }}>Allotted USN Ranges</th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #CBD5E1' }}>Count</th>
              </tr>
            </thead>
            <tbody>
              {roomResults.map(res => {
                const depts = Object.keys(res.departmentTallies).join(', ');
                const firstUsn = res.seatedCandidates[0]?.usn || '-';
                const lastUsn = res.seatedCandidates[res.seatedCandidates.length - 1]?.usn || '-';

                return (
                  <tr key={res.roomId}>
                    <td style={{ padding: '10px', border: '1px solid #CBD5E1', fontWeight: 800, color: '#0F172A' }}>
                      {res.roomNumber}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #CBD5E1', color: '#334155' }}>
                      {res.building} ({res.floor === 0 ? 'Ground Floor' : `Fl ${res.floor}`})
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #CBD5E1', color: '#4338CA', fontWeight: 700 }}>
                      {depts}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #CBD5E1', fontFamily: 'monospace', fontSize: '0.78rem' }}>
                      {firstUsn} ... {lastUsn}
                    </td>
                    <td style={{ padding: '10px', border: '1px solid #CBD5E1', textAlign: 'center', fontWeight: 800 }}>
                      {res.occupiedCount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Mandatory Instructions */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', marginBottom: '28px', fontSize: '0.78rem', color: '#334155' }}>
            <div style={{ fontWeight: 800, marginBottom: '6px', color: '#0F172A' }}>
              MANDATORY INSTRUCTIONS FOR CANDIDATES:
            </div>
            <ol style={{ margin: 0, paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Candidates must occupy allotted seats 15 minutes prior to session commencement.</li>
              <li>College Identity Card and Official Hall Ticket are mandatory for hall entry.</li>
              <li>Multi-Department Interleaving is active: Any attempt to communicate with adjacent candidates is treated as malpractice under Malpractice Code MP-104.</li>
              <li>Electronic gadgets, smartwatches, programmable calculators, and unauthorized paper sheets are strictly prohibited.</li>
            </ol>
          </div>

          {/* Official Sign-off */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '20px' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
              Notice Ref: AICTE/COE/SEE-2026/ALLOC-09<br />
              Generated via AI Seating Engine
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 140, borderBottom: '1px solid #334155', marginBottom: '6px' }} />
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F172A' }}>Dr. K. S. Venkatesh</div>
              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Controller of Examinations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
