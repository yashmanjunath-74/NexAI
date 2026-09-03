import React from 'react';
import { AssignedCourse } from '../../types';
import { Users } from 'lucide-react';

interface AssignedCoursesTabProps {
  courses: AssignedCourse[];
  onSelectCourseForStudents: (courseCode: string) => void;
  onSelectCourseForCIE: (courseCode: string) => void;
}

export const AssignedCoursesTab: React.FC<AssignedCoursesTabProps> = ({
  courses,
  onSelectCourseForStudents,
  onSelectCourseForCIE,
}) => {
  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
          Course Assignments Delegated by Head of Department
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#64748B' }}>
          You have been officially allocated as course in-charge for these subjects for Fall Semester 2026.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        {courses.map(c => (
          <div
            key={c.code}
            style={{
              background: '#FFFFFF',
              borderRadius: '18px',
              border: '1.5px solid var(--color-border, #E2E8F0)',
              padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{
                  background: '#EEF2FF',
                  color: '#4F46E5',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  padding: '4px 10px',
                  borderRadius: '8px',
                }}>
                  {c.code}
                </span>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700 }}>
                  {c.credits} Credits • {c.semester}
                </span>
              </div>

              <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: 800, color: '#0F172A' }}>
                {c.title}
              </h3>
              <p style={{ margin: '0 0 18px 0', fontSize: '0.8rem', color: '#64748B' }}>
                Next Session: <strong style={{ color: '#0F172A' }}>{c.nextClassTime}</strong>
              </p>

              {/* Quick Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>ENROLLED STUDENTS</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0F172A' }}>{c.totalEnrolled}</div>
                </div>
                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>AVG ATTENDANCE</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#16A34A' }}>{c.avgAttendance}%</div>
                </div>
              </div>

              {/* Syllabus Progress */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>
                  <span>Syllabus Completion</span>
                  <span>{c.syllabusCompletion}%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${c.syllabusCompletion}%`, height: '100%', background: '#4F46E5', borderRadius: '3px' }} />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
              <button
                onClick={() => onSelectCourseForStudents(c.code)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#4F46E5',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Users size={15} /> Manage Attendance & Marks
              </button>

              <button
                onClick={() => onSelectCourseForCIE(c.code)}
                style={{
                  padding: '10px 14px',
                  background: '#EEF2FF',
                  color: '#4F46E5',
                  border: '1px solid #C7D2FE',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                CIE Papers
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
