import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface CreateRoomFormProps {
  onCancel: () => void;
  onSave: () => void;
}

export const CreateRoomForm: React.FC<CreateRoomFormProps> = ({ onCancel, onSave }) => {
  const [roomNumber, setRoomNumber] = useState('');
  const [building, setBuilding] = useState('');
  const [capacity, setCapacity] = useState('');
  const [roomStatus, setRoomStatus] = useState('Available');

  const handleSaveInternal = () => {
    console.log("Saving Room:", { roomNumber, building, capacity, roomStatus });
    onSave();
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-surface)',
    color: 'var(--color-text-primary)',
    fontSize: '0.875rem'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <Card variant="flat">
        <h3 style={{ margin: '0 0 24px 0', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>Room Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Room Number</label>
            <input style={inputStyle} placeholder="e.g. B-205" value={roomNumber} onChange={e => setRoomNumber(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Building / Block</label>
            <input style={inputStyle} placeholder="e.g. South Wing" value={building} onChange={e => setBuilding(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Seating Capacity</label>
            <input type="number" style={inputStyle} placeholder="e.g. 40" value={capacity} onChange={e => setCapacity(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Status</label>
            <select style={inputStyle} value={roomStatus} onChange={e => setRoomStatus(e.target.value)}>
              <option value="Available">Available</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>
      </Card>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSaveInternal}>Save Room</Button>
      </div>
    </div>
  );
};
