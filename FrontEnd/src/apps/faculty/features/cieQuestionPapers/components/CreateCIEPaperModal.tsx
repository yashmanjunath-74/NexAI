import React, { useState } from 'react';
import { AssignedCourse, FacultyCIEPaper, FacultyCIEQuestion } from '../../../types';
import { X, Plus, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreateCIEPaperModalProps {
  isOpen: boolean;
  selectedCourseCode: string;
  courses: AssignedCourse[];
  onClose: () => void;
  onSubmitPaper: (paper: FacultyCIEPaper) => void;
}

export const CreateCIEPaperModal: React.FC<CreateCIEPaperModalProps> = ({
  isOpen,
  selectedCourseCode,
  courses,
  onClose,
  onSubmitPaper,
}) => {
  const [newTestType, setNewTestType] = useState<'CIE-1' | 'CIE-2' | 'ASSIGNMENT_TEST'>('CIE-2');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionMarks, setNewQuestionMarks] = useState(10);
  const [newQuestionBlooms, setNewQuestionBlooms] = useState<'L1' | 'L2' | 'L3' | 'L4' | 'L5'>('L3');
  const [newQuestionCO, setNewQuestionCO] = useState<'CO1' | 'CO2' | 'CO3' | 'CO4' | 'CO5'>('CO2');
  const [stagedQuestions, setStagedQuestions] = useState<FacultyCIEQuestion[]>([
    { id: 'sq1', qNumber: '1', text: 'Analyze the worst-case time complexity of QuickSort with randomized pivot selection.', marks: 10, bloomsLevel: 'L4', co: 'CO1' },
    { id: 'sq2', qNumber: '2', text: 'Construct an AVL tree by inserting keys [10, 20, 30, 40, 50, 25] and show LL/LR rotations.', marks: 10, bloomsLevel: 'L3', co: 'CO2' },
  ]);

  if (!isOpen) return null;

  const handleAddQuestionToDraft = () => {
    if (!newQuestionText.trim()) {
      toast.error('Please enter question description.');
      return;
    }
    const newQ: FacultyCIEQuestion = {
      id: `sq_${Date.now().toString().slice(-4)}`,
      qNumber: `${stagedQuestions.length + 1}`,
      text: newQuestionText.trim(),
      marks: Number(newQuestionMarks) || 5,
      bloomsLevel: newQuestionBlooms,
      co: newQuestionCO,
    };
    setStagedQuestions(prev => [...prev, newQ]);
    setNewQuestionText('');
    toast.success(`Question ${newQ.qNumber} added to CIE paper draft.`);
  };

  const handleSubmit = () => {
    if (stagedQuestions.length === 0) {
      toast.error('Please add at least one question.');
      return;
    }
    const totalM = stagedQuestions.reduce((acc, q) => acc + q.marks, 0);
    const selectedCourseObj = courses.find(c => c.code === selectedCourseCode);

    const newPaper: FacultyCIEPaper = {
      id: `CIE-${selectedCourseCode}-${newTestType}-${Date.now().toString().slice(-4)}`,
      courseCode: selectedCourseCode,
      courseTitle: selectedCourseObj?.title || 'Subject',
      semester: selectedCourseObj?.semester || 'Semester',
      testType: newTestType,
      maxMarks: totalM,
      status: 'SUBMITTED_TO_HOD',
      submittedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      questions: stagedQuestions,
    };

    onSubmitPaper(newPaper);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1.5rem',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        maxWidth: '640px',
        width: '100%',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#F8FAFC',
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
              Draft CIE Question Paper for {selectedCourseCode}
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: '#64748B' }}>
              Author questions with Bloom's Taxonomy and submit to HOD for approval
            </p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', maxHeight: '68vh', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Test Type</label>
              <select
                value={newTestType}
                onChange={e => setNewTestType(e.target.value as any)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700, background: 'white' }}
              >
                <option value="CIE-1">CIE-1 (First Internal Test)</option>
                <option value="CIE-2">CIE-2 (Second Internal Test)</option>
                <option value="ASSIGNMENT_TEST">Assignment / Lab Test</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Assigned Subject</label>
              <input
                type="text"
                disabled
                value={selectedCourseCode}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 800, background: '#F1F5F9', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Add Question Box */}
          <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
              ➕ Add Question to Paper:
            </div>
            <textarea
              rows={3}
              placeholder="Enter question statement..."
              value={newQuestionText}
              onChange={e => setNewQuestionText(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: '10px' }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '10px', alignItems: 'center' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748B' }}>Marks</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={newQuestionMarks}
                  onChange={e => setNewQuestionMarks(parseInt(e.target.value) || 5)}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 800, boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748B' }}>Bloom Level</label>
                <select
                  value={newQuestionBlooms}
                  onChange={e => setNewQuestionBlooms(e.target.value as any)}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 700, background: 'white' }}
                >
                  <option value="L1">L1 - Remember</option>
                  <option value="L2">L2 - Understand</option>
                  <option value="L3">L3 - Apply</option>
                  <option value="L4">L4 - Analyze</option>
                  <option value="L5">L5 - Evaluate</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#64748B' }}>Outcome (CO)</label>
                <select
                  value={newQuestionCO}
                  onChange={e => setNewQuestionCO(e.target.value as any)}
                  style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontWeight: 700, background: 'white' }}
                >
                  <option value="CO1">CO1 - Concepts</option>
                  <option value="CO2">CO2 - Design</option>
                  <option value="CO3">CO3 - Implementation</option>
                  <option value="CO4">CO4 - Analysis</option>
                  <option value="CO5">CO5 - Synthesis</option>
                </select>
              </div>
              <button
                type="button"
                onClick={handleAddQuestionToDraft}
                style={{
                  marginTop: '16px',
                  padding: '7px 14px',
                  background: '#0F172A',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Plus size={14} /> Add
              </button>
            </div>
          </div>

          {/* Questions Staged in Paper */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>
                Questions in Draft ({stagedQuestions.length})
              </span>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#4F46E5' }}>
                Total Marks: {stagedQuestions.reduce((acc, q) => acc + q.marks, 0)} M
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stagedQuestions.map((q, idx) => (
                <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.82rem' }}>
                  <div style={{ color: '#334155' }}>
                    <strong>Q{idx + 1}.</strong> {q.text}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    <span style={{ background: '#EEF2FF', color: '#4F46E5', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>{q.co}</span>
                    <span style={{ background: '#F3E8FF', color: '#7E22CE', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>{q.bloomsLevel}</span>
                    <span style={{ background: '#E0F2FE', color: '#0369A1', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800 }}>{q.marks}M</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '10px', background: '#F8FAFC' }}>
          <button
            onClick={onClose}
            style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', background: 'white', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
              color: 'white',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Send size={14} /> Submit CIE Paper to HOD ✓
          </button>
        </div>
      </div>
    </div>
  );
};
