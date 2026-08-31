import React, { useState } from 'react';
import { SessionKeyData, VaultSubject } from '../types';
import { KeyRound, Lock, CheckCircle2, Cpu, Clock, Users, Sparkles, X, Check, Copy, ChevronDown } from 'lucide-react';

interface SessionKeyModalProps {
  subjects: VaultSubject[];
  selectedSubjectCode: string;
  sessionKeys: Record<string, SessionKeyData>;
  onSelectSubject: (code: string) => void;
  onSaveKey: (key: SessionKeyData) => void;
  onClose: () => void;
}

export const SessionKeyModal: React.FC<SessionKeyModalProps> = ({
  subjects,
  selectedSubjectCode,
  sessionKeys,
  onSelectSubject,
  onSaveKey,
  onClose,
}) => {
  const [currentCode, setCurrentCode] = useState<string>(selectedSubjectCode);
  const activeSubject = subjects.find(s => s.code === currentCode) || subjects[0];
  const existingKeyForSubject = sessionKeys[currentCode];

  const [algorithm, setAlgorithm] = useState('AES-256-GCM + CRYSTALS-Dilithium3 (Post-Quantum)');
  const [requiredThreshold, setRequiredThreshold] = useState(2);
  const totalCustodians = 3;
  const [timelockOffset, setTimelockOffset] = useState(30); // 30 mins before exam
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<SessionKeyData | null>(existingKeyForSubject || null);
  const [copiedFingerprint, setCopiedFingerprint] = useState(false);

  // When changing subject in modal
  const handleSubjectChange = (newCode: string) => {
    setCurrentCode(newCode);
    onSelectSubject(newCode);
    setGeneratedKey(sessionKeys[newCode] || null);
  };

  const custodiansList = [
    { name: 'Controller of Examinations (CoE)', role: 'Primary Keyholder', signed: true },
    { name: 'University Chief Superintendent', role: 'Security Custodian', signed: true },
    { name: 'External Academic Observer', role: 'Verification Custodian', signed: false },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      // Create simulated random fingerprint
      const hexParts = Array.from({ length: 16 }, () =>
        Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
      );
      const fingerprint = hexParts.join(':');

      const newKey: SessionKeyData = {
        keyId: `KEY-2026-${activeSubject.code}-${Math.floor(1000 + Math.random() * 9000)}`,
        subjectCode: activeSubject.code,
        algorithm,
        generatedAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' IST',
        expiresAt: `${activeSubject.examDate} 14:00 IST`,
        unlockTimestamp: `${activeSubject.examDate} ${timelockOffset} mins prior to exam slot`,
        thresholdQuorum: {
          required: requiredThreshold,
          total: totalCustodians,
          signed: ['Controller of Examinations', 'University Chief Superintendent'],
        },
        keyFingerprint: fingerprint,
        isUnlocked: false,
      };

      setGeneratedKey(newKey);
      setIsGenerating(false);
    }, 1400);
  };

  const handleConfirmAndSave = () => {
    if (generatedKey) {
      onSaveKey(generatedKey);
      onClose();
    }
  };

  const handleCopy = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey.keyFingerprint);
      setCopiedFingerprint(true);
      setTimeout(() => setCopiedFingerprint(false), 2000);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
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
        maxWidth: '700px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          padding: '24px 30px',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Cyber vector decoration */}
          <svg style={{ position: 'absolute', right: -10, top: -10, opacity: 0.15, pointerEvents: 'none' }} viewBox="0 0 120 120" width="120" height="120">
            <polygon points="60,10 110,35 110,85 60,110 10,85 10,35" fill="none" stroke="#48977f" strokeWidth="2" />
            <circle cx="60" cy="60" r="25" fill="#48977f" />
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
                <KeyRound size={22} />
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#48977f', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Cryptographic Master Key Protocol
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '1.25rem', fontWeight: 800 }}>
                  Session Key Ceremony
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
                  Generate and arm post-quantum encryption keys for examination subjects.
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

        {/* Modal Body */}
        <div style={{ padding: '28px 30px' }}>
          {/* ── STEP 0: SUBJECT SELECTOR ── */}
          <div style={{
            background: '#f8fafc',
            border: '1.5px solid #cbd5e1',
            borderRadius: '14px',
            padding: '16px 18px',
            marginBottom: '22px',
          }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              Select Subject for Key Generation:
            </label>

            <div style={{ position: 'relative' }}>
              <select
                value={currentCode}
                onChange={e => handleSubjectChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid var(--color-primary)',
                  background: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: 'var(--color-text-primary)',
                  cursor: 'pointer',
                  appearance: 'none',
                  boxSizing: 'border-box'
                }}
              >
                {subjects.map(s => {
                  const hasKey = !!sessionKeys[s.code];
                  return (
                    <option key={s.code} value={s.code}>
                      {s.code} — {s.title} ({s.examDate}) {hasKey ? '✓ Key Armed' : '• Pending Key'}
                    </option>
                  );
                })}
              </select>
              <ChevronDown size={18} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-text-secondary)' }} />
            </div>

            {/* Quick metadata chips for chosen subject */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap', fontSize: '0.75rem' }}>
              <span style={{ background: '#e2e8f0', color: '#334155', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
                📅 Exam: {activeSubject.examDate}
              </span>
              <span style={{ background: '#e2e8f0', color: '#334155', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
                ⏰ Slot: {activeSubject.examSlot}
              </span>
              <span style={{
                background: existingKeyForSubject ? '#dcfce7' : '#ffedd5',
                color: existingKeyForSubject ? '#15803d' : '#c2410c',
                padding: '4px 10px',
                borderRadius: '6px',
                fontWeight: 700
              }}>
                {existingKeyForSubject ? 'Key Currently Armed' : 'Key Generation Required'}
              </span>
            </div>
          </div>

          {!generatedKey ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Configuration Step 1: Encryption Algorithm */}
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                  1. Cryptographic Cipher Suite
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { id: 'AES-256-GCM + CRYSTALS-Dilithium3 (Post-Quantum)', label: 'AES-256-GCM + Dilithium3', tag: 'Post-Quantum Safe' },
                    { id: 'ChaCha20-Poly1305 + Ed25519', label: 'ChaCha20-Poly1305 + Ed25519', tag: 'High Performance' }
                  ].map(item => (
                    <div
                      key={item.id}
                      onClick={() => setAlgorithm(item.id)}
                      style={{
                        border: algorithm === item.id ? '2px solid #48977f' : '1.5px solid var(--color-border)',
                        background: algorithm === item.id ? '#48977f08' : '#f8fafc',
                        borderRadius: '10px',
                        padding: '12px 14px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>{item.label}</span>
                        {algorithm === item.id && <CheckCircle2 size={16} color="#48977f" />}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: '#48977f', fontWeight: 600 }}>{item.tag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Configuration Step 2: Shamir Secret Sharing Quorum */}
              <div style={{ background: '#f8fafc', padding: '16px 18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Users size={16} color="#48977f" />
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    2. Shamir's Secret Sharing (Threshold Quorum)
                  </label>
                </div>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  The unsealing key will be split into {totalCustodians} cryptographic shards. A minimum of {requiredThreshold} custodians must co-sign to unseal the exam paper.
                </p>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>Required Signs:</span>
                    <select
                      value={requiredThreshold}
                      onChange={e => setRequiredThreshold(Number(e.target.value))}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 700 }}
                    >
                      <option value={2}>2 of 3 Custodians</option>
                      <option value={3}>3 of 3 Custodians</option>
                    </select>
                  </div>
                </div>

                {/* Custodian List */}
                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {custodiansList.map((cust, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '8px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.75rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{cust.name}</span>
                      <span style={{ color: '#48977f', fontWeight: 700 }}>{cust.role}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Configuration Step 3: Timelock Setting */}
              <div style={{ background: '#f8fafc', padding: '16px 18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Clock size={16} color="#3b82f6" />
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    3. Timelock Release Window
                  </label>
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                  Hardware HSM will refuse decryption requests prior to the scheduled exam window.
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[15, 30, 45, 60].map(mins => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setTimelockOffset(mins)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '8px',
                        border: timelockOffset === mins ? '2px solid #3b82f6' : '1px solid #cbd5e1',
                        background: timelockOffset === mins ? '#3b82f615' : 'white',
                        color: timelockOffset === mins ? '#3b82f6' : 'var(--color-text-primary)',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      {mins} Mins Prior
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Trigger Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                style={{
                  padding: '14px',
                  background: 'linear-gradient(135deg, #48977f 0%, #2f6852 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: isGenerating ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 18px rgba(72,151,127,0.35)',
                  transition: 'all 0.2s ease',
                }}
              >
                {isGenerating ? (
                  <>
                    <Cpu size={18} className="animate-spin" /> Generating HSM Cryptographic Ring for {activeSubject.code}...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} /> Generate Key for {activeSubject.code}
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Generated Key View */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Success Badge Banner */}
              <div style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                border: '1.5px solid #86efac',
                borderRadius: '14px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#48977f', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={22} />
                </div>
                <div>
                  <h4 style={{ margin: 0, color: '#166534', fontWeight: 800, fontSize: '0.95rem' }}>
                    Master Session Key Armed for {generatedKey.subjectCode}
                  </h4>
                  <p style={{ margin: '2px 0 0 0', color: '#15803d', fontSize: '0.78rem' }}>
                    Key ID: <strong>{generatedKey.keyId}</strong> • Shamir Shards Distributed
                  </p>
                </div>
              </div>

              {/* Key Details Card */}
              <div style={{
                background: '#0f172a',
                color: '#e2e8f0',
                borderRadius: '14px',
                padding: '20px',
                fontSize: '0.78rem',
                fontFamily: 'monospace',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                border: '1px solid #334155'
              }}>
                <div>
                  <span style={{ color: '#94a3b8' }}>SUBJECT / COURSE:</span>
                  <div style={{ color: '#38bdf8', fontWeight: 700, marginTop: '2px' }}>
                    {generatedKey.subjectCode} — {activeSubject.title}
                  </div>
                </div>

                <div>
                  <span style={{ color: '#94a3b8' }}>CIPHER SUITE:</span>
                  <div style={{ color: '#a78bfa', fontWeight: 700, marginTop: '2px' }}>{generatedKey.algorithm}</div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#94a3b8' }}>FINGERPRINT SHA-256:</span>
                    <button
                      onClick={handleCopy}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        border: 'none',
                        color: copiedFingerprint ? '#4ade80' : '#cbd5e1',
                        cursor: 'pointer',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {copiedFingerprint ? <><Check size={10} /> Copied</> : <><Copy size={10} /> Copy</>}
                    </button>
                  </div>
                  <div style={{ color: '#4ade80', wordBreak: 'break-all', marginTop: '4px', letterSpacing: '1px' }}>
                    {generatedKey.keyFingerprint}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '8px', borderTop: '1px dashed #334155' }}>
                  <div>
                    <span style={{ color: '#94a3b8' }}>TIMELOCK:</span>
                    <div style={{ color: '#fbbf24', marginTop: '2px' }}>{generatedKey.unlockTimestamp}</div>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>QUORUM STATUS:</span>
                    <div style={{ color: '#a78bfa', marginTop: '2px' }}>2 of 3 Shards Validated</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setGeneratedKey(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: 'white',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: '10px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: 'var(--color-text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  Regenerate for {activeSubject.code}
                </button>

                <button
                  onClick={handleConfirmAndSave}
                  style={{
                    flex: 2,
                    padding: '12px',
                    background: 'linear-gradient(135deg, #48977f 0%, #2f6852 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(72,151,127,0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Lock size={16} /> Save & Arm Vault for {activeSubject.code}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
