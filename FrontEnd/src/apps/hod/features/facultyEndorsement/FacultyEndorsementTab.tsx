import React, { useState } from 'react';
import { CIEMarksSheet, FacultyNomination } from '../../types';
import { Badge } from '@/components/ui/Badge';
import {
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { CIEMarksEndorsementModal } from './components/CIEMarksEndorsementModal';

interface FacultyEndorsementTabProps {
  cieSheets: CIEMarksSheet[];
  facultyNominations: FacultyNomination[];
  onUpdateCIESheets: (updatedSheets: CIEMarksSheet[]) => void;
  onUpdateNominations?: (updatedNominations: FacultyNomination[]) => void;
}

export const FacultyEndorsementTab: React.FC<FacultyEndorsementTabProps> = ({
  cieSheets,
  facultyNominations,
  onUpdateCIESheets,
  onUpdateNominations: _onUpdateNominations,
}) => {
  const [selectedSheetForEndorse, setSelectedSheetForEndorse] = useState<CIEMarksSheet | null>(null);

  const handleEndorseSuccess = (subjectCode: string) => {
    const updated = cieSheets.map(s => {
      if (s.subjectCode === subjectCode) {
        return {
          ...s,
          isEndorsedByHOD: true,
          endorsedAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' IST',
        };
      }
      return s;
    });
    onUpdateCIESheets(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* ── Section 1: CIE Marks Endorsement ── */}
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
              Continuous Internal Evaluation (CIE) Marks Sheets
            </h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Review class average internal scores and freeze records before submitting to the Controller of Examinations.
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} /> Immutable Ledger Sync Active
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead style={{ background: '#f8fafc', color: 'var(--color-text-secondary)', fontWeight: 700, borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '14px 20px' }}>Subject Course</th>
                <th style={{ padding: '14px 16px' }}>Semester</th>
                <th style={{ padding: '14px 16px' }}>Faculty in Charge</th>
                <th style={{ padding: '14px 16px' }}>Cohort Size</th>
                <th style={{ padding: '14px 16px' }}>Class Average</th>
                <th style={{ padding: '14px 16px' }}>Endorsement Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>HOD Action</th>
              </tr>
            </thead>
            <tbody>
              {cieSheets.map(sheet => (
                <tr key={sheet.subjectCode} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--color-text-primary)', fontFamily: 'monospace' }}>
                      {sheet.subjectCode}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                      {sheet.subjectTitle}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>{sheet.semester}</td>
                  <td style={{ padding: '14px 16px' }}>{sheet.facultyInCharge}</td>
                  <td style={{ padding: '14px 16px' }}>{sheet.totalStudents} Students</td>
                  <td style={{ padding: '14px 16px' }}>
                    <strong style={{ color: '#16a34a' }}>{sheet.averageScore}</strong> / {sheet.maxMarks}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    {sheet.isEndorsedByHOD ? (
                      <Badge variant="success">ENDORSED & FROZEN ✓</Badge>
                    ) : (
                      <Badge variant="warning">PENDING HOD REVIEW</Badge>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    {sheet.isEndorsedByHOD ? (
                      <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                        Endorsed: {sheet.endorsedAt?.split(' ')[0]}
                      </span>
                    ) : (
                      <button
                        onClick={() => setSelectedSheetForEndorse(sheet)}
                        style={{
                          padding: '6px 14px',
                          background: 'linear-gradient(135deg, #48977f 0%, #2f6852 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 8px rgba(72,151,127,0.3)',
                        }}
                      >
                        <CheckCircle2 size={13} /> Endorse Sheet
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Section 2: Department Faculty Appointments & Nominations ── */}
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
              Department Examination Faculty Appointments & Nominations
            </h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Appointed Question Paper Setters, External Evaluators, and Chief Invigilators for Fall 2026.
            </p>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead style={{ background: '#f8fafc', color: 'var(--color-text-secondary)', fontWeight: 700, borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '14px 20px' }}>Faculty Member</th>
                <th style={{ padding: '14px 16px' }}>Designation & Experience</th>
                <th style={{ padding: '14px 16px' }}>Assigned Exam Role</th>
                <th style={{ padding: '14px 16px' }}>Nominated Subject Course</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {facultyNominations.map(fn => (
                <tr key={fn.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--color-text-primary)' }}>{fn.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{fn.email}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div>{fn.designation}</div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{fn.experienceYears} Years Exp</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      background: fn.assignedRole === 'SETTER' ? '#eff6ff' : fn.assignedRole === 'EVALUATOR' ? '#fdf4ff' : '#f0fdf4',
                      color: fn.assignedRole === 'SETTER' ? '#1d4ed8' : fn.assignedRole === 'EVALUATOR' ? '#a21caf' : '#15803d',
                      border: `1px solid ${fn.assignedRole === 'SETTER' ? '#bfdbfe' : fn.assignedRole === 'EVALUATOR' ? '#f5d0fe' : '#bbf7d0'}`,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '0.72rem',
                    }}>
                      {fn.assignedRole.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <strong>{fn.subjectCode}</strong>: {fn.subjectTitle}
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    {fn.status === 'ACCEPTED' ? (
                      <Badge variant="success">ACCEPTED ✓</Badge>
                    ) : (
                      <Badge variant="warning">NOMINATED</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CIE Endorsement Modal */}
      {selectedSheetForEndorse && (
        <CIEMarksEndorsementModal
          sheet={selectedSheetForEndorse}
          onEndorseSuccess={handleEndorseSuccess}
          onClose={() => setSelectedSheetForEndorse(null)}
        />
      )}
    </div>
  );
};
