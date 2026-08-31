import React, { useState } from 'react';
import { CheckCircle, Users, BookMarked, Search, Sparkles, ArrowRight } from 'lucide-react';

interface SubjectSelectionProps {
  onNext: (selectedSubjects: any[], totalStudents: number) => void;
}

const ALL_SUBJECTS = [
  { code: 'CS101', title: 'Introduction to Computer Science', dept: 'Computer Science', credits: 4, eligibleStudents: 120, color: '#48977f' },
  { code: 'CS201', title: 'Data Structures & Algorithms',     dept: 'Computer Science', credits: 4, eligibleStudents: 85,  color: '#3b82f6' },
  { code: 'CS301', title: 'Operating Systems',                dept: 'Computer Science', credits: 3, eligibleStudents: 110, color: '#8b5cf6' },
  { code: 'MA101', title: 'Engineering Mathematics I',         dept: 'Mathematics',      credits: 4, eligibleStudents: 200, color: '#ed7245' },
  { code: 'MA201', title: 'Probability & Statistics',          dept: 'Mathematics',      credits: 3, eligibleStudents: 95,  color: '#f59e0b' },
  { code: 'EC101', title: 'Basic Electronics',                 dept: 'Electronics',      credits: 3, eligibleStudents: 140, color: '#14b8a6' },
];

export const SubjectSelection: React.FC<SubjectSelectionProps> = ({ onNext }) => {
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [search, setSearch] = useState('');

  const filtered = ALL_SUBJECTS.filter(s =>
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.dept.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (code: string) =>
    setSelectedCodes(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]);

  const selectedSubjects = ALL_SUBJECTS.filter(s => selectedCodes.includes(s.code));
  const totalStudents    = selectedSubjects.reduce((sum, s) => sum + s.eligibleStudents, 0);

  const handleContinue = () => onNext(selectedSubjects, totalStudents);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, minHeight: '70vh' }}>

      {/* ── Hero banner ─────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #48977f 0%, #2f6852 100%)',
        borderRadius: '16px',
        padding: '32px 40px',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Vector art in banner */}
        <svg style={{ position: 'absolute', right: -20, top: -20, opacity: 0.12, pointerEvents: 'none' }} viewBox="0 0 200 200" width="200" height="200">
          <circle cx="150" cy="50"  r="80" fill="white" />
          <circle cx="150" cy="50"  r="55" fill="none" stroke="white" strokeWidth="2" />
          <circle cx="150" cy="50"  r="32" fill="none" stroke="white" strokeWidth="1.5" />
          <polygon points="30,160 60,100 90,160" fill="white" opacity="0.6" />
          <rect x="10" y="170" width="180" height="4" rx="2" fill="white" opacity="0.3" />
        </svg>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
          <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookMarked size={24} color="white" />
          </div>
          <div>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase' }}>Step 1 of 3</p>
            <h2 style={{ margin: 0, color: 'white', fontWeight: 800, fontSize: '1.6rem' }}>Select Exam Subjects</h2>
          </div>
        </div>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', maxWidth: '500px' }}>
          Choose the subjects to include in this exam session. Required room capacity is calculated automatically based on enrolled students.
        </p>
      </div>

      {/* ── Two-column layout ──────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', flex: 1 }}>

        {/* LEFT: Subject browser */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
            <input
              placeholder="Search subjects by name, code, or department…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 40px',
                borderRadius: '10px',
                border: '1.5px solid var(--color-border)',
                background: 'white',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Subject cards grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {filtered.map(sub => {
              const isSelected = selectedCodes.includes(sub.code);
              return (
                <div
                  key={sub.code}
                  onClick={() => toggle(sub.code)}
                  style={{
                    background: 'white',
                    border: isSelected ? `2px solid ${sub.color}` : '1.5px solid var(--color-border)',
                    borderRadius: '14px',
                    padding: '20px',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? `0 4px 20px ${sub.color}22` : '0 1px 6px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.borderColor = `${sub.color}66`; }}
                  onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--color-border)'; }}
                >
                  {/* Background watermark vector */}
                  <svg style={{ position: 'absolute', right: -10, bottom: -10, opacity: 0.07, pointerEvents: 'none' }} viewBox="0 0 70 70" width="70" height="70">
                    <circle cx="55" cy="55" r="44" fill={sub.color} />
                    <circle cx="55" cy="55" r="28" fill="none" stroke={sub.color} strokeWidth="2" />
                  </svg>

                  {/* Selection indicator */}
                  <div style={{ position: 'absolute', top: 14, right: 14 }}>
                    {isSelected
                      ? <CheckCircle size={22} color={sub.color} fill={`${sub.color}22`} />
                      : <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${sub.color}44` }} />
                    }
                  </div>

                  {/* Code chip */}
                  <div style={{ display: 'inline-block', background: `${sub.color}15`, color: sub.color, border: `1px solid ${sub.color}33`, padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, marginBottom: '10px', letterSpacing: '0.5px' }}>
                    {sub.code}
                  </div>

                  <h4 style={{ margin: '0 0 6px 0', fontWeight: 700, fontSize: '0.9rem', paddingRight: '28px', lineHeight: 1.3 }}>{sub.title}</h4>

                  <p style={{ margin: '0 0 14px 0', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                    {sub.dept} · {sub.credits} Credits
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: `${sub.color}10`, borderRadius: '8px', padding: '8px 12px' }}>
                    <Users size={14} color={sub.color} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: sub.color }}>{sub.eligibleStudents}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>eligible students</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Summary panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Summary card */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            border: '1.5px solid var(--color-border)',
            padding: '24px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            position: 'sticky',
            top: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Sparkles size={18} color="#48977f" />
              <h4 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem' }}>Selection Summary</h4>
            </div>

            {selectedSubjects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
                <BookMarked size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
                <p style={{ margin: 0 }}>No subjects selected yet.<br />Click cards on the left to add them.</p>
              </div>
            ) : (
              <>
                {/* Selected subjects list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  {selectedSubjects.map(sub => (
                    <div key={sub.code} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '10px 14px',
                      background: `${sub.color}08`,
                      border: `1px solid ${sub.color}22`,
                      borderLeft: `4px solid ${sub.color}`,
                      borderRadius: '8px',
                    }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: '0.8rem', color: sub.color }}>{sub.code}</span>
                        <p style={{ margin: '2px 0 0 0', fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{sub.title}</p>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>{sub.eligibleStudents}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div style={{ borderTop: '1.5px dashed var(--color-border)', paddingTop: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>Subjects Selected</span>
                    <span style={{ fontWeight: 700 }}>{selectedSubjects.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Total Seats Required</span>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#48977f' }}>{totalStudents}</span>
                  </div>
                </div>
              </>
            )}

            {/* CTA */}
            <button
              disabled={selectedSubjects.length === 0}
              onClick={handleContinue}
              style={{
                width: '100%',
                padding: '14px',
                background: selectedSubjects.length > 0 ? 'linear-gradient(135deg, #48977f, #2f6852)' : 'var(--color-border)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: selectedSubjects.length > 0 ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
                boxShadow: selectedSubjects.length > 0 ? '0 4px 16px rgba(72,151,127,0.35)' : 'none',
              }}
            >
              Continue to Room Allocation <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
