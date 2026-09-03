import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Clock, CalendarDays, Users, BookOpen, ArrowRight, Eye, Pencil, CheckCircle } from 'lucide-react';

interface Session {
  id: string;
  name: string;
  date: string;
  time: string;
  status: 'Pending Allocation' | 'Allocated';
  examType: 'SEE (Semester End Examination)';
  departments: string[];
  subjects: string[];
  totalStudents: number;
  rooms: number;
}

interface SessionListProps {
  onAllocate: (id: string) => void;  // navigate to full allocation wizard
  onView: (id: string) => void;      // navigate to blueprint view
}

const SESSIONS: Session[] = [
  {
    id: 'SESS_001',
    name: 'SEE Autumn 2026 — Core Sciences & Common Engineering (Semesters 1 & 3)',
    date: 'December 12, 2026',
    time: '09:30 AM – 12:30 PM',
    status: 'Pending Allocation',
    examType: 'SEE (Semester End Examination)',
    departments: ['CSE', 'ECE', 'ME', 'CV', 'AIML'],
    subjects: ['CS101', 'EC101', 'ME101', 'MA101'],
    totalStudents: 860,
    rooms: 0,
  },
  {
    id: 'SESS_002',
    name: 'SEE Autumn 2026 — Professional Core & Departmental Majors (Semesters 5 & 7)',
    date: 'December 18, 2026',
    time: '02:00 PM – 05:00 PM',
    status: 'Allocated',
    examType: 'SEE (Semester End Examination)',
    departments: ['CSE', 'ECE', 'ME', 'CV'],
    subjects: ['CS301', 'EC301', 'ME301', 'CV301'],
    totalStudents: 740,
    rooms: 12,
  },
  {
    id: 'SESS_003',
    name: 'SEE Spring 2027 — Institutional Main Examination Series (All Semesters)',
    date: 'May 10, 2027',
    time: '09:30 AM – 12:30 PM',
    status: 'Pending Allocation',
    examType: 'SEE (Semester End Examination)',
    departments: ['CSE', 'ECE', 'ME', 'CV', 'ISE', 'AIML'],
    subjects: ['CS401', 'EC401', 'ME401', 'CV401', 'AI401'],
    totalStudents: 980,
    rooms: 0,
  },
];

const statusMeta = {
  'Pending Allocation': { color: '#ed7245', gradient: 'linear-gradient(135deg, #ed724522 0%, #ed724508 100%)', border: '#ed724544' },
  'Allocated':          { color: '#48977f', gradient: 'linear-gradient(135deg, #48977f22 0%, #48977f08 100%)', border: '#48977f44' },
};

export const SessionList: React.FC<SessionListProps> = ({ onAllocate, onView }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* CoE Institutional Scope Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
        border: '1.5px solid #C7D2FE',
        borderRadius: '14px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.25rem' }}>🏛️</span>
          <div>
            <div style={{ fontWeight: 800, color: '#3730A3', fontSize: '0.85rem' }}>
              CoE Institution-Wide Scope: Semester End Examinations (SEE) Across All Academic Departments
            </div>
            <div style={{ fontSize: '0.78rem', color: '#4F46E5', marginTop: '2px' }}>
              CoE centrally coordinates SEE exam dates, interleaved multi-department seating allotments, and campus-wide halls. Continuous Internal Evaluations (CIE) are conducted independently by Department HODs.
            </div>
          </div>
        </div>

        <span style={{
          background: '#4F46E5',
          color: 'white',
          fontSize: '0.72rem',
          fontWeight: 800,
          padding: '4px 10px',
          borderRadius: '20px',
          whiteSpace: 'nowrap'
        }}>
          ALL DEPARTMENTS ACTIVE
        </span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: 40, height: 40, borderRadius: '10px', background: '#8b5cf615', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
          <CalendarDays size={20} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem' }}>Upcoming SEE Institutional Sessions</h3>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>Select an institution-wide examination session to allocate rooms and invigilators</p>
        </div>
      </div>

      {/* Session Cards */}
      {SESSIONS.map(sess => {
        const meta = statusMeta[sess.status];
        const isPending = sess.status === 'Pending Allocation';

        return (
          <div
            key={sess.id}
            style={{
              background: 'white',
              borderRadius: '16px',
              border: `1.5px solid ${meta.border}`,
              borderTop: `5px solid ${meta.color}`,
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              transition: 'box-shadow 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 28px ${meta.color}22`; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
          >
            {/* Card body */}
            <div style={{ padding: '24px 28px', background: meta.gradient, position: 'relative', overflow: 'hidden' }}>
              {/* Large calendar vector - background decoration */}
              <svg style={{ position: 'absolute', right: -20, bottom: -20, opacity: 0.08, pointerEvents: 'none' }} viewBox="0 0 120 120" width="120" height="120">
                <rect x="10" y="20" width="100" height="90" rx="10" fill={meta.color} />
                <rect x="10" y="20" width="100" height="28" rx="10" fill={meta.color} />
                <rect x="10" y="38" width="100" height="10" fill={meta.color} />
                <rect x="30" y="8"  width="12" height="24" rx="6" fill={meta.color} />
                <rect x="78" y="8"  width="12" height="24" rx="6" fill={meta.color} />
                {[30,50,70,90].map(x => [60,75,90,105].map(y => (
                  <rect key={`${x}${y}`} x={x} y={y} width="10" height="10" rx="2" fill="white" opacity="0.35" />
                )))}
              </svg>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <Badge variant={isPending ? 'warning' : 'success'}>{sess.status}</Badge>
                    {!isPending && <CheckCircle size={16} color="#48977f" />}
                  </div>
                  <h2 style={{ margin: '0 0 12px 0', fontWeight: 800, fontSize: '1.3rem', color: 'var(--color-text-primary)', lineHeight: 1.2 }}>
                    {sess.name}
                  </h2>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.83rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                      <CalendarDays size={14} color={meta.color} /> {sess.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.83rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                      <Clock size={14} color={meta.color} /> {sess.time}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.83rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                      <Users size={14} color={meta.color} /> {sess.totalStudents} Students
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.83rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
                      <BookOpen size={14} color={meta.color} /> {sess.subjects.length} Subjects
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card footer */}
            <div style={{
              padding: '16px 28px',
              borderTop: `1px solid ${meta.border}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'white',
            }}>
              {/* Department & Subject chips */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B' }}>DEPARTMENTS:</span>
                {sess.departments.map(dept => (
                  <span key={dept} style={{
                    background: '#EEF2FF',
                    color: '#4F46E5',
                    border: '1px solid #C7D2FE',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 900,
                  }}>
                    {dept}
                  </span>
                ))}
                <span style={{ color: '#CBD5E1' }}>|</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B' }}>SUBJECTS:</span>
                {sess.subjects.map(code => (
                  <span key={code} style={{
                    background: `${meta.color}12`,
                    color: meta.color,
                    border: `1px solid ${meta.color}33`,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}>
                    {code}
                  </span>
                ))}
                {sess.rooms > 0 && (
                  <span style={{ background: '#8b5cf612', color: '#8b5cf6', border: '1px solid #8b5cf633', padding: '2px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
                    {sess.rooms} Exam Halls Assigned
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '10px', flexShrink: 0, marginLeft: '16px' }}>
                {isPending ? (
                  <button
                    onClick={() => onAllocate(sess.id)}
                    style={{
                      background: `linear-gradient(135deg, ${meta.color}, #c85a30)`,
                      color: 'white',
                      border: 'none',
                      padding: '10px 22px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: `0 4px 14px ${meta.color}44`,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Pencil size={15} /> Start Allocation <ArrowRight size={15} />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => onAllocate(sess.id)}
                      style={{
                        background: 'transparent',
                        color: meta.color,
                        border: `1.5px solid ${meta.color}`,
                        padding: '10px 18px',
                        borderRadius: '10px',
                        fontWeight: 600,
                        fontSize: '0.83rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => onView(sess.id)}
                      style={{
                        background: `linear-gradient(135deg, ${meta.color}, #2f6852)`,
                        color: 'white',
                        border: 'none',
                        padding: '10px 22px',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: `0 4px 14px ${meta.color}44`,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Eye size={15} /> View Blueprint <ArrowRight size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
