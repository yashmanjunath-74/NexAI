import React, { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { StudentEligibilityRecord } from '../../../types';

interface CSVUploadModalProps {
  onImportStudents: (imported: StudentEligibilityRecord[]) => void;
  onClose: () => void;
}

export const CSVUploadModal: React.FC<CSVUploadModalProps> = ({ onImportStudents, onClose }) => {
  const [selectedFileName] = useState<string>('CSE_Fall2026_Attendance_Master.csv');
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewParsed, setPreviewParsed] = useState<StudentEligibilityRecord[] | null>(null);

  const handleSimulateParse = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setPreviewParsed([
        {
          id: `imp_${Date.now()}_1`,
          usn: '1RV23CS010',
          name: 'Ishaan Gupta',
          email: 'ishaan.cs23@rvce.edu.in',
          semester: '3rd Sem',
          department: 'Computer Science',
          section: 'A',
          attendancePercent: 91.0,
          totalClassesHeld: 80,
          classesAttended: 73,
          cieMarksAvg: 45.0,
          status: 'ELIGIBLE',
          hasFeeDues: false,
        },
        {
          id: `imp_${Date.now()}_2`,
          usn: '1RV23CS011',
          name: 'Meera Iyer',
          email: 'meera.cs23@rvce.edu.in',
          semester: '3rd Sem',
          department: 'Computer Science',
          section: 'A',
          attendancePercent: 72.5,
          totalClassesHeld: 80,
          classesAttended: 58,
          cieMarksAvg: 39.0,
          status: 'CONDONABLE',
          hasFeeDues: false,
          condonationReason: 'Sports Leave for Inter-University Badminton Championship',
        },
        {
          id: `imp_${Date.now()}_3`,
          usn: '1RV23CS012',
          name: 'Tanvi Kulkarni',
          email: 'tanvi.cs23@rvce.edu.in',
          semester: '3rd Sem',
          department: 'Computer Science',
          section: 'A',
          attendancePercent: 84.0,
          totalClassesHeld: 80,
          classesAttended: 67,
          cieMarksAvg: 42.0,
          status: 'ELIGIBLE',
          hasFeeDues: false,
        },
      ]);
      setIsProcessing(false);
    }, 1000);
  };

  const handleConfirmImport = () => {
    if (previewParsed) {
      onImportStudents(previewParsed);
      onClose();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          padding: '22px 30px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: 'rgba(59, 130, 246, 0.25)',
                border: '1.5px solid rgba(59, 130, 246, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#3b82f6'
              }}>
                <Upload size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                  Bulk Attendance CSV Ingestion Gateway
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                  Upload ERP attendance records to automatically evaluate exam eligibility.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#cbd5e1',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Drag & Drop Area */}
          <div style={{
            border: '2px dashed #3b82f6',
            background: '#f8fafc',
            borderRadius: '14px',
            padding: '30px',
            textAlign: 'center',
            cursor: 'pointer',
          }}>
            <FileText size={36} color="#3b82f6" style={{ margin: '0 auto 10px auto' }} />
            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
              {selectedFileName}
            </h4>
            <p style={{ margin: '0 0 14px 0', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Supports CSV, XLSX containing columns: [USN, Student_Name, Classes_Held, Classes_Attended, CIE_Score]
            </p>

            <button
              type="button"
              onClick={handleSimulateParse}
              disabled={isProcessing}
              style={{
                padding: '8px 20px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {isProcessing ? 'Validating & Parsing Data...' : 'Parse & Validate Records'}
            </button>
          </div>

          {/* Parsed Preview Table */}
          {previewParsed && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '0.82rem', color: 'var(--color-text-primary)' }}>
                  Validated Records Preview ({previewParsed.length} Students)
                </strong>
                <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700 }}>
                  0 Format Errors Detected ✓
                </span>
              </div>

              <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
                  <thead style={{ background: '#f1f5f9', color: '#475569', fontWeight: 700 }}>
                    <tr>
                      <th style={{ padding: '8px 12px' }}>USN</th>
                      <th style={{ padding: '8px 12px' }}>Name</th>
                      <th style={{ padding: '8px 12px' }}>Attendance</th>
                      <th style={{ padding: '8px 12px' }}>CIE Score</th>
                      <th style={{ padding: '8px 12px' }}>Calculated Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewParsed.map(p => (
                      <tr key={p.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px 12px', fontFamily: 'monospace', fontWeight: 700 }}>{p.usn}</td>
                        <td style={{ padding: '8px 12px' }}>{p.name}</td>
                        <td style={{ padding: '8px 12px', fontWeight: 700, color: p.attendancePercent >= 75 ? '#16a34a' : '#d97706' }}>
                          {p.attendancePercent}% ({p.classesAttended}/{p.totalClassesHeld})
                        </td>
                        <td style={{ padding: '8px 12px' }}>{p.cieMarksAvg}/50</td>
                        <td style={{ padding: '8px 12px' }}>
                          <span style={{
                            background: p.status === 'ELIGIBLE' ? '#ecfdf5' : '#fef3c7',
                            color: p.status === 'ELIGIBLE' ? '#059669' : '#b45309',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontWeight: 700,
                            fontSize: '0.7rem'
                          }}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 30px', background: '#f8fafc', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{ padding: '8px 18px', background: 'white', border: '1.5px solid var(--color-border)', borderRadius: '8px', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmImport}
            disabled={!previewParsed}
            style={{
              padding: '8px 20px',
              background: previewParsed ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' : '#cbd5e1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: previewParsed ? 'pointer' : 'not-allowed',
              boxShadow: previewParsed ? '0 4px 12px rgba(59,130,246,0.3)' : 'none',
            }}
          >
            Import to Active Roster ✓
          </button>
        </div>
      </div>
    </div>
  );
};
