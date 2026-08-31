import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface CreateFacultyFormProps {
  onCancel: () => void;
  onSave: () => void;
}

export const CreateFacultyForm: React.FC<CreateFacultyFormProps> = ({ onCancel, onSave }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [roles, setRoles] = useState<string[]>([]);

  const handleRoleToggle = (role: string) => {
    setRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
  };

  const handleSaveInternal = () => {
    console.log("Saving Faculty:", { fullName, email, phone, department, roles });
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
        <h3 style={{ margin: '0 0 24px 0', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>Faculty Credentials</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Full Name</label>
            <input style={inputStyle} placeholder="e.g. Dr. Jane Doe" value={fullName} onChange={e => setFullName(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Department</label>
            <input style={inputStyle} placeholder="e.g. Mechanical Engineering" value={department} onChange={e => setDepartment(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Email Address (Login ID)</label>
            <input type="email" style={inputStyle} placeholder="jane.doe@university.edu" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Phone Number</label>
            <input type="tel" style={inputStyle} placeholder="+1 234 567 8900" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
          <label style={{ display: 'block', marginBottom: '16px', fontSize: '0.875rem', fontWeight: 600 }}>Assigned Roles</label>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            {['Invigilator', 'Evaluator', 'Room Superintendent', 'Examiner'].map(role => (
              <label key={role} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={roles.includes(role)} 
                  onChange={() => handleRoleToggle(role)} 
                  style={{ width: '16px', height: '16px' }}
                />
                <span style={{ fontSize: '0.875rem' }}>{role}</span>
              </label>
            ))}
          </div>
        </div>
      </Card>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSaveInternal}>Save Faculty</Button>
      </div>
    </div>
  );
};
