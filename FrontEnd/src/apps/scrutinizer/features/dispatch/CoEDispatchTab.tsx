import React, { useState } from 'react';
import { ScrutinyBundle } from '../../types';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, Printer, Eye } from 'lucide-react';
import { ScrutinyCertificateModal } from './components/ScrutinyCertificateModal';

interface CoEDispatchTabProps {
  bundles: ScrutinyBundle[];
}

export const CoEDispatchTab: React.FC<CoEDispatchTabProps> = ({ bundles }) => {
  const [selectedBundleForCertificate, setSelectedBundleForCertificate] = useState<ScrutinyBundle | null>(null);

  const certifiedBundles = bundles.filter(b => b.status === 'SCRUTINIZED_AND_SEALED');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* ── Top Summary Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '16px',
        padding: '24px 30px',
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
            <ShieldCheck size={18} color="#4ade80" />
            <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Grade Ledger Publishing Desk
            </span>
          </div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 900 }}>
            {certifiedBundles.length} Certified Bundles Transmitted to CoE
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
            All candidate scores in these bundles are verified, locked, and ready for official SGPA computation.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          style={{
            padding: '10px 18px',
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
          <Printer size={15} /> Print Dispatch Summary
        </button>
      </div>

      {/* ── Certified Bundles Table ── */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1.5px solid var(--color-border)',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <strong style={{ fontSize: '0.95rem' }}>Certified Scrutiny Dispatch Registry</strong>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead style={{ background: '#f8fafc', color: 'var(--color-text-secondary)', fontWeight: 700, borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '14px 20px' }}>Bundle Code</th>
                <th style={{ padding: '14px 16px' }}>Subject Course</th>
                <th style={{ padding: '14px 16px' }}>Appointed Valuer</th>
                <th style={{ padding: '14px 16px' }}>Booklets Audited</th>
                <th style={{ padding: '14px 16px' }}>Ledger Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Certificate Action</th>
              </tr>
            </thead>
            <tbody>
              {certifiedBundles.map(bundle => (
                <tr key={bundle.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 20px', fontWeight: 800, fontFamily: 'monospace', color: '#2563eb' }}>
                    {bundle.bundleCode}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--color-text-primary)' }}>{bundle.subjectCode}: {bundle.subjectTitle}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{bundle.semester}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                    {bundle.assignedEvaluatorName || 'Dr. Edsger Dijkstra'}
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 700, color: '#16a34a' }}>
                    {bundle.totalScripts} / {bundle.totalScripts} Books (100%)
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Badge variant="success">COE TRANSMITTED ✓</Badge>
                  </td>
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedBundleForCertificate(bundle)}
                      style={{
                        padding: '6px 14px',
                        background: '#f8fafc',
                        border: '1.5px solid var(--color-border)',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Eye size={12} /> View Certificate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scrutiny Certificate Modal */}
      {selectedBundleForCertificate && (
        <ScrutinyCertificateModal
          bundle={selectedBundleForCertificate}
          onClose={() => setSelectedBundleForCertificate(null)}
        />
      )}
    </div>
  );
};
