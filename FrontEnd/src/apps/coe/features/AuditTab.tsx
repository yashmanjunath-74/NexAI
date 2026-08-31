import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface AuditLog {
  id: string;
  timestamp: string;
  actor_name: string;
  actor_email: string;
  action: string;
  severity: string;
  details: any;
}

interface Metrics {
  total_students_evaluated: number;
  average_gpa: number;
  pass_percentage: number;
}

interface AuditTabProps {
  logs: AuditLog[];
  metrics: Metrics | null;
  loading: boolean;
  error?: string;
}

export const AuditTab: React.FC<AuditTabProps> = ({ logs, metrics, loading, error }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
      {metrics && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          <Card variant="flat">
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Total Evaluated</p>
            <h3 style={{ margin: '8px 0 0 0', fontSize: '2rem' }}>{metrics.total_students_evaluated}</h3>
          </Card>
          <Card variant="flat">
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Average GPA</p>
            <h3 style={{ margin: '8px 0 0 0', fontSize: '2rem' }}>{metrics.average_gpa.toFixed(2)}</h3>
          </Card>
          <Card variant="flat">
            <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Pass Percentage</p>
            <h3 style={{ margin: '8px 0 0 0', fontSize: '2rem' }}>{metrics.pass_percentage.toFixed(1)}%</h3>
          </Card>
        </div>
      )}

      <Card variant="flat">
        <h3 style={{ marginBottom: '16px' }}>Immutable Audit Ledger</h3>
        {loading ? (
          <p>Loading logs...</p>
        ) : error ? (
          <p style={{ color: 'var(--color-danger)' }}>{error}</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                  <th style={{ padding: '12px', fontWeight: 600 }}>Timestamp</th>
                  <th style={{ padding: '12px', fontWeight: 600 }}>Actor</th>
                  <th style={{ padding: '12px', fontWeight: 600 }}>Action</th>
                  <th style={{ padding: '12px', fontWeight: 600 }}>Severity</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px', fontSize: '0.875rem' }}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ fontWeight: 500 }}>{log.actor_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{log.actor_email}</div>
                    </td>
                    <td style={{ padding: '12px', fontSize: '0.875rem', maxWidth: '300px' }}>{log.action}</td>
                    <td style={{ padding: '12px' }}>
                      <Badge variant={log.severity === 'HIGH' ? 'danger' : log.severity === 'MEDIUM' ? 'warning' : 'info'}>
                        {log.severity}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
