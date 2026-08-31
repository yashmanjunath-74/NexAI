import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface SubjectEnrolmentProps {
  subjectCode: string;
  subjectTitle: string;
}

export const SubjectEnrolment: React.FC<SubjectEnrolmentProps> = () => {
  const students = [
    { usn: '1RV21CS001', name: 'Aarav Sharma', attendance: '85%', marks: '45/50', eligible: true },
    { usn: '1RV21CS002', name: 'Aditi Rao', attendance: '92%', marks: '48/50', eligible: true },
    { usn: '1RV21CS003', name: 'Arjun Menon', attendance: '65%', marks: '30/50', eligible: false },
    { usn: '1RV21CS004', name: 'Bhavya Gupta', attendance: '78%', marks: '35/50', eligible: true },
    { usn: '1RV21CS005', name: 'Chaitanya Reddy', attendance: '50%', marks: '22/50', eligible: false }
  ];

  return (
    <Card variant="flat">
      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
        <div style={{ flex: 1, background: 'var(--color-bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Total Enrolled</p>
          <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-primary)' }}>120</h3>
        </div>
        <div style={{ flex: 1, background: 'var(--color-bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Total Eligible</p>
          <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-success)' }}>115</h3>
        </div>
        <div style={{ flex: 1, background: 'var(--color-bg-surface)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Not Eligible</p>
          <h3 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-danger)' }}>5</h3>
        </div>
      </div>
      
      <h3 style={{ marginBottom: '16px' }}>Student Roster & Eligibility</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-border)' }}>
            <th style={{ padding: '12px', color: 'var(--color-text-secondary)' }}>USN</th>
            <th style={{ padding: '12px', color: 'var(--color-text-secondary)' }}>Name</th>
            <th style={{ padding: '12px', color: 'var(--color-text-secondary)' }}>Attendance</th>
            <th style={{ padding: '12px', color: 'var(--color-text-secondary)' }}>Internal Marks</th>
            <th style={{ padding: '12px', color: 'var(--color-text-secondary)' }}>Eligibility</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.usn} style={{ borderBottom: '1px solid var(--color-border)' }}>
              <td style={{ padding: '12px', fontWeight: 500 }}>{student.usn}</td>
              <td style={{ padding: '12px' }}>{student.name}</td>
              <td style={{ padding: '12px', color: parseInt(student.attendance) < 75 ? 'var(--color-danger)' : 'inherit' }}>{student.attendance}</td>
              <td style={{ padding: '12px' }}>{student.marks}</td>
              <td style={{ padding: '12px' }}>
                {student.eligible ? (
                  <Badge variant="success">Eligible</Badge>
                ) : (
                  <Badge variant="danger">Not Eligible</Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};
