import React, { useState } from 'react';
import { ScrutinyBundle, EvaluatorProfile } from '../../types';
import { Badge } from '@/components/ui/Badge';
import {
  Search,
  UserCheck,
  Plus,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { AllocateEvaluatorModal } from './components/AllocateEvaluatorModal';
import { BundleIntakeModal } from './components/BundleIntakeModal';

interface BundleManagementTabProps {
  bundles: ScrutinyBundle[];
  evaluators: EvaluatorProfile[];
  onUpdateBundle: (updatedBundle: ScrutinyBundle) => void;
  onAddBundle: (newBundle: ScrutinyBundle) => void;
  onNavigateToAudit: (bundle: ScrutinyBundle) => void;
}

export const BundleManagementTab: React.FC<BundleManagementTabProps> = ({
  bundles,
  evaluators,
  onUpdateBundle,
  onAddBundle,
  onNavigateToAudit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBundleForAllocation, setSelectedBundleForAllocation] = useState<ScrutinyBundle | null>(null);
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);

  const filteredBundles = bundles.filter(b => {
    if (statusFilter !== 'ALL' && b.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.bundleCode.toLowerCase().includes(q) ||
        b.subjectCode.toLowerCase().includes(q) ||
        b.subjectTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAllocateSuccess = (bundleId: string, evaluatorId: string, evaluatorName: string, deadline: string) => {
    const bundle = bundles.find(b => b.id === bundleId);
    if (bundle) {
      const updated: ScrutinyBundle = {
        ...bundle,
        assignedEvaluatorId: evaluatorId,
        assignedEvaluatorName: evaluatorName,
        valuationDeadline: deadline,
        status: 'ALLOCATED_TO_EVALUATOR',
      };
      onUpdateBundle(updated);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* ── Action & Filter Bar ── */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1.5px solid var(--color-border)',
        padding: '18px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
          <input
            type="text"
            placeholder="Search Bundle Code or Subject..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              border: '1.5px solid var(--color-border)',
              fontSize: '0.82rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid var(--color-border)', fontSize: '0.8rem', fontWeight: 600 }}
          >
            <option value="ALL">All Bundle Statuses</option>
            <option value="UNASSIGNED">Unassigned (Needs Evaluator)</option>
            <option value="ALLOCATED_TO_EVALUATOR">Allocated / In Valuation</option>
            <option value="EVALUATED_PENDING_SCRUTINY">Evaluated (Pending Scrutiny)</option>
            <option value="SCRUTINIZED_AND_SEALED">Scrutinized & Certified</option>
          </select>

          <button
            onClick={() => setIsIntakeModalOpen(true)}
            style={{
              padding: '9px 18px',
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
            <Plus size={15} /> Ingest New Bundle
          </button>
        </div>
      </div>

      {/* ── Bundles Management Table ── */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1.5px solid var(--color-border)',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
            Answer Booklet Bundles Custodian Roster ({filteredBundles.length} Bundles)
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            Physical & Digital Custody Managed by Central Scrutiny Officer
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead style={{ background: '#f8fafc', color: 'var(--color-text-secondary)', fontWeight: 700, borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '14px 20px' }}>Bundle Code</th>
                <th style={{ padding: '14px 16px' }}>Subject Course</th>
                <th style={{ padding: '14px 16px' }}>Booklets</th>
                <th style={{ padding: '14px 16px' }}>Assigned Evaluator</th>
                <th style={{ padding: '14px 16px' }}>Valuation Progress</th>
                <th style={{ padding: '14px 16px' }}>Lifecycle Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Custodian Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBundles.map(bundle => (
                <tr key={bundle.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {/* Bundle Code */}
                  <td style={{ padding: '14px 20px', fontWeight: 800, fontFamily: 'monospace', color: '#2563eb' }}>
                    {bundle.bundleCode}
                  </td>

                  {/* Subject Course */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--color-text-primary)' }}>{bundle.subjectCode}: {bundle.subjectTitle}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>{bundle.semester} • Exam: {bundle.examDate}</div>
                  </td>

                  {/* Booklets */}
                  <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                    {bundle.totalScripts} Books
                  </td>

                  {/* Assigned Evaluator */}
                  <td style={{ padding: '14px 16px' }}>
                    {bundle.assignedEvaluatorName ? (
                      <span style={{ fontWeight: 700, color: '#1e293b', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <UserCheck size={14} color="#16a34a" /> {bundle.assignedEvaluatorName}
                      </span>
                    ) : (
                      <span style={{ color: '#d97706', fontWeight: 700, fontSize: '0.75rem' }}>
                        — Unassigned —
                      </span>
                    )}
                  </td>

                  {/* Valuation Progress */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                      <span>{bundle.completedScripts} / {bundle.totalScripts}</span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>({Math.round((bundle.completedScripts / bundle.totalScripts) * 100)}%)</span>
                    </div>
                    <div style={{ width: '80px', height: '5px', background: '#e2e8f0', borderRadius: '3px', marginTop: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(bundle.completedScripts / bundle.totalScripts) * 100}%`, height: '100%', background: '#48977f' }} />
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '14px 16px' }}>
                    {bundle.status === 'UNASSIGNED' && <Badge variant="warning">UNASSIGNED</Badge>}
                    {bundle.status === 'ALLOCATED_TO_EVALUATOR' && <Badge variant="primary">IN VALUATION</Badge>}
                    {bundle.status === 'IN_EVALUATION' && <Badge variant="primary">IN VALUATION</Badge>}
                    {bundle.status === 'EVALUATED_PENDING_SCRUTINY' && <Badge variant="danger">READY FOR SCRUTINY</Badge>}
                    {bundle.status === 'SCRUTINIZED_AND_SEALED' && <Badge variant="success">CERTIFIED ✓</Badge>}
                  </td>

                  {/* Action */}
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    {bundle.status === 'UNASSIGNED' && (
                      <button
                        onClick={() => setSelectedBundleForAllocation(bundle)}
                        style={{
                          padding: '6px 14px',
                          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 6px rgba(59,130,246,0.25)',
                        }}
                      >
                        <UserCheck size={13} /> Allocate Evaluator
                      </button>
                    )}

                    {bundle.status === 'EVALUATED_PENDING_SCRUTINY' && (
                      <button
                        onClick={() => onNavigateToAudit(bundle)}
                        style={{
                          padding: '6px 14px',
                          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          boxShadow: '0 2px 6px rgba(245,158,11,0.25)',
                        }}
                      >
                        <AlertTriangle size={13} /> Audit Scrutiny
                      </button>
                    )}

                    {bundle.status === 'SCRUTINIZED_AND_SEALED' && (
                      <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={13} /> Dispatched to CoE
                      </span>
                    )}

                    {bundle.status === 'ALLOCATED_TO_EVALUATOR' && (
                      <button
                        onClick={() => setSelectedBundleForAllocation(bundle)}
                        style={{
                          padding: '5px 10px',
                          background: 'white',
                          border: '1px solid var(--color-border)',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          color: 'var(--color-text-secondary)',
                          cursor: 'pointer',
                        }}
                      >
                        Reallocate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Allocate Evaluator Modal */}
      {selectedBundleForAllocation && (
        <AllocateEvaluatorModal
          bundle={selectedBundleForAllocation}
          evaluators={evaluators}
          onAllocateSuccess={handleAllocateSuccess}
          onClose={() => setSelectedBundleForAllocation(null)}
        />
      )}

      {/* Ingest Bundle Modal */}
      {isIntakeModalOpen && (
        <BundleIntakeModal
          onIntakeSuccess={onAddBundle}
          onClose={() => setIsIntakeModalOpen(false)}
        />
      )}
    </div>
  );
};
