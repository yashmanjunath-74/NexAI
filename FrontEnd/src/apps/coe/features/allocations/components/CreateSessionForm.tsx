import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sparkles } from 'lucide-react';

interface CreateSessionFormProps {
  onCancel: () => void;
  onSave: () => void;
  onSaveAndAllocate?: () => void;
}

export const CreateSessionForm: React.FC<CreateSessionFormProps> = ({
  onCancel,
  onSave,
  onSaveAndAllocate,
}) => {
  const [sessionName, setSessionName] = useState('');
  const [examType, setExamType] = useState('SEE_REGULAR');
  const [selectedDepts, setSelectedDepts] = useState<string[]>(['CSE', 'ECE', 'ME', 'CV', 'AIML', 'ISE']);
  const [selectedSemesters, setSelectedSemesters] = useState<number[]>([3, 5]);
  const [examsPerDay, setExamsPerDay] = useState<number>(1);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('09:30');
  const [endTime, setEndTime] = useState('12:30');
  const [instructions, setInstructions] = useState('');

  const allDepartments = [
    { code: 'CSE', name: 'Computer Science & Engineering', color: '#8b5cf6' },
    { code: 'ECE', name: 'Electronics & Communication', color: '#14b8a6' },
    { code: 'ME',  name: 'Mechanical Engineering', color: '#f59e0b' },
    { code: 'CV',  name: 'Civil Engineering', color: '#ec4899' },
    { code: 'AIML', name: 'Artificial Intelligence & ML', color: '#3b82f6' },
    { code: 'ISE', name: 'Information Science & Engineering', color: '#10b981' },
  ];

  const allSemesters = [1, 2, 3, 4, 5, 6, 7, 8];

  const toggleDept = (code: string) => {
    setSelectedDepts(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const toggleSemester = (sem: number) => {
    setSelectedSemesters(prev =>
      prev.includes(sem) ? prev.filter(s => s !== sem) : [...prev, sem]
    );
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
    backgroundColor: 'var(--color-bg-surface)',
    color: 'var(--color-text-primary)',
    fontSize: '0.875rem',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <Card variant="flat" style={{ padding: '28px' }}>
        <h3 style={{ margin: '0 0 24px 0', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
          SEE Institutional Exam Session Details
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
              Session Name / Title
            </label>
            <input
              style={inputStyle}
              placeholder="e.g. SEE Autumn 2026 — Core Sciences & Engineering"
              value={sessionName}
              onChange={e => setSessionName(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
              Examination Category (CoE Mandate)
            </label>
            <select style={inputStyle} value={examType} onChange={e => setExamType(e.target.value)}>
              <option value="SEE_REGULAR">Semester End Examination (SEE) — Regular Cycle</option>
              <option value="SEE_SUPPLEMENTARY">Semester End Examination (SEE) — Fast-Track Supplementary</option>
              <option value="SEE_SPECIAL">Special Institutional Degree Examination Cycle</option>
            </select>
          </div>
        </div>

        {/* Multi-department selection */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
            Participating Academic Departments (Interleaved Seating):
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
            {allDepartments.map(d => {
              const isChecked = selectedDepts.includes(d.code);
              return (
                <div
                  key={d.code}
                  onClick={() => toggleDept(d.code)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: `1.5px solid ${isChecked ? d.color : '#E2E8F0'}`,
                    background: isChecked ? `${d.color}0F` : '#F8FAFC',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <input type="checkbox" checked={isChecked} onChange={() => {}} />
                  <div>
                    <span style={{ fontWeight: 800, fontSize: '0.85rem', color: isChecked ? d.color : '#334155' }}>
                      {d.code}
                    </span>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{d.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Semester Selection */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
            Target Semesters:
          </label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {allSemesters.map(sem => {
              const isSelected = selectedSemesters.includes(sem);
              return (
                <button
                  key={sem}
                  type="button"
                  onClick={() => toggleSemester(sem)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: isSelected ? '2px solid #4F46E5' : '1.5px solid #E2E8F0',
                    background: isSelected ? '#EEF2FF' : 'white',
                    color: isSelected ? '#4F46E5' : '#475569',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  Sem {sem}
                </button>
              );
            })}
          </div>
        </div>

        {/* Exams per day and date/timing */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
              Exams Per Day Limit
            </label>
            <select style={inputStyle} value={examsPerDay} onChange={e => setExamsPerDay(Number(e.target.value))}>
              <option value={1}>1 Exam Session / Day</option>
              <option value={2}>2 Exam Sessions / Day</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
              Exam Date
            </label>
            <input type="date" style={inputStyle} value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
              Slot Start Time
            </label>
            <input type="time" style={inputStyle} value={startTime} onChange={e => setStartTime(e.target.value)} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
              Slot End Time
            </label>
            <input type="time" style={inputStyle} value={endTime} onChange={e => setEndTime(e.target.value)} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
            Special Instructions / Anti-Cheating Directives
          </label>
          <textarea
            style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
            placeholder="e.g. Non-programmable calculators allowed. Cross-department interleaved seating strictly enforced."
            value={instructions}
            onChange={e => setInstructions(e.target.value)}
          />
        </div>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button variant="outline" onClick={onSave}>
            Save Draft Session
          </Button>
          <Button
            variant="primary"
            onClick={onSaveAndAllocate || onSave}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Sparkles size={16} /> Save & Launch AI Allocator
          </Button>
        </div>
      </div>
    </div>
  );
};
