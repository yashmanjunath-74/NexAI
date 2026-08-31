import React, { useState } from 'react';
import { StudentEligibilityRecord } from '../../types';
import { Badge } from '@/components/ui/Badge';
import {
  Search,
  Upload,
  CheckCircle2,
  Award
} from 'lucide-react';
import { CSVUploadModal } from './components/CSVUploadModal';
import { CondonationWaiverModal } from './components/CondonationWaiverModal';

interface EligibilityGatewayTabProps {
  students: StudentEligibilityRecord[];
  onUpdateStudent: (student: StudentEligibilityRecord) => void;
  onBulkAddStudents: (newStudents: StudentEligibilityRecord[]) => void;
  onNavigateToHallTickets?: () => void;
}

export const EligibilityGatewayTab: React.FC<EligibilityGatewayTabProps> = ({
  students,
  onUpdateStudent,
  onBulkAddStudents,
  onNavigateToHallTickets: _onNavigateToHallTickets,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [selectedStudentForCondonation, setSelectedStudentForCondonation] = useState<StudentEligibilityRecord | null>(null);

  // Filter logic
  const filteredStudents = students.filter(s => {
    if (selectedSemester !== 'ALL' && s.semester !== selectedSemester) return false;
    if (selectedStatus !== 'ALL' && s.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return s.usn.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
    }
    return true;
  });

  const handleApproveCondonation = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      const updated: StudentEligibilityRecord = {
        ...student,
        status: 'ELIGIBLE',
        condonationApproved: true,
      };
      onUpdateStudent(updated);
    }
  };

  const handleResolveFeeBlock = (student: StudentEligibilityRecord) => {
    const updated: StudentEligibilityRecord = {
      ...student,
      hasFeeDues: false,
      status: student.attendancePercent >= 75 ? 'ELIGIBLE' : 'CONDONABLE',
    };
    onUpdateStudent(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* ── Filter Bar & Actions ── */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1.5px solid var(--color-border)',
        padding: '18px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
          <input
            type="text"
            placeholder="Search by USN or Student Name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              border: '1.5px solid var(--color-border)',
              fontSize: '0.82rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Semester & Status Dropdowns */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={selectedSemester}
            onChange={e => setSelectedSemester(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid var(--color-border)', fontSize: '0.8rem', fontWeight: 600 }}
          >
            <option value="ALL">All Semesters (3rd, 5th, 7th)</option>
            <option value="3rd Sem">3rd Semester B.Tech</option>
            <option value="5th Sem">5th Semester B.Tech</option>
            <option value="7th Sem">7th Semester B.Tech</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid var(--color-border)', fontSize: '0.8rem', fontWeight: 600 }}
          >
            <option value="ALL">All Eligibility Statuses</option>
            <option value="ELIGIBLE">Eligible (≥75% Attendance)</option>
            <option value="CONDONABLE">Condonable (65% - 74.9%)</option>
            <option value="DETAINED">Detained (&lt;65% Attendance)</option>
            <option value="FEE_BLOCKED">Fee Blocked</option>
          </select>

          <button
            onClick={() => setIsCSVModalOpen(true)}
            style={{
              padding: '8px 16px',
              background: '#3b82f615',
              border: '1.5px solid #3b82f644',
              borderRadius: '8px',
              color: '#3b82f6',
              fontWeight: 700,
              fontSize: '0.8rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Upload size={14} /> Bulk Ingest CSV
          </button>
        </div>
      </div>

      {/* ── Student Eligibility Table ── */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1.5px solid var(--color-border)',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
            Department Student Eligibility Roster ({filteredStudents.length} Students)
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            Attendance Threshold: Minimum 75% | Condonation Floor: 65%
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead style={{ background: '#f8fafc', color: 'var(--color-text-secondary)', fontWeight: 700, borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '14px 20px' }}>Student USN & Name</th>
                <th style={{ padding: '14px 16px' }}>Semester / Sec</th>
                <th style={{ padding: '14px 16px' }}>Attendance %</th>
                <th style={{ padding: '14px 16px' }}>Classes Attended</th>
                <th style={{ padding: '14px 16px' }}>CIE Score</th>
                <th style={{ padding: '14px 16px' }}>Eligibility Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>HOD Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => {
                const isEligible = student.status === 'ELIGIBLE' || (student.status === 'CONDONABLE' && student.condonationApproved);
                const attColor = student.attendancePercent >= 85 ? '#16a34a' : student.attendancePercent >= 75 ? '#059669' : student.attendancePercent >= 65 ? '#d97706' : '#e11d48';

                return (
                  <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>
                    {/* USN & Name */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 800, color: 'var(--color-text-primary)', fontFamily: 'monospace' }}>
                        {student.usn}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                        {student.name}
                      </div>
                    </td>

                    {/* Semester & Section */}
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                      {student.semester} (Sec {student.section})
                    </td>

                    {/* Attendance % with Mini Bar */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ color: attColor }}>{student.attendancePercent}%</strong>
                      </div>
                      <div style={{ width: '80px', height: '5px', background: '#e2e8f0', borderRadius: '3px', marginTop: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${student.attendancePercent}%`, height: '100%', background: attColor }} />
                      </div>
                    </td>

                    {/* Classes Attended */}
                    <td style={{ padding: '14px 16px', color: 'var(--color-text-secondary)' }}>
                      {student.classesAttended} / {student.totalClassesHeld} Classes
                    </td>

                    {/* CIE Score */}
                    <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                      {student.cieMarksAvg} / 50
                    </td>

                    {/* Eligibility Status Badge */}
                    <td style={{ padding: '14px 16px' }}>
                      {student.status === 'ELIGIBLE' && (
                        <Badge variant="success">ELIGIBLE</Badge>
                      )}
                      {student.status === 'CONDONABLE' && (
                        student.condonationApproved ? (
                          <Badge variant="success">CONDONED ✓</Badge>
                        ) : (
                          <Badge variant="warning">CONDONABLE SHORTAGE</Badge>
                        )
                      )}
                      {student.status === 'DETAINED' && (
                        <Badge variant="danger">DETAINED (&lt;65%)</Badge>
                      )}
                      {student.status === 'FEE_BLOCKED' && (
                        <Badge variant="danger">FEE DUES BLOCKED</Badge>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      {student.status === 'CONDONABLE' && !student.condonationApproved && (
                        <button
                          onClick={() => setSelectedStudentForCondonation(student)}
                          style={{
                            padding: '6px 12px',
                            background: '#fef3c7',
                            border: '1px solid #fde68a',
                            color: '#b45309',
                            borderRadius: '6px',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Award size={12} /> Review Waiver
                        </button>
                      )}

                      {student.status === 'FEE_BLOCKED' && (
                        <button
                          onClick={() => handleResolveFeeBlock(student)}
                          style={{
                            padding: '6px 12px',
                            background: '#ecfdf5',
                            border: '1px solid #a7f3d0',
                            color: '#059669',
                            borderRadius: '6px',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                          }}
                        >
                          Clear Dues & Unblock
                        </button>
                      )}

                      {isEligible && (
                        <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={13} /> Approved for Exam
                        </span>
                      )}

                      {student.status === 'DETAINED' && (
                        <span style={{ fontSize: '0.72rem', color: '#e11d48', fontWeight: 600 }}>
                          Barred by Regulation
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Ingestion Modal */}
      {isCSVModalOpen && (
        <CSVUploadModal
          onImportStudents={newStudents => onBulkAddStudents(newStudents)}
          onClose={() => setIsCSVModalOpen(false)}
        />
      )}

      {/* Condonation Review Modal */}
      {selectedStudentForCondonation && (
        <CondonationWaiverModal
          student={selectedStudentForCondonation}
          onApproveCondonation={handleApproveCondonation}
          onClose={() => setSelectedStudentForCondonation(null)}
        />
      )}
    </div>
  );
};
