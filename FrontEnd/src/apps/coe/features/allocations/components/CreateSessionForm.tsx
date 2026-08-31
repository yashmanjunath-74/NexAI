import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface CreateSessionFormProps {
  onCancel: () => void;
  onSave: () => void;
}

export const CreateSessionForm: React.FC<CreateSessionFormProps> = ({ onCancel, onSave }) => {
  const [sessionName, setSessionName] = useState('');
  const [examType, setExamType] = useState('Midterm');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [instructions, setInstructions] = useState('');

  const handleSaveInternal = () => {
    console.log("Saving Session:", { sessionName, examType, startDate, startTime, endTime, instructions });
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
        <h3 style={{ margin: '0 0 24px 0', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>Session Details</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Session Name</label>
            <input style={inputStyle} placeholder="e.g. Midterm - Fall 2026" value={sessionName} onChange={e => setSessionName(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Exam Type</label>
            <select style={inputStyle} value={examType} onChange={e => setExamType(e.target.value)}>
              <option value="Internal">Internal Assessment</option>
              <option value="Midterm">Midterm Examination</option>
              <option value="Final">Final Examination</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Start Date</label>
            <input type="date" style={inputStyle} value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Start Time</label>
            <input type="time" style={inputStyle} value={startTime} onChange={e => setStartTime(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>End Time</label>
            <input type="time" style={inputStyle} value={endTime} onChange={e => setEndTime(e.target.value)} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Special Instructions</label>
          <textarea 
            style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} 
            placeholder="e.g. Calculators allowed. Students must bring ID cards." 
            value={instructions} 
            onChange={e => setInstructions(e.target.value)} 
          />
        </div>
      </Card>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSaveInternal}>Save Session</Button>
      </div>
    </div>
  );
};
