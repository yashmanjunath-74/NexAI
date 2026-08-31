import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Room {
  id: string;
  roomNumber: string;
  building: string;
  capacity: number;
}

interface RoomAllocationProps {
  totalRequiredCapacity: number;
  onNext: (selectedRooms: Room[]) => void;
  onBack: () => void;
}

export const RoomAllocation: React.FC<RoomAllocationProps> = ({ totalRequiredCapacity, onNext, onBack }) => {
  const [selectedRoomIds, setSelectedRoomIds] = useState<string[]>([]);

  const availableRooms: Room[] = [
    { id: 'R1', roomNumber: 'A-101', building: 'Main Block', capacity: 60 },
    { id: 'R2', roomNumber: 'A-102', building: 'Main Block', capacity: 40 },
    { id: 'R3', roomNumber: 'B-201', building: 'South Wing', capacity: 50 },
    { id: 'R4', roomNumber: 'B-205', building: 'South Wing', capacity: 40 },
  ];

  const handleToggleRoom = (id: string) => {
    setSelectedRoomIds(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const selectedRooms = availableRooms.filter(r => selectedRoomIds.includes(r.id));
  const currentAllocatedCapacity = selectedRooms.reduce((sum, r) => sum + r.capacity, 0);
  
  const isCapacityMet = currentAllocatedCapacity >= totalRequiredCapacity;
  const progressPercentage = Math.min((currentAllocatedCapacity / totalRequiredCapacity) * 100, 100) || 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={{ margin: '0 0 8px 0' }}>Step 2: Room Allocation</h3>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
          Select enough rooms to accommodate {totalRequiredCapacity} students.
        </p>
      </div>

      {/* Progress Bar */}
      <Card variant="flat" style={{ padding: '16px', background: isCapacityMet ? 'var(--color-success-light)' : 'var(--color-bg-surface)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isCapacityMet ? 'var(--color-success)' : 'var(--color-text-primary)' }}>
            Capacity Fulfillment
          </span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: isCapacityMet ? 'var(--color-success)' : 'var(--color-text-primary)' }}>
            {currentAllocatedCapacity} / {totalRequiredCapacity} Seats
          </span>
        </div>
        <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-border)', borderRadius: '4px', overflow: 'hidden' }}>
          <div 
            style={{ 
              height: '100%', 
              width: `${progressPercentage}%`, 
              backgroundColor: isCapacityMet ? 'var(--color-success)' : 'var(--color-primary)',
              transition: 'width 0.3s ease, background-color 0.3s ease'
            }} 
          />
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {availableRooms.map(room => (
          <div 
            key={room.id}
            onClick={() => handleToggleRoom(room.id)}
            style={{ 
              padding: '16px',
              border: selectedRoomIds.includes(room.id) ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              backgroundColor: selectedRoomIds.includes(room.id) ? 'var(--color-bg-surface)' : 'transparent',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ margin: 0 }}>{room.roomNumber}</h4>
              <input 
                type="checkbox" 
                checked={selectedRoomIds.includes(room.id)} 
                readOnly 
                style={{ width: '16px', height: '16px' }} 
              />
            </div>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{room.building}</p>
            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-primary)' }}>{room.capacity} Seats</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button variant="primary" onClick={() => onNext(selectedRooms)} disabled={!isCapacityMet}>
          Continue to Invigilators
        </Button>
      </div>
    </div>
  );
};
