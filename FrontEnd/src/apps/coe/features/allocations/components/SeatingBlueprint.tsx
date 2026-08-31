import React, { useState } from 'react';
import { Users, DoorOpen, UserCheck, MapPin, CheckCircle, Download } from 'lucide-react';

interface Room {
  id: string;
  roomNumber: string;
  building: string;
  capacity: number;
}

interface SeatingBlueprintProps {
  selectedSubjects: { code: string; title: string; eligibleStudents: number; color?: string }[];
  selectedRooms: Room[];
  assignments: Record<string, string>; // roomId -> invigilator name
  onReturn: () => void;
}

// Generate mock students distributed across rooms
const STUDENT_POOL: { usn: string; name: string; subject: string; color: string }[] = [
  ...Array.from({ length: 60 }, (_, i) => ({
    usn:     `1RV21CS${String(i + 1).padStart(3, '0')}`,
    name:    ['Arjun', 'Priya', 'Rahul', 'Sneha', 'Kiran', 'Divya', 'Rohan', 'Ananya', 'Vivek', 'Pooja'][i % 10] + ' ' + ['Sharma', 'Patel', 'Nair', 'Reddy', 'Kumar', 'Singh', 'Mehta', 'Joshi', 'Iyer', 'Gupta'][Math.floor(i / 6) % 10],
    subject: 'CS101',
    color:   '#48977f',
  })),
  ...Array.from({ length: 85 }, (_, i) => ({
    usn:     `1RV21CS${String(i + 61).padStart(3, '0')}`,
    name:    ['Aditya', 'Meera', 'Sanjay', 'Lakshmi', 'Kartik', 'Nisha', 'Varun', 'Swati', 'Nikhil', 'Isha'][i % 10] + ' ' + ['Verma', 'Tiwari', 'Saxena', 'Chauhan', 'Bose', 'Pillai', 'Rao', 'Das', 'Shah', 'Malhotra'][Math.floor(i / 9) % 10],
    subject: 'CS201',
    color:   '#3b82f6',
  })),
];

// Seat grid component for a single room
const RoomBlueprint: React.FC<{
  room: Room;
  invigilator: string;
  students: typeof STUDENT_POOL;
  cols?: number;
}> = ({ room, invigilator, students, cols = 8 }) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const seats = Array.from({ length: room.capacity }, (_, i) => students[i] || null);
  const occupied = students.length;

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      border: '1.5px solid var(--color-border)',
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    }}>
      {/* Room header */}
      <div style={{
        background: 'linear-gradient(135deg, #48977f, #2f6852)',
        padding: '18px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative rings */}
        <svg style={{ position: 'absolute', right: -20, top: -20, opacity: 0.12, pointerEvents: 'none' }} viewBox="0 0 100 100" width="100" height="100">
          <circle cx="80" cy="20" r="60" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="80" cy="20" r="40" fill="none" stroke="white" strokeWidth="1.5" />
          <circle cx="80" cy="20" r="22" fill="white" />
        </svg>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <DoorOpen size={20} color="white" />
              <h3 style={{ margin: 0, color: 'white', fontWeight: 800, fontSize: '1.3rem' }}>Room {room.roomNumber}</h3>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} /> {room.building}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <UserCheck size={12} /> {invigilator || 'Unassigned'}
              </span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '8px 14px' }}>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', fontWeight: 500 }}>OCCUPIED</p>
              <p style={{ margin: 0, color: 'white', fontWeight: 800, fontSize: '1.2rem' }}>
                {occupied}<span style={{ fontSize: '0.8rem', fontWeight: 500 }}>/{room.capacity}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject legend */}
      {students.length > 0 && (
        <div style={{ padding: '10px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', gap: '12px', flexWrap: 'wrap', background: '#fafafa' }}>
          {[...new Set(students.map(s => s.subject))].map(code => {
            const color = students.find(s => s.subject === code)?.color || '#48977f';
            const count = students.filter(s => s.subject === code).length;
            return (
              <div key={code} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
                <div style={{ width: 10, height: 10, borderRadius: '2px', background: color }} />
                <span style={{ fontWeight: 600, color }}>{code}</span>
                <span style={{ color: 'var(--color-text-secondary)' }}>({count} students)</span>
              </div>
            );
          })}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '2px', border: '1.5px dashed #ccc', background: '#f5f5f5' }} />
            <span style={{ color: 'var(--color-text-secondary)' }}>Empty ({room.capacity - occupied})</span>
          </div>
        </div>
      )}

      {/* Seat grid */}
      <div style={{ padding: '20px 24px' }}>
        {/* Invigilator desk indicator */}
        <div style={{
          textAlign: 'center',
          marginBottom: '16px',
          padding: '8px',
          background: '#f0faf5',
          border: '1.5px dashed #48977f44',
          borderRadius: '8px',
          fontSize: '0.75rem',
          color: '#48977f',
          fontWeight: 600,
          letterSpacing: '1px',
        }}>
          ▲ INVIGILATOR / FRONT
        </div>

        {/* Aisle labels */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: '6px',
        }}>
          {seats.map((student, idx) => {
            const col = idx % cols;
            // Add aisle gap after col 3 visually (we fake it with margin)
            const hasAisle = col === 3;
            return (
              <div
                key={idx}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  width: '100%',
                  aspectRatio: '1',
                  minWidth: '32px',
                  maxWidth: '48px',
                  borderRadius: '6px',
                  background: student ? student.color : '#f0f0f0',
                  border: student
                    ? `1.5px solid ${student.color}88`
                    : '1.5px dashed #d0d0d0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: student ? 'pointer' : 'default',
                  position: 'relative',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                  transform: hovered === idx ? 'scale(1.15)' : 'scale(1)',
                  boxShadow: hovered === idx && student ? `0 4px 12px ${student.color}55` : 'none',
                  marginRight: hasAisle ? '8px' : '0',
                }}
                title={student ? `${student.usn} — ${student.name} (${student.subject})` : `Seat ${idx + 1} — Empty`}
              >
                {student ? (
                  <span style={{ fontSize: '0.5rem', fontWeight: 700, color: 'white', textAlign: 'center', lineHeight: 1, padding: '2px' }}>
                    {student.name.split(' ').map(w => w[0]).join('')}
                  </span>
                ) : (
                  <span style={{ fontSize: '0.6rem', color: '#bbb' }}>{idx + 1}</span>
                )}

                {/* Tooltip on hover */}
                {hovered === idx && student && (
                  <div style={{
                    position: 'absolute',
                    bottom: '110%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#1a1a2e',
                    color: 'white',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '0.7rem',
                    whiteSpace: 'nowrap',
                    zIndex: 100,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}>
                    <div style={{ fontWeight: 700 }}>{student.usn}</div>
                    <div style={{ color: '#aaa' }}>{student.name}</div>
                    <div style={{ color: student.color }}>{student.subject}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const SeatingBlueprint: React.FC<SeatingBlueprintProps> = ({
  selectedSubjects,
  selectedRooms,
  assignments,
  onReturn,
}) => {
  // Distribute students across rooms
  let studentQueue = [...STUDENT_POOL].filter(s =>
    selectedSubjects.some(sub => sub.code === s.subject)
  );

  const roomStudents: Record<string, typeof STUDENT_POOL> = {};
  selectedRooms.forEach(room => {
    roomStudents[room.id] = studentQueue.splice(0, room.capacity);
  });

  const totalStudents = Object.values(roomStudents).reduce((sum, arr) => sum + arr.length, 0);
  const totalCapacity = selectedRooms.reduce((sum, r) => sum + r.capacity, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* ── Success Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #48977f 0%, #2f6852 100%)',
        borderRadius: '16px',
        padding: '28px 36px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <svg style={{ position: 'absolute', right: -20, top: -20, opacity: 0.1, pointerEvents: 'none' }} viewBox="0 0 200 200" width="200" height="200">
          <circle cx="160" cy="40"  r="90" fill="white" />
          <circle cx="160" cy="40"  r="60" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="30"  cy="180" r="60" fill="white" opacity="0.5" />
        </svg>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={30} color="white" />
            </div>
            <div>
              <h2 style={{ margin: 0, color: 'white', fontWeight: 800 }}>Allocation Published!</h2>
              <p style={{ margin: '4px 0 0 0', color: 'rgba(255,255,255,0.75)', fontSize: '0.875rem' }}>
                {totalStudents} students assigned across {selectedRooms.length} rooms
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.4)', color: 'white', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
            >
              <Download size={16} /> Export PDF
            </button>
            <button
              onClick={onReturn}
              style={{ background: 'white', border: 'none', color: '#48977f', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
            >
              Dashboard →
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats row ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        {[
          { label: 'Rooms Used',      value: selectedRooms.length,  color: '#48977f', icon: <DoorOpen size={20} /> },
          { label: 'Subjects',        value: selectedSubjects.length, color: '#3b82f6', icon: <Users size={20} /> },
          { label: 'Students Seated', value: totalStudents,          color: '#8b5cf6', icon: <UserCheck size={20} /> },
          { label: 'Total Capacity',  value: totalCapacity,          color: '#ed7245', icon: <CheckCircle size={20} /> },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'white',
            borderRadius: '12px',
            border: `1px solid ${stat.color}22`,
            borderTop: `4px solid ${stat.color}`,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <div style={{ width: 40, height: 40, borderRadius: '10px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 500 }}>{stat.label}</p>
              <p style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Seating blueprints per room ── */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontWeight: 700 }}>🗺️ Seating Blueprint</h3>
          <span style={{ background: '#48977f15', color: '#48977f', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 }}>Visual Floor Plan</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {selectedRooms.map(room => (
            <RoomBlueprint
              key={room.id}
              room={room}
              invigilator={assignments[room.id] || 'Unassigned'}
              students={roomStudents[room.id] || []}
              cols={8}
            />
          ))}
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--color-text-secondary)', margin: 0 }}>
        💡 Hover over any seat to see the student's USN, name, and subject.
      </p>
    </div>
  );
};
