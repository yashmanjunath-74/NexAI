import React, { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function EligibilityGateway() {
  const [file, setFile] = useState<File | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { accessToken } = useAuthStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !sessionId) {
      setStatus('Please provide both an Exam Session ID and a CSV file.');
      return;
    }

    setLoading(true);
    setStatus('');
    
    const formData = new FormData();
    formData.append('csv_file', file);
    formData.append('exam_session_id', sessionId);

    try {
      const response = await fetch('http://localhost:8000/api/v1/hod/upload-csv/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setStatus(`Upload accepted. Task ID: ${data.task_id}`);
      } else {
        setStatus(`Error: ${data.detail || data.error || 'Upload failed'}`);
      }
    } catch (err) {
      setStatus('Network error occurred during upload.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!sessionId) {
      setStatus('Please provide an Exam Session ID to generate hall tickets.');
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      const response = await fetch(`http://localhost:8000/api/v1/hod/generate-hall-tickets/${sessionId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setStatus(`Generation task started. Task ID: ${data.task_id}`);
      } else {
        setStatus(`Error: ${data.detail || data.error || 'Generation failed'}`);
      }
    } catch (err) {
      setStatus('Network error occurred during generation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card animate-slide-up" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem', color: 'var(--color-text-primary)' }}>Eligibility Gateway</h2>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>
          Exam Session ID (UUID)
        </label>
        <input 
          type="text" 
          value={sessionId}
          onChange={(e) => setSessionId(e.target.value)}
          placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'var(--color-bg-base)',
            border: '1px solid var(--color-border)',
            borderRadius: '0.5rem',
            color: 'var(--color-text-primary)',
          }}
        />
      </div>

      <div style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px dashed var(--color-border)', borderRadius: '0.5rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Upload CIE / Attendance CSV</h3>
        <input type="file" accept=".csv" onChange={handleFileChange} style={{ marginBottom: '1rem' }} />
        <button 
          onClick={handleUpload} 
          disabled={loading || !file || !sessionId}
          className="btn-primary"
          style={{ width: '100%' }}
        >
          {loading ? 'Uploading...' : 'Process Eligibility CSV'}
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--color-bg-base)', borderRadius: '0.5rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Hall Ticket Generation</h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>
          Automatically generate hall tickets for all eligible students in this session.
        </p>
        <button 
          onClick={handleGenerate} 
          disabled={loading || !sessionId}
          className="btn-primary"
          style={{ width: '100%', background: 'linear-gradient(135deg, #10b981, #059669)' }}
        >
          {loading ? 'Starting...' : 'Generate Hall Tickets'}
        </button>
      </div>

      {status && (
        <div style={{ 
          padding: '1rem', 
          background: status.startsWith('Error') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          color: status.startsWith('Error') ? '#ef4444' : '#10b981',
          borderRadius: '0.5rem',
          marginTop: '1rem',
          wordBreak: 'break-all'
        }}>
          {status}
        </div>
      )}
    </div>
  );
}
