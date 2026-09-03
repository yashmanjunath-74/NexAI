import React, { useState } from 'react';
import { ExamHallPacket } from '../types';
import { X, Copy, Check, QrCode, Smartphone, ShieldCheck } from 'lucide-react';
import QRCode from 'react-qr-code';

interface Props {
  packet: ExamHallPacket;
  onClose: () => void;
  onSaveSession: (updatedPacket: ExamHallPacket) => void;
}

export const SessionKeyModal: React.FC<Props> = ({ packet, onClose, onSaveSession }) => {
  const [stationId, setStationId] = useState(packet.assignedStationId || 'Station 01');
  const [staffName, setStaffName] = useState(packet.assignedStaffName || 'Ramesh Verma (Staff #42)');
  const [copied, setCopied] = useState(false);

  // Generate or reuse session key
  const generatedKey = packet.sessionKey || `SCAN-FALL26-${packet.courseCode}-${packet.hallNumber.replace(/\s+/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleActivate = () => {
    const updated: ExamHallPacket = {
      ...packet,
      sessionKey: generatedKey,
      assignedStationId: stationId,
      assignedStaffName: staffName,
      status: packet.status === 'PENDING_KEY' ? 'KEY_GENERATED' : packet.status,
      keyGeneratedAt: packet.keyGeneratedAt || new Date().toISOString(),
    };
    onSaveSession(updated);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1.5rem',
      fontFamily: 'var(--font-sans, inherit)',
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        maxWidth: '560px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: '#E8F5F1',
              color: '#2F6852',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <QrCode size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                Scanning Session Credentials
              </h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748B' }}>
                Authorize scanning staff mobile workstation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#94A3B8',
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Packet Summary Banner */}
          <div style={{
            background: '#F8FAFC',
            borderRadius: '12px',
            padding: '14px 16px',
            border: '1px solid #E2E8F0',
            marginBottom: '20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            fontSize: '0.82rem',
          }}>
            <div>
              <span style={{ color: '#64748B' }}>Course / Exam:</span>
              <div style={{ fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                {packet.courseCode} — {packet.courseTitle}
              </div>
            </div>
            <div>
              <span style={{ color: '#64748B' }}>Hall / Capacity:</span>
              <div style={{ fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>
                {packet.hallNumber} • {packet.expectedBooklets} Booklets
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
            borderRadius: '16px',
            color: 'white',
            marginBottom: '20px',
            textAlign: 'center',
          }}>
            <div style={{
              background: '#FFFFFF',
              padding: '14px',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
              marginBottom: '14px',
            }}>
              <QRCode
                value={JSON.stringify({
                  sessionKey: generatedKey,
                  packetId: packet.id,
                  courseCode: packet.courseCode,
                  hallNumber: packet.hallNumber,
                  expectedBooklets: packet.expectedBooklets,
                  stationId: stationId,
                })}
                size={160}
                style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
                viewBox={`0 0 160 160`}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#94A3B8' }}>
              <Smartphone size={14} color="#10B981" />
              <span>Scanning staff: Point <strong>NexAI Scanner App</strong> camera to connect instantly</span>
            </div>
          </div>

          {/* Session Key Display */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Authorized Session Key (Manual Entry)
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: '#F1F5F9',
              border: '1.5px dashed #48977F',
              borderRadius: '12px',
              padding: '10px 14px',
            }}>
              <span style={{
                fontFamily: 'monospace',
                fontSize: '1.1rem',
                fontWeight: 800,
                color: '#2F6852',
                letterSpacing: '1px',
                flex: 1,
              }}>
                {generatedKey}
              </span>
              <button
                onClick={handleCopy}
                style={{
                  background: copied ? '#10B981' : '#FFFFFF',
                  color: copied ? 'white' : '#0F172A',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.2s',
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied' : 'Copy Key'}
              </button>
            </div>
          </div>

          {/* Station & Staff Assignment */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Designated Station
              </label>
              <select
                value={stationId}
                onChange={(e) => setStationId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  background: 'white',
                  color: '#0F172A',
                }}
              >
                <option value="Station 01">Station 01 (High-Speed Flatbed)</option>
                <option value="Station 02">Station 02 (Overhead Rig A)</option>
                <option value="Station 03">Station 03 (Mobile Station 1)</option>
                <option value="Station 04">Station 04 (Mobile Station 2)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Scanning Officer Name
              </label>
              <input
                type="text"
                value={staffName}
                onChange={(e) => setStaffName(e.target.value)}
                placeholder="e.g. Ramesh Verma"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Security Notice */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            background: '#FEF3C7',
            padding: '10px 12px',
            borderRadius: '10px',
            fontSize: '0.75rem',
            color: '#92400E',
          }}>
            <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>
              This session key binds the mobile app exclusively to this hall packet. All uploaded booklets are signed with cryptographic SHA-256 digests.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px',
          background: '#F8FAFC',
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: '1px solid #CBD5E1',
              background: 'white',
              color: '#475569',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleActivate}
            style={{
              padding: '10px 22px',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #48977F 0%, #2F6852 100%)',
              color: 'white',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(72,151,127,0.3)',
            }}
          >
            Authorize & Issue Session Key ✓
          </button>
        </div>
      </div>
    </div>
  );
};
