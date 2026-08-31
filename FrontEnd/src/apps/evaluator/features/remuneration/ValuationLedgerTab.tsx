import React from 'react';
import { ValuationLedgerEntry } from '../../types';
import { Award, ShieldCheck, Printer } from 'lucide-react';

interface ValuationLedgerTabProps {
  ledgerEntries: ValuationLedgerEntry[];
}

export const ValuationLedgerTab: React.FC<ValuationLedgerTabProps> = ({
  ledgerEntries,
}) => {
  const totalEarned = ledgerEntries.reduce((sum, e) => sum + e.remunerationEarned, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* ── Honorarium Claim Card ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '16px',
        padding: '26px 30px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Award size={18} color="#4ade80" />
            <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Central Valuation Remuneration Claim
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#ffffff' }}>
            ₹{totalEarned.toLocaleString('en-IN')}{' '}
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#94a3b8' }}>
              ({ledgerEntries.length} Answer Booklets Valued @ ₹35/booklet)
            </span>
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
            Certified and approved under Autonomous University Examination Statute Section 9.1.
          </p>
        </div>

        <div>
          <button
            onClick={() => window.print()}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #48977f 0%, #2f6852 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(72,151,127,0.3)',
            }}
          >
            <Printer size={15} /> Print Official Honorarium Bill
          </button>
        </div>
      </div>

      {/* ── Ledger Entries Table ── */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1.5px solid var(--color-border)',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>
              Immutable Digital Valuation Ledger
            </h4>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
              Cryptographically signed valuation records transmitted to the Controller of Examinations.
            </p>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} /> Ledger Sealed
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead style={{ background: '#f8fafc', color: 'var(--color-text-secondary)', fontWeight: 700, borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '14px 20px' }}>Dummy Barcode</th>
                <th style={{ padding: '14px 16px' }}>Subject Course</th>
                <th style={{ padding: '14px 16px' }}>Valued Timestamp</th>
                <th style={{ padding: '14px 16px' }}>Total Marks Awarded</th>
                <th style={{ padding: '14px 16px' }}>Cryptographic Hash</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Remuneration</th>
              </tr>
            </thead>
            <tbody>
              {ledgerEntries.map(entry => (
                <tr key={entry.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 800, fontFamily: 'monospace', color: '#0f172a' }}>
                    {entry.scriptDummyBarcode}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                    {entry.subjectCode}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--color-text-secondary)' }}>
                    {entry.valuedAt}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <strong style={{ color: '#16a34a' }}>{entry.totalMarksAwarded}</strong> / {entry.maxMarks} M
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: 'monospace', fontSize: '0.72rem', color: '#64748b' }}>
                    {entry.digitalSignatureHash.substring(0, 18)}...
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right', fontWeight: 800, color: '#1e293b' }}>
                    ₹{entry.remunerationEarned}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
