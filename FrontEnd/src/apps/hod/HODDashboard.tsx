import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  Users,
  CheckCircle2,
  QrCode,
  FileCheck
} from 'lucide-react';

import {
  StudentEligibilityRecord,
  HallTicketRecord,
  FacultyNomination,
  CIEMarksSheet
} from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_HALL_TICKETS,
  INITIAL_FACULTY_NOMINATIONS,
  INITIAL_CIE_SHEETS
} from './mockData';

import { HODOverviewTab } from './features/overview/HODOverviewTab';
import { EligibilityGatewayTab } from './features/eligibility/EligibilityGatewayTab';
import { HallTicketsTab } from './features/hallTickets/HallTicketsTab';
import { FacultyEndorsementTab } from './features/facultyEndorsement/FacultyEndorsementTab';

type HODTab = 'OVERVIEW' | 'ELIGIBILITY' | 'HALL_TICKETS' | 'FACULTY_CIE';

export default function HODDashboard() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  // Master States
  const [activeTab, setActiveTab] = useState<HODTab>('OVERVIEW');
  const [students, setStudents] = useState<StudentEligibilityRecord[]>(INITIAL_STUDENTS);
  const [hallTickets, setHallTickets] = useState<HallTicketRecord[]>(INITIAL_HALL_TICKETS);
  const [facultyNominations, setFacultyNominations] = useState<FacultyNomination[]>(INITIAL_FACULTY_NOMINATIONS);
  const [cieSheets, setCIESheets] = useState<CIEMarksSheet[]>(INITIAL_CIE_SHEETS);

  // Handlers
  const handleUpdateStudent = (updatedStudent: StudentEligibilityRecord) => {
    setStudents(prev => prev.map(s => (s.id === updatedStudent.id ? updatedStudent : s)));
  };

  const handleBulkAddStudents = (newStudents: StudentEligibilityRecord[]) => {
    setStudents(prev => [...newStudents, ...prev]);
  };

  const sidebarItems = [
    { id: 'OVERVIEW', label: 'Department Overview', icon: <Users size={20} /> },
    { id: 'ELIGIBILITY', label: 'Eligibility Gateway', icon: <CheckCircle2 size={20} /> },
    { id: 'HALL_TICKETS', label: 'Hall Tickets (Admit)', icon: <QrCode size={20} /> },
    { id: 'FACULTY_CIE', label: 'CIE & Faculty Nom.', icon: <FileCheck size={20} /> },
  ];

  const headerConfig: Record<HODTab, { title: string; subtitle: string; icon: React.ReactNode; accentColor: string }> = {
    OVERVIEW: {
      title: 'HOD Academic & Examination Operations',
      subtitle: 'Department of Computer Science & Engineering • Fall Semester 2026 Examination Gateway.',
      icon: <Users size={26} />,
      accentColor: '#3b82f6',
    },
    ELIGIBILITY: {
      title: 'Student Eligibility & Attendance Gateway',
      subtitle: 'Monitor attendance cutoffs (≥75%), verify medical condonation waivers, and resolve fee blockages.',
      icon: <CheckCircle2 size={26} />,
      accentColor: '#10b981',
    },
    HALL_TICKETS: {
      title: 'Cryptographic Hall Ticket Generation & Dispatch',
      subtitle: 'Batch generate, digitally sign, and inspect tamper-evident QR code examination admit cards.',
      icon: <QrCode size={26} />,
      accentColor: '#48977f',
    },
    FACULTY_CIE: {
      title: 'CIE Marks Endorsement & Faculty Nominations',
      subtitle: 'Endorse and freeze Continuous Internal Evaluation marks and manage Paper Setter nominations.',
      icon: <FileCheck size={26} />,
      accentColor: '#8b5cf6',
    },
  };

  const currentHeader = headerConfig[activeTab];

  return (
    <MainLayout
      userName={user?.full_name || 'Dr. Grace Hopper'}
      userRole="Head of Department (CSE)"
      sidebarItems={sidebarItems}
      activeSidebarItemId={activeTab}
      onSidebarItemClick={id => setActiveTab(id as HODTab)}
      onLogout={logout}
    >
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* ── Large Decorative Vector (Bottom-Right) ── */}
        <svg
          viewBox="0 0 340 340"
          width="420"
          height="420"
          style={{
            position: 'fixed',
            right: -50,
            bottom: -60,
            pointerEvents: 'none',
            opacity: 0.08,
            zIndex: 0,
          }}
        >
          {/* University Crest / Academic Cap Vector */}
          <path d="M170,30 L320,100 L170,170 L20,100 Z" fill="#48977f" />
          <path d="M70,135 L70,220 C70,260 170,310 170,310 C170,310 270,260 270,220 L270,135 L170,185 Z" fill="#48977f" opacity="0.85" />
          <circle cx="170" cy="220" r="30" fill="white" opacity="0.6" />
          <circle cx="170" cy="220" r="14" fill="#48977f" />
        </svg>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Page Header */}
          <PageHeader
            title={currentHeader.title}
            subtitle={currentHeader.subtitle}
            icon={currentHeader.icon}
            accentColor={currentHeader.accentColor}
          />

          {/* ── Tab Views ── */}
          {activeTab === 'OVERVIEW' && (
            <HODOverviewTab
              students={students}
              hallTickets={hallTickets}
              cieSheets={cieSheets}
              onNavigateToEligibility={() => setActiveTab('ELIGIBILITY')}
              onNavigateToHallTickets={() => setActiveTab('HALL_TICKETS')}
              onNavigateToFaculty={() => setActiveTab('FACULTY_CIE')}
            />
          )}

          {activeTab === 'ELIGIBILITY' && (
            <EligibilityGatewayTab
              students={students}
              onUpdateStudent={handleUpdateStudent}
              onBulkAddStudents={handleBulkAddStudents}
              onNavigateToHallTickets={() => setActiveTab('HALL_TICKETS')}
            />
          )}

          {activeTab === 'HALL_TICKETS' && (
            <HallTicketsTab
              hallTickets={hallTickets}
              students={students}
              onUpdateHallTickets={setHallTickets}
            />
          )}

          {activeTab === 'FACULTY_CIE' && (
            <FacultyEndorsementTab
              cieSheets={cieSheets}
              facultyNominations={facultyNominations}
              onUpdateCIESheets={setCIESheets}
              onUpdateNominations={setFacultyNominations}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
