import React, { useState } from 'react';
import { CourseRecord, FacultyMember } from '../../types';
import {
  BookOpen,
  Plus,
  Target,
  Award,
  Edit2,
  Trash2,
  UserCheck,
  ChevronRight,
  Layers,
  Sparkles,
  CheckCircle2,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  courses: CourseRecord[];
  facultyMembers: FacultyMember[];
  onAddCourse: (newCourse: CourseRecord) => void;
  onUpdateCourse: (updated: CourseRecord) => void;
  onDeleteCourse: (code: string) => void;
}

export const HODCurriculumTab: React.FC<Props> = ({
  courses,
  facultyMembers,
  onAddCourse,
  onUpdateCourse,
  onDeleteCourse,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<CourseRecord>(courses[0] || null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form State for New Course
  const [newCode, setNewCode] = useState('CS303');
  const [newTitle, setNewTitle] = useState('Computer Networks & Protocols');
  const [newCredits, setNewCredits] = useState(4);
  const [newSemester, setNewSemester] = useState('5th Semester B.Tech');
  const [newFacultyId, setNewFacultyId] = useState('FAC_101');
  const [newModulesText, setNewModulesText] = useState(
    'Module 1: Physical & Data Link Layer Protocols\nModule 2: Network Layer & Routing (BGP, OSPF)\nModule 3: Transport Layer (TCP, UDP, Congestion Control)\nModule 4: Application Layer (HTTP/3, DNS, TLS)\nModule 5: Network Security & Cryptography'
  );

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedFac = facultyMembers.find(f => f.id === newFacultyId);
    const modules = newModulesText.split('\n').map(m => m.trim()).filter(Boolean);

    const created: CourseRecord = {
      code: newCode.trim().toUpperCase(),
      title: newTitle.trim(),
      department: 'Computer Science & Engineering',
      semester: newSemester,
      credits: Number(newCredits) || 3,
      studentsCount: 120,
      status: 'ACTIVE',
      assignedFacultyId: assignedFac?.id,
      assignedFacultyName: assignedFac?.name,
      syllabusModules: modules,
      outcomes: [
        { id: 'CO1', description: `Understand fundamental network layer architectures and TCP/IP stack.`, mappedPOs: ['PO1', 'PO2'] },
        { id: 'CO2', description: `Analyze flow and congestion control mechanisms in transmission protocols.`, mappedPOs: ['PO2', 'PO3'] },
        { id: 'CO3', description: `Design subnets and configure routing algorithms for scalable intranets.`, mappedPOs: ['PO3', 'PO5'] },
        { id: 'CO4', description: `Implement cryptographic handshakes and TLS encryption protocols.`, mappedPOs: ['PO1', 'PO4', 'PO12'] },
      ]
    };

    onAddCourse(created);
    setSelectedCourse(created);
    setIsCreateModalOpen(false);
    toast.success(`Course ${created.code} (${created.title}) successfully created and assigned to ${assignedFac?.name}!`);
  };

  const handleAssignFaculty = (courseCode: string, facultyId: string) => {
    const fac = facultyMembers.find(f => f.id === facultyId);
    if (!fac) return;

    const updated = {
      ...selectedCourse,
      assignedFacultyId: fac.id,
      assignedFacultyName: fac.name,
    };
    onUpdateCourse(updated);
    setSelectedCourse(updated);
    toast.success(`Assigned ${fac.name} as course in-charge for ${courseCode}!`);
  };

  const PO_LIST = ['PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12'];

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
              background: '#EEF2FF',
              color: '#4F46E5',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
            }}>
              Department Curriculum Authority
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>• NBA & OBE Compliant</span>
          </div>
          <h2 style={{ margin: '6px 0 0 0', fontSize: '1.25rem', fontWeight: 800, color: '#0F172A' }}>
            Course Curriculum, CO-PO Mapping & Faculty Allocation
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748B' }}>
            HOD manages department course syllabi, defines Bloom's level Course Outcomes, maps PO vectors, and delegates teaching faculty.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 18px',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
          }}
        >
          <Plus size={16} /> ➕ Add New Course
        </button>
      </div>

      {/* ── Main Two-Column Layout: Left (Course Selector List) & Right (Course & CO-PO Detail) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Column: Course Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', paddingLeft: '4px' }}>
            Department Course Catalog ({courses.length})
          </div>

          {courses.map(c => {
            const isSelected = selectedCourse?.code === c.code;
            return (
              <div
                key={c.code}
                onClick={() => setSelectedCourse(c)}
                style={{
                  background: isSelected ? '#F8FAFC' : '#FFFFFF',
                  borderRadius: '14px',
                  padding: '16px',
                  border: isSelected ? '2px solid #4F46E5' : '1px solid #E2E8F0',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(79,70,229,0.08)' : '0 1px 2px rgba(0,0,0,0.02)',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{
                    fontSize: '0.78rem',
                    fontWeight: 900,
                    color: isSelected ? '#4F46E5' : '#0F172A',
                    background: isSelected ? '#EEF2FF' : '#F1F5F9',
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}>
                    {c.code}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>
                    {c.credits} Credits
                  </span>
                </div>

                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0F172A', marginBottom: '6px', lineHeight: 1.3 }}>
                  {c.title}
                </div>

                <div style={{ fontSize: '0.75rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserCheck size={13} color="#4F46E5" />
                  <span>{c.assignedFacultyName || 'Unassigned'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Course Studio */}
        {selectedCourse && (
          <div style={{
            background: '#FFFFFF',
            borderRadius: '18px',
            border: '1px solid #E2E8F0',
            padding: '24px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          }}>
            
            {/* Course Header & Faculty In-Charge Assignment */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              paddingBottom: '20px',
              borderBottom: '1px solid #F1F5F9',
              marginBottom: '20px',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 900, color: '#4F46E5' }}>{selectedCourse.code}</span>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>•</span>
                  <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>{selectedCourse.semester}</span>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>•</span>
                  <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 600 }}>{selectedCourse.credits} Credits</span>
                </div>
                <h3 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 800, color: '#0F172A' }}>
                  {selectedCourse.title}
                </h3>
              </div>

              {/* Faculty Delegate Dropdown */}
              <div style={{
                background: '#F8FAFC',
                padding: '10px 14px',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                    Course In-Charge Faculty
                  </div>
                  <select
                    value={selectedCourse.assignedFacultyId || ''}
                    onChange={(e) => handleAssignFaculty(selectedCourse.code, e.target.value)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      color: '#0F172A',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <option value="" disabled>Select Teaching Faculty</option>
                    {facultyMembers.map(f => (
                      <option key={f.id} value={f.id}>{f.name} ({f.designation})</option>
                    ))}
                  </select>
                </div>
                <UserCheck size={20} color="#4F46E5" />
              </div>
            </div>

            {/* Syllabus Modules */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <Layers size={18} color="#4F46E5" />
                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                  Syllabus Modules ({selectedCourse.syllabusModules.length})
                </h4>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedCourse.syllabusModules.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#F8FAFC',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      fontSize: '0.82rem',
                      color: '#334155',
                      fontWeight: 600,
                    }}
                  >
                    {m}
                  </div>
                ))}
              </div>
            </div>

            {/* Course Outcomes (CO) & Program Outcome (PO) Matrix */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={18} color="#4F46E5" />
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0F172A' }}>
                    Course Outcomes (CO) & PO Correlation Matrix
                  </h4>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                  Audited by CoE for Accreditation Compliance
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                  <thead>
                    <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #CBD5E1', textAlign: 'left' }}>
                      <th style={{ padding: '8px 10px', fontWeight: 800, color: '#334155', width: '60px' }}>CO #</th>
                      <th style={{ padding: '8px 10px', fontWeight: 800, color: '#334155' }}>Outcome Description</th>
                      {PO_LIST.map(po => (
                        <th key={po} style={{ padding: '8px 4px', fontWeight: 800, color: '#475569', textAlign: 'center', width: '36px' }}>
                          {po}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedCourse.outcomes.map(co => (
                      <tr key={co.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                        <td style={{ padding: '10px', fontWeight: 800, color: '#4F46E5' }}>{co.id}</td>
                        <td style={{ padding: '10px', color: '#1E293B', fontWeight: 500, lineHeight: 1.4 }}>{co.description}</td>
                        {PO_LIST.map(po => {
                          const isMapped = co.mappedPOs.includes(po);
                          return (
                            <td key={po} style={{ textAlign: 'center', padding: '6px' }}>
                              {isMapped ? (
                                <span style={{
                                  display: 'inline-block',
                                  width: 22,
                                  height: 22,
                                  borderRadius: '50%',
                                  background: '#EEF2FF',
                                  color: '#4F46E5',
                                  fontWeight: 900,
                                  fontSize: '0.75rem',
                                  lineHeight: '22px',
                                }}>
                                  ✓
                                </span>
                              ) : (
                                <span style={{ color: '#CBD5E1' }}>-</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ── Modal: Create New Course ── */}
      {isCreateModalOpen && (
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
            maxWidth: '600px',
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
                <div style={{ width: 34, height: 34, borderRadius: '8px', background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={18} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
                    Create Department Course
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>
                    Define syllabus modules and assign initial teaching faculty
                  </p>
                </div>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div style={{ padding: '24px', maxHeight: '68vh', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Course Code *</label>
                    <input
                      type="text"
                      required
                      value={newCode}
                      onChange={e => setNewCode(e.target.value)}
                      placeholder="e.g. CS303"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Course Title *</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      placeholder="e.g. Computer Networks"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 600, boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Credits *</label>
                    <input
                      type="number"
                      min="1"
                      max="6"
                      required
                      value={newCredits}
                      onChange={e => setNewCredits(parseInt(e.target.value) || 3)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 700, boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Semester</label>
                    <select
                      value={newSemester}
                      onChange={e => setNewSemester(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 600, background: 'white' }}
                    >
                      <option value="3rd Semester B.Tech">3rd Semester B.Tech</option>
                      <option value="5th Semester B.Tech">5th Semester B.Tech</option>
                      <option value="7th Semester B.Tech">7th Semester B.Tech</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Assign Teaching Faculty *</label>
                  <select
                    value={newFacultyId}
                    onChange={e => setNewFacultyId(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 600, background: 'white' }}
                  >
                    {facultyMembers.map(f => (
                      <option key={f.id} value={f.id}>{f.name} — {f.designation}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Syllabus Modules (One per line)</label>
                  <textarea
                    rows={5}
                    value={newModulesText}
                    onChange={e => setNewModulesText(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.82rem', fontFamily: 'inherit', boxSizing: 'border-box' }}
                  />
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
                  onClick={() => setIsCreateModalOpen(false)}
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
                    background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
                  }}
                >
                  Create Course & Map Outcomes ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
