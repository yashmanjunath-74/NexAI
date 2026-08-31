import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

interface CreateSubjectFormProps {
  onCancel: () => void;
  onSave: () => void;
}

export const CreateSubjectForm: React.FC<CreateSubjectFormProps> = ({ onCancel, onSave }) => {
  // Form State
  const [subjectCode, setSubjectCode] = useState('');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [credits, setCredits] = useState('4');

  // CO State
  const [cos, setCos] = useState<{ id: string; code: string; description: string }[]>([
    { id: '1', code: 'CO1', description: '' }
  ]);

  // CO-PO Matrix State (co_id -> po_number -> level)
  const [matrix, setMatrix] = useState<Record<string, Record<string, string>>>({});

  const handleAddCo = () => {
    const nextCode = `CO${cos.length + 1}`;
    setCos([...cos, { id: Date.now().toString(), code: nextCode, description: '' }]);
  };

  const handleRemoveCo = (idToRemove: string) => {
    setCos(cos.filter(co => co.id !== idToRemove));
    const newMatrix = { ...matrix };
    delete newMatrix[idToRemove];
    setMatrix(newMatrix);
  };

  const handleCoDescriptionChange = (id: string, val: string) => {
    setCos(cos.map(co => co.id === id ? { ...co, description: val } : co));
  };

  const handleMatrixChange = (coId: string, poNum: number, val: string) => {
    setMatrix(prev => ({
      ...prev,
      [coId]: {
        ...(prev[coId] || {}),
        [poNum.toString()]: val
      }
    }));
  };

  const handleSaveInternal = () => {
    console.log("Saving subject:", { subjectCode, title, department, credits, cos, matrix });
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
      {/* SECTION 1: BASIC INFO */}
      <Card variant="flat">
        <h3 style={{ margin: '0 0 24px 0', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>1. Basic Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Subject Code</label>
            <input style={inputStyle} placeholder="e.g. CS305" value={subjectCode} onChange={e => setSubjectCode(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Subject Title</label>
            <input style={inputStyle} placeholder="e.g. Advanced Database Systems" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Department</label>
            <input style={inputStyle} placeholder="e.g. Computer Science" value={department} onChange={e => setDepartment(e.target.value)} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 500 }}>Credits</label>
            <input type="number" style={inputStyle} value={credits} onChange={e => setCredits(e.target.value)} />
          </div>
        </div>
      </Card>

      {/* SECTION 2: COURSE OUTCOMES */}
      <Card variant="flat">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '24px' }}>
          <h3 style={{ margin: 0 }}>2. Course Outcomes (COs)</h3>
          <Button variant="outline" onClick={handleAddCo} style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Plus size={14} /> Add CO
            </span>
          </Button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {cos.map((co) => (
            <div key={co.id} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '80px', flexShrink: 0 }}>
                <input style={{ ...inputStyle, fontWeight: 600, background: 'var(--color-bg-base)' }} value={co.code} readOnly />
              </div>
              <div style={{ flex: 1 }}>
                <input 
                  style={inputStyle} 
                  placeholder={`What will students learn in ${co.code}?`}
                  value={co.description} 
                  onChange={e => handleCoDescriptionChange(co.id, e.target.value)} 
                />
              </div>
              <button 
                onClick={() => handleRemoveCo(co.id)}
                style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '10px' }}
                title="Remove CO"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* SECTION 3: CO-PO MAPPING */}
      <Card variant="flat">
        <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '24px' }}>
          <h3 style={{ margin: 0 }}>3. CO-PO Mapping Matrix</h3>
          <p style={{ margin: '8px 0 0 0', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
            Rate correlation: 1 (Slight), 2 (Moderate), 3 (Substantial). Leave blank if not mapped.
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
            <thead>
              <tr>
                <th style={{ padding: '12px', borderBottom: '2px solid var(--color-border)', borderRight: '1px solid var(--color-border)', width: '60px' }}></th>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(po => (
                  <th key={po} style={{ padding: '12px', borderBottom: '2px solid var(--color-border)', fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                    PO{po}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cos.map((co) => (
                <tr key={co.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '12px', borderRight: '1px solid var(--color-border)', fontWeight: 600 }}>{co.code}</td>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(po => (
                    <td key={po} style={{ padding: '8px' }}>
                      <input 
                        type="number" 
                        min="1" 
                        max="3"
                        style={{ ...inputStyle, textAlign: 'center', padding: '8px 4px', width: '40px' }}
                        value={matrix[co.id]?.[po] || ''}
                        onChange={e => handleMatrixChange(co.id, po, e.target.value)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* FOOTER ACTIONS */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '16px' }}>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={handleSaveInternal}>Save Curriculum</Button>
      </div>
    </div>
  );
};
