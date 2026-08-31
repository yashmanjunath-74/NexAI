import React, { useState } from 'react';
import { ScrutinyBundle, ScriptScrutinyItem, ScrutinyTotalingStatus } from '../../types';
import { Badge } from '@/components/ui/Badge';
import {
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  ShieldCheck
} from 'lucide-react';
import { ScrutinyInspectorModal } from './components/ScrutinyInspectorModal';

interface MarksScrutinyAuditTabProps {
  bundles: ScrutinyBundle[];
  selectedBundleId: string;
  onSelectBundle: (bundleId: string) => void;
  onUpdateBundle: (updatedBundle: ScrutinyBundle) => void;
  onCertifyBundleSuccess: (bundle: ScrutinyBundle) => void;
}

export const MarksScrutinyAuditTab: React.FC<MarksScrutinyAuditTabProps> = ({
  bundles,
  selectedBundleId,
  onSelectBundle,
  onUpdateBundle,
  onCertifyBundleSuccess,
}) => {
  const [inspectingScript, setInspectingScript] = useState<ScriptScrutinyItem | null>(null);

  // Available bundles for scrutiny
  const scrutinyReadyBundles = bundles.filter(
    b => b.status === 'EVALUATED_PENDING_SCRUTINY' || b.status === 'SCRUTINIZED_AND_SEALED'
  );

  const currentBundle = bundles.find(b => b.id === selectedBundleId) || scrutinyReadyBundles[0] || bundles[0];

  const handleApproveCorrection = (scriptId: string, correctedScore: number, remarks: string) => {
    const updatedScripts = currentBundle.scripts.map(s => {
      if (s.id === scriptId) {
        return {
          ...s,
          status: 'CORRECTED_BY_SCRUTINIZER' as ScrutinyTotalingStatus,
          scrutinizerCorrectedScore: correctedScore,
          scrutinizerNotes: remarks,
          isAudited: true,
        };
      }
      return s;
    });

    const auditedCount = updatedScripts.filter(s => s.isAudited).length;

    const updatedBundle: ScrutinyBundle = {
      ...currentBundle,
      scripts: updatedScripts,
      auditedScriptsCount: auditedCount,
    };

    onUpdateBundle(updatedBundle);
  };

  const handleCertifyEntireBundle = () => {
    const certifiedBundle: ScrutinyBundle = {
      ...currentBundle,
      status: 'SCRUTINIZED_AND_SEALED',
      scrutinyStatus: 'CERTIFIED',
    };
    onUpdateBundle(certifiedBundle);
    onCertifyBundleSuccess(certifiedBundle);
  };

  const allAudited = currentBundle.scripts.length > 0 && currentBundle.scripts.every(s => s.isAudited);
  const discrepancyCount = currentBundle.scripts.filter(s => s.status === 'ARITHMETIC_MISMATCH_DETECTED').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* ── Active Scrutiny Bundle Switcher Bar ── */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1.5px solid var(--color-border)',
        padding: '16px 22px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
            Active Audit Bundle:
          </span>
          <select
            value={currentBundle.id}
            onChange={e => onSelectBundle(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: '8px', border: '1.5px solid var(--color-border)', fontSize: '0.85rem', fontWeight: 800 }}
          >
            {bundles.map(b => (
              <option key={b.id} value={b.id}>
                {b.bundleCode} ({b.subjectCode} — {b.subjectTitle})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            Evaluator: <strong>{currentBundle.assignedEvaluatorName || 'Dr. Alan Turing'}</strong>
          </span>

          <button
            onClick={handleCertifyEntireBundle}
            disabled={!allAudited || currentBundle.status === 'SCRUTINIZED_AND_SEALED'}
            style={{
              padding: '9px 18px',
              background: currentBundle.status === 'SCRUTINIZED_AND_SEALED'
                ? '#ecfdf5'
                : allAudited
                ? 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
                : '#cbd5e1',
              color: currentBundle.status === 'SCRUTINIZED_AND_SEALED' ? '#059669' : 'white',
              border: currentBundle.status === 'SCRUTINIZED_AND_SEALED' ? '1.5px solid #a7f3d0' : 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: allAudited && currentBundle.status !== 'SCRUTINIZED_AND_SEALED' ? 'pointer' : 'default',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: allAudited && currentBundle.status !== 'SCRUTINIZED_AND_SEALED' ? '0 4px 14px rgba(22,163,74,0.35)' : 'none',
            }}
          >
            {currentBundle.status === 'SCRUTINIZED_AND_SEALED' ? (
              <><CheckCircle2 size={15} /> Certified & Sealed ✓</>
            ) : (
              <><ShieldCheck size={15} /> Certify Scrutiny of Entire Bundle →</>
            )}
          </button>
        </div>
      </div>

      {/* ── Telemetry & Discrepancy Status ── */}
      <div style={{
        background: discrepancyCount > 0 ? '#fffbeb' : '#f0fdf4',
        borderRadius: '14px',
        border: `1.5px solid ${discrepancyCount > 0 ? '#fde68a' : '#bbf7d0'}`,
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {discrepancyCount > 0 ? <AlertTriangle size={20} color="#d97706" /> : <CheckCircle2 size={20} color="#16a34a" />}
          <div>
            <strong style={{ fontSize: '0.9rem', color: discrepancyCount > 0 ? '#92400e' : '#166534' }}>
              {discrepancyCount > 0 ? `${discrepancyCount} Arithmetic Discrepancy Detected` : 'All Evaluated Scripts Verified Clean'}
            </strong>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.75rem', color: discrepancyCount > 0 ? '#b45309' : '#15803d' }}>
              {currentBundle.auditedScriptsCount} of {currentBundle.scripts.length} Booklets audited in this bundle.
            </p>
          </div>
        </div>

        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: discrepancyCount > 0 ? '#b45309' : '#15803d' }}>
          {Math.round((currentBundle.auditedScriptsCount / Math.max(1, currentBundle.scripts.length)) * 100)}% Audit Complete
        </span>
      </div>

      {/* ── Scrutiny Table ── */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1.5px solid var(--color-border)',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)' }}>
          <strong style={{ fontSize: '0.95rem' }}>
            Answer Booklet Marks Totaling & Omission Audit Table
          </strong>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead style={{ background: '#f8fafc', color: 'var(--color-text-secondary)', fontWeight: 700, borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '14px 20px' }}>Dummy Barcode</th>
                <th style={{ padding: '14px 16px' }}>Cover Page Total</th>
                <th style={{ padding: '14px 16px' }}>Inside Questions Sum</th>
                <th style={{ padding: '14px 16px' }}>Variance / Slip</th>
                <th style={{ padding: '14px 16px' }}>Scrutiny Audit Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Scrutiny Action</th>
              </tr>
            </thead>
            <tbody>
              {currentBundle.scripts.map(script => {
                const diff = script.summedQuestionMarks - script.frontPageTotal;

                return (
                  <tr key={script.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {/* Dummy Barcode */}
                    <td style={{ padding: '14px 20px', fontWeight: 800, fontFamily: 'monospace', color: '#0f172a' }}>
                      {script.dummyBarcode}
                    </td>

                    {/* Cover Page */}
                    <td style={{ padding: '14px 16px', fontWeight: 800 }}>
                      {script.frontPageTotal} Marks
                    </td>

                    {/* Inside Sum */}
                    <td style={{ padding: '14px 16px', fontWeight: 800, color: '#16a34a' }}>
                      {script.summedQuestionMarks} Marks
                    </td>

                    {/* Variance Slip */}
                    <td style={{ padding: '14px 16px' }}>
                      {diff === 0 ? (
                        <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.75rem' }}>0 (Match ✓)</span>
                      ) : (
                        <span style={{ color: '#e11d48', fontWeight: 800, fontSize: '0.78rem' }}>
                          {diff > 0 ? `+${diff}` : diff} M Mismatch
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '14px 16px' }}>
                      {script.status === 'VERIFIED_ACCURATE' && <Badge variant="success">ACCURATE ✓</Badge>}
                      {script.status === 'ARITHMETIC_MISMATCH_DETECTED' && <Badge variant="danger">ARITHMETIC SLIP</Badge>}
                      {script.status === 'CORRECTED_BY_SCRUTINIZER' && <Badge variant="success">CORRECTED ✓</Badge>}
                    </td>

                    {/* Action */}
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <button
                        onClick={() => setInspectingScript(script)}
                        style={{
                          padding: '6px 12px',
                          background: script.status === 'ARITHMETIC_MISMATCH_DETECTED' ? '#fef2f2' : '#f8fafc',
                          border: `1.5px solid ${script.status === 'ARITHMETIC_MISMATCH_DETECTED' ? '#fecdd3' : 'var(--color-border)'}`,
                          color: script.status === 'ARITHMETIC_MISMATCH_DETECTED' ? '#e11d48' : 'var(--color-text-primary)',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <FileCheck size={13} /> {script.isAudited ? 'Review Totaling' : 'Audit Script'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scrutiny Inspector Modal */}
      {inspectingScript && (
        <ScrutinyInspectorModal
          script={inspectingScript}
          onApproveCorrection={handleApproveCorrection}
          onClose={() => setInspectingScript(null)}
        />
      )}
    </div>
  );
};
