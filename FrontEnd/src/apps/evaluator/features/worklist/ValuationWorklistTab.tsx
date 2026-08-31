import React, { useState } from 'react';
import { ValuationBundle, ScannedAnswerBooklet } from '../../types';
import { Badge } from '@/components/ui/Badge';
import {
  Layers,
  CheckCircle2,
  Clock,
  Award,
  Search,
  PenTool,
  ArrowRight,
  Cpu
} from 'lucide-react';

interface ValuationWorklistTabProps {
  bundles: ValuationBundle[];
  scripts: ScannedAnswerBooklet[];
  activeBundleId: string;
  onSelectBundle: (bundleId: string) => void;
  onOpenStudio: (script: ScannedAnswerBooklet) => void;
}

export const ValuationWorklistTab: React.FC<ValuationWorklistTabProps> = ({
  bundles,
  scripts,
  activeBundleId,
  onSelectBundle,
  onOpenStudio,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const activeBundle = bundles.find(b => b.id === activeBundleId) || bundles[0];
  const bundleScripts = scripts.filter(s => s.bundleId === activeBundleId);

  const filteredScripts = bundleScripts.filter(s => {
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      return s.dummyBarcode.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const totalAssigned = bundles.reduce((sum, b) => sum + b.totalScripts, 0);
  const totalValued = bundles.reduce((sum, b) => sum + b.completedScripts, 0);
  const totalEarned = totalValued * 35;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* ── Top Telemetry Stat Cards ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
      }}>
        {[
          {
            label: 'Assigned Scripts Queue',
            value: `${totalAssigned} Answer Books`,
            desc: `${bundles.length} Course Bundles Assigned`,
            icon: <Layers size={20} />,
            color: '#3b82f6',
          },
          {
            label: 'Valuation Completed',
            value: `${totalValued} Valued`,
            desc: `${Math.round((totalValued / totalAssigned) * 100)}% Progress`,
            icon: <CheckCircle2 size={20} />,
            color: '#10b981',
          },
          {
            label: 'Pending Valuation',
            value: `${totalAssigned - totalValued} Books`,
            desc: `Due by ${activeBundle.deadline}`,
            icon: <Clock size={20} />,
            color: '#f59e0b',
          },
          {
            label: 'Honorarium Earned',
            value: `₹${totalEarned.toLocaleString('en-IN')}`,
            desc: '₹35 per Valued Booklet',
            icon: <Award size={20} />,
            color: '#8b5cf6',
          },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              background: 'white',
              borderRadius: '14px',
              border: `1px solid ${stat.color}22`,
              borderTop: `4px solid ${stat.color}`,
              padding: '18px 20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={{
              width: 44,
              height: 44,
              borderRadius: '10px',
              background: `${stat.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: stat.color,
              flexShrink: 0,
            }}>
              {stat.icon}
            </div>

            <div>
              <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>
                {stat.label}
              </p>
              <h3 style={{ margin: '2px 0 0 0', fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                {stat.value}
              </h3>
              <p style={{ margin: '2px 0 0 0', fontSize: '0.7rem', color: stat.color, fontWeight: 600 }}>
                {stat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Subject Bundle Selector Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        {bundles.map(b => {
          const isSelected = b.id === activeBundleId;
          const progressPercent = Math.round((b.completedScripts / b.totalScripts) * 100);

          return (
            <div
              key={b.id}
              onClick={() => onSelectBundle(b.id)}
              style={{
                background: isSelected ? '#f0fdf4' : 'white',
                borderRadius: '14px',
                border: isSelected ? '2px solid #48977f' : '1.5px solid var(--color-border)',
                padding: '20px 22px',
                boxShadow: isSelected ? '0 4px 16px rgba(72,151,127,0.15)' : '0 2px 8px rgba(0,0,0,0.03)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{
                  background: isSelected ? '#48977f' : '#f1f5f9',
                  color: isSelected ? 'white' : '#475569',
                  padding: '3px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                }}>
                  {b.id}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: isSelected ? '#166534' : 'var(--color-text-secondary)' }}>
                  {b.completedScripts} / {b.totalScripts} Valued ({progressPercent}%)
                </span>
              </div>

              <h3 style={{ margin: '4px 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                {b.subjectCode}: {b.subjectTitle}
              </h3>
              <p style={{ margin: '0 0 14px 0', fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
                {b.semester} • {b.valuationCenter}
              </p>

              {/* Progress Bar */}
              <div style={{ width: '100%', height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', background: isSelected ? '#48977f' : '#3b82f6', transition: 'width 0.3s ease' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Script Queue Table ── */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1.5px solid var(--color-border)',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      }}>
        {/* Table Controls */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
              Double-Blind Valuation Queue ({activeBundle.subjectCode})
            </span>
            <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#1d4ed8', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>
              Zero-Knowledge Anonymized Barcode Active
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '220px' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
              <input
                type="text"
                placeholder="Search Dummy Barcode..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px 7px 30px',
                  borderRadius: '6px',
                  border: '1.5px solid var(--color-border)',
                  fontSize: '0.78rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '7px 10px', borderRadius: '6px', border: '1.5px solid var(--color-border)', fontSize: '0.78rem', fontWeight: 600 }}
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="VALUED">Valuation Completed</option>
              <option value="DEVIATION_FLAGGED">Deviation Flagged</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead style={{ background: '#f8fafc', color: 'var(--color-text-secondary)', fontWeight: 700, borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '14px 20px' }}>Anonymized Dummy Barcode</th>
                <th style={{ padding: '14px 16px' }}>Booklet Size</th>
                <th style={{ padding: '14px 16px' }}>AI Baseline Score</th>
                <th style={{ padding: '14px 16px' }}>Evaluator Score</th>
                <th style={{ padding: '14px 16px' }}>Valuation Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Digital Studio Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredScripts.map(script => (
                <tr key={script.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {/* Barcode */}
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: 800, fontFamily: 'monospace', color: '#0f172a' }}>
                      {script.dummyBarcode}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-text-secondary)' }}>
                      Assigned: {script.assignedDate}
                    </div>
                  </td>

                  {/* Booklet Size */}
                  <td style={{ padding: '14px 16px', color: 'var(--color-text-secondary)' }}>
                    {script.totalPages} Scanned Pages
                  </td>

                  {/* AI Baseline Score */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: '#f5f3ff', color: '#7c3aed', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Cpu size={12} /> {script.aiTotalScore} / {script.maxMarks}
                    </span>
                  </td>

                  {/* Evaluator Score */}
                  <td style={{ padding: '14px 16px' }}>
                    {script.evaluatorTotalScore !== null ? (
                      <strong style={{ fontSize: '0.9rem', color: '#16a34a' }}>
                        {script.evaluatorTotalScore} / {script.maxMarks} M
                      </strong>
                    ) : (
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>— Pending —</span>
                    )}
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '14px 16px' }}>
                    {script.status === 'VALUED' && <Badge variant="success">VALUED ✓</Badge>}
                    {script.status === 'IN_PROGRESS' && <Badge variant="warning">IN PROGRESS</Badge>}
                    {script.status === 'PENDING' && <Badge variant="primary">PENDING</Badge>}
                    {script.status === 'DEVIATION_FLAGGED' && <Badge variant="danger">DEVIATION (&gt;15%)</Badge>}
                  </td>

                  {/* Action */}
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <button
                      onClick={() => onOpenStudio(script)}
                      style={{
                        padding: '7px 16px',
                        background: script.status === 'VALUED' ? '#f8fafc' : 'linear-gradient(135deg, #48977f 0%, #2f6852 100%)',
                        color: script.status === 'VALUED' ? '#475569' : 'white',
                        border: script.status === 'VALUED' ? '1.5px solid var(--color-border)' : 'none',
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: script.status === 'VALUED' ? 'none' : '0 2px 8px rgba(72,151,127,0.25)',
                      }}
                    >
                      <PenTool size={13} /> {script.status === 'VALUED' ? 'Review Marking' : 'Open Valuation Studio'} <ArrowRight size={12} />
                    </button>
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
