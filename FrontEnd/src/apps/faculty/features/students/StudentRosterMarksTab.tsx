import React, { useState } from 'react';
import { AssignedCourse, StudentGradeRecord, DailyAttendanceRecord } from '../../types';
import {
  Save,
  Search,
  Calendar,
  CheckCircle2,
  XCircle,
  UserCheck,
  History,
  FileSpreadsheet,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface StudentRosterMarksTabProps {
  courses: AssignedCourse[];
  selectedCourseCode: string;
  onSelectCourseCode: (code: string) => void;
  students: StudentGradeRecord[];
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  onStudentFieldChange: (
    id: string,
    field: 'attendancePercent' | 'cie1' | 'cie2' | 'labOrQuiz',
    value: number
  ) => void;
  onCommitDailyAttendance: (
    courseCode: string,
    sessionDate: string,
    sessionTopic: string,
    absentUsns: string[]
  ) => void;
  attendanceHistory: DailyAttendanceRecord[];
  onSaveMarksToHOD: () => void;
}

export const StudentRosterMarksTab: React.FC<StudentRosterMarksTabProps> = ({
  courses,
  selectedCourseCode,
  onSelectCourseCode,
  students,
  searchQuery,
  onSearchQueryChange,
  onStudentFieldChange,
  onCommitDailyAttendance,
  attendanceHistory,
  onSaveMarksToHOD,
}) => {
  // Sub-Tab State: Daily Attendance Register vs CIE Marks Entry
  const [activeSubView, setActiveSubView] = useState<'DAILY_ATTENDANCE' | 'CIE_MARKS'>('DAILY_ATTENDANCE');

  // Daily Attendance Session State
  const [sessionDate, setSessionDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [sessionTopic, setSessionTopic] = useState<string>('Lecture #40: B-Trees & Multi-Level Indexing');
  // Set of USNs marked as ABSENT for today's session
  const [absentUsnSet, setAbsentUsnSet] = useState<Set<string>>(new Set(['1MS24CS004']));
  const [attendanceFilter, setAttendanceFilter] = useState<'ALL' | 'PRESENT' | 'ABSENT'>('ALL');

  // CIE Marks Milestone Filter
  const [marksMilestone, setMarksMilestone] = useState<'ALL' | 'CIE1' | 'CIE2' | 'LAB'>('ALL');

  // Filter students for active course
  const courseStudents = students.filter(s => s.courseCode === selectedCourseCode);
  const filteredStudents = courseStudents.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.usn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle single student absent / present
  const toggleStudentAttendance = (usn: string) => {
    setAbsentUsnSet(prev => {
      const next = new Set(prev);
      if (next.has(usn)) {
        next.delete(usn);
      } else {
        next.add(usn);
      }
      return next;
    });
  };

  // 1-Click: Mark All Present
  const handleMarkAllPresent = () => {
    setAbsentUsnSet(new Set());
    toast.success('All enrolled students marked as PRESENT ✓');
  };

  // 1-Click: Invert Selection
  const handleInvertAttendance = () => {
    const allUsns = courseStudents.map(s => s.usn);
    setAbsentUsnSet(prev => {
      const next = new Set<string>();
      allUsns.forEach(u => {
        if (!prev.has(u)) next.add(u);
      });
      return next;
    });
  };

  // Commit Daily Attendance Session
  const handleCommitSession = () => {
    const absentArray = Array.from(absentUsnSet);
    onCommitDailyAttendance(selectedCourseCode, sessionDate, sessionTopic, absentArray);
    toast.success(
      `Daily Attendance Recorded! ${courseStudents.length - absentArray.length} Present, ${absentArray.length} Absent. Cumulative attendance updated.`,
      { icon: '📅', duration: 4500 }
    );
  };

  const presentCount = courseStudents.length - absentUsnSet.size;
  const absentCount = absentUsnSet.size;

  const relevantHistory = attendanceHistory.filter(h => h.courseCode === selectedCourseCode);

  return (
    <div>
      {/* ── Top Bar: Course Selector & Operational Mode Switcher ── */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '18px 24px',
        border: '1.5px solid var(--color-border, #E2E8F0)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '4px' }}>
              ACTIVE COURSE:
            </span>
            <select
              value={selectedCourseCode}
              onChange={e => onSelectCourseCode(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.88rem',
                fontWeight: 800,
                color: '#0F172A',
                background: 'white',
                cursor: 'pointer',
              }}
            >
              {courses.map(c => (
                <option key={c.code} value={c.code}>{c.code} — {c.title}</option>
              ))}
            </select>
          </div>

          {/* Mode Switcher Tabs */}
          <div style={{
            display: 'flex',
            background: '#F1F5F9',
            padding: '4px',
            borderRadius: '12px',
            gap: '4px',
          }}>
            <button
              onClick={() => setActiveSubView('DAILY_ATTENDANCE')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: activeSubView === 'DAILY_ATTENDANCE' ? '#FFFFFF' : 'transparent',
                color: activeSubView === 'DAILY_ATTENDANCE' ? '#4F46E5' : '#64748B',
                boxShadow: activeSubView === 'DAILY_ATTENDANCE' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <Calendar size={15} /> Daily Attendance Register
            </button>
            <button
              onClick={() => setActiveSubView('CIE_MARKS')}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: activeSubView === 'CIE_MARKS' ? '#FFFFFF' : 'transparent',
                color: activeSubView === 'CIE_MARKS' ? '#4F46E5' : '#64748B',
                boxShadow: activeSubView === 'CIE_MARKS' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              <FileSpreadsheet size={15} /> CIE Internal Assessment Marks
            </button>
          </div>
        </div>

        {/* Action button corresponding to active subview */}
        <div>
          {activeSubView === 'DAILY_ATTENDANCE' ? (
            <button
              onClick={handleCommitSession}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
              }}
            >
              <UserCheck size={16} /> Save Today's Attendance Session ✓
            </button>
          ) : (
            <button
              onClick={onSaveMarksToHOD}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(22,163,74,0.3)',
              }}
            >
              <Save size={16} /> Submit CIE Marks to HOD Gateway
            </button>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SUBVIEW 1: DAILY ATTENDANCE REGISTER (Fast Absentees Entry)
         ══════════════════════════════════════════════════════════════ */}
      {activeSubView === 'DAILY_ATTENDANCE' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Lecture Session Details Card */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px 24px',
            border: '1.5px solid var(--color-border, #E2E8F0)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                  Daily Attendance Session Sheet
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                  All students are marked Present by default. Click or tap any absent student to toggle their absence, then save the session.
                </p>
              </div>

              {/* Quick Batch Buttons */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleMarkAllPresent}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #BBF7D0',
                    background: '#F0FDF4',
                    color: '#15803D',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <CheckCircle2 size={14} /> 1-Click: Mark All Present
                </button>
                <button
                  type="button"
                  onClick={handleInvertAttendance}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    color: '#475569',
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Invert Toggles
                </button>
              </div>
            </div>

            {/* Inputs for Date and Topic */}
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '16px', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>SESSION DATE</label>
                <input
                  type="date"
                  value={sessionDate}
                  onChange={e => setSessionDate(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>LECTURE TOPIC / SYLLABUS UNIT</label>
                <input
                  type="text"
                  value={sessionTopic}
                  onChange={e => setSessionTopic(e.target.value)}
                  placeholder="e.g. Lecture #40: B-Trees & Multi-Level Indexing"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Live Session Metrics Ribbon */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F8FAFC',
              borderRadius: '12px',
              padding: '12px 18px',
              border: '1px solid #E2E8F0',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>Total Enrolled:</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#0F172A' }}>{courseStudents.length}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#16A34A' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#15803D' }}>Present:</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#15803D' }}>{presentCount}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#DC2626' }} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#B91C1C' }}>Absent:</span>
                  <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#B91C1C' }}>{absentCount}</span>
                </div>
              </div>

              {/* Absentees Quick Tags */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#991B1B' }}>Absentees:</span>
                {absentUsnSet.size === 0 ? (
                  <span style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 700, background: '#DCFCE7', padding: '2px 8px', borderRadius: '6px' }}>
                    None (100% Full Attendance) ✓
                  </span>
                ) : (
                  Array.from(absentUsnSet).map(usn => {
                    const studentObj = courseStudents.find(s => s.usn === usn);
                    return (
                      <span
                        key={usn}
                        onClick={() => toggleStudentAttendance(usn)}
                        title="Click to remove from absent list"
                        style={{
                          background: '#FEE2E2',
                          color: '#991B1B',
                          border: '1px solid #FCA5A5',
                          borderRadius: '6px',
                          padding: '2px 8px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {usn} ({studentObj?.name.split(' ')[0]}) ✕
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Student Grid / List for Daily Attendance */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid var(--color-border, #E2E8F0)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 20px',
              borderBottom: '1px solid #F1F5F9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setAttendanceFilter('ALL')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    background: attendanceFilter === 'ALL' ? '#0F172A' : '#F1F5F9',
                    color: attendanceFilter === 'ALL' ? '#FFFFFF' : '#64748B',
                  }}
                >
                  All ({courseStudents.length})
                </button>
                <button
                  onClick={() => setAttendanceFilter('PRESENT')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    background: attendanceFilter === 'PRESENT' ? '#16A34A' : '#F1F5F9',
                    color: attendanceFilter === 'PRESENT' ? '#FFFFFF' : '#64748B',
                  }}
                >
                  Present ({presentCount})
                </button>
                <button
                  onClick={() => setAttendanceFilter('ABSENT')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    background: attendanceFilter === 'ABSENT' ? '#DC2626' : '#F1F5F9',
                    color: attendanceFilter === 'ABSENT' ? '#FFFFFF' : '#64748B',
                  }}
                >
                  Absent ({absentCount})
                </button>
              </div>

              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Filter student..."
                  value={searchQuery}
                  onChange={e => onSearchQueryChange(e.target.value)}
                  style={{
                    padding: '7px 12px 7px 30px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.8rem',
                    width: '200px',
                  }}
                />
              </div>
            </div>

            {/* Student Attendance Cards Grid */}
            <div style={{ padding: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
              {filteredStudents
                .filter(s => {
                  const isAbsent = absentUsnSet.has(s.usn);
                  if (attendanceFilter === 'PRESENT') return !isAbsent;
                  if (attendanceFilter === 'ABSENT') return isAbsent;
                  return true;
                })
                .map(s => {
                  const isAbsent = absentUsnSet.has(s.usn);
                  const isShortage = s.attendancePercent < 75;

                  return (
                    <div
                      key={s.id}
                      onClick={() => toggleStudentAttendance(s.usn)}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: isAbsent ? '2px solid #F87171' : '1.5px solid #E2E8F0',
                        background: isAbsent ? '#FEF2F2' : '#FFFFFF',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.15s ease',
                        boxShadow: isAbsent ? '0 2px 8px rgba(239,68,68,0.1)' : '0 1px 3px rgba(0,0,0,0.02)',
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.88rem', color: isAbsent ? '#991B1B' : '#0F172A' }}>
                          {s.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: isAbsent ? '#B91C1C' : '#64748B' }}>
                          {s.usn}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: isShortage ? '#DC2626' : '#64748B', marginTop: '4px', fontWeight: 600 }}>
                          Cumulative: <strong>{s.attendancePercent}%</strong> ({s.classesAttended}/{s.classesHeld} classes)
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        {isAbsent ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#DC2626',
                            color: 'white',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 900,
                          }}>
                            <XCircle size={14} /> ABSENT
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: '#DCFCE7',
                            color: '#15803D',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 900,
                          }}>
                            <CheckCircle2 size={14} /> PRESENT
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Attendance History Section */}
          {relevantHistory.length > 0 && (
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px 24px',
              border: '1.5px solid var(--color-border, #E2E8F0)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <History size={18} color="#4F46E5" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>
                  Recorded Daily Attendance Sessions Log ({selectedCourseCode})
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {relevantHistory.map(log => (
                  <div
                    key={log.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: '#F8FAFC',
                      padding: '12px 18px',
                      borderRadius: '10px',
                      border: '1px solid #E2E8F0',
                      fontSize: '0.82rem',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, color: '#0F172A' }}>
                        Session #{log.sessionNumber}: {log.sessionTopic}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                        Recorded on {log.date} • Recorded at {log.recordedAt}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ color: '#16A34A', fontWeight: 800 }}>
                        {log.presentCount} Present
                      </span>
                      <span style={{ color: '#DC2626', fontWeight: 800 }}>
                        {log.absentCount} Absent
                      </span>
                      {log.absentUSNs.length > 0 && (
                        <span style={{ fontSize: '0.72rem', background: '#FEE2E2', color: '#B91C1C', padding: '2px 6px', borderRadius: '4px', fontFamily: 'monospace' }}>
                          [{log.absentUSNs.join(', ')}]
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          SUBVIEW 2: CIE INTERNAL ASSESSMENT MARKS (Milestone Entries)
         ══════════════════════════════════════════════════════════════ */}
      {activeSubView === 'CIE_MARKS' && (
        <div>
          {/* Milestone Filter Toolbar */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px 20px',
            border: '1.5px solid var(--color-border, #E2E8F0)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '18px',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#64748B' }}>Milestone Focus:</span>
              <div style={{ display: 'flex', gap: '4px', background: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
                <button
                  onClick={() => setMarksMilestone('ALL')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    background: marksMilestone === 'ALL' ? '#FFFFFF' : 'transparent',
                    color: marksMilestone === 'ALL' ? '#0F172A' : '#64748B',
                  }}
                >
                  All Components
                </button>
                <button
                  onClick={() => setMarksMilestone('CIE1')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    background: marksMilestone === 'CIE1' ? '#FFFFFF' : 'transparent',
                    color: marksMilestone === 'CIE1' ? '#4F46E5' : '#64748B',
                  }}
                >
                  CIE-1 (30M)
                </button>
                <button
                  onClick={() => setMarksMilestone('CIE2')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    background: marksMilestone === 'CIE2' ? '#FFFFFF' : 'transparent',
                    color: marksMilestone === 'CIE2' ? '#4F46E5' : '#64748B',
                  }}
                >
                  CIE-2 (30M)
                </button>
                <button
                  onClick={() => setMarksMilestone('LAB')}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    background: marksMilestone === 'LAB' ? '#FFFFFF' : 'transparent',
                    color: marksMilestone === 'LAB' ? '#4F46E5' : '#64748B',
                  }}
                >
                  Lab / Quiz (20M)
                </button>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search USN or Name..."
                value={searchQuery}
                onChange={e => onSearchQueryChange(e.target.value)}
                style={{
                  padding: '7px 12px 7px 30px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.8rem',
                  width: '240px',
                }}
              />
            </div>
          </div>

          {/* Student Marks Table */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid var(--color-border, #E2E8F0)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            overflow: 'hidden',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>USN & STUDENT</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>ATTENDANCE</th>
                    {(marksMilestone === 'ALL' || marksMilestone === 'CIE1') && (
                      <th style={{ padding: '12px 16px', fontWeight: 700 }}>CIE-1 (30M)</th>
                    )}
                    {(marksMilestone === 'ALL' || marksMilestone === 'CIE2') && (
                      <th style={{ padding: '12px 16px', fontWeight: 700 }}>CIE-2 (30M)</th>
                    )}
                    {(marksMilestone === 'ALL' || marksMilestone === 'LAB') && (
                      <th style={{ padding: '12px 16px', fontWeight: 700 }}>LAB / QUIZ (20M)</th>
                    )}
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>CUMULATIVE CIE (50M)</th>
                    <th style={{ padding: '12px 16px', fontWeight: 700 }}>HOD GATEWAY</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '36px', textAlign: 'center', color: '#94A3B8' }}>
                        No students found matching the query.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(student => {
                      const isShortage = student.attendancePercent < 75;
                      const isCIEPassing = student.totalCIE >= 20;

                      return (
                        <tr
                          key={student.id}
                          style={{
                            borderBottom: '1px solid #F1F5F9',
                            background: student.isModified ? '#F0FDF4' : 'transparent',
                          }}
                        >
                          {/* USN & Name */}
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 800, color: '#0F172A' }}>{student.name}</div>
                            <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#64748B' }}>
                              {student.usn}
                            </div>
                          </td>

                          {/* Attendance Info */}
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{
                              fontWeight: 800,
                              color: isShortage ? '#DC2626' : '#16A34A',
                            }}>
                              {student.attendancePercent}%
                            </span>
                            <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block' }}>
                              {student.classesAttended}/{student.classesHeld} classes
                            </span>
                          </td>

                          {/* CIE-1 Score Input */}
                          {(marksMilestone === 'ALL' || marksMilestone === 'CIE1') && (
                            <td style={{ padding: '14px 16px' }}>
                              <input
                                type="number"
                                min="0"
                                max="30"
                                value={student.cie1 || 0}
                                onChange={e =>
                                  onStudentFieldChange(
                                    student.id,
                                    'cie1',
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                style={{
                                  width: '58px',
                                  padding: '6px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid #CBD5E1',
                                  fontWeight: 800,
                                  fontSize: '0.85rem',
                                  textAlign: 'center',
                                  background: 'white',
                                }}
                              />
                            </td>
                          )}

                          {/* CIE-2 Score Input */}
                          {(marksMilestone === 'ALL' || marksMilestone === 'CIE2') && (
                            <td style={{ padding: '14px 16px' }}>
                              <input
                                type="number"
                                min="0"
                                max="30"
                                value={student.cie2 || 0}
                                onChange={e =>
                                  onStudentFieldChange(
                                    student.id,
                                    'cie2',
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                style={{
                                  width: '58px',
                                  padding: '6px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid #CBD5E1',
                                  fontWeight: 800,
                                  fontSize: '0.85rem',
                                  textAlign: 'center',
                                  background: 'white',
                                }}
                              />
                            </td>
                          )}

                          {/* Lab / Quiz Score Input */}
                          {(marksMilestone === 'ALL' || marksMilestone === 'LAB') && (
                            <td style={{ padding: '14px 16px' }}>
                              <input
                                type="number"
                                min="0"
                                max="20"
                                value={student.labOrQuiz || 0}
                                onChange={e =>
                                  onStudentFieldChange(
                                    student.id,
                                    'labOrQuiz',
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                style={{
                                  width: '58px',
                                  padding: '6px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid #CBD5E1',
                                  fontWeight: 800,
                                  fontSize: '0.85rem',
                                  textAlign: 'center',
                                  background: 'white',
                                }}
                              />
                            </td>
                          )}

                          {/* Cumulative Total */}
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontSize: '1rem', fontWeight: 900, color: '#4F46E5' }}>
                              {student.totalCIE}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}> / 50</span>
                          </td>

                          {/* Gateway Eligibility */}
                          <td style={{ padding: '14px 16px' }}>
                            {isShortage ? (
                              <span style={{
                                background: '#FEE2E2',
                                color: '#B91C1C',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                              }}>
                                ATTENDANCE SHORTAGE
                              </span>
                            ) : !isCIEPassing ? (
                              <span style={{
                                background: '#FEF3C7',
                                color: '#92400E',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                              }}>
                                CIE &lt; 20/50
                              </span>
                            ) : (
                              <span style={{
                                background: '#DCFCE7',
                                color: '#15803D',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                              }}>
                                QUALIFIED ✓
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
        </div>
      )}
    </div>
  );
};
