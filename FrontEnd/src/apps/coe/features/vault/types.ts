export interface Question {
  id: string;
  number: number;
  section: string;
  text: string;
  marks: number;
  bloomsLevel: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
  coMapping: string; // Course Outcome, e.g. CO1, CO2
}

export interface QuestionPaperSet {
  id: string;
  setLabel: 'Set A' | 'Set B' | 'Set C' | 'Set D';
  title: string;
  subjectCode: string;
  subjectTitle: string;
  examSession: string;
  semester: string;
  setterName: string;
  setterDepartment: string;
  status: 'SUBMITTED' | 'APPROVED' | 'VAULTED' | 'SELECTED_ACTIVE' | 'ARCHIVED';
  ipfsCid: string;
  sha256Hash: string;
  submittedAt: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Balanced';
  aiQualityScore: number; // 0 - 100
  similarityScore: number; // Plagiarism check %
  totalMarks: number;
  durationMinutes: number;
  questionsCount: number;
  questions: Question[];
  isDecrypted?: boolean;
}

export interface VaultSubject {
  code: string;
  title: string;
  department: string;
  examDate: string;
  examSlot: string;
  setsAvailable: number;
  requiredSets: number;
  vaultStatus: 'LOCKED' | 'KEY_GENERATED' | 'READY_TO_UNSEAL' | 'UNSEALED';
  activeSelectedSetId?: string;
}

export interface SessionKeyData {
  keyId: string;
  subjectCode: string;
  algorithm: string; // e.g. AES-256-GCM / Dilithium3 Post-Quantum
  generatedAt: string;
  expiresAt: string;
  unlockTimestamp: string;
  thresholdQuorum: {
    required: number;
    total: number;
    signed: string[];
  };
  keyFingerprint: string;
  isUnlocked: boolean;
}
