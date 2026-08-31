export type ScriptStatus = 'PENDING' | 'IN_PROGRESS' | 'VALUED' | 'DEVIATION_FLAGGED';

export interface CanvasAnnotation {
  id: string;
  pageNumber: number;
  type: 'TICK' | 'CROSS' | 'STEP_MARK' | 'COMMENT';
  x: number; // percentage from left (0 - 100)
  y: number; // percentage from top (0 - 100)
  text?: string;
  marksValue?: number;
}

export interface QuestionMarkingItem {
  id: string;
  questionNumber: number;
  section: string; // e.g. "Part A", "Part B", "Part C"
  statement: string;
  maxMarks: number;
  evaluatorScore: number | null;
  aiSuggestedScore: number;
  aiConfidence: number; // e.g. 96 (%)
  aiStepAnalysis: string[];
  schemeOfEvaluation: string;
  modelAnswerSummary: string;
  evaluatorNotes?: string;
  isValued: boolean;
}

export interface ScannedAnswerBooklet {
  id: string;
  dummyBarcode: string; // e.g. "ANON-CS201-8942"
  bundleId: string;
  subjectCode: string;
  subjectTitle: string;
  semester: string;
  totalPages: number;
  status: ScriptStatus;
  evaluatorTotalScore: number | null;
  aiTotalScore: number;
  maxMarks: number;
  assignedDate: string;
  valuedDate?: string;
  deviationPercent?: number;
  questions: QuestionMarkingItem[];
  annotations: CanvasAnnotation[];
}

export interface ValuationBundle {
  id: string;
  subjectCode: string;
  subjectTitle: string;
  semester: string;
  valuationCenter: string;
  totalScripts: number;
  completedScripts: number;
  remunerationPerScript: number; // in INR e.g. 35
  deadline: string;
}

export interface ValuationLedgerEntry {
  id: string;
  scriptDummyBarcode: string;
  subjectCode: string;
  valuedAt: string;
  totalMarksAwarded: number;
  maxMarks: number;
  remunerationEarned: number;
  digitalSignatureHash: string;
}
