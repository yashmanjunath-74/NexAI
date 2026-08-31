import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';

import { SubjectSelection } from './steps/SubjectSelection';
import { RoomAllocation }   from './steps/RoomAllocation';
import { InvigilatorAssignment } from './steps/InvigilatorAssignment';
import { SeatingBlueprint } from './SeatingBlueprint';

interface Room {
  id: string;
  roomNumber: string;
  building: string;
  capacity: number;
}

interface AllocationWizardProps {
  sessionId: string;
  onComplete: () => void;
}

const STEP_LABELS = ['Subjects', 'Rooms', 'Invigilators', 'Blueprint'];
const STEP_COLORS = ['#48977f', '#3b82f6', '#8b5cf6', '#ed7245'];

export const AllocationWizard: React.FC<AllocationWizardProps> = ({ sessionId: _sessionId, onComplete }) => {
  const [step, setStep] = useState(1);

  // Wizard state
  const [selectedSubjects, setSelectedSubjects]             = useState<any[]>([]);
  const [totalRequiredCapacity, setTotalRequiredCapacity]   = useState(0);
  const [selectedRooms, setSelectedRooms]                   = useState<Room[]>([]);
  const [assignments, setAssignments]                       = useState<Record<string, string>>({});

  const handleSubjectSelectionNext = (subjects: any[], capacity: number) => {
    setSelectedSubjects(subjects);
    setTotalRequiredCapacity(capacity);
    setStep(2);
  };

  const handleRoomAllocationNext = (rooms: Room[]) => {
    setSelectedRooms(rooms);
    setStep(3);
  };

  const handlePublish = (finalAssignments: Record<string, string>) => {
    setAssignments(finalAssignments);
    setStep(4);
  };

  return (
    <div>
      {/* ── Step progress bar ── */}
      {step < 4 && (
        <Card variant="flat" style={{ padding: '16px 24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {STEP_LABELS.slice(0, 3).map((label, idx) => {
              const num       = idx + 1;
              const isDone    = step > num;
              const isActive  = step === num;
              const color     = STEP_COLORS[idx];
              return (
                <React.Fragment key={label}>
                  {/* Step circle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: isDone || isActive ? color : 'var(--color-border)',
                      color: isDone || isActive ? 'white' : 'var(--color-text-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '0.85rem', flexShrink: 0,
                      transition: 'all 0.3s ease',
                    }}>
                      {isDone ? '✓' : num}
                    </div>
                    <span style={{
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.85rem',
                      color: isActive ? color : isDone ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      whiteSpace: 'nowrap',
                    }}>
                      {label}
                    </span>
                  </div>
                  {/* Connector */}
                  {idx < 2 && (
                    <div style={{
                      flex: 1, height: '3px', borderRadius: '2px', margin: '0 8px',
                      background: step > num ? color : 'var(--color-border)',
                      transition: 'background 0.4s ease',
                    }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </Card>
      )}

      {/* ── Step content ── */}
      {step === 1 && <SubjectSelection onNext={handleSubjectSelectionNext} />}

      {step === 2 && (
        <Card variant="flat" style={{ padding: '28px' }}>
          <RoomAllocation
            totalRequiredCapacity={totalRequiredCapacity}
            onNext={handleRoomAllocationNext}
            onBack={() => setStep(1)}
          />
        </Card>
      )}

      {step === 3 && (
        <Card variant="flat" style={{ padding: '28px' }}>
          <InvigilatorAssignment
            selectedRooms={selectedRooms}
            onBack={() => setStep(2)}
            onPublish={handlePublish}
          />
        </Card>
      )}

      {step === 4 && (
        <SeatingBlueprint
          selectedSubjects={selectedSubjects}
          selectedRooms={selectedRooms}
          assignments={assignments}
          onReturn={onComplete}
        />
      )}
    </div>
  );
};
