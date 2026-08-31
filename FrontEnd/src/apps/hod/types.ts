export type EligibilityStatus = 'ELIGIBLE' | 'CONDONABLE' | 'DETAINED' | 'FEE_BLOCKED';

export interface StudentEligibilityRecord {
  id: string;
  usn: string;
  name: string;
  email: string;
  semester: string; // e.g. "3rd Sem", "5th Sem", "7th Sem"
  department: string;
  section: string; // e.g. "A", "B", "C"
  attendancePercent: number;
  totalClassesHeld: number;
  classesAttended: number;
  cieMarksAvg: number; // Continuous Internal Evaluation out of 50
  status: EligibilityStatus;
  hasFeeDues: boolean;
  dueAmount?: string;
  condonationReason?: string;
  condonationApproved?: boolean;
  hallTicketIssued?: boolean;
  hallTicketNumber?: string;
}

export interface TimetableSlot {
  subjectCode: string;
  subjectTitle: string;
  examDate: string;
  examTime: string;
  roomAllocated: string;
  deskNumber: string;
}

export interface HallTicketRecord {
  id: string;
  ticketNumber: string;
  usn: string;
  studentName: string;
  semester: string;
  department: string;
  examSession: string;
  generatedAt: string;
  isRevoked: boolean;
  revokeReason?: string;
  qrPayload: string;
  slots: TimetableSlot[];
}

export interface FacultyNomination {
  id: string;
  facultyId: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  experienceYears: number;
  assignedRole: 'SETTER' | 'EVALUATOR' | 'CHIEF_INVIGILATOR' | 'LAB_EXAMINER';
  subjectCode: string;
  subjectTitle: string;
  status: 'NOMINATED' | 'ACCEPTED' | 'DECLINED';
}

export interface CIEMarksSheet {
  subjectCode: string;
  subjectTitle: string;
  semester: string;
  facultyInCharge: string;
  totalStudents: number;
  averageScore: number;
  maxMarks: number;
  isEndorsedByHOD: boolean;
  endorsedAt?: string;
}
