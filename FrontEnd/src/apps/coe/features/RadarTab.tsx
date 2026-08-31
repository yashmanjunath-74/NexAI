import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface RadarSession {
  session_id: string;
  student_usn: string;
  timetable_slot: string;
  high_severity_flags: number;
  medium_severity_flags: number;
  low_severity_flags: number;
  total_flags: number;
  latest_event: string | null;
}

interface RadarTabProps {
  data: RadarSession[];
  loading: boolean;
  error?: string;
}

export const RadarTab: React.FC<RadarTabProps> = ({ data, loading, error }) => {
  return (
    <Card variant="flat">
      <h3 style={{ marginBottom: '16px', color: 'var(--color-danger)' }}>🔴 Live Proctoring Radar</h3>
      
      {loading ? (
        <p>Scanning signals...</p>
      ) : error ? (
        <p style={{ color: 'var(--color-danger)' }}>{error}</p>
      ) : data.length === 0 ? (
        <p style={{ color: 'var(--color-text-secondary)' }}>No active sessions with flags right now.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {data.map(session => (
            <Card key={session.session_id} variant="default" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderColor: session.high_severity_flags > 0 ? 'var(--color-danger)' : 'var(--color-border)'
            }}>
              <div>
                <h4 style={{ margin: 0 }}>USN: {session.student_usn}</h4>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Slot: {session.timetable_slot}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', fontWeight: 600 }}>
                  Latest Event: {session.latest_event || 'None'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Badge variant="danger">{session.high_severity_flags} High</Badge>
                <Badge variant="warning">{session.medium_severity_flags} Med</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
};
