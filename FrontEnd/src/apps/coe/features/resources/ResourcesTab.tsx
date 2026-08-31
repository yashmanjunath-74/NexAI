import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Plus, Building } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';

import { ResourceList } from './components/ResourceList';
import { CreateRoomForm } from './components/CreateRoomForm';
import { CreateFacultyForm } from './components/CreateFacultyForm';

export const ResourcesTab: React.FC = () => {
  const [viewState, setViewState] = useState<'LIST' | 'CREATE_ROOM' | 'CREATE_FACULTY'>('LIST');
  const [activeSubTab, setActiveSubTab] = useState<'ROOMS' | 'FACULTY'>('ROOMS');

  const handleCancel = () => setViewState('LIST');
  const handleSave   = () => setViewState('LIST');

  const backBtn = (
    <button onClick={handleCancel} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 16px', borderRadius: '8px', fontWeight: 500 }}>
      <ArrowLeft size={16} /> Back
    </button>
  );

  const headerConfig = {
    LIST: {
      title: 'Resource Management',
      subtitle: 'Manage exam rooms and registered faculty.',
      action: (
        <Button variant="outline-inverse" onClick={() => setViewState(activeSubTab === 'ROOMS' ? 'CREATE_ROOM' : 'CREATE_FACULTY')}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={16} /> {activeSubTab === 'ROOMS' ? 'Add New Room' : 'Add New Faculty'}
          </span>
        </Button>
      ),
    },
    CREATE_ROOM:    { title: 'Register Exam Room',  subtitle: 'Add a new exam hall or room.', action: backBtn },
    CREATE_FACULTY: { title: 'Register Faculty',    subtitle: 'Add a new invigilator or evaluator.', action: backBtn },
  };

  const cfg = headerConfig[viewState];

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>

      {/* ── Large decorative vector: Institution Building ── */}
      <svg
        viewBox="0 0 300 340"
        width="400" height="440"
        style={{
          position: 'fixed',
          right: -50,
          bottom: -60,
          pointerEvents: 'none',
          opacity: 0.1,
          zIndex: 0,
        }}
      >
        {/* Main building body */}
        <rect x="30" y="120" width="240" height="200" rx="4" fill="#48977f" />
        {/* Roof / pediment */}
        <polygon points="150,30 20,120 280,120" fill="#3b7a65" />
        {/* Columns */}
        {[60, 100, 140, 180, 220].map(x => (
          <rect key={x} x={x} y="120" width="14" height="200" rx="3" fill="#2f6852" opacity="0.5" />
        ))}
        {/* Windows row 1 */}
        {[50, 110, 170, 225].map(x => (
          <rect key={`w1-${x}`} x={x} y="145" width="30" height="36" rx="2" fill="white" opacity="0.25" />
        ))}
        {/* Windows row 2 */}
        {[50, 110, 170, 225].map(x => (
          <rect key={`w2-${x}`} x={x} y="200" width="30" height="36" rx="2" fill="white" opacity="0.2" />
        ))}
        {/* Central door */}
        <rect x="118" y="262" width="64" height="58" rx="3" fill="white" opacity="0.3" />
        <ellipse cx="150" cy="262" rx="32" ry="10" fill="white" opacity="0.2" />
        {/* Flagpole */}
        <line x1="150" y1="30" x2="150" y2="0" stroke="#48977f" strokeWidth="4" strokeLinecap="round" />
        <rect x="150" y="0" width="32" height="20" rx="2" fill="#48977f" opacity="0.6" />
        {/* Steps */}
        <rect x="20"  y="314" width="260" height="10" rx="2" fill="#2f6852" />
        <rect x="10"  y="322" width="280" height="10" rx="2" fill="#2f6852" opacity="0.7" />
        {/* Floating sparkles */}
        <circle cx="20"  cy="80"  r="5" fill="#48977f" opacity="0.4"/>
        <circle cx="282" cy="60"  r="4" fill="#48977f" opacity="0.35"/>
        <circle cx="10"  cy="200" r="6" fill="#48977f" opacity="0.3"/>
      </svg>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <PageHeader
          title={cfg.title}
          subtitle={cfg.subtitle}
          icon={<Building size={26} />}
          accentColor="#3b82f6"
          action={cfg.action}
        />

        {viewState === 'LIST'           && <ResourceList activeSubTab={activeSubTab} setActiveSubTab={setActiveSubTab} />}
        {viewState === 'CREATE_ROOM'    && <CreateRoomForm    onCancel={handleCancel} onSave={handleSave} />}
        {viewState === 'CREATE_FACULTY' && <CreateFacultyForm onCancel={handleCancel} onSave={handleSave} />}
      </div>
    </div>
  );
};
