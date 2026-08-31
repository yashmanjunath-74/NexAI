import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  Layers,
  ShieldCheck,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

import {
  ScrutinyBundle,
  EvaluatorProfile
} from './types';
import {
  INITIAL_SCRUTINY_BUNDLES,
  INITIAL_EVALUATORS
} from './mockData';

import { ScrutinyOverviewTab } from './features/overview/ScrutinyOverviewTab';
import { BundleManagementTab } from './features/bundles/BundleManagementTab';
import { MarksScrutinyAuditTab } from './features/audit/MarksScrutinyAuditTab';
import { CoEDispatchTab } from './features/dispatch/CoEDispatchTab';

type ScrutinizerTab = 'OVERVIEW' | 'BUNDLES' | 'AUDIT' | 'DISPATCH';

export default function ScrutinizerDashboard() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  // States
  const [activeTab, setActiveTab] = useState<ScrutinizerTab>('OVERVIEW');
  const [bundles, setBundles] = useState<ScrutinyBundle[]>(INITIAL_SCRUTINY_BUNDLES);
  const [evaluators] = useState<EvaluatorProfile[]>(INITIAL_EVALUATORS);
  const [selectedAuditBundleId, setSelectedAuditBundleId] = useState<string>(
    INITIAL_SCRUTINY_BUNDLES[0]?.id || ''
  );

  const handleUpdateBundle = (updatedBundle: ScrutinyBundle) => {
    setBundles(prev => prev.map(b => (b.id === updatedBundle.id ? updatedBundle : b)));
  };

  const handleAddBundle = (newBundle: ScrutinyBundle) => {
    setBundles(prev => [newBundle, ...prev]);
  };

  const handleNavigateToAuditWithBundle = (bundle: ScrutinyBundle) => {
    setSelectedAuditBundleId(bundle.id);
    setActiveTab('AUDIT');
  };

  const sidebarItems = [
    { id: 'OVERVIEW', label: 'Scrutiny Overview', icon: <Layers size={20} /> },
    { id: 'BUNDLES', label: 'Bundle Allocations', icon: <UserCheck size={20} /> },
    { id: 'AUDIT', label: 'Marks Totaling Audit', icon: <AlertTriangle size={20} /> },
    { id: 'DISPATCH', label: 'CoE Ledger Dispatch', icon: <ShieldCheck size={20} /> },
  ];

  const headerConfig: Record<ScrutinizerTab, { title: string; subtitle: string; icon: React.ReactNode; accentColor: string }> = {
    OVERVIEW: {
      title: 'Central Scrutiny & Bundle Custodian Operations',
      subtitle: 'Supervise examination answer script custody, evaluator allocations, and marks totaling integrity.',
      icon: <Layers size={26} />,
      accentColor: '#3b82f6',
    },
    BUNDLES: {
      title: 'Answer Booklet Bundle Allocation Desk',
      subtitle: 'Ingest examination center packets, attach anonymized barcodes, and assign bundles to qualified evaluators.',
      icon: <UserCheck size={26} />,
      accentColor: '#48977f',
    },
    AUDIT: {
      title: 'Marks Totaling & Omission Scrutiny Desk',
      subtitle: 'Verify question-by-question arithmetic sums, cover page grand totals, and un-evaluated answer pages.',
      icon: <AlertTriangle size={26} />,
      accentColor: '#f59e0b',
    },
    DISPATCH: {
      title: 'Certified CoE Grade Ledger Transmission',
      subtitle: 'Transmit cryptographically certified marks ledgers directly to the Controller of Examinations.',
      icon: <ShieldCheck size={26} />,
      accentColor: '#10b981',
    },
  };

  const currentHeader = headerConfig[activeTab];

  return (
    <MainLayout
      userName={user?.full_name || 'Dr. Claude Shannon'}
      userRole="Central Scrutiny Custodian"
      sidebarItems={sidebarItems}
      activeSidebarItemId={activeTab}
      onSidebarItemClick={id => setActiveTab(id as ScrutinizerTab)}
      onLogout={logout}
    >
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* ── Large Decorative Vector (Bottom-Right) ── */}
        <svg
          viewBox="0 0 340 340"
          width="420"
          height="420"
          style={{
            position: 'fixed',
            right: -50,
            bottom: -60,
            pointerEvents: 'none',
            opacity: 0.08,
            zIndex: 0,
          }}
        >
          {/* Bundle & Magnifying Audit Vector */}
          <rect x="60" y="80" width="220" height="180" rx="16" fill="#48977f" />
          <line x1="60" y1="140" x2="280" y2="140" stroke="white" strokeWidth="4" />
          <circle cx="210" cy="190" r="50" fill="none" stroke="white" strokeWidth="8" />
          <line x1="245" y1="225" x2="280" y2="260" stroke="white" strokeWidth="12" strokeLinecap="round" />
        </svg>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Page Header */}
          <PageHeader
            title={currentHeader.title}
            subtitle={currentHeader.subtitle}
            icon={currentHeader.icon}
            accentColor={currentHeader.accentColor}
          />

          {/* ── Tab Views ── */}
          {activeTab === 'OVERVIEW' && (
            <ScrutinyOverviewTab
              bundles={bundles}
              evaluators={evaluators}
              onNavigateToBundles={() => setActiveTab('BUNDLES')}
              onNavigateToAudit={() => setActiveTab('AUDIT')}
              onNavigateToDispatch={() => setActiveTab('DISPATCH')}
            />
          )}

          {activeTab === 'BUNDLES' && (
            <BundleManagementTab
              bundles={bundles}
              evaluators={evaluators}
              onUpdateBundle={handleUpdateBundle}
              onAddBundle={handleAddBundle}
              onNavigateToAudit={handleNavigateToAuditWithBundle}
            />
          )}

          {activeTab === 'AUDIT' && (
            <MarksScrutinyAuditTab
              bundles={bundles}
              selectedBundleId={selectedAuditBundleId}
              onSelectBundle={setSelectedAuditBundleId}
              onUpdateBundle={handleUpdateBundle}
              onCertifyBundleSuccess={() => setActiveTab('DISPATCH')}
            />
          )}

          {activeTab === 'DISPATCH' && (
            <CoEDispatchTab
              bundles={bundles}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
