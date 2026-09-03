import React from 'react';
import { KeyRound, ShieldCheck, Sparkles } from 'lucide-react';

interface SEEValuationGateTabProps {
  selectedCourseCode: string;
  inputSessionKey: string;
  isValidatingKey: boolean;
  onInputSessionKeyChange: (val: string) => void;
  onValidateSessionKey: (e: React.FormEvent) => void;
}

export const SEEValuationGateTab: React.FC<SEEValuationGateTabProps> = ({
  selectedCourseCode,
  inputSessionKey,
  isValidatingKey,
  onInputSessionKeyChange,
  onValidateSessionKey,
}) => {
  return (
    <div>
      <div style={{
        maxWidth: '680px',
        margin: '20px auto',
        background: '#FFFFFF',
        borderRadius: '20px',
        border: '1.5px solid var(--color-border, #E2E8F0)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
        padding: '36px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #48977F 0%, #2F6852 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 8px 20px rgba(72,151,127,0.3)',
          }}>
            <KeyRound size={32} />
          </div>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '1.45rem', fontWeight: 900, color: '#0F172A' }}>
            SEE Digital Valuation Studio Gateway
          </h2>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', lineHeight: 1.5 }}>
            Autonomous Examination Digital Answer Script Evaluation. Enter the single-session cryptographic key issued by the Controller of Examinations (CoE).
          </p>
        </div>

        <form onSubmit={onValidateSessionKey}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
              Evaluation Session Key (from CoE Valuation Order):
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="e.g. EVAL-CS201-FALL26-A92F"
                value={inputSessionKey}
                onChange={e => onInputSessionKeyChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '2px solid #CBD5E1',
                  fontSize: '0.95rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  letterSpacing: '1px',
                  boxSizing: 'border-box',
                  textTransform: 'uppercase',
                  outline: 'none',
                }}
              />
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.72rem', color: '#64748B', background: '#F1F5F9', padding: '4px 8px', borderRadius: '6px' }}>
                CASE-INSENSITIVE
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                Quick Test Sample:
              </span>
              <button
                type="button"
                onClick={() => onInputSessionKeyChange(`EVAL-${selectedCourseCode}-2026-KEY`)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4F46E5',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Sparkles size={12} /> Auto-fill Sample Session Key
              </button>
            </div>
          </div>

          <div style={{
            background: '#F8FAFC',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #E2E8F0',
            marginBottom: '24px',
            fontSize: '0.8rem',
            color: '#475569',
            lineHeight: 1.5,
          }}>
            <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#059669" /> Session Key Expiry Protocol:
            </div>
            Once you enter the evaluation studio, your valuation progress is cryptographically sealed. When you click <strong>"Complete Evaluation Batch"</strong> (or upon deadline expiry), your session key terminates and safely returns you to this Faculty Dashboard.
          </div>

          <button
            type="submit"
            disabled={isValidatingKey}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #48977F 0%, #2F6852 100%)',
              color: 'white',
              fontWeight: 900,
              fontSize: '0.95rem',
              cursor: isValidatingKey ? 'not-allowed' : 'pointer',
              boxShadow: '0 6px 18px rgba(72,151,127,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {isValidatingKey ? 'Validating Session Key...' : 'Validate Session Key & Open Evaluation Studio →'}
          </button>
        </form>
      </div>
    </div>
  );
};
