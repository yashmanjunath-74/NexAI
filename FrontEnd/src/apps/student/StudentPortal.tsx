import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

interface StudentProfile {
  usn: string;
  name: string;
  department: string;
  semester: number;
  batch_year: number;
}

interface HallTicket {
  id: string;
  status: string;
  issued_at: string | null;
  cie_eligibility_status: boolean;
  attendance_eligibility_status: boolean;
}

interface Result {
  id: string;
  subject_code: string;
  subject_name: string;
  exam_session_name: string;
  credits: number;
  cie_marks: string;
  see_marks: string;
  total_marks: string;
  grade: string;
  published_at: string;
}

export default function StudentPortal() {
  const [activeTab, setActiveTab] = useState<'HALL_TICKETS' | 'RESULTS'>('HALL_TICKETS');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [hallTickets, setHallTickets] = useState<HallTicket[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/student/portal/my_profile/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          setProfile(await response.json());
        }
      } catch (err) {
        console.error("Failed to fetch profile");
      }
    };
    fetchProfile();
  }, [token]);

  const fetchHallTickets = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/student/portal/my_hall_tickets/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setHallTickets(await response.json());
      } else {
        setError('Failed to fetch hall tickets');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/v1/student/portal/my_results/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setResults(await response.json());
      } else {
        setError('Failed to fetch results');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'HALL_TICKETS') {
      fetchHallTickets();
    } else {
      fetchResults();
    }
  }, [activeTab, token]);

  const calculateGPA = () => {
    if (results.length === 0) return 0;
    
    let totalGradePoints = 0;
    let totalCredits = 0;
    
    const gradeMap: Record<string, number> = {
      'S': 10, 'A': 9, 'B': 8, 'C': 7, 'D': 6, 'E': 5, 'F': 0, 'ABSENT': 0
    };
    
    results.forEach(res => {
      if (res.grade && gradeMap[res.grade] !== undefined) {
        totalGradePoints += (gradeMap[res.grade] * res.credits);
        totalCredits += res.credits;
      }
    });
    
    return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-base)', padding: '2rem' }}>
      <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: 800 }}>
          Student Portal
        </h1>
        
        {profile && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '2rem',
            padding: '1.5rem',
            background: 'var(--color-bg-overlay)',
            borderRadius: '0.5rem',
            border: '1px solid var(--color-border)'
          }}>
            <div>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Welcome Back
              </p>
              <h2 style={{ margin: '0.25rem 0', fontSize: '1.5rem' }}>{profile.name}</h2>
              <p style={{ margin: 0, color: 'var(--color-accent-primary)', fontWeight: 600 }}>{profile.usn}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0 }}>Sem {profile.semester} • {profile.department}</p>
              <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Batch {profile.batch_year}</p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--color-border)' }}>
          <button
            onClick={() => setActiveTab('HALL_TICKETS')}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.5rem 1rem',
              color: activeTab === 'HALL_TICKETS' ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === 'HALL_TICKETS' ? '2px solid var(--color-accent-primary)' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Hall Tickets
          </button>
          <button
            onClick={() => setActiveTab('RESULTS')}
            style={{
              background: 'transparent',
              border: 'none',
              padding: '0.5rem 1rem',
              color: activeTab === 'RESULTS' ? 'var(--color-accent-primary)' : 'var(--color-text-secondary)',
              borderBottom: activeTab === 'RESULTS' ? '2px solid var(--color-accent-primary)' : '2px solid transparent',
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Results & Grades
          </button>
        </div>

        {error && (
          <div style={{
            padding: '1rem',
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#ef4444',
            borderRadius: '0.5rem',
            marginBottom: '1.5rem',
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <p>Loading...</p>
        ) : activeTab === 'HALL_TICKETS' ? (
          <div>
            {hallTickets.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)' }}>No hall tickets generated yet.</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {hallTickets.map(ht => (
                  <div key={ht.id} className="card" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: 0 }}>Term Hall Ticket</h3>
                      <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                        <span style={{ color: ht.cie_eligibility_status ? '#10b981' : '#ef4444' }}>
                          CIE: {ht.cie_eligibility_status ? 'Eligible' : 'Not Eligible'}
                        </span>
                        <span style={{ color: ht.attendance_eligibility_status ? '#10b981' : '#ef4444' }}>
                          Att: {ht.attendance_eligibility_status ? 'Eligible' : 'Not Eligible'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: ht.status === 'ISSUED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: ht.status === 'ISSUED' ? '#10b981' : '#f59e0b',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                      }}>
                        {ht.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {results.length > 0 && (
              <div style={{ 
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1))',
                padding: '2rem', 
                borderRadius: '0.5rem',
                marginBottom: '2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}>
                <div>
                  <h2 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Semester GPA</h2>
                  <p style={{ margin: '0.25rem 0 0 0', color: 'var(--color-text-secondary)' }}>Based on latest published results</p>
                </div>
                <div style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--color-accent-primary)' }}>
                  {calculateGPA()}
                </div>
              </div>
            )}

            {results.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)' }}>No results published yet.</p>
            ) : (
              <div className="card" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: 'var(--color-bg-overlay)', borderBottom: '1px solid var(--color-border)' }}>
                    <tr>
                      <th style={{ padding: '1rem', fontWeight: 600 }}>Subject Code</th>
                      <th style={{ padding: '1rem', fontWeight: 600 }}>Subject Name</th>
                      <th style={{ padding: '1rem', fontWeight: 600 }}>Credits</th>
                      <th style={{ padding: '1rem', fontWeight: 600 }}>CIE</th>
                      <th style={{ padding: '1rem', fontWeight: 600 }}>SEE</th>
                      <th style={{ padding: '1rem', fontWeight: 600 }}>Total</th>
                      <th style={{ padding: '1rem', fontWeight: 600 }}>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((res, i) => (
                      <tr key={res.id} style={{ borderBottom: i === results.length - 1 ? 'none' : '1px solid var(--color-border)' }}>
                        <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>{res.subject_code}</td>
                        <td style={{ padding: '1rem', fontWeight: 500 }}>{res.subject_name}</td>
                        <td style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>{res.credits}</td>
                        <td style={{ padding: '1rem' }}>{res.cie_marks}</td>
                        <td style={{ padding: '1rem' }}>{res.see_marks || '-'}</td>
                        <td style={{ padding: '1rem', fontWeight: 600 }}>{res.total_marks || '-'}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{
                            padding: '0.25rem 0.5rem',
                            background: res.grade && res.grade !== 'F' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: res.grade && res.grade !== 'F' ? '#10b981' : '#ef4444',
                            borderRadius: '0.25rem',
                            fontWeight: 700
                          }}>
                            {res.grade || '-'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
