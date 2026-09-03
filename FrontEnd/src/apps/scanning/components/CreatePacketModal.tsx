import React, { useState } from 'react';
import { ExamHallPacket } from '../types';
import { X, PlusCircle, Layers, Calendar, Building, Sparkles } from 'lucide-react';

interface Props {
  onClose: () => void;
  onCreate: (newPacket: ExamHallPacket) => void;
}

export const CreatePacketModal: React.FC<Props> = ({ onClose, onCreate }) => {
  const [courseCode, setCourseCode] = useState('CS301');
  const [courseTitle, setCourseTitle] = useState('Database Management Systems');
  const [hallNumber, setHallNumber] = useState('Hall C-104');
  const [date, setDate] = useState('2026-09-05');
  const [slot, setSlot] = useState('09:30 AM - 12:30 PM (Morning)');
  const [expectedBooklets, setExpectedBooklets] = useState(30);
  const [assignedStation, setAssignedStation] = useState('Station 01');
  const [assignedStaff, setAssignedStaff] = useState('Ramesh Verma (Staff #42)');
  const [autoGenerateKey, setAutoGenerateKey] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanHall = hallNumber.replace(/\s+/g, '');
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const sessionKey = autoGenerateKey
      ? `SCAN-FALL26-${courseCode.toUpperCase()}-${cleanHall}-${randomCode}`
      : undefined;

    const newPacket: ExamHallPacket = {
      id: `PKT-${courseCode.toUpperCase()}-${cleanHall}-${Date.now().toString().slice(-4)}`,
      courseCode: courseCode.trim().toUpperCase(),
      courseTitle: courseTitle.trim(),
      hallNumber: hallNumber.trim(),
      slot: slot,
      date: date,
      expectedBooklets: Number(expectedBooklets) || 30,
      digitizedBooklets: 0,
      totalScannedPages: 0,
      sessionKey: sessionKey,
      assignedStationId: assignedStation,
      assignedStaffName: assignedStaff,
      status: sessionKey ? 'KEY_GENERATED' : 'PENDING_KEY',
      keyGeneratedAt: sessionKey ? new Date().toISOString() : undefined,
    };

    onCreate(newPacket);
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
        maxWidth: '580px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
      }}>
        {/* Modal Header */}
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
              <PlusCircle size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                Create Examination Hall Packet
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748B' }}>
                Register new exam dispatch bundle for mobile digitization
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

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '24px', maxHeight: '72vh', overflowY: 'auto' }}>
            
            {/* Subject Code & Title */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Course Code *
                </label>
                <input
                  type="text"
                  required
                  value={courseCode}
                  onChange={(e) => setCourseCode(e.target.value)}
                  placeholder="e.g. CS301"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g. Database Management Systems"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Hall Number & Expected Booklets */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Examination Hall / Room *
                </label>
                <div style={{ position: 'relative' }}>
                  <Building size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#94A3B8' }} />
                  <input
                    type="text"
                    required
                    value={hallNumber}
                    onChange={(e) => setHallNumber(e.target.value)}
                    placeholder="e.g. Hall C-104"
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Expected Physical Booklets *
                </label>
                <div style={{ position: 'relative' }}>
                  <Layers size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#94A3B8' }} />
                  <input
                    type="number"
                    min="1"
                    max="500"
                    required
                    value={expectedBooklets}
                    onChange={(e) => setExpectedBooklets(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Exam Date & Slot */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Exam Date
                </label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#94A3B8' }} />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Time Slot / Shift
                </label>
                <select
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: 'white',
                  }}
                >
                  <option value="09:30 AM - 12:30 PM (Morning)">09:30 AM - 12:30 PM (Morning)</option>
                  <option value="02:00 PM - 05:00 PM (Afternoon)">02:00 PM - 05:00 PM (Afternoon)</option>
                  <option value="06:00 PM - 09:00 PM (Evening)">06:00 PM - 09:00 PM (Evening)</option>
                </select>
              </div>
            </div>

            {/* Station Assignment */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Assign Scanning Station
                </label>
                <select
                  value={assignedStation}
                  onChange={(e) => setAssignedStation(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    background: 'white',
                  }}
                >
                  <option value="Station 01">Station 01 (Overhead Rig A)</option>
                  <option value="Station 02">Station 02 (Overhead Rig B)</option>
                  <option value="Station 03">Station 03 (Mobile Unit 1)</option>
                  <option value="Station 04">Station 04 (Mobile Unit 2)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  Assigned Staff Officer
                </label>
                <input
                  type="text"
                  value={assignedStaff}
                  onChange={(e) => setAssignedStaff(e.target.value)}
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

            {/* Auto Generate Session Key Toggle */}
            <div style={{
              background: '#F8FAFC',
              borderRadius: '12px',
              padding: '14px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                  <Sparkles size={16} color="#48977F" />
                  <span>Auto-Generate Mobile Session Key & QR</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                  Scanning staff can immediately connect their mobile app using this key.
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoGenerateKey}
                onChange={(e) => setAutoGenerateKey(e.target.checked)}
                style={{ width: 18, height: 18, accentColor: '#48977F', cursor: 'pointer' }}
              />
            </div>

          </div>

          {/* Modal Footer */}
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            background: '#F8FAFC',
          }}>
            <button
              type="button"
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
              type="submit"
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
              Create Hall Packet ✓
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
