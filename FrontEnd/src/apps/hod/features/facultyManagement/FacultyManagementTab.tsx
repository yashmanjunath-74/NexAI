import React, { useState } from 'react';
import { FacultyMember, CourseRecord } from '../../types';
import {
  Users,
  UserPlus,
  KeyRound,
  Copy,
  Check,
  Mail,
  ShieldCheck,
  Building,
  BookOpen,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  facultyMembers: FacultyMember[];
  courses: CourseRecord[];
  onAddFaculty: (newFaculty: FacultyMember) => void;
}

export const FacultyManagementTab: React.FC<Props> = ({
  facultyMembers,
  courses,
  onAddFaculty,
}) => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedCredFaculty, setSelectedCredFaculty] = useState<FacultyMember | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [designation, setDesignation] = useState('Assistant Professor');
  const [assignedCourseCode, setAssignedCourseCode] = useState('CS201');

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFaculty: FacultyMember = {
      id: `FAC_${Date.now().toString().slice(-3)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      employeeId: employeeId.trim().toUpperCase(),
      designation: designation,
      department: 'Computer Science & Engineering',
      assignedCourses: [assignedCourseCode],
      tempPassword: 'password123',
      status: 'ACTIVE',
      createdDate: new Date().toISOString().split('T')[0],
    };

    onAddFaculty(newFaculty);
    setIsRegisterModalOpen(false);
    setSelectedCredFaculty(newFaculty);
    toast.success(`Faculty profile & login credentials created for ${newFaculty.name}!`);

    // Reset Form
    setName('');
    setEmail('');
    setEmployeeId('');
  };

  const handleCopyCredentials = (fac: FacultyMember) => {
    const creds = `NexAI Faculty Portal Access:
URL: ${window.location.origin}/login
Email: ${fac.email}
Password: ${fac.tempPassword || 'password123'}
Role: Faculty / Evaluator`;
    navigator.clipboard.writeText(creds);
    setCopiedKey(true);
    toast.success('Credentials copied to clipboard!');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* ── Top Header Banner ── */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        padding: '20px 24px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: '#F0FDF4',
              color: '#16A34A',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
            }}>
              Department Personnel Authority
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>• User Provisioning Gateway</span>
          </div>
          <h2 style={{ margin: '6px 0 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
            Faculty User Registration & Credential Provisioning
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748B' }}>
            HOD creates teaching faculty accounts, issues portal passwords, and designates course stewardship.
          </p>
        </div>

        <button
          onClick={() => setIsRegisterModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(22,163,74,0.3)',
          }}
        >
          <UserPlus size={16} /> ➕ Register Faculty Member
        </button>
      </div>

      {/* ── Faculty Directory Table ── */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0F172A' }}>
            Registered Department Faculty ({facultyMembers.length})
          </div>
          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
            All faculty have authenticated access to the Faculty Workspace & SEE Evaluator Gateway.
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>FACULTY NAME & ID</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>DESIGNATION</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>LOGIN EMAIL</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>ASSIGNED COURSES</th>
                <th style={{ padding: '12px 16px', fontWeight: 700 }}>STATUS</th>
                <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>CREDENTIALS</th>
              </tr>
            </thead>
            <tbody>
              {facultyMembers.map(fac => (
                <tr key={fac.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 800, color: '#0F172A' }}>{fac.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{fac.employeeId}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#334155' }}>
                    {fac.designation}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#0284C7', fontWeight: 600 }}>
                    {fac.email}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {fac.assignedCourses.map(code => (
                        <span key={code} style={{
                          background: '#EEF2FF',
                          color: '#4F46E5',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                        }}>
                          {code}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      background: '#DCFCE7',
                      color: '#15803D',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                    }}>
                      {fac.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => setSelectedCredFaculty(fac)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#F1F5F9',
                        border: '1px solid #CBD5E1',
                        color: '#334155',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      <KeyRound size={13} color="#16A34A" /> View Credential Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal: Register New Faculty ── */}
      {isRegisterModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            maxWidth: '520px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#F8FAFC',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 34, height: 34, borderRadius: '8px', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                    Register Faculty Member
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>
                    Generate user credentials for Department of CSE
                  </p>
                </div>
              </div>
              <button onClick={() => setIsRegisterModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit}>
              <div style={{ padding: '24px' }}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                    Full Name (with Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Prof. Claude Shannon"
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700, boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      University / Login Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. shannon@univ.edu"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 600, boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      Employee ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={employeeId}
                      onChange={e => setEmployeeId(e.target.value)}
                      placeholder="e.g. EMP-CS-092"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 800, boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      Academic Designation
                    </label>
                    <select
                      value={designation}
                      onChange={e => setDesignation(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 600, background: 'white' }}
                    >
                      <option value="Assistant Professor">Assistant Professor</option>
                      <option value="Associate Professor">Associate Professor</option>
                      <option value="Professor">Professor</option>
                      <option value="Visiting Professor">Visiting Professor</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                      Assign Primary Course
                    </label>
                    <select
                      value={assignedCourseCode}
                      onChange={e => setAssignedCourseCode(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 600, background: 'white' }}
                    >
                      {courses.map(c => (
                        <option key={c.code} value={c.code}>{c.code} — {c.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{
                  background: '#F0FDF4',
                  borderRadius: '10px',
                  padding: '12px',
                  border: '1px solid #BBF7D0',
                  fontSize: '0.78rem',
                  color: '#15803D',
                  lineHeight: 1.4,
                }}>
                  🔐 <strong>Default Access:</strong> An initial temporary password (<code>password123</code>) will be generated. The faculty member can immediately sign in at the login screen.
                </div>
              </div>

              <div style={{
                padding: '16px 24px',
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px',
                background: '#F8FAFC',
              }}>
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', background: 'white', color: '#475569', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(22,163,74,0.3)',
                  }}
                >
                  Register & Provision Credentials ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Credential Slip ── */}
      {selectedCredFaculty && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.5rem',
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            maxWidth: '460px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#F8FAFC',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 34, height: 34, borderRadius: '8px', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0F172A' }}>
                    Faculty Credential Slip
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>
                    Authorized login record for {selectedCredFaculty.name}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedCredFaculty(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{
                background: '#F8FAFC',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>PORTAL LOGIN URL</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0F172A' }}>{window.location.origin}/login</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>LOGIN USERNAME / EMAIL</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0284C7' }}>{selectedCredFaculty.email}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>TEMPORARY PASSWORD</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 900, color: '#15803D', letterSpacing: '1px' }}>
                    {selectedCredFaculty.tempPassword || 'password123'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700 }}>ASSIGNED COURSES</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4F46E5' }}>
                    {selectedCredFaculty.assignedCourses.join(', ')}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleCopyCredentials(selectedCredFaculty)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  {copiedKey ? <Check size={16} color="#16A34A" /> : <Copy size={16} />}
                  {copiedKey ? 'Copied!' : 'Copy Credential Slip'}
                </button>

                <button
                  onClick={() => setSelectedCredFaculty(null)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#0F172A',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  Done
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
