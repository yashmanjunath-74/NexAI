import React from 'react';
import { ScrutinyBundle, EvaluatorProfile } from '../../types';
import {
  Layers,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface ScrutinyOverviewTabProps {
  bundles: ScrutinyBundle[];
  evaluators: EvaluatorProfile[];
  onNavigateToBundles: () => void;
  onNavigateToAudit: () => void;
  onNavigateToDispatch?: () => void;
}

export const ScrutinyOverviewTab: React.FC<ScrutinyOverviewTabProps> = ({
  bundles,
  evaluators,
  onNavigateToBundles,
  onNavigateToAudit,
  onNavigateToDispatch: _onNavigateToDispatch,
}) => {
  const totalBundles = bundles.length;
  const unassignedBundles = bundles.filter(b => b.status === 'UNASSIGNED').length;
  const inValuation = bundles.filter(b => b.status === 'ALLOCATED_TO_EVALUATOR' || b.status === 'IN_EVALUATION').length;
  const readyForScrutiny = bundles.filter(b => b.status === 'EVALUATED_PENDING_SCRUTINY').length;
  const certifiedBundles = bundles.filter(b => b.status === 'SCRUTINIZED_AND_SEALED').length;

  const totalScripts = bundles.reduce((sum, b) => sum + b.totalScripts, 0);

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
            label: 'Total Intake Bundles',
            value: `${totalBundles} Bundles`,
            desc: `${totalScripts} Total Answer Booklets`,
            icon: <Layers size={20} />,
            color: '#3b82f6',
          },
          {
            label: 'Active in Valuation',
            value: `${inValuation} Bundles`,
            desc: `${evaluators.length} Appointed Evaluators`,
            icon: <UserCheck size={20} />,
            color: '#8b5cf6',
          },
          {
            label: 'Awaiting Scrutiny Audit',
            value: `${readyForScrutiny} Bundles`,
            desc: 'Totaling & Omission Checks',
            icon: <AlertTriangle size={20} />,
            color: '#f59e0b',
          },
          {
            label: 'Certified & Dispatched',
            value: `${certifiedBundles} Sealed`,
            desc: 'CoE Grade Ledger Transmitted',
            icon: <ShieldCheck size={20} />,
            color: '#10b981',
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

      {/* ── Action Center Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
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
            <ShieldCheck size={18} color="#48977f" />
            <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Central Scrutiny Operations Status
            </span>
          </div>
          <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>
            Answer Booklet Scrutiny & Custodian Gateway
          </h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>
            You have <strong>{unassignedBundles} unassigned bundle</strong> ready for valuer allocation and <strong>{readyForScrutiny} bundle</strong> awaiting marks scrutiny audit.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {unassignedBundles > 0 && (
            <button
              onClick={onNavigateToBundles}
              style={{
                padding: '10px 18px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(59,130,246,0.3)',
              }}
            >
              <UserCheck size={15} /> Allocate Evaluators ({unassignedBundles})
            </button>
          )}

          <button
            onClick={onNavigateToAudit}
            style={{
              padding: '10px 18px',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(245,158,11,0.35)',
            }}
          >
            <AlertTriangle size={15} /> Start Marks Totaling Scrutiny <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* ── Scrutiny Pipeline Flow Chart ── */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1.5px solid var(--color-border)',
        padding: '24px 28px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}>
        <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 800 }}>
          Central Valuation & Scrutiny Workflow Pipeline
        </h4>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
          {[
            { step: '1. Bundle Intake & Barcoding', desc: 'Ingest physical/digital books & mask USN with anonymous barcodes', count: `${totalBundles} Ingested`, color: '#3b82f6' },
            { step: '2. Evaluator Allocation', desc: 'Assign bundle quotas to qualified faculty examiners with deadlines', count: `${inValuation} Active`, color: '#8b5cf6' },
            { step: '3. Marks Totaling Scrutiny', desc: 'Cross-check inside page sums against front cover and check un-evaluated pages', count: `${readyForScrutiny} Ready`, color: '#f59e0b' },
            { step: '4. CoE Ledger Dispatch', desc: 'Digitally certify marks and publish final grade ledger to Controller of Exams', count: `${certifiedBundles} Sealed`, color: '#10b981' },
          ].map((s, i) => (
            <div key={i} style={{ background: '#f8fafc', border: `1px solid ${s.color}33`, borderTop: `3px solid ${s.color}`, borderRadius: '10px', padding: '14px 16px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.85rem', color: s.color, marginBottom: '6px' }}>{s.step}</div>
              <p style={{ margin: '0 0 10px 0', fontSize: '0.74rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{s.desc}</p>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: s.color }}>{s.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
