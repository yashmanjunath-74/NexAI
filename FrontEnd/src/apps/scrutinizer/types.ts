export type BundleLifecycleStatus =
  | 'UNASSIGNED'
  | 'ALLOCATED_TO_EVALUATOR'
  | 'IN_EVALUATION'
  | 'EVALUATED_PENDING_SCRUTINY'
  | 'SCRUTINIZED_AND_SEALED';

export type ScrutinyTotalingStatus =
  | 'VERIFIED_ACCURATE'
  | 'ARITHMETIC_MISMATCH_DETECTED'
  | 'UNTOUCHED_PAGE_FLAGGED'
  | 'CORRECTED_BY_SCRUTINIZER';

export interface EvaluatorProfile {
  id: string;
  facultyId: string;
  name: string;
  department: string;
  designation: string;
  email: string;
  phone: string;
  experienceYears: number;
  assignedBundlesCount: number;
  maxBundleQuota: number;
  valuationCenterLab: string;
}

export interface ScriptScrutinyItem {
  id: string;
  dummyBarcode: string;
  bundleId: string;
  subjectCode: string;
  totalPages: number;
  frontPageTotal: number;
  summedQuestionMarks: number;
  evaluatorName: string;
  status: ScrutinyTotalingStatus;
  discrepancyDetails?: string;
  scrutinizerCorrectedScore?: number;
  scrutinizerNotes?: string;
  isAudited: boolean;
}

export interface ScrutinyBundle {
  id: string;
  bundleCode: string; // e.g. "BUNDLE-CS201-01"
  subjectCode: string;
  subjectTitle: string;
  semester: string;
  examSession: string;
  examDate: string;
  totalScripts: number;
  completedScripts: number;
  assignedEvaluatorId?: string;
  assignedEvaluatorName?: string;
  valuationDeadline: string;
  status: BundleLifecycleStatus;
  scrutinyStatus: 'PENDING' | 'IN_SCRUTINY' | 'CERTIFIED';
  auditedScriptsCount: number;
  scripts: ScriptScrutinyItem[];
}
