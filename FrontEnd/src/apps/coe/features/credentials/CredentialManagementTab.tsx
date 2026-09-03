import React, { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  KeyRound,
  Users,
  UserPlus,
  Search,
  Copy,
  RotateCw,
  Eye,
  EyeOff,
  Building,
  X,
  ScanLine,
  FileCheck2
} from 'lucide-react';
import toast from 'react-hot-toast';

export type OfficerRole = 'HOD' | 'SCRUTINIZER' | 'SCANNING_OFFICER';

export interface OfficerCredential {
  id: string;
  name: string;
  email: string;
  role: OfficerRole;
  department: string;
  designation: string;
  status: 'ACTIVE' | 'PROVISIONED' | 'SUSPENDED';
  tempPassword: string;
  lastLogin?: string;
  issuedAt: string;
  portalPath: string;
}

const INITIAL_OFFICERS: OfficerCredential[] = [
  {
    id: 'off_01',
    name: 'Dr. Grace Hopper',
    email: 'hod.cse@univ.edu',
    role: 'HOD',
    department: 'Computer Science & Engineering',
    designation: 'Professor & Head of Department',
    status: 'ACTIVE',
    tempPassword: 'HOD-CSE-Fall26!',
    lastLogin: 'Today, 09:15 AM',
    issuedAt: '2026-08-20',
    portalPath: '/hod',
  },
  {
    id: 'off_02',
    name: 'Dr. Claude Shannon',
    email: 'hod.ece@univ.edu',
    role: 'HOD',
    department: 'Electronics & Communication',
    designation: 'Professor & Head of Department',
    status: 'ACTIVE',
    tempPassword: 'HOD-ECE-2026*9',
    lastLogin: 'Yesterday, 04:30 PM',
    issuedAt: '2026-08-20',
    portalPath: '/hod',
  },
  {
    id: 'off_03',
    name: 'Dr. James Watt',
    email: 'hod.me@univ.edu',
    role: 'HOD',
    department: 'Mechanical Engineering',
    designation: 'Professor & Head of Department',
    status: 'PROVISIONED',
    tempPassword: 'HOD-ME-Init#26',
    issuedAt: '2026-09-01',
    portalPath: '/hod',
  },
  {
    id: 'off_04',
    name: 'Dr. M. Visvesvaraya',
    email: 'hod.cv@univ.edu',
    role: 'HOD',
    department: 'Civil Engineering',
    designation: 'Professor & Head of Department',
    status: 'ACTIVE',
    tempPassword: 'HOD-CV-Fall26!',
    lastLogin: '2 days ago',
    issuedAt: '2026-08-22',
    portalPath: '/hod',
  },
  {
    id: 'off_05',
    name: 'Dr. Geoffrey Hinton',
    email: 'hod.aiml@univ.edu',
    role: 'HOD',
    department: 'Artificial Intelligence & ML',
    designation: 'Associate Professor & HOD I/C',
    status: 'PROVISIONED',
    tempPassword: 'HOD-AIML-Temp#1',
    issuedAt: '2026-09-02',
    portalPath: '/hod',
  },
  {
    id: 'off_06',
    name: 'Prof. Alan Kay',
    email: 'scrutinizer.cse@univ.edu',
    role: 'SCRUTINIZER',
    department: 'Board of Paper Scrutineers (CSE)',
    designation: 'Senior External Scrutiny Officer',
    status: 'ACTIVE',
    tempPassword: 'Scrutiny#CSE$2026',
    lastLogin: 'Today, 10:45 AM',
    issuedAt: '2026-08-25',
    portalPath: '/scrutinizer',
  },
  {
    id: 'off_07',
    name: 'Dr. Ada Lovelace',
    email: 'scrutinizer.math@univ.edu',
    role: 'SCRUTINIZER',
    department: 'Board of Paper Scrutineers (Math)',
    designation: 'Board Scrutiny Chairperson',
    status: 'ACTIVE',
    tempPassword: 'Scrutiny*Math#99',
    lastLogin: 'Yesterday, 02:10 PM',
    issuedAt: '2026-08-25',
    portalPath: '/scrutinizer',
  },
  {
    id: 'off_08',
    name: 'Prof. Richard Feynman',
    email: 'scrutinizer.phys@univ.edu',
    role: 'SCRUTINIZER',
    department: 'Board of Paper Scrutineers (Physics)',
    designation: 'Subject Expert Scrutinizer',
    status: 'PROVISIONED',
    tempPassword: 'Scrutiny#Phys!26',
    issuedAt: '2026-09-01',
    portalPath: '/scrutinizer',
  },
  {
    id: 'off_09',
    name: 'Officer K. Ramesh',
    email: 'scanning.center1@univ.edu',
    role: 'SCANNING_OFFICER',
    department: 'Central Digitization Center Desk #1',
    designation: 'Scanning Center Superintendent',
    status: 'ACTIVE',
    tempPassword: 'ScanDesk@Fall26',
    lastLogin: 'Today, 08:00 AM',
    issuedAt: '2026-08-15',
    portalPath: '/scanning',
  },
  {
    id: 'off_10',
    name: 'Officer Priya Sharma',
    email: 'scanning.center2@univ.edu',
    role: 'SCANNING_OFFICER',
    department: 'Central Digitization Center Desk #2',
    designation: 'High-Speed Scanner Supervisor',
    status: 'PROVISIONED',
    tempPassword: 'ScanDesk#Init92',
    issuedAt: '2026-09-02',
    portalPath: '/scanning',
  },
];

export const CredentialManagementTab: React.FC = () => {
  const [officers, setOfficers] = useState<OfficerCredential[]>(() => {
    try {
      const saved = localStorage.getItem('nexai_coe_officer_credentials');
      return saved ? JSON.parse(saved) : INITIAL_OFFICERS;
    } catch {
      return INITIAL_OFFICERS;
    }
  });

  const saveOfficers = (list: OfficerCredential[]) => {
    setOfficers(list);
    try {
      localStorage.setItem('nexai_coe_officer_credentials', JSON.stringify(list));
    } catch (e) {
      console.error(e);
    }
  };

  const [roleFilter, setRoleFilter] = useState<'ALL' | OfficerRole>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [revealedPasswords, setRevealedPasswords] = useState<Set<string>>(new Set());

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOfficerName, setNewOfficerName] = useState('');
  const [newOfficerEmail, setNewOfficerEmail] = useState('');
  const [newOfficerRole, setNewOfficerRole] = useState<OfficerRole>('HOD');
  const [newOfficerDept, setNewOfficerDept] = useState('Computer Science & Engineering');
  const [newOfficerDesignation, setNewOfficerDesignation] = useState('Professor & Head of Department');
  const [newOfficerPassword, setNewOfficerPassword] = useState(`Pass-${Math.random().toString(36).substring(2, 7).toUpperCase()}!26`);

  const generateRandomPassword = (role: OfficerRole) => {
    const prefix = role === 'HOD' ? 'HOD' : role === 'SCRUTINIZER' ? 'SCRUT' : 'SCAN';
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${rand}#2026`;
  };

  const toggleRevealPassword = (id: string) => {
    setRevealedPasswords(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`, { icon: '📋' });
  };

  const copyFullCredentials = (officer: OfficerCredential) => {
    const payload = `NexAI Examination Management System — Institutional Credentials\nOfficer: ${officer.name}\nDesignation: ${officer.designation}\nRole: ${officer.role}\nDepartment: ${officer.department}\nOfficial Login Email: ${officer.email}\nTemporary Password: ${officer.tempPassword}\nPortal Login URL: ${window.location.origin}${officer.portalPath}\n\nNote: Please reset your temporary password immediately upon initial login.`;
    navigator.clipboard.writeText(payload);
    toast.success(`Full credentials package for ${officer.name} copied to clipboard!`, { icon: '🔐', duration: 4000 });
  };

  const handleResetPassword = (id: string) => {
    const target = officers.find(o => o.id === id);
    if (!target) return;

    const freshPassword = generateRandomPassword(target.role);
    const updated = officers.map(o =>
      o.id === id
        ? {
            ...o,
            tempPassword: freshPassword,
            status: 'PROVISIONED' as const,
            issuedAt: new Date().toISOString().slice(0, 10),
          }
        : o
    );

    saveOfficers(updated);
    toast.success(`Credentials reset for ${target.name}! New Passcode: ${freshPassword}`, { icon: '🔄', duration: 5000 });
  };

  const handleToggleStatus = (id: string) => {
    const updated: OfficerCredential[] = officers.map(o => {
      if (o.id === id) {
        const nextStatus: 'ACTIVE' | 'SUSPENDED' = o.status === 'SUSPENDED' ? 'ACTIVE' : 'SUSPENDED';
        toast.success(`Access for ${o.name} is now ${nextStatus}`);
        return { ...o, status: nextStatus };
      }
      return o;
    });
    saveOfficers(updated);
  };

  const handleCreateOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficerName.trim() || !newOfficerEmail.trim()) {
      toast.error('Please enter complete officer details.');
      return;
    }

    const portalPath =
      newOfficerRole === 'HOD'
        ? '/hod'
        : newOfficerRole === 'SCRUTINIZER'
        ? '/scrutinizer'
        : '/scanning';

    const newOfficer: OfficerCredential = {
      id: `off_${Date.now().toString().slice(-4)}`,
      name: newOfficerName.trim(),
      email: newOfficerEmail.trim().toLowerCase(),
      role: newOfficerRole,
      department: newOfficerDept,
      designation: newOfficerDesignation,
      status: 'PROVISIONED',
      tempPassword: newOfficerPassword,
      issuedAt: new Date().toISOString().slice(0, 10),
      portalPath,
    };

    saveOfficers([newOfficer, ...officers]);
    setIsModalOpen(false);
    toast.success(`Institutional credentials generated and provisioned for ${newOfficer.name}!`, { icon: '🎉', duration: 4500 });

    // Reset modal form
    setNewOfficerName('');
    setNewOfficerEmail('');
    setNewOfficerPassword(generateRandomPassword('HOD'));
  };

  // Filtered list
  const filteredOfficers = officers.filter(o => {
    const matchesRole = roleFilter === 'ALL' || o.role === roleFilter;
    const matchesQuery =
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesQuery;
  });

  const hodCount = officers.filter(o => o.role === 'HOD').length;
  const scrutCount = officers.filter(o => o.role === 'SCRUTINIZER').length;
  const scanCount = officers.filter(o => o.role === 'SCANNING_OFFICER').length;

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <PageHeader
          title="Institutional User Credentials & Portal Access Control"
          subtitle="Controller of Examinations (CoE) Administrative Console: Generate, provision, and reset official login credentials for HODs, Scrutinizers, and Scanning Desks."
          icon={<KeyRound size={26} />}
          accentColor="#0284C7"
          action={
            <button
              onClick={() => {
                setNewOfficerPassword(generateRandomPassword(newOfficerRole));
                setIsModalOpen(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                color: 'white',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(2,132,199,0.3)',
              }}
            >
              <UserPlus size={16} /> Issue New Officer Credentials
            </button>
          }
        />

        {/* ── Summary Metrics ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '22px' }}>
          <div style={{ background: '#FFFFFF', padding: '18px 22px', borderRadius: '16px', border: '1.5px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B' }}>TOTAL PROVISIONED USERS</span>
              <Users size={18} color="#0284C7" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0F172A', marginTop: '6px' }}>
              {officers.length}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 700, marginTop: '2px' }}>
              {officers.filter(o => o.status === 'ACTIVE').length} Active Sessions
            </div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '18px 22px', borderRadius: '16px', border: '1.5px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B' }}>HEAD OF DEPARTMENTS (HOD)</span>
              <Building size={18} color="#4F46E5" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#4F46E5', marginTop: '6px' }}>
              {hodCount}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>CSE, ECE, ME, CV, AIML Portals</div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '18px 22px', borderRadius: '16px', border: '1.5px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B' }}>QP SCRUTINIZERS</span>
              <FileCheck2 size={18} color="#D97706" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#D97706', marginTop: '6px' }}>
              {scrutCount}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>Board of Examination Scrutiny</div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '18px 22px', borderRadius: '16px', border: '1.5px solid #E2E8F0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B' }}>SCANNING DESK OFFICERS</span>
              <ScanLine size={18} color="#059669" />
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#059669', marginTop: '6px' }}>
              {scanCount}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>High-Speed Digitization Centers</div>
          </div>
        </div>

        {/* ── Toolbar: Role Filter and Search ── */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '16px 22px',
          border: '1.5px solid var(--color-border, #E2E8F0)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
          flexWrap: 'wrap',
          gap: '12px',
        }}>
          {/* Role Filter Tabs */}
          <div style={{ display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: '10px', gap: '4px' }}>
            <button
              onClick={() => setRoleFilter('ALL')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                background: roleFilter === 'ALL' ? '#0F172A' : 'transparent',
                color: roleFilter === 'ALL' ? 'white' : '#64748B',
              }}
            >
              All Roles ({officers.length})
            </button>
            <button
              onClick={() => setRoleFilter('HOD')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                background: roleFilter === 'HOD' ? '#4F46E5' : 'transparent',
                color: roleFilter === 'HOD' ? 'white' : '#64748B',
              }}
            >
              HOD ({hodCount})
            </button>
            <button
              onClick={() => setRoleFilter('SCRUTINIZER')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                background: roleFilter === 'SCRUTINIZER' ? '#D97706' : 'transparent',
                color: roleFilter === 'SCRUTINIZER' ? 'white' : '#64748B',
              }}
            >
              Scrutinizers ({scrutCount})
            </button>
            <button
              onClick={() => setRoleFilter('SCANNING_OFFICER')}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
                background: roleFilter === 'SCANNING_OFFICER' ? '#059669' : 'transparent',
                color: roleFilter === 'SCANNING_OFFICER' ? 'white' : '#64748B',
              }}
            >
              Scanning Desk ({scanCount})
            </button>
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search by Name, Email, Dept..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                padding: '7px 14px 7px 32px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.82rem',
                width: '260px',
              }}
            />
          </div>
        </div>

        {/* ── Credentials Table ── */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid var(--color-border, #E2E8F0)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          overflow: 'hidden',
        }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left', color: '#64748B' }}>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>OFFICER & DESIGNATION</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>PORTAL ROLE</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>DEPARTMENT / UNIT</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>STATUS</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700 }}>TEMPORARY CREDENTIALS</th>
                  <th style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredOfficers.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#94A3B8' }}>
                      No officer credentials found matching the filter.
                    </td>
                  </tr>
                ) : (
                  filteredOfficers.map(officer => {
                    const isRevealed = revealedPasswords.has(officer.id);

                    const roleBadge = {
                      HOD: { bg: '#EEF2FF', text: '#4F46E5', label: 'HOD PORTAL (/hod)' },
                      SCRUTINIZER: { bg: '#FEF3C7', text: '#B45309', label: 'SCRUTINIZER (/scrutinizer)' },
                      SCANNING_OFFICER: { bg: '#ECFDF5', text: '#047857', label: 'SCANNING DESK (/scanning)' },
                    }[officer.role];

                    const statusBadge = {
                      ACTIVE: { bg: '#DCFCE7', text: '#15803D', label: 'ACTIVE' },
                      PROVISIONED: { bg: '#FEF9C3', text: '#A16207', label: 'PROVISIONED' },
                      SUSPENDED: { bg: '#FEE2E2', text: '#B91C1C', label: 'SUSPENDED' },
                    }[officer.status];

                    return (
                      <tr key={officer.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                        {/* Name & Email */}
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9rem' }}>
                            {officer.name}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                            {officer.designation}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#0284C7', fontFamily: 'monospace', marginTop: '2px' }}>
                            {officer.email}
                          </div>
                        </td>

                        {/* Portal Role */}
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{
                            background: roleBadge.bg,
                            color: roleBadge.text,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 900,
                            letterSpacing: '0.3px',
                          }}>
                            {roleBadge.label}
                          </span>
                        </td>

                        {/* Department */}
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ fontWeight: 700, color: '#334155' }}>
                            {officer.department}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                            Issued: {officer.issuedAt}
                          </div>
                        </td>

                        {/* Status */}
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{
                            background: statusBadge.bg,
                            color: statusBadge.text,
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                          }}>
                            {statusBadge.label}
                          </span>
                          {officer.lastLogin && (
                            <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '2px' }}>
                              Last: {officer.lastLogin}
                            </div>
                          )}
                        </td>

                        {/* Passcode with reveal and copy */}
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{
                              fontFamily: 'monospace',
                              fontWeight: 800,
                              fontSize: '0.82rem',
                              background: '#F1F5F9',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              color: '#0F172A',
                            }}>
                              {isRevealed ? officer.tempPassword : '••••••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => toggleRevealPassword(officer.id)}
                              title={isRevealed ? 'Hide Password' : 'Show Password'}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '2px' }}
                            >
                              {isRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(officer.tempPassword, 'Passcode')}
                              title="Copy Passcode"
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0284C7', padding: '2px' }}
                            >
                              <Copy size={15} />
                            </button>
                          </div>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                            <button
                              onClick={() => copyFullCredentials(officer)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: '#F8FAFC',
                                border: '1px solid #CBD5E1',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                color: '#334155',
                              }}
                              title="Copy full credentials package"
                            >
                              <Copy size={13} /> Copy Package
                            </button>

                            <button
                              onClick={() => handleResetPassword(officer.id)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                background: '#EFF6FF',
                                border: '1px solid #BFDBFE',
                                color: '#1D4ED8',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                              }}
                              title="Reset Password & Send New Passcode"
                            >
                              <RotateCw size={13} /> Reset Passcode
                            </button>

                            <button
                              onClick={() => handleToggleStatus(officer.id)}
                              style={{
                                padding: '6px 8px',
                                borderRadius: '6px',
                                border: 'none',
                                background: officer.status === 'SUSPENDED' ? '#DCFCE7' : '#FEE2E2',
                                color: officer.status === 'SUSPENDED' ? '#15803D' : '#B91C1C',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                              }}
                              title={officer.status === 'SUSPENDED' ? 'Reactivate Access' : 'Suspend Access'}
                            >
                              {officer.status === 'SUSPENDED' ? 'Unfreeze' : 'Suspend'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Modal: Provision New Institutional Officer Credentials ── */}
      {isModalOpen && (
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
            maxWidth: '560px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#F8FAFC',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: 36, height: 36, borderRadius: '8px', background: '#0284C7', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0F172A' }}>
                    Issue Institutional Portal Credentials
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>
                    Provision officer credentials for HOD, Scrutinizer, or Scanning Desks
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateOfficer} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Role Select */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                    Portal Authorization Role:
                  </label>
                  <select
                    value={newOfficerRole}
                    onChange={e => {
                      const r = e.target.value as OfficerRole;
                      setNewOfficerRole(r);
                      setNewOfficerPassword(generateRandomPassword(r));
                      if (r === 'HOD') setNewOfficerDesignation('Professor & Head of Department');
                      else if (r === 'SCRUTINIZER') setNewOfficerDesignation('Question Paper Scrutiny Officer');
                      else setNewOfficerDesignation('Scanning Center Superintendent');
                    }}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '0.85rem', fontWeight: 800, background: 'white' }}
                  >
                    <option value="HOD">Head of Department (HOD Portal)</option>
                    <option value="SCRUTINIZER">QP Scrutinizer (Board of Examination Scrutiny)</option>
                    <option value="SCANNING_OFFICER">Scanning Center Superintendent (Digital Scanning Center)</option>
                  </select>
                </div>

                {/* Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                    Officer Full Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Rao"
                    value={newOfficerName}
                    onChange={e => setNewOfficerName(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                    Institutional Official Email:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. hod.cse@univ.edu"
                    value={newOfficerEmail}
                    onChange={e => setNewOfficerEmail(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Department */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                    Academic Department / Valuation Center:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Science & Engineering"
                    value={newOfficerDept}
                    onChange={e => setNewOfficerDept(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Designation */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
                    Official Designation / Appointment:
                  </label>
                  <input
                    type="text"
                    value={newOfficerDesignation}
                    onChange={e => setNewOfficerDesignation(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Generated Passcode */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0F172A' }}>
                      Initial Temporary Password:
                    </label>
                    <button
                      type="button"
                      onClick={() => setNewOfficerPassword(generateRandomPassword(newOfficerRole))}
                      style={{ background: 'none', border: 'none', color: '#0284C7', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', padding: 0 }}
                    >
                      🔄 Regenerate Passcode
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={newOfficerPassword}
                    onChange={e => setNewOfficerPassword(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '0.85rem', fontFamily: 'monospace', fontWeight: 800, background: '#F8FAFC', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #CBD5E1', background: 'white', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '9px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <KeyRound size={15} /> Issue & Provision Account ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
