import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, ArrowLeft, CalendarDays, Sparkles } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';

import { SessionList } from './components/SessionList';
import { AllocationWizard } from './components/AllocationWizard';
import { CreateSessionForm } from './components/CreateSessionForm';
import { SeatingBlueprint } from './components/SeatingBlueprint';

import {
  RoomAllocationResult,
  AITelemetryMetrics,
  SessionScopeConfig,
} from './types/allocationTypes';

import {
  MOCK_ALL_SUBJECTS,
  MOCK_EXAM_HALLS,
  MOCK_FACULTY_ROSTER,
  MOCK_TIME_SLOTS,
} from './mock/allocationMockData';

import { runAISeatingSolver } from './services/aiAllocationEngine';

type ViewState = 'LIST' | 'CREATE_SESSION' | 'ALLOCATE' | 'BLUEPRINT';

export const AllocationsTab: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>('LIST');
  const [activeSession, setActiveSession] = useState<string | null>('S1');

  // Compute default baseline AI allocation so pre-existing sessions have a live floor plan
  const defaultSolution = useMemo(() => {
    return runAISeatingSolver(
      MOCK_ALL_SUBJECTS.slice(0, 5), // CS301, EC301, ME301, CV301, AI301
      [MOCK_EXAM_HALLS[0], MOCK_EXAM_HALLS[1], MOCK_EXAM_HALLS[2], MOCK_EXAM_HALLS[3]],
      MOCK_FACULTY_ROSTER,
      {
        interleavingStrategy: 'CHECKERBOARD_2D',
        antiCheatingStrictness: 'MAXIMUM',
        invigilatorRatio: 30,
        enforceEqualWorkload: true,
        avoidDepartmentBias: true,
        reserveBufferPercentage: 5,
        prioritizeGroundFloorPWD: true,
      }
    );
  }, []);

  const [blueprintResults, setBlueprintResults] = useState<RoomAllocationResult[]>(
    defaultSolution.results
  );
  const [blueprintTelemetry, setBlueprintTelemetry] = useState<AITelemetryMetrics>(
    defaultSolution.telemetry
  );
  const [blueprintScope, setBlueprintScope] = useState<SessionScopeConfig>({
    sessionName: 'SEE Autumn 2026 — Institutional End Semester Examination',
    examType: 'SEE_REGULAR',
    academicYear: '2026-27',
    selectedDepartments: ['CSE', 'ECE', 'ME', 'CV', 'AIML'],
    selectedSemesters: [3, 5],
    examsPerDay: 1,
    startDate: '2026-11-15',
    selectedSlots: [MOCK_TIME_SLOTS[0]],
  });

  const handleCompleteAllocation = (
    results: RoomAllocationResult[],
    telemetry: AITelemetryMetrics,
    scope: SessionScopeConfig
  ) => {
    setBlueprintResults(results);
    setBlueprintTelemetry(telemetry);
    setBlueprintScope(scope);
    setViewState('BLUEPRINT');
  };

  const backBtn = (
    <button
      onClick={() => setViewState('LIST')}
      style={{
        background: 'rgba(255,255,255,0.2)',
        border: '1px solid rgba(255,255,255,0.3)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        padding: '8px 16px',
        borderRadius: '8px',
        fontWeight: 600,
        fontSize: '0.85rem',
      }}
    >
      <ArrowLeft size={16} /> Back to Sessions
    </button>
  );

  const headerTitles: Record<ViewState, { title: string; subtitle: string }> = {
    LIST: {
      title: 'SEE Institutional Examination Allocations',
      subtitle: 'Institution-wide semester end examinations across all departments with anti-cheating matrix.',
    },
    CREATE_SESSION: {
      title: 'Create SEE Exam Session',
      subtitle: 'Define participating departments, semesters, time windows, and exam limits per day.',
    },
    ALLOCATE: {
      title: 'AI Examination Allocation Wizard',
      subtitle: 'Multi-parameter selection, cross-department interleaving, and equalized invigilator balancer.',
    },
    BLUEPRINT: {
      title: 'Interleaved Seating Blueprint & Floor Plan',
      subtitle: 'Visual hall matrix, multi-department bench interleaving, and invigilation supervision roster.',
    },
  };

  const h = headerTitles[viewState];

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative vector */}
      <svg
        viewBox="0 0 300 320"
        width="400"
        height="420"
        style={{ position: 'fixed', right: -50, bottom: -60, pointerEvents: 'none', opacity: 0.08, zIndex: 0 }}
      >
        <rect x="20" y="50" width="260" height="250" rx="16" fill="#4F46E5" />
        <rect x="20" y="50" width="260" height="65" rx="16" fill="#312E81" />
        <rect x="20" y="95" width="260" height="20" fill="#312E81" />
        <rect x="80" y="30" width="20" height="42" rx="10" fill="#4F46E5" />
        <rect x="200" y="30" width="20" height="42" rx="10" fill="#4F46E5" />
      </svg>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <PageHeader
          title={h.title}
          subtitle={h.subtitle}
          icon={<CalendarDays size={26} />}
          accentColor="#4F46E5"
          action={
            viewState === 'LIST' ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button
                  variant="outline-inverse"
                  onClick={() => {
                    setActiveSession('NEW_AI');
                    setViewState('ALLOCATE');
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Sparkles size={16} /> Run AI Allocator
                </Button>
                <Button
                  variant="outline-inverse"
                  onClick={() => setViewState('CREATE_SESSION')}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Plus size={16} /> Create Session
                </Button>
              </div>
            ) : (
              backBtn
            )
          }
        />

        {/* 1. LIST: Sessions */}
        {viewState === 'LIST' && (
          <SessionList
            onAllocate={id => {
              setActiveSession(id);
              setViewState('ALLOCATE');
            }}
            onView={id => {
              setActiveSession(id);
              setViewState('BLUEPRINT');
            }}
          />
        )}

        {/* 2. CREATE SESSION FORM */}
        {viewState === 'CREATE_SESSION' && (
          <CreateSessionForm
            onCancel={() => setViewState('LIST')}
            onSave={() => setViewState('LIST')}
            onSaveAndAllocate={() => {
              setActiveSession('NEW_AI');
              setViewState('ALLOCATE');
            }}
          />
        )}

        {/* 3. ALLOCATION WIZARD (5 Modular Steps) */}
        {viewState === 'ALLOCATE' && (
          <AllocationWizard
            sessionId={activeSession || 'S1'}
            onCompleteAllocation={handleCompleteAllocation}
            onCancel={() => setViewState('LIST')}
          />
        )}

        {/* 4. BLUEPRINT VIEW */}
        {viewState === 'BLUEPRINT' && (
          <SeatingBlueprint
            roomResults={blueprintResults}
            telemetry={blueprintTelemetry}
            scopeConfig={blueprintScope}
            onReturn={() => setViewState('LIST')}
          />
        )}
      </div>
    </div>
  );
};
