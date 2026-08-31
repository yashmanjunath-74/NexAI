import React, { useState } from 'react';
import { HallTicketRecord, StudentEligibilityRecord } from '../../types';
import { Badge } from '@/components/ui/Badge';
import {
  QrCode,
  Search,
  Eye
} from 'lucide-react';
import { HallTicketPreviewModal } from './components/HallTicketPreviewModal';
import { BatchGenerateModal } from './components/BatchGenerateModal';

interface HallTicketsTabProps {
  hallTickets: HallTicketRecord[];
  students: StudentEligibilityRecord[];
  onUpdateHallTickets: (updatedList: HallTicketRecord[]) => void;
}

export const HallTicketsTab: React.FC<HallTicketsTabProps> = ({
  hallTickets,
  students,
  onUpdateHallTickets,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('ALL');
  const [previewingTicket, setPreviewingTicket] = useState<HallTicketRecord | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  const filteredTickets = hallTickets.filter(t => {
    if (selectedSemester !== 'ALL' && !t.semester.includes(selectedSemester)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.ticketNumber.toLowerCase().includes(q) ||
        t.usn.toLowerCase().includes(q) ||
        t.studentName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleToggleRevocation = (ticketId: string) => {
    const updated = hallTickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          isRevoked: !t.isRevoked,
          revokeReason: !t.isRevoked ? 'Revoked by HOD due to disciplinary review.' : undefined,
        };
      }
      return t;
    });
    onUpdateHallTickets(updated);
  };

  const handleBatchGenerateSuccess = (newTickets: HallTicketRecord[]) => {
    // Merge new tickets without duplicates
    const existingUsns = hallTickets.map(t => t.usn);
    const uniqueNew = newTickets.filter(t => !existingUsns.includes(t.usn));
    onUpdateHallTickets([...hallTickets, ...uniqueNew]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* ── Filter Bar & Batch Generate CTA ── */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1.5px solid var(--color-border)',
        padding: '18px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)' }} />
          <input
            type="text"
            placeholder="Search Ticket No, USN or Name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              border: '1.5px solid var(--color-border)',
              fontSize: '0.82rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={selectedSemester}
            onChange={e => setSelectedSemester(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid var(--color-border)', fontSize: '0.8rem', fontWeight: 600 }}
          >
            <option value="ALL">All Semesters</option>
            <option value="3rd">3rd Semester B.Tech</option>
            <option value="5th">5th Semester B.Tech</option>
            <option value="7th">7th Semester B.Tech</option>
          </select>

          <button
            onClick={() => setIsBatchModalOpen(true)}
            style={{
              padding: '9px 18px',
              background: 'linear-gradient(135deg, #48977f 0%, #2f6852 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(72,151,127,0.3)',
            }}
          >
            <QrCode size={15} /> Batch Generate Hall Tickets
          </button>
        </div>
      </div>

      {/* ── Hall Tickets Table ── */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        border: '1.5px solid var(--color-border)',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
      }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
            Issued Examination Hall Tickets ({filteredTickets.length} Active Admit Cards)
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
            Digitally Signed with Tamper-Evident QR Code
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead style={{ background: '#f8fafc', color: 'var(--color-text-secondary)', fontWeight: 700, borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '14px 20px' }}>Admit Ticket No</th>
                <th style={{ padding: '14px 16px' }}>Student USN & Name</th>
                <th style={{ padding: '14px 16px' }}>Semester / Program</th>
                <th style={{ padding: '14px 16px' }}>Issue Timestamp</th>
                <th style={{ padding: '14px 16px' }}>QR Status</th>
                <th style={{ padding: '14px 16px' }}>Admit Status</th>
                <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map(ticket => (
                <tr key={ticket.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  {/* Ticket Number */}
                  <td style={{ padding: '14px 20px', fontWeight: 800, fontFamily: 'monospace', color: '#2563eb' }}>
                    {ticket.ticketNumber}
                  </td>

                  {/* Student Details */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 800, color: 'var(--color-text-primary)' }}>{ticket.studentName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontFamily: 'monospace' }}>{ticket.usn}</div>
                  </td>

                  {/* Semester */}
                  <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                    {ticket.semester}
                  </td>

                  {/* Timestamp */}
                  <td style={{ padding: '14px 16px', color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
                    {ticket.generatedAt}
                  </td>

                  {/* QR Status */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      background: '#ecfdf5',
                      color: '#059669',
                      border: '1px solid #a7f3d0',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      <QrCode size={11} /> Verified QR
                    </span>
                  </td>

                  {/* Admit Status */}
                  <td style={{ padding: '14px 16px' }}>
                    {ticket.isRevoked ? (
                      <Badge variant="danger">REVOKED</Badge>
                    ) : (
                      <Badge variant="success">ACTIVE ADMIT</Badge>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        onClick={() => setPreviewingTicket(ticket)}
                        style={{
                          padding: '6px 12px',
                          background: '#f8fafc',
                          border: '1.5px solid var(--color-border)',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Eye size={12} /> View Card
                      </button>

                      <button
                        onClick={() => handleToggleRevocation(ticket.id)}
                        style={{
                          padding: '6px 10px',
                          background: ticket.isRevoked ? '#ecfdf5' : '#fff1f2',
                          border: `1px solid ${ticket.isRevoked ? '#a7f3d0' : '#fecdd3'}`,
                          color: ticket.isRevoked ? '#059669' : '#e11d48',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {ticket.isRevoked ? 'Restore' : 'Revoke'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hall Ticket Preview Modal */}
      {previewingTicket && (
        <HallTicketPreviewModal
          ticket={previewingTicket}
          onClose={() => setPreviewingTicket(null)}
        />
      )}

      {/* Batch Generator Modal */}
      {isBatchModalOpen && (
        <BatchGenerateModal
          students={students}
          onBatchGenerateSuccess={handleBatchGenerateSuccess}
          onClose={() => setIsBatchModalOpen(false)}
        />
      )}
    </div>
  );
};
