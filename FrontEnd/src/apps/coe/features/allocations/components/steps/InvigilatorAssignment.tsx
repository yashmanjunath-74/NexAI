import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Room {
  id: string;
  roomNumber: string;
  building: string;
  capacity: number;
}

interface InvigilatorAssignmentProps {
  selectedRooms: Room[];
  onBack: () => void;
  onPublish: (assignments: Record<string, string>) => void;
}

export const InvigilatorAssignment: React.FC<InvigilatorAssignmentProps> = ({ selectedRooms, onBack, onPublish }) => {
  // Map of room ID to assigned faculty ID
  const [assignments, setAssignments] = useState<Record<string, string>>({});

  const availableFaculty = [
    { id: 'F1', name: 'Dr. Alan Turing', department: 'Computer Science' },
    { id: 'F2', name: 'Dr. Grace Hopper', department: 'Computer Science' },
    { id: 'F3', name: 'Dr. John von Neumann', department: 'Mathematics' },
    { id: 'F4', name: 'Dr. Ada Lovelace', department: 'Mathematics' },
  ];

  const handleAssign = (roomId: string, facultyId: string) => {
    setAssignments(prev => ({
      ...prev,
      [roomId]: facultyId
    }));
  };

  const isAllAssigned = selectedRooms.every(r => assignments[r.id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ margin: '0 0 8px 0' }}>Step 3: Invigilator Assignment</h3>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          Assign a faculty member to each of the selected exam rooms.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {selectedRooms.map(room => (
          <Card key={room.id} variant="flat" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h4 style={{ margin: '0 0 4px 0' }}>{room.roomNumber}</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                {room.building} • Capacity: {room.capacity}
              </p>
            </div>
            
            <div style={{ minWidth: '250px' }}>
              <select 
                value={assignments[room.id] || ''} 
                onChange={(e) => handleAssign(room.id, e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '10px 14px', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-bg-surface)',
                  fontSize: '0.875rem'
                }}
              >
                <option value="" disabled>Select Invigilator...</option>
                {availableFaculty.map(faculty => {
                  // Disable option if faculty is already assigned to another room
                  const isAssignedElsewhere = Object.entries(assignments).some(([rId, fId]) => fId === faculty.id && rId !== room.id);
                  return (
                    <option key={faculty.id} value={faculty.id} disabled={isAssignedElsewhere}>
                      {faculty.name} ({faculty.department}) {isAssignedElsewhere ? '- Assigned' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button variant="primary" onClick={() => onPublish(assignments)} disabled={!isAllAssigned}>
          Review & Publish Allocation
        </Button>
      </div>
    </div>
  );
};
