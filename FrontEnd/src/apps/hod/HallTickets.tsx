import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

interface HallTicket {
  id: string;
  ticket_number: string;
  student: string;
  exam_session: string;
  is_revoked: boolean;
  generated_at: string;
}

export default function HallTickets() {
  const [tickets, setTickets] = useState<HallTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { accessToken } = useAuthStore();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/hod/hall-tickets/', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setTickets(data);
        } else {
          setError('Failed to fetch hall tickets');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [accessToken]);

  return (
    <div className="card animate-fade-in" style={{ padding: '2rem' }}>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>Generated Hall Tickets</h2>
      
      {loading ? (
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading hall tickets...</p>
      ) : error ? (
        <p style={{ color: '#ef4444' }}>{error}</p>
      ) : tickets.length === 0 ? (
        <p style={{ color: 'var(--color-text-secondary)' }}>No hall tickets generated yet.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-secondary)' }}>
                <th style={{ padding: '1rem' }}>Ticket Number</th>
                <th style={{ padding: '1rem' }}>Student ID</th>
                <th style={{ padding: '1rem' }}>Session</th>
                <th style={{ padding: '1rem' }}>Generated At</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem', fontFamily: 'monospace' }}>{ticket.ticket_number}</td>
                  <td style={{ padding: '1rem' }}>{ticket.student}</td>
                  <td style={{ padding: '1rem' }}>{ticket.exam_session}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>
                    {new Date(ticket.generated_at).toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '9999px', 
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: ticket.is_revoked ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: ticket.is_revoked ? '#ef4444' : '#10b981'
                    }}>
                      {ticket.is_revoked ? 'Revoked' : 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
