import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  Layers,
  PenTool,
  AlertTriangle,
  Award
} from 'lucide-react';

import {
  ValuationBundle,
  ScannedAnswerBooklet,
  ValuationLedgerEntry
} from './types';
import {
  INITIAL_BUNDLES,
  INITIAL_SCRIPTS,
  INITIAL_VALUATION_LEDGER
} from './mockData';

import { ValuationWorklistTab } from './features/worklist/ValuationWorklistTab';
import { DigitalValuationStudio } from './features/studio/DigitalValuationStudio';
import { ChiefReviewTab } from './features/review/ChiefReviewTab';
import { ValuationLedgerTab } from './features/remuneration/ValuationLedgerTab';

type EvaluatorTab = 'WORKLIST' | 'STUDIO' | 'CHIEF_REVIEW' | 'LEDGER';

export default function EvaluatorDashboard() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  // Master State
  const [activeTab, setActiveTab] = useState<EvaluatorTab>('WORKLIST');
  const [bundles, setBundles] = useState<ValuationBundle[]>(INITIAL_BUNDLES);
  const [scripts, setScripts] = useState<ScannedAnswerBooklet[]>(INITIAL_SCRIPTS);
  const [ledgerEntries, setLedgerEntries] = useState<ValuationLedgerEntry[]>(INITIAL_VALUATION_LEDGER);
  const [activeBundleId, setActiveBundleId] = useState<string>('BUNDLE-CS201-04');
  const [activeScriptForStudio, setActiveScriptForStudio] = useState<ScannedAnswerBooklet | null>(null);

  // Studio Launcher
  const handleOpenStudio = (script: ScannedAnswerBooklet) => {
    setActiveScriptForStudio(script);
    setActiveTab('STUDIO');
  };

  const handleUpdateScript = (updatedScript: ScannedAnswerBooklet) => {
    setScripts(prev => prev.map(s => (s.id === updatedScript.id ? updatedScript : s)));
    if (activeScriptForStudio?.id === updatedScript.id) {
      setActiveScriptForStudio(updatedScript);
    }
  };

  const handleSubmitValuationSuccess = () => {
    if (!activeScriptForStudio) return;

    // Create ledger entry
    const newEntry: ValuationLedgerEntry = {
      id: `LEDGER_${Date.now()}`,
      scriptDummyBarcode: activeScriptForStudio.dummyBarcode,
      subjectCode: activeScriptForStudio.subjectCode,
      valuedAt: new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' IST',
      totalMarksAwarded: activeScriptForStudio.evaluatorTotalScore || 0,
      maxMarks: activeScriptForStudio.maxMarks,
      remunerationEarned: 35,
      digitalSignatureHash: `0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
    };

    setLedgerEntries(prev => [newEntry, ...prev]);

    // Update bundle progress
    setBundles(prev =>
      prev.map(b =>
        b.id === activeScriptForStudio.bundleId
          ? { ...b, completedScripts: Math.min(b.totalScripts, b.completedScripts + 1) }
          : b
      )
    );

    setActiveScriptForStudio(null);
    setActiveTab('WORKLIST');
  };

  const sidebarItems = [
    { id: 'WORKLIST', label: 'Valuation Queue', icon: <Layers size={20} /> },
    { id: 'STUDIO', label: 'Marking Studio', icon: <PenTool size={20} /> },
    { id: 'CHIEF_REVIEW', label: 'Chief Referee Review', icon: <AlertTriangle size={20} /> },
    { id: 'LEDGER', label: 'Valuation Ledger', icon: <Award size={20} /> },
  ];

  const headerConfig: Record<EvaluatorTab, { title: string; subtitle: string; icon: React.ReactNode; accentColor: string }> = {
    WORKLIST: {
      title: 'Central Digital Valuation Workspace',
      subtitle: 'Double-blind on-screen valuation of scanned handwritten answer booklets with AI step-marking assistance.',
      icon: <Layers size={26} />,
      accentColor: '#3b82f6',
    },
    STUDIO: {
      title: 'On-Screen Digital Valuation Studio',
      subtitle: 'Split-screen canvas with interactive annotation tools, model answer keys, and NexAI handwriting OCR.',
      icon: <PenTool size={26} />,
      accentColor: '#48977f',
    },
    CHIEF_REVIEW: {
      title: 'Chief Examiner Variance Review Desk',
      subtitle: 'Inspect answer booklets flagged with >15% variance between examiner marking and AI baseline.',
      icon: <AlertTriangle size={26} />,
      accentColor: '#ef4444',
    },
    LEDGER: {
      title: 'Digital Valuation Ledger & Honorarium Claim',
      subtitle: 'Immutable record of valued booklets with cryptographic signatures and automated remuneration claim billing.',
      icon: <Award size={26} />,
      accentColor: '#8b5cf6',
    },
  };

  const currentHeader = headerConfig[activeTab];

  return (
    <MainLayout
      userName={user?.full_name || 'Dr. Edsger Dijkstra'}
      userRole="Central Valuation Examiner"
      sidebarItems={sidebarItems}
      activeSidebarItemId={activeTab}
      onSidebarItemClick={id => {
        if (id === 'STUDIO' && !activeScriptForStudio) {
          // Open first available script in current bundle
          const firstScript = scripts.find(s => s.bundleId === activeBundleId) || scripts[0];
          setActiveScriptForStudio(firstScript);
        }
        setActiveTab(id as EvaluatorTab);
      }}
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
          {/* Digital Pen & Certificate Stamp Vector */}
          <circle cx="170" cy="170" r="130" fill="none" stroke="#48977f" strokeWidth="8" strokeDasharray="12 8" />
          <polygon points="170,40 210,130 170,250 130,130" fill="#48977f" />
          <circle cx="170" cy="130" r="20" fill="white" />
          <path d="M110,210 L170,270 L230,210" fill="none" stroke="#48977f" strokeWidth="6" />
        </svg>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Page Header (Rendered when not in full studio mode) */}
          {activeTab !== 'STUDIO' && (
            <PageHeader
              title={currentHeader.title}
              subtitle={currentHeader.subtitle}
              icon={currentHeader.icon}
              accentColor={currentHeader.accentColor}
            />
          )}

          {/* ── Tab Views ── */}
          {activeTab === 'WORKLIST' && (
            <ValuationWorklistTab
              bundles={bundles}
              scripts={scripts}
              activeBundleId={activeBundleId}
              onSelectBundle={setActiveBundleId}
              onOpenStudio={handleOpenStudio}
            />
          )}

          {activeTab === 'STUDIO' && (
            activeScriptForStudio ? (
              <DigitalValuationStudio
                script={activeScriptForStudio}
                onUpdateScript={handleUpdateScript}
                onCloseStudio={() => {
                  setActiveScriptForStudio(null);
                  setActiveTab('WORKLIST');
                }}
                onSubmitSuccess={handleSubmitValuationSuccess}
              />
            ) : (
              <div style={{ background: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center', border: '1.5px dashed var(--color-border)' }}>
                <p>No script currently selected for valuation.</p>
                <button
                  onClick={() => setActiveTab('WORKLIST')}
                  style={{ padding: '8px 18px', background: '#48977f', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
                >
                  Select Script from Queue
                </button>
              </div>
            )
          )}

          {activeTab === 'CHIEF_REVIEW' && (
            <ChiefReviewTab
              flaggedScripts={scripts.filter(s => s.status === 'DEVIATION_FLAGGED')}
              onOpenStudio={handleOpenStudio}
            />
          )}

          {activeTab === 'LEDGER' && (
            <ValuationLedgerTab
              ledgerEntries={ledgerEntries}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
