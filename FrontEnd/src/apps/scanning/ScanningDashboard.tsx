import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { INITIAL_PACKETS, INITIAL_BOOKLETS } from './mockData';
import { ExamHallPacket, ScannedBooklet } from './types';
import { SessionKeyModal } from './components/SessionKeyModal';
import { BookletViewerModal } from './components/BookletViewerModal';
import { CreatePacketModal } from './components/CreatePacketModal';
import {
  ScanLine,
  QrCode,
  Smartphone,
  Layers,
  FileCheck,
  Sparkles,
  ArrowUpRight,
  LogOut,
  RefreshCw,
  Eye,
  Lock,
  Search,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ScanningDashboard() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const [packets, setPackets] = useState<ExamHallPacket[]>(INITIAL_PACKETS);
  const [booklets, setBooklets] = useState<ScannedBooklet[]>(INITIAL_BOOKLETS);
  const [selectedPacketForKey, setSelectedPacketForKey] = useState<ExamHallPacket | null>(null);
  const [selectedBookletForView, setSelectedBookletForView] = useState<ScannedBooklet | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPacket, setFilterPacket] = useState<string>('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Computed Metrics
  const totalExpected = packets.reduce((acc, p) => acc + p.expectedBooklets, 0);
  const totalDigitized = packets.reduce((acc, p) => acc + p.digitizedBooklets, 0);
  const totalPages = packets.reduce((acc, p) => acc + p.totalScannedPages, 0);
  const activeStations = packets.filter(p => p.status === 'SCANNING_IN_PROGRESS').length;
  const overallPercent = Math.round((totalDigitized / (totalExpected || 1)) * 100);

  const handleCreatePacket = (newPacket: ExamHallPacket) => {
    setPackets(prev => [newPacket, ...prev]);
    toast.success(`Created Examination Hall Packet for ${newPacket.courseCode} (${newPacket.hallNumber})!`);
  };

  const handleSaveSession = (updatedPacket: ExamHallPacket) => {
    setPackets(prev => prev.map(p => p.id === updatedPacket.id ? updatedPacket : p));
    toast.success(`Session key generated for ${updatedPacket.courseCode} (${updatedPacket.hallNumber})!`);
  };

  const handleReconcile = (packetId: string) => {
    setPackets(prev => prev.map(p => {
      if (p.id === packetId) {
        return {
          ...p,
          status: 'VAULTED',
          digitizedBooklets: p.expectedBooklets,
          totalScannedPages: p.expectedBooklets * 16,
        };
      }
      return p;
    }));
    toast.success('Batch reconciled and sealed into Evaluator Vault!');
  };

  const filteredBooklets = booklets.filter(b => {
    const matchesSearch = b.dummyBarcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.physicalBarcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.scannedByStaff.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterPacket === 'ALL' || b.packetId === filterPacket;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      color: '#0F172A',
      fontFamily: 'var(--font-sans, "Plus Jakarta Sans", system-ui, sans-serif)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* ── Top Industrial Header ── */}
      <header style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '12px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: 42,
            height: 42,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #48977F 0%, #2F6852 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 12px rgba(72,151,127,0.35)',
          }}>
            <ScanLine size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.3px', color: '#0F172A' }}>
                NexAI Digitization Hub
              </h1>
              <span style={{
                background: '#E8F5F1',
                color: '#2F6852',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 800,
              }}>
                CENTRAL SCANNING STATION
              </span>
            </div>
            <p style={{ margin: '2px 0 0 0', fontSize: '0.78rem', color: '#64748B' }}>
              Examination Paper Digitalization, Session Key Dispatch & Evaluation Ingestion
            </p>
          </div>
        </div>

        {/* User Badge & Quick Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="/coe"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#334155',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            <span>Switch to CoE Dashboard</span>
            <ArrowUpRight size={14} />
          </a>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '6px 12px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#475569',
              fontSize: '0.82rem',
            }}>
              {user?.full_name?.substring(0, 2).toUpperCase() || 'SO'}
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0F172A' }}>
                {user?.full_name || 'Scanning Superintendent'}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748B' }}>
                Scanning Center Unit 1
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            style={{
              background: 'transparent',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '8px',
              color: '#64748B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* ── Main Content Area ── */}
      <main style={{ flex: 1, padding: '24px 28px', maxWidth: '1600px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        
        {/* ── Live KPI Metrics Row ── */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}>
          {/* Metric 1 */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '18px 20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Booklets Digitized</span>
              <div style={{ width: 34, height: 34, borderRadius: '8px', background: '#E8F5F1', color: '#2F6852', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={18} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A' }}>{totalDigitized}</span>
              <span style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 600 }}>/ {totalExpected} booklets</span>
            </div>
            {/* Progress bar */}
            <div style={{ width: '100%', height: '6px', background: '#F1F5F9', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${overallPercent}%`, height: '100%', background: 'linear-gradient(90deg, #48977F, #2F6852)', borderRadius: '3px' }} />
            </div>
          </div>

          {/* Metric 2 */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '18px 20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Total Pages Ingested</span>
              <div style={{ width: 34, height: 34, borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileCheck size={18} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A' }}>{totalPages.toLocaleString()}</span>
              <span style={{ fontSize: '0.82rem', color: '#10B981', fontWeight: 700 }}>+100% cloud synced</span>
            </div>
            <p style={{ margin: '10px 0 0 0', fontSize: '0.75rem', color: '#64748B' }}>
              High-resolution 300 DPI multi-page bundles
            </p>
          </div>

          {/* Metric 3 */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '18px 20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Active Mobile Stations</span>
              <div style={{ width: 34, height: 34, borderRadius: '8px', background: '#FAF5FF', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Smartphone size={18} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A' }}>{activeStations}</span>
              <span style={{ fontSize: '0.82rem', color: '#8B5CF6', fontWeight: 700 }}>Active Session Keys</span>
            </div>
            <p style={{ margin: '10px 0 0 0', fontSize: '0.75rem', color: '#64748B' }}>
              Connected via NexAI Scanner App
            </p>
          </div>

          {/* Metric 4 */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '18px 20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>Avg Scanning Throughput</span>
              <div style={{ width: 34, height: 34, borderRadius: '8px', background: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={18} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0F172A' }}>22s</span>
              <span style={{ fontSize: '0.82rem', color: '#10B981', fontWeight: 700 }}>98.9% OCR Clarity</span>
            </div>
            <p style={{ margin: '10px 0 0 0', fontSize: '0.75rem', color: '#64748B' }}>
              Rapid burst capture with auto edge-detect
            </p>
          </div>
        </section>

        {/* ── Section 1: Session Key Generation & Hall Packets ── */}
        <section style={{
          background: '#FFFFFF',
          borderRadius: '18px',
          padding: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
          marginBottom: '28px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                Examination Hall Packets & Session Keys
              </h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748B' }}>
                Issue cryptographic Session Keys and screen QR codes for scanning staff to connect their mobile scanner app.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #48977F 0%, #2F6852 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '9px 16px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(72,151,127,0.3)',
                }}
              >
                <Plus size={16} /> Create Hall Packet
              </button>

              <button
                onClick={() => toast.success('Checking for new hall dispatches from invigilators...')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  color: '#475569',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={14} /> Refresh Handover Packets
              </button>
            </div>
          </div>

          {/* Packets Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>EXAM & SUBJECT</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>HALL & TIMING</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>BOOKLET PROGRESS</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>SESSION KEY & QR</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700 }}>STATUS</th>
                  <th style={{ padding: '12px 14px', fontWeight: 700, textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {packets.map((pkt) => {
                  const pct = Math.round((pkt.digitizedBooklets / pkt.expectedBooklets) * 100);

                  return (
                    <tr key={pkt.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      {/* Exam */}
                      <td style={{ padding: '16px 14px' }}>
                        <div style={{ fontWeight: 800, color: '#0F172A' }}>{pkt.courseCode}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{pkt.courseTitle}</div>
                      </td>

                      {/* Hall & Slot */}
                      <td style={{ padding: '16px 14px' }}>
                        <div style={{ fontWeight: 700, color: '#0F172A' }}>{pkt.hallNumber}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{pkt.slot}</div>
                      </td>

                      {/* Progress */}
                      <td style={{ padding: '16px 14px', minWidth: '180px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, marginBottom: '6px' }}>
                          <span>{pkt.digitizedBooklets} / {pkt.expectedBooklets} Booklets</span>
                          <span style={{ color: pct === 100 ? '#10B981' : '#2F6852' }}>{pct}%</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: pct === 100 ? '#10B981' : '#48977F' }} />
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px' }}>
                          {pkt.totalScannedPages} total pages digitized
                        </div>
                      </td>

                      {/* Session Key */}
                      <td style={{ padding: '16px 14px' }}>
                        {pkt.sessionKey ? (
                          <div>
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: '#F1F5F9',
                              border: '1px dashed #48977F',
                              borderRadius: '8px',
                              padding: '4px 8px',
                              fontFamily: 'monospace',
                              fontWeight: 800,
                              color: '#2F6852',
                              fontSize: '0.8rem',
                            }}>
                              <QrCode size={13} />
                              <span>{pkt.sessionKey}</span>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '4px' }}>
                              {pkt.assignedStationId} • {pkt.assignedStaffName}
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontStyle: 'italic' }}>
                            No session key generated
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px 14px' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          background:
                            pkt.status === 'COMPLETED' || pkt.status === 'VAULTED'
                              ? '#E8F5F1'
                              : pkt.status === 'SCANNING_IN_PROGRESS'
                              ? '#EFF6FF'
                              : '#FEF3C7',
                          color:
                            pkt.status === 'COMPLETED' || pkt.status === 'VAULTED'
                              ? '#2F6852'
                              : pkt.status === 'SCANNING_IN_PROGRESS'
                              ? '#2563EB'
                              : '#D97706',
                        }}>
                          {pkt.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px 14px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            onClick={() => setSelectedPacketForKey(pkt)}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '8px',
                              border: '1px solid #CBD5E1',
                              background: pkt.sessionKey ? '#FFFFFF' : 'linear-gradient(135deg, #48977F 0%, #2F6852 100%)',
                              color: pkt.sessionKey ? '#334155' : '#FFFFFF',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                            }}
                          >
                            <QrCode size={14} />
                            {pkt.sessionKey ? 'View QR & Key' : 'Generate Key'}
                          </button>

                          {pkt.status === 'COMPLETED' && (
                            <button
                              onClick={() => handleReconcile(pkt.id)}
                              style={{
                                padding: '8px 14px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#10B981',
                                color: 'white',
                                fontWeight: 800,
                                fontSize: '0.78rem',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                              }}
                            >
                              <Lock size={13} /> Reconcile & Vault
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Section 2: Live Ingestion Feed & Scanned Booklets ── */}
        <section style={{
          background: '#FFFFFF',
          borderRadius: '18px',
          padding: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10B981', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
                  Live Scanned Booklet Ingestion Stream
                </h2>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748B' }}>
                Real-time stream of physical booklets scanned and digitized by active staff mobile stations.
              </p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: 11, color: '#94A3B8' }} />
                <input
                  type="text"
                  placeholder="Search barcode, staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '8px 12px 8px 34px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '0.82rem',
                    width: '200px',
                    outline: 'none',
                  }}
                />
              </div>

              <select
                value={filterPacket}
                onChange={(e) => setFilterPacket(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: 'white',
                  color: '#334155',
                }}
              >
                <option value="ALL">All Exam Packets</option>
                {packets.map(p => (
                  <option key={p.id} value={p.id}>{p.courseCode} ({p.hallNumber})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Booklets Feed Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px',
          }}>
            {filteredBooklets.map((b) => (
              <div
                key={b.id}
                style={{
                  background: '#F8FAFC',
                  borderRadius: '14px',
                  padding: '16px',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  transition: 'all 0.2s',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{
                      fontFamily: 'monospace',
                      fontWeight: 900,
                      color: '#2F6852',
                      fontSize: '0.95rem',
                      display: 'block',
                    }}>
                      {b.dummyBarcode}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                      Physical Barcode: <strong style={{ color: '#0F172A' }}>{b.physicalBarcode}</strong>
                    </span>
                  </div>

                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    background: b.status === 'VERIFIED' ? '#E8F5F1' : '#FEF3C7',
                    color: b.status === 'VERIFIED' ? '#2F6852' : '#D97706',
                  }}>
                    {b.status === 'VERIFIED' ? 'DIGITIZED ✓' : 'FLAGGED BLUR'}
                  </span>
                </div>

                {/* Packet / Station info */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#FFFFFF',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  fontSize: '0.78rem',
                }}>
                  <div>
                    <span style={{ color: '#64748B' }}>Pages Scanned:</span>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>
                      {b.pageCount} Pages
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#64748B' }}>OCR Clarity:</span>
                    <div style={{ fontWeight: 800, color: '#10B981', fontSize: '0.9rem' }}>
                      {b.ocrConfidence}%
                    </div>
                  </div>
                </div>

                {/* Footer with Inspector Trigger */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                    {b.scannedByStaff} • {b.scannedAt}
                  </div>

                  <button
                    onClick={() => setSelectedBookletForView(b)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '6px 12px',
                      background: '#1E293B',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <Eye size={13} /> Inspect Pages
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Modals ── */}
      {selectedPacketForKey && (
        <SessionKeyModal
          packet={selectedPacketForKey}
          onClose={() => setSelectedPacketForKey(null)}
          onSaveSession={handleSaveSession}
        />
      )}

      {selectedBookletForView && (
        <BookletViewerModal
          booklet={selectedBookletForView}
          onClose={() => setSelectedBookletForView(null)}
          onApprove={(id) => {
            setBooklets(prev => prev.map(b => b.id === id ? { ...b, status: 'VERIFIED' } : b));
            toast.success('Booklet approved and sealed into evaluation vault!');
          }}
        />
      )}

      {isCreateModalOpen && (
        <CreatePacketModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreatePacket}
        />
      )}
    </div>
  );
}
