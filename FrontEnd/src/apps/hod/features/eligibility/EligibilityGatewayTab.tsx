import React, { useState } from 'react';
import { StudentEligibilityRecord } from '../../types';
import { Badge } from '@/components/ui/Badge';
import {
  Search,
  Upload,
  CheckCircle2,
  Award,
  BookOpen,
  Filter,
  AlertTriangle,
  XCircle,
  Users
} from 'lucide-react';
import { CSVUploadModal } from './components/CSVUploadModal';
import { CondonationWaiverModal } from './components/CondonationWaiverModal';

interface EligibilityGatewayTabProps {
  students: StudentEligibilityRecord[];
  onUpdateStudent: (student: StudentEligibilityRecord) => void;
  onBulkAddStudents: (newStudents: StudentEligibilityRecord[]) => void;
  onNavigateToHallTickets?: () => void;
}

const SEMESTER_SUBJECTS: Record<string, { code: string; title: string; faculty: string }[]> = {
  '3rd Sem': [
    { code: 'CS201', title: 'Data Structures & Algorithms', faculty: 'Prof. Alan Turing' },
    { code: 'CS203', title: 'Discrete Mathematics & Graph Theory', faculty: 'Dr. John von Neumann' },
  ],
  '5th Sem': [
    { code: 'CS301', title: 'Operating Systems & Kernel Design', faculty: 'Dr. Barbara Liskov' },
    { code: 'CS302', title: 'Database Management Systems', faculty: 'Dr. Edgar Codd' },
  ],
  '7th Sem': [
    { code: 'CS401', title: 'Distributed Systems & Cloud Computing', faculty: 'Dr. Leslie Lamport' },
    { code: 'CS402', title: 'Artificial Intelligence & Machine Learning', faculty: 'Prof. Geoffrey Hinton' },
  ],
};

export const EligibilityGatewayTab: React.FC<EligibilityGatewayTabProps> = ({
  students,
  onUpdateStudent,
  onBulkAddStudents,
  onNavigateToHallTickets: _onNavigateToHallTickets,
}) => {
  const [selectedSemester, setSelectedSemester] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const [selectedStudentForCondonation, setSelectedStudentForCondonation] = useState<StudentEligibilityRecord | null>(null);

  const handleSemesterChange = (newSem: string) => {
    setSelectedSemester(newSem);
    if (newSem !== 'ALL' && selectedSubject !== 'ALL') {
      const semSubjects = SEMESTER_SUBJECTS[newSem] || [];
      if (!semSubjects.some(s => s.code === selectedSubject)) {
        setSelectedSubject('ALL');
      }
    }
  };

  // Compute available subjects for the dropdown
  const availableSubjects = selectedSemester === 'ALL'
    ? Object.values(SEMESTER_SUBJECTS).flat()
    : SEMESTER_SUBJECTS[selectedSemester] || [];

  // Filter logic: Filter by Semester, Subject, Status, and Search Query
  const filteredStudents = students.filter(s => {
    if (selectedSemester !== 'ALL' && s.semester !== selectedSemester) return false;
    if (selectedSubject !== 'ALL' && s.subjectCode !== selectedSubject) return false;
    if (selectedStatus !== 'ALL' && s.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.usn.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        (s.subjectCode && s.subjectCode.toLowerCase().includes(q)) ||
        (s.subjectTitle && s.subjectTitle.toLowerCase().includes(q)) ||
        (s.facultyInCharge && s.facultyInCharge.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Telemetry metrics
  const total = filteredStudents.length;
  const eligibleCount = filteredStudents.filter(s => s.status === 'ELIGIBLE' || s.condonationApproved).length;
  const condonableCount = filteredStudents.filter(s => s.status === 'CONDONABLE' && !s.condonationApproved).length;
  const detainedCount = filteredStudents.filter(s => s.status === 'DETAINED').length;
  const feeBlockedCount = filteredStudents.filter(s => s.status === 'FEE_BLOCKED').length;

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
      
      {/* ── Top Metric Stats Ribbon ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
      }}>
        {/* Total Evaluated */}
        <div style={{
          background: 'white',
          borderRadius: '14px',
          border: '1.5px solid #E2E8F0',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
        }}>
          <div style={{ width: 42, height: 42, borderRadius: '10px', background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Evaluated</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0F172A' }}>{total} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>Students</span></div>
          </div>
        </div>

        {/* Eligible */}
        <div style={{
          background: 'white',
          borderRadius: '14px',
          border: '1.5px solid #BBF7D0',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
        }}>
          <div style={{ width: 42, height: 42, borderRadius: '10px', background: '#DCFCE7', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subject Eligible (≥75%)</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#15803D' }}>{eligibleCount} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16A34A' }}>({total > 0 ? Math.round((eligibleCount / total) * 100) : 0}%)</span></div>
          </div>
        </div>

        {/* Condonation Required */}
        <div style={{
          background: 'white',
          borderRadius: '14px',
          border: '1.5px solid #FDE68A',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
        }}>
          <div style={{ width: 42, height: 42, borderRadius: '10px', background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#B45309', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Shortage (65%–74.9%)</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#B45309' }}>{condonableCount} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#B45309' }}>Condonable</span></div>
          </div>
        </div>

        {/* Detained */}
        <div style={{
          background: 'white',
          borderRadius: '14px',
          border: '1.5px solid #FECACA',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
        }}>
          <div style={{ width: 42, height: 42, borderRadius: '10px', background: '#FEE2E2', color: '#B91C1C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <XCircle size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#B91C1C', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Detained (&lt;65%)</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#B91C1C' }}>{detainedCount} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#B91C1C' }}>Barred</span></div>
          </div>
        </div>
      </div>

      {/* ── Multi-Parameter Filter Bar: Semester, Subject, Status & Search ── */}
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
        gap: '14px',
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '260px', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
          <input
            type="text"
            placeholder="Search USN, student name, subject code, or teacher..."
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

        {/* Dropdown Filters: Semester, Subject & Status */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          
          {/* 1. Semester Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>Semester:</span>
            <select
              value={selectedSemester}
              onChange={e => handleSemesterChange(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#0F172A',
                background: '#F8FAFC',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Semesters (3rd, 5th, 7th)</option>
              <option value="3rd Sem">3rd Semester B.Tech</option>
              <option value="5th Sem">5th Semester B.Tech</option>
              <option value="7th Sem">7th Semester B.Tech</option>
            </select>
          </div>

          {/* 2. Subject Course Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4F46E5', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <BookOpen size={13} /> Subject:
            </span>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1.5px solid #A5B4FC',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#1E1B4B',
                background: '#EEF2FF',
                cursor: 'pointer',
                maxWidth: '280px',
              }}
            >
              <option value="ALL">
                {selectedSemester === 'ALL' ? 'All Subjects Across Department' : `All ${selectedSemester} Subjects`}
              </option>
              {availableSubjects.map(sub => (
                <option key={sub.code} value={sub.code}>
                  {sub.code}: {sub.title}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Eligibility Status Selector */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1.5px solid #CBD5E1',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#0F172A',
              background: '#F8FAFC',
              cursor: 'pointer',
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="ELIGIBLE">Eligible (≥75% Attendance)</option>
            <option value="CONDONABLE">Condonable Shortage (65%–74.9%)</option>
            <option value="DETAINED">Detained (&lt;65% Attendance)</option>
            <option value="FEE_BLOCKED">Fee Dues Blocked</option>
          </select>

          {/* Bulk Ingest Action */}
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

      {/* ── Subject-Wise Student Eligibility Table ── */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1.5px solid var(--color-border)',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
          <div>
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A' }}>
              Subject-Wise Student Eligibility Roster ({filteredStudents.length} Records)
            </span>
            <div style={{ fontSize: '0.74rem', color: '#64748B', marginTop: '2px' }}>
              {selectedSubject !== 'ALL' ? (
                <span>Filtered for Course: <strong style={{ color: '#4F46E5' }}>{selectedSubject}</strong></span>
              ) : selectedSemester !== 'ALL' ? (
                <span>Filtered for <strong style={{ color: '#0F172A' }}>{selectedSemester}</strong> (All Subjects)</span>
              ) : (
                <span>Showing all courses across 3rd, 5th, and 7th Semesters</span>
              )}
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            Attendance Threshold: <strong>≥75%</strong> | Condonation Floor: <strong>65%</strong>
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead style={{ background: '#f8fafc', color: 'var(--color-text-secondary)', fontWeight: 700, borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '14px 20px' }}>STUDENT USN & NAME</th>
                <th style={{ padding: '14px 16px' }}>SEMESTER</th>
                <th style={{ padding: '14px 16px' }}>SUBJECT COURSE & TEACHER</th>
                <th style={{ padding: '14px 16px' }}>ATTENDANCE %</th>
                <th style={{ padding: '14px 16px' }}>CLASSES ATTENDED</th>
                <th style={{ padding: '14px 16px' }}>CIE SCORE</th>
                <th style={{ padding: '14px 16px' }}>ELIGIBILITY STATUS</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>HOD ACTION</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: '#64748B', fontSize: '0.88rem' }}>
                    No student eligibility records found matching the selected Semester / Subject filter.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
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
                        {student.semester} <span style={{ color: '#64748B', fontSize: '0.74rem' }}>({student.section})</span>
                      </td>

                      {/* Subject Course & Teacher */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{
                            background: '#EEF2FF',
                            color: '#4F46E5',
                            fontWeight: 800,
                            fontSize: '0.72rem',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontFamily: 'monospace'
                          }}>
                            {student.subjectCode || 'CS201'}
                          </span>
                          <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.8rem' }}>
                            {student.subjectTitle || 'Data Structures & Algorithms'}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                          Teacher: <strong>{student.facultyInCharge || 'Prof. Alan Turing'}</strong>
                        </div>
                      </td>

                      {/* Attendance % with Mini Bar */}
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong style={{ color: attColor }}>{student.attendancePercent}%</strong>
                        </div>
                        <div style={{ width: '80px', height: '5px', background: '#e2e8f0', borderRadius: '3px', marginTop: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.min(student.attendancePercent, 100)}%`, height: '100%', background: attColor }} />
                        </div>
                      </td>

                      {/* Classes Attended */}
                      <td style={{ padding: '14px 16px', color: 'var(--color-text-secondary)' }}>
                        {student.classesAttended} / {student.totalClassesHeld} Classes
                      </td>

                      {/* CIE Score */}
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                        <span style={{ color: student.cieMarksAvg >= 40 ? '#16A34A' : student.cieMarksAvg >= 30 ? '#D97706' : '#DC2626' }}>
                          {student.cieMarksAvg}
                        </span> / 50
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
                })
              )}
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
