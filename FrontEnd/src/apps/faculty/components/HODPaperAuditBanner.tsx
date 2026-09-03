import React from 'react';
import { FacultyCIEPaper } from '../types';
import { BellRing, ArrowRight } from 'lucide-react';

interface HODPaperAuditBannerProps {
  ciePapers: FacultyCIEPaper[];
  onReviewClick: () => void;
}

export const HODPaperAuditBanner: React.FC<HODPaperAuditBannerProps> = ({
  ciePapers,
  onReviewClick,
}) => {
  const revisionPapers = ciePapers.filter(p => p.status === 'REVISION_REQUESTED');
  if (revisionPapers.length === 0) return null;

  return (
    <div style={{
      background: 'linear-gradient(90deg, #FFF1F2 0%, #FFE4E6 100%)',
      border: '2px solid #FDA4AF',
      borderRadius: '16px',
      padding: '16px 22px',
      marginBottom: '26px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 4px 14px rgba(225, 29, 72, 0.1)',
      gap: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: '#E11D48',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 0 0 4px rgba(225, 29, 72, 0.2)',
        }}>
          <BellRing size={22} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: '#BE123C',
              color: 'white',
              fontWeight: 900,
              fontSize: '0.72rem',
              padding: '2px 8px',
              borderRadius: '4px',
              letterSpacing: '0.5px'
            }}>
              HOD PAPER AUDIT NOTIFICATION
            </span>
            <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#881337' }}>
              Revision Requested for {revisionPapers.map(p => `${p.courseCode} (${p.testType})`).join(', ')}
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#9F1239', marginTop: '4px' }}>
            💬 HOD Remarks: <span style={{ fontStyle: 'italic', fontWeight: 600 }}>"{revisionPapers[0]?.hodRemarks}"</span>
          </div>
        </div>
      </div>

      <button
        onClick={onReviewClick}
        style={{
          background: '#E11D48',
          color: 'white',
          border: 'none',
          borderRadius: '10px',
          padding: '10px 18px',
          fontSize: '0.82rem',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 8px rgba(225, 29, 72, 0.3)',
        }}
      >
        Review Directives & Resubmit for Re-Audit <ArrowRight size={14} />
      </button>
    </div>
  );
};
