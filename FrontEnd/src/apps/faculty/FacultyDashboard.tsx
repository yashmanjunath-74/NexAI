import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  BookOpen,
  Users,
  FileCheck,
  KeyRound,
  PenTool,
  Save,
  Plus
} from 'lucide-react';
import {
  INITIAL_ASSIGNED_COURSES,
  INITIAL_STUDENT_ROSTER,
  INITIAL_FACULTY_CIE_PAPERS,
  INITIAL_DAILY_ATTENDANCE_LOGS,
  INITIAL_CIE_SCANNED_SCRIPTS,
} from './mockData';
import {
  AssignedCourse,
  StudentGradeRecord,
  FacultyCIEPaper,
  DailyAttendanceRecord,
  CIEScannedScript,
} from './types';
import toast from 'react-hot-toast';

// Feature Tabs & Modals (Folder structure identical to HOD)
import { AssignedCoursesTab } from './features/courses/AssignedCoursesTab';
import { StudentRosterMarksTab } from './features/students/StudentRosterMarksTab';
import { CIEQuestionPapersTab } from './features/cieQuestionPapers/CIEQuestionPapersTab';
import { CreateCIEPaperModal } from './features/cieQuestionPapers/components/CreateCIEPaperModal';
import { CIEEvaluationTab } from './features/cieEvaluation/CIEEvaluationTab';
import { SEEValuationGateTab } from './features/seeValuation/SEEValuationGateTab';
import { HODPaperAuditBanner } from './components/HODPaperAuditBanner';
import { FacultyVectorBackground } from './components/FacultyVectorBackground';

type FacultyTab = 'COURSES' | 'STUDENTS' | 'CIE_PAPERS' | 'CIE_EVALUATION' | 'SEE_VALUATION';

export default function FacultyDashboard() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();

  // Tab & Dataset State
  const [activeTab, setActiveTab] = useState<FacultyTab>('COURSES');
  const [courses] = useState<AssignedCourse[]>(INITIAL_ASSIGNED_COURSES);
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>('CS201');
  const [students, setStudents] = useState<StudentGradeRecord[]>(INITIAL_STUDENT_ROSTER);
  const [searchQuery, setSearchQuery] = useState('');

  // Daily Attendance History
  const [attendanceHistory, setAttendanceHistory] = useState<DailyAttendanceRecord[]>(INITIAL_DAILY_ATTENDANCE_LOGS);

  // CIE Scanned Answer Scripts for Correction Studio
  const [scannedScripts, setScannedScripts] = useState<CIEScannedScript[]>(INITIAL_CIE_SCANNED_SCRIPTS);

  // CIE Question Papers with localStorage sync across HOD and Faculty portals
  const [ciePapers, setCIEPapers] = useState<FacultyCIEPaper[]>(() => {
    try {
      const saved = localStorage.getItem('nexai_cie_papers');
      return saved ? JSON.parse(saved) : INITIAL_FACULTY_CIE_PAPERS;
    } catch {
      return INITIAL_FACULTY_CIE_PAPERS;
    }
  });

  const saveCIEPapers = (papers: FacultyCIEPaper[]) => {
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

  // SEE Valuation Gate State
  const [inputSessionKey, setInputSessionKey] = useState('');
  const [isValidatingKey, setIsValidatingKey] = useState(false);

  // Modal State for CIE Paper Creator
  const [isCreatePaperOpen, setIsCreatePaperOpen] = useState(false);

  // Handlers for Student Marks & Attendance
  const handleStudentFieldChange = (
    id: string,
    field: 'attendancePercent' | 'cie1' | 'cie2' | 'labOrQuiz',
    value: number
  ) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === id) {
          const updated = { ...s, [field]: value, isModified: true };
          const bestCie = Math.max(updated.cie1 || 0, updated.cie2 || 0);
          updated.totalCIE = bestCie + (updated.labOrQuiz || 0);
          return updated;
        }
        return s;
      })
    );
  };

  // Handler: Commit Daily Attendance Session
  const handleCommitDailyAttendance = (
    courseCode: string,
    sessionDate: string,
    sessionTopic: string,
    absentUsns: string[]
  ) => {
    const absentSet = new Set(absentUsns);
    const courseStudents = students.filter(s => s.courseCode === courseCode);

    // Update students cumulative attendance
    setStudents(prev =>
      prev.map(s => {
        if (s.courseCode === courseCode) {
          const isAbsent = absentSet.has(s.usn);
          const newHeld = s.classesHeld + 1;
          const newAttended = isAbsent ? s.classesAttended : s.classesAttended + 1;
          const newPct = Math.round((newAttended / newHeld) * 100);

          return {
            ...s,
            classesHeld: newHeld,
            classesAttended: newAttended,
            attendancePercent: newPct,
            isModified: true,
          };
        }
        return s;
      })
    );

    // Log the session record
    const newLog: DailyAttendanceRecord = {
      id: `att-log-${Date.now()}`,
      courseCode,
      date: sessionDate,
      sessionNumber: (attendanceHistory.filter(h => h.courseCode === courseCode).length || 0) + 40,
      sessionTopic: sessionTopic || `Lecture Session on ${sessionDate}`,
      totalStudents: courseStudents.length,
      presentCount: courseStudents.length - absentUsns.length,
      absentCount: absentUsns.length,
      absentUSNs: absentUsns,
      recordedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAttendanceHistory(prev => [newLog, ...prev]);
  };

  // Handler: Submit Paper Draft to HOD
  const handleSubmitDraftToHOD = (newPaper: FacultyCIEPaper) => {
    saveCIEPapers([newPaper, ...ciePapers]);
    setIsCreatePaperOpen(false);
    toast.success(`Paper for ${newPaper.courseCode} (${newPaper.testType}) submitted to HOD for verification!`);
  };

  // Handler: Resubmit Paper for Re-Audit after revising
  const handleResubmitForReaudit = (paperId: string) => {
    const target = ciePapers.find(p => p.id === paperId);
    if (!target) return;

    const updated = ciePapers.map(p =>
      p.id === paperId
        ? {
            ...p,
            status: 'SUBMITTED_TO_HOD' as const,
            submittedAt: `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Resubmitted for Re-Audit)`,
          }
        : p
    );

    saveCIEPapers(updated);
    toast.success(`Question paper for ${target.courseCode} (${target.testType}) resubmitted to HOD for Re-Audit!`, {
      icon: '🔄',
      duration: 4000,
    });
  };

  // Handler: Script Evaluation Complete (Automatically syncs to Student Roster!)
  const handleValuationComplete = (
    awardedTotal: number,
    studentId: string,
    testType: 'CIE-1' | 'CIE-2'
  ) => {
    setStudents(prev =>
      prev.map(s => {
        if (s.id === studentId) {
          const field = testType === 'CIE-1' ? 'cie1' : 'cie2';
          const updated = { ...s, [field]: awardedTotal, isModified: true };
          const bestCie = Math.max(updated.cie1 || 0, updated.cie2 || 0);
          updated.totalCIE = bestCie + (updated.labOrQuiz || 0);
          return updated;
        }
        return s;
      })
    );
  };

  const handleUpdateScript = (updatedScript: CIEScannedScript) => {
    setScannedScripts(prev => prev.map(s => (s.id === updatedScript.id ? updatedScript : s)));
  };

  const handleSaveMarksToHOD = () => {
    setStudents(prev => prev.map(s => ({ ...s, isModified: false })));
    toast.success(`Marks & Attendance for ${selectedCourseCode} synchronized and submitted to HOD!`);
  };

  // Handler: Validate SEE Session Key & Transition to Evaluator Studio
  const handleValidateSessionKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = inputSessionKey.trim().toUpperCase();

    if (!cleanKey) {
      toast.error('Please enter a valid CoE Evaluation Session Key.');
      return;
    }

    setIsValidatingKey(true);

    setTimeout(() => {
      setIsValidatingKey(false);
      if (cleanKey.includes('EVAL') || cleanKey.length >= 8) {
        toast.success('Session key verified! Launching Digital Evaluation Studio...');
        navigate(`/evaluator?sessionKey=${cleanKey}&subject=${selectedCourseCode}&evaluator=${encodeURIComponent(user?.full_name || 'Faculty Evaluator')}`);
      } else {
        toast.error('Invalid or expired Session Key. Please check the key issued by CoE.');
      }
    }, 600);
  };

  const belowAttendanceCount = students.filter(
    s => s.courseCode === selectedCourseCode && s.attendancePercent < 75
  ).length;

  const pendingScriptsCount = scannedScripts.filter(
    s => s.courseCode === selectedCourseCode && s.status === 'PENDING_VALUATION'
  ).length;

  const sidebarItems = [
    {
      id: 'COURSES',
      label: 'My Assigned Courses',
      icon: <BookOpen size={20} />,
      badge: (
        <span style={{
          background: 'rgba(255,255,255,0.18)',
          color: 'white',
          padding: '1px 7px',
          borderRadius: '10px',
          fontSize: '0.72rem',
          fontWeight: 800
        }}>
          {courses.length}
        </span>
      )
    },
    {
      id: 'STUDENTS',
      label: 'Attendance & CIE Marks',
      icon: <Users size={20} />,
      badge: belowAttendanceCount > 0 ? (
        <span style={{
          background: '#F59E0B',
          color: 'white',
          padding: '1px 6px',
          borderRadius: '10px',
          fontSize: '0.68rem',
          fontWeight: 800,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '2px'
        }}>
          ⚠️ {belowAttendanceCount}
        </span>
      ) : undefined
    },
    {
      id: 'CIE_PAPERS',
      label: 'CIE Question Papers',
      icon: <FileCheck size={20} />,
      badge: ciePapers.filter(p => p.status === 'REVISION_REQUESTED').length > 0 ? (
        <span style={{
          background: '#EF4444',
          color: 'white',
          padding: '1px 6px',
          borderRadius: '10px',
          fontSize: '0.68rem',
          fontWeight: 900,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '3px'
        }}>
          REVISION
        </span>
      ) : undefined
    },
    {
      id: 'CIE_EVALUATION',
      label: 'CIE Script Evaluation',
      icon: <PenTool size={20} />,
      badge: pendingScriptsCount > 0 ? (
        <span style={{
          background: '#3B82F6',
          color: 'white',
          padding: '1px 7px',
          borderRadius: '10px',
          fontSize: '0.68rem',
          fontWeight: 800
        }}>
          {pendingScriptsCount} Pending
        </span>
      ) : undefined
    },
    {
      id: 'SEE_VALUATION',
      label: 'SEE Evaluator Studio',
      icon: <KeyRound size={20} />,
      badge: (
        <span style={{
          background: '#059669',
          color: 'white',
          padding: '1px 6px',
          borderRadius: '10px',
          fontSize: '0.68rem',
          fontWeight: 800
        }}>
          OTP
        </span>
      )
    },
  ];

  const headerConfig: Record<FacultyTab, { title: string; subtitle: string; icon: React.ReactNode; accentColor: string; action?: React.ReactNode }> = {
    COURSES: {
      title: 'Assigned Courses & Teaching Allocations',
      subtitle: 'Department of Computer Science & Engineering • Fall Semester 2026 Course In-Charge Desk.',
      icon: <BookOpen size={26} />,
      accentColor: '#4F46E5',
    },
    STUDENTS: {
      title: 'Student Attendance & Continuous Internal Evaluation (CIE) Marks',
      subtitle: 'Record daily lecture attendance with 1-click absent toggles, and submit continuous evaluation test marks for HOD clearance.',
      icon: <Users size={26} />,
      accentColor: '#16A34A',
      action: (
        <button
          onClick={handleSaveMarksToHOD}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(22,163,74,0.3)',
          }}
        >
          <Save size={16} /> Save & Submit Marks to HOD
        </button>
      )
    },
    CIE_PAPERS: {
      title: 'Continuous Internal Evaluation (CIE) Question Paper Creator',
      subtitle: 'Draft question papers mapped to Bloom taxonomy and Course Outcomes, inspect HOD audit remarks, and resubmit.',
      icon: <FileCheck size={26} />,
      accentColor: '#8B5CF6',
      action: (
        <button
          onClick={() => setIsCreatePaperOpen(true)}
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
          <Plus size={16} /> Draft New CIE Paper
        </button>
      )
    },
    CIE_EVALUATION: {
      title: 'CIE Digital Answer Script Valuation Studio',
      subtitle: 'Digitally correct student CIE test papers with interactive pen stamps, step rubrics, and automated gradebook sync.',
      icon: <PenTool size={26} />,
      accentColor: '#2563EB',
    },
    SEE_VALUATION: {
      title: 'Semester End Examination (SEE) Valuation Studio Gate',
      subtitle: 'Cryptographic single-session OTP key gateway for autonomous digital answer script evaluation.',
      icon: <KeyRound size={26} />,
      accentColor: '#059669',
    },
  };

  const currentHeader = headerConfig[activeTab];
  const displayName = user?.full_name || 'Prof. Alan Turing';

  return (
    <MainLayout
      userName={displayName}
      userRole="Assistant Professor (CSE)"
      sidebarItems={sidebarItems}
      activeSidebarItemId={activeTab}
      onSidebarItemClick={id => setActiveTab(id as FacultyTab)}
      onLogout={logout}
    >
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <FacultyVectorBackground />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <PageHeader
            title={currentHeader.title}
            subtitle={currentHeader.subtitle}
            icon={currentHeader.icon}
            accentColor={currentHeader.accentColor}
            action={currentHeader.action}
          />

          {/* ── High-Priority HOD Paper Setting Notification Banner ── */}
          <HODPaperAuditBanner
            ciePapers={ciePapers}
            onReviewClick={() => setActiveTab('CIE_PAPERS')}
          />

          {/* ══════════════ TAB 1: ASSIGNED COURSES ══════════════ */}
          {activeTab === 'COURSES' && (
            <AssignedCoursesTab
              courses={courses}
              onSelectCourseForStudents={code => {
                setSelectedCourseCode(code);
                setActiveTab('STUDENTS');
              }}
              onSelectCourseForCIE={code => {
                setSelectedCourseCode(code);
                setActiveTab('CIE_PAPERS');
              }}
            />
          )}

          {/* ══════════════ TAB 2: STUDENT ROSTER & DAILY ATTENDANCE ══════════════ */}
          {activeTab === 'STUDENTS' && (
            <StudentRosterMarksTab
              courses={courses}
              selectedCourseCode={selectedCourseCode}
              onSelectCourseCode={setSelectedCourseCode}
              students={students}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              onStudentFieldChange={handleStudentFieldChange}
              onCommitDailyAttendance={handleCommitDailyAttendance}
              attendanceHistory={attendanceHistory}
              onSaveMarksToHOD={handleSaveMarksToHOD}
            />
          )}

          {/* ══════════════ TAB 3: CIE QUESTION PAPERS ══════════════ */}
          {activeTab === 'CIE_PAPERS' && (
            <CIEQuestionPapersTab
              ciePapers={ciePapers}
              onOpenCreatePaperModal={() => setIsCreatePaperOpen(true)}
              onResubmitForReaudit={handleResubmitForReaudit}
            />
          )}

          {/* ══════════════ TAB 4: CIE ANSWER SCRIPT EVALUATION ══════════════ */}
          {activeTab === 'CIE_EVALUATION' && (
            <CIEEvaluationTab
              courses={courses}
              selectedCourseCode={selectedCourseCode}
              onSelectCourseCode={setSelectedCourseCode}
              scripts={scannedScripts}
              onUpdateScript={handleUpdateScript}
              onValuationComplete={handleValuationComplete}
            />
          )}

          {/* ══════════════ TAB 5: SEE VALUATION GATE ══════════════ */}
          {activeTab === 'SEE_VALUATION' && (
            <SEEValuationGateTab
              selectedCourseCode={selectedCourseCode}
              inputSessionKey={inputSessionKey}
              isValidatingKey={isValidatingKey}
              onInputSessionKeyChange={setInputSessionKey}
              onValidateSessionKey={handleValidateSessionKey}
            />
          )}
        </div>
      </div>

      {/* ── Modal: Draft New CIE Question Paper ── */}
      <CreateCIEPaperModal
        isOpen={isCreatePaperOpen}
        selectedCourseCode={selectedCourseCode}
        courses={courses}
        onClose={() => setIsCreatePaperOpen(false)}
        onSubmitPaper={handleSubmitDraftToHOD}
      />
    </MainLayout>
  );
}
