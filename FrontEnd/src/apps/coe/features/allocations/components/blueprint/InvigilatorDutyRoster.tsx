import React from 'react';
import { Scale, Phone } from 'lucide-react';
import { RoomAllocationResult } from '../../types/allocationTypes';

interface InvigilatorDutyRosterProps {
  roomResults: RoomAllocationResult[];
}

export const InvigilatorDutyRoster: React.FC<InvigilatorDutyRosterProps> = ({ roomResults }) => {
  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      border: '1.5px solid var(--color-border)',
      overflow: 'hidden',
      boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
    }}>
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Scale size={22} color="#7C3AED" />
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#1E293B' }}>
              Official Invigilation Duty Roster (Equalized Allocation)
            </h3>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>
              All duties distributed under institutional fairness parameters with cross-department anti-bias pairing.
            </p>
          </div>
        </div>

        <span style={{
          background: '#F5F3FF',
          color: '#7C3AED',
          border: '1px solid #DDD6FE',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 700,
        }}>
          {roomResults.length} Active Exam Halls
        </span>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569', fontWeight: 700 }}>
            <th style={{ padding: '14px 20px' }}>Exam Hall</th>
            <th style={{ padding: '14px 16px' }}>Location</th>
            <th style={{ padding: '14px 16px', textAlign: 'center' }}>Candidates</th>
            <th style={{ padding: '14px 20px' }}>Chief Invigilator</th>
            <th style={{ padding: '14px 20px' }}>Reliever / Second Invigilator</th>
            <th style={{ padding: '14px 16px', textAlign: 'center' }}>Pairing Status</th>
          </tr>
        </thead>
        <tbody>
          {roomResults.map(res => {
            const chief = res.chiefInvigilator;
            const reliever = res.relieverInvigilator;
            const isCrossPaired = reliever && chief && chief.department !== reliever.department;

            return (
              <tr key={res.roomId} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '14px 20px' }}>
                  <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem' }}>
                    Hall {res.roomNumber}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    Capacity: {res.capacity} Seats
                  </div>
                </td>

                <td style={{ padding: '14px 16px', color: '#475569' }}>
                  <div>{res.building}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                    {res.floor === 0 ? 'Ground Floor (PWD)' : `Floor ${res.floor}`}
                  </div>
                </td>

                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <span style={{
                    fontWeight: 900,
                    fontSize: '1rem',
                    color: '#059669',
                    background: '#ECFDF5',
                    padding: '3px 10px',
                    borderRadius: '6px',
                  }}>
                    {res.occupiedCount}
                  </span>
                </td>

                <td style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#38BDF8' }} />
                    <div>
                      <div style={{ fontWeight: 800, color: '#1E293B' }}>{chief?.name || 'Unassigned'}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                        Dept: <span style={{ fontWeight: 700, color: '#0284C7' }}>{chief?.department}</span> • {chief?.designation}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Phone size={10} /> {chief?.phone}
                      </div>
                    </div>
                  </div>
                </td>

                <td style={{ padding: '14px 20px' }}>
                  {reliever ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#A78BFA' }} />
                      <div>
                        <div style={{ fontWeight: 800, color: '#1E293B' }}>{reliever.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>
                          Dept: <span style={{ fontWeight: 700, color: '#7C3AED' }}>{reliever.department}</span> • {reliever.designation}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <Phone size={10} /> {reliever.phone}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8', fontStyle: 'italic' }}>
                      Single Invigilator (Hall &le; 35 Seats)
                    </span>
                  )}
                </td>

                <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <span style={{
                    background: isCrossPaired ? '#ECFDF5' : '#F1F5F9',
                    color: isCrossPaired ? '#047857' : '#475569',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}>
                    {isCrossPaired ? '✓ Cross-Paired' : 'Standard'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
