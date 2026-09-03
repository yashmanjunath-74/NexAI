import React, { useState } from 'react';
import { WizardStepper } from './wizard/WizardStepper';
import { Step1ScopeSchedule } from './wizard/steps/Step1ScopeSchedule';
import { Step2SubjectMatrix } from './wizard/steps/Step2SubjectMatrix';
import { Step3HallConfiguration } from './wizard/steps/Step3HallConfiguration';
import { Step4InvigilatorRoster } from './wizard/steps/Step4InvigilatorRoster';
import { Step5AIEngineConsole } from './wizard/steps/Step5AIEngineConsole';

import {
  SessionScopeConfig,
  SubjectExam,
  ExamHall,
  FacultyInvigilator,
  RoomAllocationResult,
  AITelemetryMetrics,
} from '../types/allocationTypes';

import {
  MOCK_TIME_SLOTS,
  MOCK_ALL_SUBJECTS,
  MOCK_EXAM_HALLS,
  MOCK_FACULTY_ROSTER,
} from '../mock/allocationMockData';

interface AllocationWizardProps {
  sessionId?: string;
  onCompleteAllocation: (
    results: RoomAllocationResult[],
    telemetry: AITelemetryMetrics,
    scope: SessionScopeConfig
  ) => void;
  onCancel: () => void;
}

export const AllocationWizard: React.FC<AllocationWizardProps> = ({
  onCompleteAllocation,
  onCancel: _onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // 1. Step 1: Scope & Schedule
  const [scopeConfig, setScopeConfig] = useState<SessionScopeConfig>({
    sessionName: 'SEE Autumn 2026 — Institutional Semester End Examination',
    examType: 'SEE_REGULAR',
    academicYear: '2026-27',
    selectedDepartments: ['CSE', 'ECE', 'ME', 'CV', 'AIML'],
    selectedSemesters: [3, 5],
    examsPerDay: 1,
    startDate: new Date().toISOString().split('T')[0],
    selectedSlots: [MOCK_TIME_SLOTS[0]],
  });

  // 2. Step 2: Subjects & Candidate Headcount
  const [selectedSubjects, setSelectedSubjects] = useState<SubjectExam[]>(
    MOCK_ALL_SUBJECTS.filter(s =>
      ['CS301', 'EC301', 'ME301', 'CV301', 'AI301'].includes(s.code)
    )
  );

  // 3. Step 3: Exam Halls
  const [selectedRooms, setSelectedRooms] = useState<ExamHall[]>([
    MOCK_EXAM_HALLS[0], // A-101 (60)
    MOCK_EXAM_HALLS[1], // A-102 (40)
    MOCK_EXAM_HALLS[2], // A-201 (50)
    MOCK_EXAM_HALLS[3], // B-101 (60)
    MOCK_EXAM_HALLS[4], // B-205 (40)
  ]);

  // 4. Step 4: Faculty Invigilators
  const [facultyRoster, setFacultyRoster] = useState<FacultyInvigilator[]>(MOCK_FACULTY_ROSTER);

  const handleScopeChange = (updated: Partial<SessionScopeConfig>) => {
    setScopeConfig(prev => ({ ...prev, ...updated }));
  };

  const handleSolveComplete = (
    results: RoomAllocationResult[],
    telemetry: AITelemetryMetrics
  ) => {
    onCompleteAllocation(results, telemetry, scopeConfig);
  };

  const totalRequiredCandidates = selectedSubjects.reduce((sum, s) => sum + s.eligibleStudents, 0);

  return (
    <div>
      {/* Visual Stepper */}
      <WizardStepper
        currentStep={currentStep}
        onStepClick={targetStep => {
          if (targetStep < currentStep) setCurrentStep(targetStep);
        }}
      />

      {/* Step Views */}
      {currentStep === 1 && (
        <Step1ScopeSchedule
          config={scopeConfig}
          onChange={handleScopeChange}
          onNext={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 2 && (
        <Step2SubjectMatrix
          scopeConfig={scopeConfig}
          selectedSubjects={selectedSubjects}
          onSubjectsChange={setSelectedSubjects}
          onNext={() => setCurrentStep(3)}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <Step3HallConfiguration
          requiredStudents={totalRequiredCandidates}
          selectedRooms={selectedRooms}
          onRoomsChange={setSelectedRooms}
          onNext={() => setCurrentStep(4)}
          onBack={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 4 && (
        <Step4InvigilatorRoster
          selectedRooms={selectedRooms}
          facultyRoster={facultyRoster}
          onFacultyChange={setFacultyRoster}
          onNext={() => setCurrentStep(5)}
          onBack={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 5 && (
        <Step5AIEngineConsole
          selectedSubjects={selectedSubjects}
          selectedRooms={selectedRooms}
          facultyRoster={facultyRoster}
          onBack={() => setCurrentStep(4)}
          onSolveComplete={handleSolveComplete}
        />
      )}
    </div>
  );
};
