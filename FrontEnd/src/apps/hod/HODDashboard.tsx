import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  Users,
  CheckCircle2,
  QrCode,
  FileCheck,
  BookOpen,
  UserPlus,
  Calendar,
  Building
} from 'lucide-react';

import {
  StudentEligibilityRecord,
  HallTicketRecord,
  FacultyNomination,
  CIEMarksSheet,
  CourseRecord,
  FacultyMember,
  CIEQuestionPaper,
  DepartmentExamSession,
  ExamHall,
  AllocatedSeat,
  FacultyDutyAllocation
} from './types';
import {
  INITIAL_STUDENTS,
  INITIAL_HALL_TICKETS,
  INITIAL_FACULTY_NOMINATIONS,
  INITIAL_CIE_SHEETS,
  INITIAL_COURSES,
  INITIAL_FACULTY_MEMBERS,
  INITIAL_CIE_PAPERS,
  INITIAL_DEPARTMENT_EXAM_SESSIONS,
  INITIAL_EXAM_HALLS,
  INITIAL_ALLOCATED_SEATS,
  INITIAL_FACULTY_DUTY_ALLOCATIONS
} from './mockData';

import { HODOverviewTab } from './features/overview/HODOverviewTab';
import { EligibilityGatewayTab } from './features/eligibility/EligibilityGatewayTab';
import { HallTicketsTab } from './features/hallTickets/HallTicketsTab';
import { FacultyEndorsementTab } from './features/facultyEndorsement/FacultyEndorsementTab';
import { HODCurriculumTab } from './features/curriculum/HODCurriculumTab';
import { FacultyManagementTab } from './features/facultyManagement/FacultyManagementTab';
import { DepartmentExamsTab } from './features/departmentExams/DepartmentExamsTab';
import { ExamHallsTab } from './features/rooms/ExamHallsTab';

type HODTab = 'OVERVIEW' | 'CURRICULUM' | 'FACULTY' | 'EXAM_HALLS' | 'DEPT_EXAMS' | 'ELIGIBILITY' | 'HALL_TICKETS' | 'FACULTY_CIE';

export default function HODDashboard() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);

  // Master States
  const [activeTab, setActiveTab] = useState<HODTab>('OVERVIEW');
  const [courses, setCourses] = useState<CourseRecord[]>(INITIAL_COURSES);
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>(INITIAL_FACULTY_MEMBERS);
  const [examHalls, setExamHalls] = useState<ExamHall[]>(INITIAL_EXAM_HALLS);
  const [allocatedSeats, setAllocatedSeats] = useState<AllocatedSeat[]>(INITIAL_ALLOCATED_SEATS);
  const [facultyDuties, setFacultyDuties] = useState<FacultyDutyAllocation[]>(INITIAL_FACULTY_DUTY_ALLOCATIONS);
  const [examSessions, setExamSessions] = useState<DepartmentExamSession[]>(INITIAL_DEPARTMENT_EXAM_SESSIONS);
  const [ciePapers, setCIEPapers] = useState<CIEQuestionPaper[]>(() => {
    try {
      const saved = localStorage.getItem('nexai_cie_papers');
      return saved ? JSON.parse(saved) : INITIAL_CIE_PAPERS;
    } catch {
      return INITIAL_CIE_PAPERS;
    }
  });

  const handleUpdateCIEPapers = (papers: CIEQuestionPaper[]) => {
    setCIEPapers(papers);
    try {
      localStorage.setItem('nexai_cie_papers', JSON.stringify(papers));
      window.dispatchEvent(new Event('nexai_cie_papers_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem('nexai_cie_papers');
        if (saved) setCIEPapers(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('nexai_cie_papers_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('nexai_cie_papers_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

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
    { id: 'CURRICULUM', label: 'Course & CO-PO Studio', icon: <BookOpen size={20} /> },
    { id: 'ELIGIBILITY', label: 'Eligibility Gateway', icon: <CheckCircle2 size={20} /> },
    { id: 'EXAM_HALLS', label: 'Exam Halls & Rooms', icon: <Building size={20} /> },
    { id: 'DEPT_EXAMS', label: 'Exam Scheduling & Duties', icon: <Calendar size={20} /> },
    { id: 'FACULTY_CIE', label: 'CIE Paper Review', icon: <FileCheck size={20} /> },
    { id: 'HALL_TICKETS', label: 'Hall Tickets (Admit)', icon: <QrCode size={20} /> },
    { id: 'FACULTY', label: 'Faculty Credentials', icon: <UserPlus size={20} /> }
  ];

  const headerConfig: Record<HODTab, { title: string; subtitle: string; icon: React.ReactNode; accentColor: string }> = {
    OVERVIEW: {
      title: 'HOD Academic & Examination Operations',
      subtitle: 'Department of Computer Science & Engineering • Fall Semester 2026 Examination Gateway.',
      icon: <Users size={26} />,
      accentColor: '#3b82f6',
    },
    CURRICULUM: {
      title: 'Course Curriculum, CO-PO Mapping & Faculty Assignment',
      subtitle: 'Author department courses, define Bloom-aligned Course Outcomes, and map Program Outcome correlations.',
      icon: <BookOpen size={26} />,
      accentColor: '#4F46E5',
    },
    FACULTY: {
      title: 'Faculty User Provisioning & Credential Generator',
      subtitle: 'Register department teaching faculty, provision portal login credentials, and inspect authorization slips.',
      icon: <UserPlus size={26} />,
      accentColor: '#16A34A',
    },
    EXAM_HALLS: {
      title: 'Department Examination Halls & Room Infrastructure',
      subtitle: 'Annual registration of physical examination halls, bench grid dimensions, seating capacities, and CCTV surveillance.',
      icon: <Building size={26} />,
      accentColor: '#059669',
    },
    DEPT_EXAMS: {
      title: 'Department Examination Scheduling & Duty Allotments',
      subtitle: 'Schedule CIE & lab exams, allocate timetable slots & halls, assign student batches, and appoint faculty duties.',
      icon: <Calendar size={26} />,
      accentColor: '#4F46E5',
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
      title: 'Faculty Internal Test (CIE) Question Paper Review',
      subtitle: 'Inspect, verify Bloom taxonomy levels & CO mappings, and approve Continuous Internal Evaluation question papers submitted by teaching faculty.',
      icon: <FileCheck size={26} />,
      accentColor: '#8b5cf6',
    },
  };

  const currentHeader = headerConfig[activeTab];

  const displayName = (!user?.full_name || user.full_name.toLowerCase() === 'head of department' || user.full_name.toLowerCase() === 'hod')
    ? 'Dr. Grace Hopper'
    : user.full_name;

  return (
    <MainLayout
      userName={displayName}
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
            right: -60,
            bottom: -60,
            pointerEvents: 'none',
            opacity: 0.08,
            zIndex: 0,
          }}
        >
          {/* Certificate / Shield / Laurel HOD Decorative Motif */}
          <circle cx="170" cy="170" r="140" fill={currentHeader.accentColor} />
          <circle cx="170" cy="170" r="110" fill="none" stroke="white" strokeWidth="6" strokeDasharray="10 10" />
          <path d="M170,70 L210,140 L290,140 L225,185 L250,260 L170,215 L90,260 L115,185 L50,140 L130,140 Z" fill="white" opacity="0.3" />
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

          {activeTab === 'CURRICULUM' && (
            <HODCurriculumTab
              courses={courses}
              facultyMembers={facultyMembers}
              onAddCourse={(newCourse) => setCourses(prev => [newCourse, ...prev])}
              onUpdateCourse={(updated) => setCourses(prev => prev.map(c => c.code === updated.code ? updated : c))}
              onDeleteCourse={(code) => setCourses(prev => prev.filter(c => c.code !== code))}
            />
          )}

          {activeTab === 'FACULTY' && (
            <FacultyManagementTab
              facultyMembers={facultyMembers}
              courses={courses}
              onAddFaculty={(newFac) => setFacultyMembers(prev => [newFac, ...prev])}
            />
          )}

          {activeTab === 'EXAM_HALLS' && (
            <ExamHallsTab
              halls={examHalls}
              onUpdateHalls={setExamHalls}
            />
          )}

          {activeTab === 'DEPT_EXAMS' && (
            <DepartmentExamsTab
              sessions={examSessions}
              courses={courses}
              facultyMembers={facultyMembers}
              halls={examHalls}
              allocatedSeats={allocatedSeats}
              facultyDuties={facultyDuties}
              onUpdateSessions={setExamSessions}
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
              ciePapers={ciePapers}
              onUpdateCIESheets={setCIESheets}
              onUpdateNominations={setFacultyNominations}
              onUpdateCIEPapers={handleUpdateCIEPapers}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
}
