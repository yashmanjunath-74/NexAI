import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus, ArrowLeft, CalendarDays } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';

import { SessionList }     from './components/SessionList';
import { AllocationWizard } from './components/AllocationWizard';
import { CreateSessionForm } from './components/CreateSessionForm';
import { SeatingBlueprint } from './components/SeatingBlueprint';

type ViewState = 'LIST' | 'CREATE_SESSION' | 'ALLOCATE' | 'BLUEPRINT';

// Mock data for the blueprint preview (pre-allocated session)
const MOCK_ALLOCATED = {
  selectedSubjects: [
    { code: 'CS301', title: 'Operating Systems',   eligibleStudents: 110, color: '#8b5cf6' },
    { code: 'MA201', title: 'Probability & Stats',  eligibleStudents: 95,  color: '#f59e0b' },
    { code: 'EC101', title: 'Basic Electronics',    eligibleStudents: 140, color: '#14b8a6' },
  ],
  selectedRooms: [
    { id: 'R1', roomNumber: 'A-101', building: 'Main Block',  capacity: 60 },
    { id: 'R2', roomNumber: 'A-102', building: 'Main Block',  capacity: 40 },
    { id: 'R3', roomNumber: 'B-201', building: 'South Wing',  capacity: 50 },
    { id: 'R4', roomNumber: 'B-205', building: 'South Wing',  capacity: 40 },
  ],
  assignments: {
    R1: 'Dr. Alan Turing',
    R2: 'Dr. Grace Hopper',
    R3: 'Dr. John von Neumann',
    R4: 'Dr. Ada Lovelace',
  },
};

export const AllocationsTab: React.FC = () => {
  const [viewState, setViewState]       = useState<ViewState>('LIST');
  const [activeSession, setActiveSession] = useState<string | null>(null);

  const backBtn = (
    <button
      onClick={() => setViewState('LIST')}
      style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 16px', borderRadius: '8px', fontWeight: 500 }}
    >
      <ArrowLeft size={16} /> Back
    </button>
  );

  const headerTitles: Record<ViewState, { title: string; subtitle: string }> = {
    LIST:           { title: 'Exam Allocations',     subtitle: 'Manage and schedule your exam sessions.' },
    CREATE_SESSION: { title: 'Create Exam Session',  subtitle: 'Define the session schedule and parameters.' },
    ALLOCATE:       { title: 'Allocate Session',     subtitle: 'Assign subjects, rooms, and invigilators step by step.' },
    BLUEPRINT:      { title: 'Seating Blueprint',    subtitle: 'Visual floor plan of the allocated session.' },
  };

  const h = headerTitles[viewState];

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>

      {/* ── Large decorative calendar vector ── */}
      <svg viewBox="0 0 300 320" width="400" height="420"
        style={{ position: 'fixed', right: -50, bottom: -60, pointerEvents: 'none', opacity: 0.1, zIndex: 0 }}
      >
        <rect x="20" y="50" width="260" height="250" rx="16" fill="#48977f" />
        <rect x="20" y="50" width="260" height="65" rx="16" fill="#2f6852" />
        <rect x="20" y="95" width="260" height="20" fill="#2f6852" />
        <rect x="80"  y="30" width="20" height="42" rx="10" fill="#48977f" />
        <rect x="200" y="30" width="20" height="42" rx="10" fill="#48977f" />
        <rect x="80" y="65" width="140" height="22" rx="4" fill="white" opacity="0.15" />
        {[0,1,2,3,4].map(row => [0,1,2,3,4,5,6].map(col => (
          <rect key={`${row}${col}`} x={30 + col*36} y={138 + row*38} width="26" height="26" rx="6" fill="white" opacity={((row===1&&col===3)||(row===3&&col===5))?0.35:0.12} />
        )))}
        <circle cx="138" cy="176" r="15" fill="white" opacity="0.3" />
        <circle cx="10"  cy="80"  r="5" fill="#48977f" opacity="0.4"/>
        <circle cx="290" cy="60"  r="4" fill="#48977f" opacity="0.35"/>
      </svg>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <PageHeader
          title={h.title}
          subtitle={h.subtitle}
          icon={<CalendarDays size={26} />}
          accentColor="#8b5cf6"
          action={
            viewState === 'LIST'
              ? <Button variant="outline-inverse" onClick={() => setViewState('CREATE_SESSION')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plus size={16} /> Create Session
                  </span>
                </Button>
              : backBtn
          }
        />

        {/* ── LIST: Full-width big session cards ── */}
        {viewState === 'LIST' && (
          <SessionList
            onAllocate={(id) => { setActiveSession(id); setViewState('ALLOCATE'); }}
            onView={(id)     => { setActiveSession(id); setViewState('BLUEPRINT'); }}
          />
        )}

        {/* ── CREATE SESSION form ── */}
        {viewState === 'CREATE_SESSION' && (
          <CreateSessionForm
            onCancel={() => setViewState('LIST')}
            onSave={() => setViewState('LIST')}
          />
        )}

        {/* ── ALLOCATION WIZARD (full screen, no side panel) ── */}
        {viewState === 'ALLOCATE' && activeSession && (
          <AllocationWizard
            sessionId={activeSession}
            onComplete={() => setViewState('LIST')}
          />
        )}

        {/* ── BLUEPRINT VIEW (pre-allocated sessions) ── */}
        {viewState === 'BLUEPRINT' && (
          <SeatingBlueprint
            selectedSubjects={MOCK_ALLOCATED.selectedSubjects}
            selectedRooms={MOCK_ALLOCATED.selectedRooms}
            assignments={MOCK_ALLOCATED.assignments}
            onReturn={() => setViewState('LIST')}
          />
        )}
      </div>
    </div>
  );
};
