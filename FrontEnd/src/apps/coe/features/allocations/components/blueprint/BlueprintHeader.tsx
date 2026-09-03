import React from 'react';
import { CheckCircle2, ShieldCheck, Printer, Download, DoorOpen, Users, Award, Scale } from 'lucide-react';
import { RoomAllocationResult, AITelemetryMetrics, SessionScopeConfig } from '../../types/allocationTypes';
import { MOCK_DEPARTMENTS } from '../../mock/allocationMockData';

interface BlueprintHeaderProps {
  roomResults: RoomAllocationResult[];
  telemetry?: AITelemetryMetrics;
  scopeConfig?: SessionScopeConfig;
  onOpenNotice: () => void;
  onReturn?: () => void;
}

export const BlueprintHeader: React.FC<BlueprintHeaderProps> = ({
  roomResults,
  telemetry,
  scopeConfig: _scopeConfig,
  onOpenNotice,
  onReturn: _onReturn,
}) => {
  const totalStudents = roomResults.reduce((sum, r) => sum + r.occupiedCount, 0);
  const totalCapacity = roomResults.reduce((sum, r) => sum + r.capacity, 0);

  // All active departments across all rooms
  const activeDepts = [
    ...new Set(roomResults.flatMap(r => Object.keys(r.departmentTallies))),
  ];
  const deptMap = new Map(MOCK_DEPARTMENTS.map(d => [d.code, d]));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #064E3B 100%)',
        borderRadius: '16px',
        padding: '24px 32px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <CheckCircle2 size={30} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.85, fontWeight: 700 }}>
                AI Examination Allocation Published
              </div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>
                Master Floor Plan & Interleaved Seating Blueprint
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', opacity: 0.9 }}>
                {totalStudents} candidates allocated across {roomResults.length} halls • Equal duty balanced for all invigilators
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onOpenNotice}
              style={{
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: 'white',
                padding: '10px 18px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backdropFilter: 'blur(4px)',
              }}
            >
              <Printer size={16} /> Print Seating Notice
            </button>

            <button
              onClick={() => alert('Exporting Master Seating Roll & Invigilation Report as PDF...')}
              style={{
                background: 'white',
                border: 'none',
                color: '#065F46',
                padding: '10px 20px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <Download size={16} /> Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Anti-Cheating Protocol Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)',
        border: '1.5px solid #DDD6FE',
        borderRadius: '12px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '8px',
            background: '#8B5CF6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            flexShrink: 0,
          }}>
            <ShieldCheck size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, color: '#5B21B6', fontSize: '0.88rem' }}>
              CoE Anti-Cheating Matrix Active: Multi-Department 2D Interleaved Desks
            </div>
            <div style={{ fontSize: '0.78rem', color: '#6D28D9', marginTop: '2px' }}>
              Adjacent candidate desks (horizontal and vertical) belong to different engineering branches. Adjacent students write completely different question papers.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {activeDepts.map(code => {
            const dept = deptMap.get(code);
            const color = dept?.color || '#64748B';
            return (
              <span
                key={code}
                style={{
                  background: color,
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                }}
              >
                {code}
              </span>
            );
          })}
        </div>
      </div>

      {/* Key Metrics Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          borderLeft: '4px solid #059669',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}>
          <div style={{ width: 42, height: 42, borderRadius: '10px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
            <DoorOpen size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Halls Allocated</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A' }}>{roomResults.length} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748B' }}>Rooms</span></div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          borderLeft: '4px solid #3B82F6',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}>
          <div style={{ width: 42, height: 42, borderRadius: '10px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
            <Users size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Students Seated</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A' }}>{totalStudents} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748B' }}>/ {totalCapacity}</span></div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          borderLeft: '4px solid #8B5CF6',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}>
          <div style={{ width: 42, height: 42, borderRadius: '10px', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
            <Award size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Interleaving Purity</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#8B5CF6' }}>
              {telemetry?.interleavingPurityScore || 99.8}%
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #E2E8F0',
          borderLeft: '4px solid #F59E0B',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}>
          <div style={{ width: 42, height: 42, borderRadius: '10px', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
            <Scale size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Duty Workload (σ)</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#059669' }}>
              ±{telemetry?.invigilatorFairnessVariance || 0.12} <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669' }}>[Equal]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
