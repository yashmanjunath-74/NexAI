import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Clock, CalendarDays, Users, BookOpen, ArrowRight, Eye, Pencil, CheckCircle } from 'lucide-react';

interface Session {
  id: string;
  name: string;
  date: string;
  time: string;
  status: 'Pending Allocation' | 'Allocated';
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
    name: 'Midterm Examinations — Fall 2026',
    date: 'October 15, 2026',
    time: '10:00 AM',
    status: 'Pending Allocation',
    subjects: ['CS101', 'CS201', 'MA101'],
    totalStudents: 315,
    rooms: 0,
  },
  {
    id: 'SESS_002',
    name: 'End Semester Finals — Fall 2026',
    date: 'December 10, 2026',
    time: '09:00 AM',
    status: 'Allocated',
    subjects: ['CS301', 'MA201', 'EC101'],
    totalStudents: 345,
    rooms: 4,
  },
];

const statusMeta = {
  'Pending Allocation': { color: '#ed7245', gradient: 'linear-gradient(135deg, #ed724522 0%, #ed724508 100%)', border: '#ed724544' },
  'Allocated':          { color: '#48977f', gradient: 'linear-gradient(135deg, #48977f22 0%, #48977f08 100%)', border: '#48977f44' },
};

export const SessionList: React.FC<SessionListProps> = ({ onAllocate, onView }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ width: 40, height: 40, borderRadius: '10px', background: '#8b5cf615', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8b5cf6' }}>
          <CalendarDays size={20} />
        </div>
        <div>
          <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem' }}>Upcoming Exam Sessions</h3>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>Select a session to allocate rooms and invigilators</p>
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
              {/* Subject chips */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {sess.subjects.map(code => (
                  <span key={code} style={{
                    background: `${meta.color}12`,
                    color: meta.color,
                    border: `1px solid ${meta.color}33`,
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.3px',
                  }}>
                    {code}
                  </span>
                ))}
                {sess.rooms > 0 && (
                  <span style={{ background: '#8b5cf612', color: '#8b5cf6', border: '1px solid #8b5cf633', padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700 }}>
                    {sess.rooms} Rooms Assigned
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
