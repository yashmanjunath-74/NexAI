import React, { useState } from 'react';
import { QuestionPaperSet } from '../types';
import { X, FileText, CheckCircle2, Lock, Unlock, Sparkles, BookOpen, BarChart3, Database } from 'lucide-react';

interface PaperInspectorModalProps {
  paper: QuestionPaperSet;
  onSelectSet: (paper: QuestionPaperSet) => void;
  onClose: () => void;
}

const BLOOM_COLORS: Record<string, string> = {
  Remember: '#64748b',
  Understand: '#3b82f6',
  Apply: '#10b981',
  Analyze: '#8b5cf6',
  Evaluate: '#f59e0b',
  Create: '#ef4444',
};

export const PaperInspectorModal: React.FC<PaperInspectorModalProps> = ({
  paper,
  onSelectSet,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'QUESTIONS' | 'BLOOM_ANALYSIS' | 'CIPHERTEXT'>('QUESTIONS');
  const [isCipherDecrypted, setIsCipherDecrypted] = useState(false);

  // Group questions by section
  const sections = Array.from(new Set(paper.questions.map(q => q.section)));

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
        maxWidth: '840px',
        maxHeight: '92vh',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          padding: '24px 30px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Watermark */}
          <svg style={{ position: 'absolute', right: -10, top: -10, opacity: 0.1, pointerEvents: 'none' }} viewBox="0 0 100 100" width="120" height="120">
            <rect x="20" y="20" width="60" height="70" rx="8" fill="#48977f" />
            <circle cx="50" cy="50" r="14" fill="white" />
          </svg>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'rgba(72, 151, 127, 0.25)',
                border: '1.5px solid rgba(72, 151, 127, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#48977f'
              }}>
                <FileText size={22} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span style={{
                    background: '#48977f22',
                    color: '#48977f',
                    border: '1px solid #48977f55',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}>
                    {paper.setLabel}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {paper.subjectCode} • {paper.semester}
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                  {paper.title}
                </h3>
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

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'flex',
            gap: '24px',
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            fontSize: '0.78rem',
            color: '#cbd5e1'
          }}>
            <span>Total Marks: <strong style={{ color: 'white' }}>{paper.totalMarks}</strong></span>
            <span>Duration: <strong style={{ color: 'white' }}>{paper.durationMinutes} Mins</strong></span>
            <span>Questions: <strong style={{ color: 'white' }}>{paper.questionsCount}</strong></span>
            <span>AI Quality: <strong style={{ color: '#4ade80' }}>{paper.aiQualityScore}%</strong></span>
            <span>Author: <strong style={{ color: 'white' }}>{paper.setterName}</strong></span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '12px 30px',
          background: '#f8fafc',
          borderBottom: '1px solid var(--color-border)'
        }}>
          {[
            { id: 'QUESTIONS', label: 'Question Paper Breakdown', icon: <BookOpen size={14} /> },
            { id: 'BLOOM_ANALYSIS', label: "Bloom's & Syllabus Matrix", icon: <BarChart3 size={14} /> },
            { id: 'CIPHERTEXT', label: 'IPFS / Cryptographic Payload', icon: <Database size={14} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab.id ? 'white' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                fontWeight: activeTab === tab.id ? 700 : 500,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: activeTab === tab.id ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body Content Area */}
        <div style={{ padding: '24px 30px', flex: 1, overflowY: 'auto' }}>
          {activeTab === 'QUESTIONS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {sections.map(secName => {
                const secQuestions = paper.questions.filter(q => q.section === secName);
                const secMarks = secQuestions.reduce((sum, q) => sum + q.marks, 0);

                return (
                  <div key={secName} style={{ border: '1.5px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden' }}>
                    <div style={{
                      background: '#f8fafc',
                      padding: '10px 16px',
                      borderBottom: '1px solid var(--color-border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--color-text-primary)' }}>
                        {secName}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                        {secQuestions.length} Questions ({secMarks} Marks)
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {secQuestions.map(q => (
                        <div key={q.id} style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                            <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#1e293b' }}>
                              Q{q.number}.
                            </span>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <span style={{
                                background: `${BLOOM_COLORS[q.bloomsLevel]}15`,
                                color: BLOOM_COLORS[q.bloomsLevel],
                                border: `1px solid ${BLOOM_COLORS[q.bloomsLevel]}33`,
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: '0.68rem',
                                fontWeight: 700
                              }}>
                                {q.bloomsLevel}
                              </span>
                              <span style={{
                                background: '#f1f5f9',
                                color: '#475569',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '0.68rem',
                                fontWeight: 700
                              }}>
                                {q.coMapping}
                              </span>
                              <span style={{
                                background: '#ecfdf5',
                                color: '#059669',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                fontWeight: 800
                              }}>
                                {q.marks}M
                              </span>
                            </div>
                          </div>
                          <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                            {q.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'BLOOM_ANALYSIS' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Bloom's breakdown card */}
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
                <h4 style={{ margin: '0 0 14px 0', fontSize: '0.9rem', fontWeight: 800 }}>
                  Bloom's Taxonomy Cognitive Level Distribution
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {Object.entries(BLOOM_COLORS).map(([level, color]) => {
                    const count = paper.questions.filter(q => q.bloomsLevel === level).length;
                    const pct = Math.round((count / paper.questions.length) * 100);

                    return (
                      <div key={level}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{level}</span>
                          <span style={{ fontWeight: 700, color }}>{count} Qs ({pct}%)</span>
                        </div>
                        <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '4px', transition: 'width 0.4s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CO Mapping Card */}
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '14px', border: '1px solid var(--color-border)' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 800 }}>
                  Course Outcome (CO) Syllabus Coverage
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {['CO1: Foundations', 'CO2: Data Structs', 'CO3: Tree Balances', 'CO4: Graph Theory', 'CO5: Dynamic Prog', 'CO6: Advanced Synthesis'].map((co, i) => (
                    <div key={i} style={{ background: 'white', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CheckCircle2 size={16} color="#10b981" />
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{co}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'CIPHERTEXT' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: '#0f172a',
                color: '#e2e8f0',
                borderRadius: '14px',
                padding: '20px',
                fontFamily: 'monospace',
                fontSize: '0.75rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ color: '#38bdf8', fontWeight: 700 }}>IPFS STORAGE HASH:</span>
                  <span style={{ color: '#94a3b8' }}>{paper.ipfsCid}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ color: '#4ade80', fontWeight: 700 }}>SHA-256 INTEGRITY:</span>
                  <span style={{ color: '#94a3b8' }}>{paper.sha256Hash}</span>
                </div>

                <div style={{ borderTop: '1px dashed #334155', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Simulate Decryption:</span>
                  <button
                    onClick={() => setIsCipherDecrypted(!isCipherDecrypted)}
                    style={{
                      background: isCipherDecrypted ? '#48977f' : '#334155',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {isCipherDecrypted ? <><Unlock size={12} /> Decrypted Payload</> : <><Lock size={12} /> Encrypted Payload</>}
                  </button>
                </div>

                <div style={{
                  background: '#020617',
                  padding: '14px',
                  borderRadius: '8px',
                  marginTop: '12px',
                  maxHeight: '160px',
                  overflowY: 'auto',
                  lineHeight: 1.6,
                  color: isCipherDecrypted ? '#4ade80' : '#94a3b8'
                }}>
                  {isCipherDecrypted ? (
                    `{\n  "status": "DECRYPTED_SUCCESS",\n  "subject": "${paper.subjectCode}",\n  "set": "${paper.setLabel}",\n  "author": "${paper.setterName}",\n  "questions_count": ${paper.questionsCount},\n  "total_marks": ${paper.totalMarks},\n  "verified_sig": true\n}`
                  ) : (
                    `0x7f8a92b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1...\n[ENC_PAYLOAD_CHUNK_001_AES256GCM_AUTH_TAG_9A8B7C6D5E4F3A2B1C0D9E8F7A6B5C4D]\n[SIGNATURE_DILITHIUM3_POST_QUANTUM_VERIFIED_BY_COE_KEY]`
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '16px 30px',
          borderTop: '1px solid var(--color-border)',
          background: '#f8fafc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 18px',
              background: 'white',
              border: '1.5px solid var(--color-border)',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.85rem',
              color: 'var(--color-text-secondary)',
              cursor: 'pointer'
            }}
          >
            Close
          </button>

          <button
            onClick={() => {
              onSelectSet(paper);
              onClose();
            }}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #48977f 0%, #2f6852 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 14px rgba(72,151,127,0.35)'
            }}
          >
            <Sparkles size={16} /> Choose & Unseal This Set ({paper.setLabel})
          </button>
        </div>
      </div>
    </div>
  );
};
