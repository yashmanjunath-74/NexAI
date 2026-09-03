import React, { useState } from 'react';
import { ScannedBooklet } from '../types';
import { X, ChevronLeft, ChevronRight, RotateCw, ZoomIn, ZoomOut, CheckCircle2, AlertTriangle, ShieldCheck, Lock } from 'lucide-react';

interface Props {
  booklet: ScannedBooklet;
  onClose: () => void;
  onApprove?: (id: string) => void;
}

export const BookletViewerModal: React.FC<Props> = ({ booklet, onClose, onApprove }) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const totalPages = booklet.pageUrls.length || booklet.pageCount;
  const currentImageUrl = booklet.pageUrls[currentPageIndex] || booklet.pageUrls[0];

  const handleNext = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(prev => prev + 1);
      setRotation(0);
      setZoom(1);
    }
  };

  const handlePrev = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
      setRotation(0);
      setZoom(1);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1.5rem',
      fontFamily: 'var(--font-sans, inherit)',
    }}>
      <div style={{
        background: '#0F172A',
        color: 'white',
        borderRadius: '24px',
        maxWidth: '960px',
        width: '100%',
        height: '90vh',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        border: '1px solid #334155',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Top Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#131D33',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                background: '#48977F',
                color: 'white',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.5px',
              }}>
                DIGITAL BOOKLET INSPECTION
              </span>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'white' }}>
                {booklet.dummyBarcode}
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                (Physical: {booklet.physicalBarcode})
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#94A3B8' }}>
              Scanned by {booklet.scannedByStaff} • {booklet.stationId} • {booklet.scannedAt}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: booklet.status === 'VERIFIED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              color: booklet.status === 'VERIFIED' ? '#34D399' : '#FBBF24',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700,
            }}>
              {booklet.status === 'VERIFIED' ? <CheckCircle2 size={15} /> : <AlertTriangle size={15} />}
              <span>OCR Clarity: {booklet.ocrConfidence}%</span>
            </div>

            <button
              onClick={onClose}
              style={{
                background: '#1E293B',
                border: 'none',
                borderRadius: '8px',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '8px',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Workspace: Image Viewer + Controls */}
        <div style={{
          flex: 1,
          display: 'flex',
          background: '#0B0F19',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Main Document Canvas */}
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '20px',
            overflow: 'auto',
          }}>
            <div style={{
              maxWidth: '85%',
              maxHeight: '100%',
              transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              borderRadius: '8px',
              overflow: 'hidden',
              background: '#FFFFFF',
              position: 'relative',
            }}>
              <img
                src={currentImageUrl}
                alt={`Scanned Page ${currentPageIndex + 1}`}
                style={{
                  display: 'block',
                  width: '100%',
                  maxHeight: '62vh',
                  objectFit: 'contain',
                }}
              />
              {/* Document Alignment Edge Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                border: '2px solid rgba(72, 151, 127, 0.4)',
                pointerEvents: 'none',
              }} />
            </div>

            {/* Floating Navigation Arrows */}
            <button
              onClick={handlePrev}
              disabled={currentPageIndex === 0}
              style={{
                position: 'absolute',
                left: '20px',
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(30, 41, 59, 0.85)',
                border: '1px solid #334155',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: currentPageIndex === 0 ? 'not-allowed' : 'pointer',
                opacity: currentPageIndex === 0 ? 0.3 : 1,
                backdropFilter: 'blur(4px)',
              }}
            >
              <ChevronLeft size={22} />
            </button>

            <button
              onClick={handleNext}
              disabled={currentPageIndex >= totalPages - 1}
              style={{
                position: 'absolute',
                right: '20px',
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(30, 41, 59, 0.85)',
                border: '1px solid #334155',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: currentPageIndex >= totalPages - 1 ? 'not-allowed' : 'pointer',
                opacity: currentPageIndex >= totalPages - 1 ? 0.3 : 1,
                backdropFilter: 'blur(4px)',
              }}
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Right Floating Controls Panel */}
          <div style={{
            width: '260px',
            background: '#131D33',
            borderLeft: '1px solid #1E293B',
            padding: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflowY: 'auto',
          }}>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
                Page Navigation
              </span>
              <div style={{
                marginTop: '6px',
                fontSize: '1rem',
                fontWeight: 800,
                color: 'white',
              }}>
                Page {currentPageIndex + 1} of {totalPages}
              </div>
            </div>

            {/* Zoom & Rotation Tools */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setZoom(z => Math.min(z + 0.25, 2.5))}
                style={{
                  flex: 1,
                  background: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: 'white',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                }}
              >
                <ZoomIn size={14} /> Zoom
              </button>

              <button
                onClick={() => setZoom(z => Math.max(z - 0.25, 0.75))}
                style={{
                  flex: 1,
                  background: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: 'white',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  fontSize: '0.75rem',
                }}
              >
                <ZoomOut size={14} /> Reset
              </button>

              <button
                onClick={() => setRotation(r => (r + 90) % 360)}
                style={{
                  background: '#1E293B',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: 'white',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Rotate 90°"
              >
                <RotateCw size={14} />
              </button>
            </div>

            {/* Cryptographic Proof */}
            <div style={{
              background: '#0B0F19',
              borderRadius: '10px',
              padding: '12px',
              border: '1px solid #1E293B',
              fontSize: '0.72rem',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontWeight: 700, marginBottom: '6px' }}>
                <ShieldCheck size={14} />
                <span>SHA-256 Digest Seal</span>
              </div>
              <div style={{
                fontFamily: 'monospace',
                color: '#94A3B8',
                wordBreak: 'break-all',
                lineHeight: 1.4,
              }}>
                {booklet.sha256Hash}
              </div>
            </div>

            {/* Page Thumbnails Reel */}
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700 }}>
                Pages In Booklet
              </span>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                marginTop: '8px',
              }}>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setCurrentPageIndex(idx);
                      setRotation(0);
                    }}
                    style={{
                      border: currentPageIndex === idx ? '2px solid #48977F' : '1px solid #334155',
                      borderRadius: '8px',
                      padding: '6px',
                      cursor: 'pointer',
                      background: currentPageIndex === idx ? 'rgba(72, 151, 127, 0.15)' : '#0B0F19',
                      textAlign: 'center',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: currentPageIndex === idx ? '#34D399' : '#94A3B8',
                    }}
                  >
                    Page {idx + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'auto' }}>
              <button
                onClick={() => {
                  if (onApprove) onApprove(booklet.id);
                  onClose();
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'linear-gradient(135deg, #48977F 0%, #2F6852 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 12px rgba(72,151,127,0.3)',
                }}
              >
                <Lock size={14} /> Approve & Lock Packet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
