# NexAI Examination System - Architectural Diagrams Specification
### Complete Flowcharts, UML Class Models & Use Case Diagrams

This document contains formal UML and workflow specifications for the **NexAI Autonomous Examination Management System**.

---

## 1. End-to-End Institutional Examination Process Flowchart

```mermaid
flowchart TD
  classDef p1 fill:#e0f2fe,stroke:#0284c7,stroke-width:2px;
  classDef p2 fill:#fef3c7,stroke:#d97706,stroke-width:2px;
  classDef p3 fill:#ede9fe,stroke:#7c3aed,stroke-width:2px;
  classDef p4 fill:#dcfce7,stroke:#16a34a,stroke-width:2px;
  classDef p5 fill:#fce7f3,stroke:#db2777,stroke-width:2px;

  subgraph P1["PHASE 1: Continuous Assessment & Eligibility (HOD & Faculty)"]
    A1[Faculty: Daily Batch Attendance] --> A2{Attendance >= 75%?}
    A2 -- Yes --> A3[Eligible for CIE Tests]
    A2 -- No --> A4[Detained / Medical Condonation Review]
    A4 -- Condoned --> A3
    A3 --> A5[Faculty: Conduct CIE-1, 2, 3]
    A5 --> A6[Faculty: Digital CIE On-Screen Correction]
    A6 --> A7[HOD: Endorse Internal CIE Marks]
    A7 --> A8[HOD: Eligibility Gateway & Hall Ticket Release]
  end

  subgraph P2["PHASE 2: Confidential Question Paper Authoring (Setter & CoE Vault)"]
    B1[Paper Setter: AI Question Bank Assistant] --> B2[Bloom Taxonomy Tagging L1-L6]
    B2 --> B3[Module Blueprint Compliance Check]
    B3 --> B4[Client-Side AES-256 Encryption]
    B4 --> B5[Decentralized IPFS Storage CID]
    B5 --> B6[CoE Vault: Paper Decryption & Multi-Set Approval]
  end

  subgraph P3["PHASE 3: Institutional SEE Examination Scheduling (CoE AI Engine)"]
    C1[CoE: Define Multi-Dept & Semester Scope] --> C2[Select Exam Halls & 5% Emergency Buffer]
    C2 --> C3[AI Constraint Satisfaction Solver Engine]
    C3 --> C4[2D Spatial Interleaving: Alternating Branches]
    C3 --> C5[Workload Balancer: Equalize Faculty Duties]
    C4 & C5 --> C6[Publish Room Blueprints & Master Notice]
  end

  subgraph P4["PHASE 4: Examination Conduct & Digitization (Control Room & Scanning)"]
    D1[Student: Door QR Hall Ticket Scan] --> D2[Invigilator: Interleaved Seating Proctoring]
    D2 --> D3[Collect Physical Exam Booklets]
    D3 --> D4[Scanning Officer: Barcode & OMR Ingestion]
    D4 --> D5[Automated Dummy Numbering Masking]
    D5 --> D6[Generate 25-Script Evaluator Packets]
  end

  subgraph P5["PHASE 5: Double-Blind Valuation & Publishing (Evaluator & Scrutinizer)"]
    E1[Evaluator: Blind Digital Valuation Studio] --> E2[Annotation Tools & Question-wise Scoring]
    E2 --> E3[Automatic Arithmetic Summation & Totaling]
    E3 --> E4[Scrutinizer: Unvalued Question & Page Audit]
    E4 --> E5{Deviation > 15%?}
    E5 -- Yes --> E6[Route to Third Valuation Review]
    E5 -- No --> E7[CoE: Tamper-Proof Grade Ledger Lock]
    E7 --> E8[Student Portal: Digital Grade Cards & Transcripts]
  end

  A8 --> C1
  B6 --> D1
  C6 --> D1
  D6 --> E1
  E6 --> E7
```

---

## 2. AI Seating Allocation & Equal Workload Engine Flowchart

```mermaid
flowchart TD
  Start([Start: CoE Triggers AI Allocation]) --> Input[Input: Selected Departments, Semesters, Halls, Faculty Roster, 5% Buffer]
  
  Input --> GenQueues[Generate Enrolled Candidate Records]
  GenQueues --> SplitPWD[Filter Special Needs / PWD Candidates]
  
  SplitPWD --> SortHalls[Sort Exam Halls by Floor Level & Capacity]
  SortHalls --> PWDAlloc[Place PWD Candidates in Ground Floor Halls Floor 0]
  
  PWDAlloc --> InitLoop[Initialize 2D Hall Matrix: Rows x Cols with Aisles]
  
  InitLoop --> PopInterleave[Pull Candidate from Rotating Department Queues: Dept_i -> Dept_i+1]
  
  PopInterleave --> CheckLeft{Same Dept as Left Desk?}
  CheckLeft -- Yes --> SwapQueue[Swap with Candidate from Alternative Branch]
  SwapQueue --> CheckFront
  CheckLeft -- No --> CheckFront{Same Dept as Front Desk?}
  CheckFront -- Yes --> SwapQueue
  CheckFront -- No --> PlaceSeat[Place Candidate on Desk]
  
  PlaceSeat --> CapacityCheck{Hall Reached Target Capacity - 5% Buffer?}
  CapacityCheck -- No --> PopInterleave
  CapacityCheck -- Yes --> NextHall{More Halls to Allocate?}
  NextHall -- Yes --> InitLoop
  
  NextHall -- No --> FacultyStart[Initiate Invigilator Workload Balancer]
  FacultyStart --> CalcQuota[Compute Target Quota = Total Room Slots / Active Faculty]
  CalcQuota --> SortFaculty[Sort Faculty by Cumulative Historical Duties Ascending]
  
  SortFaculty --> AssignChief[Assign Chief Invigilator with Lowest Duty Count]
  AssignChief --> CheckRoomCap{Room Capacity > 35?}
  CheckRoomCap -- Yes --> AssignReliever[Assign Reliever Invigilator from Non-Conflicting Department]
  CheckRoomCap -- No --> CheckAntiBias
  
  AssignReliever --> CheckAntiBias{Invigilator Department == Majority Hall Department?}
  CheckAntiBias -- Yes --> CrossSwap[Swap with Invigilator from Complementary Branch]
  CheckAntiBias -- No --> UpdateDutyCount[Increment Current Cycle Duties]
  
  CrossSwap --> UpdateDutyCount
  UpdateDutyCount --> MoreRooms{More Rooms to Staff?}
  MoreRooms -- Yes --> SortFaculty
  MoreRooms -- No --> CalcTelemetry[Compute Telemetry: Interleaving Purity %, Fairness Variance, Utilization %]
  
  CalcTelemetry --> End([Output: Seating Blueprint, Invigilation Roster & Printable Notice])
```

---

## 3. Comprehensive UML Class Diagram

```mermaid
classDiagram
  direction TB

  %% Users & Role Hierarchy
  class User {
    +UUID id
    +String fullName
    +String email
    +String phone
    +RoleEnum role
    +Boolean isActive
    +login(credentials)
    +resetPassword()
  }

  class ChiefSuperintendent {
    +String officeRoom
    +approveQuestionPaper(paperId)
    +runAIAllocationEngine(config)
    +publishGradeLedger(sessionId)
    +provisionOfficerAccount(data)
  }

  class HeadOfDepartment {
    +String departmentCode
    +enforceAttendanceCutoff(threshold)
    +endorseCIEMarks(courseId)
    +releaseHallTickets(semester)
  }

  class Faculty {
    +String departmentCode
    +String designation
    +Integer historicalDutyCount
    +recordDailyAttendance(date, absentUSNs)
    +evaluateCIEScript(scriptId, rubrics)
    +submitCIEMarks(courseId)
  }

  class PaperSetter {
    +String affiliation
    +generateQuestionAI(prompt, bloomLevel)
    +validateBlueprint(schemeId)
    +encryptAndVault(paperData)
  }

  class ScanningOfficer {
    +String stationId
    +scanPhysicalBooklet(barcode)
    +generateDummyMask(usn)
    +bundleEvaluationPacket(batchSize)
  }

  class Evaluator {
    +String specialization
    +Integer valuedScriptsCount
    +annotatePage(pageNo, annotation)
    +assignQuestionScore(qNo, marks)
    +finalizeScriptValuation(scriptId)
  }

  class Scrutinizer {
    +String auditSection
    +scanUnvaluedAnswers(scriptId)
    +verifyScoreSummation(scriptId)
    +escalateDiscrepancy(scriptId, reason)
  }

  class Student {
    +String usn
    +String departmentCode
    +Integer semester
    +Boolean isPWD
    +downloadHallTicket()
    +locateAllocatedSeat()
    +viewGradeCard(semester)
  }

  User <|-- ChiefSuperintendent
  User <|-- HeadOfDepartment
  User <|-- Faculty
  User <|-- PaperSetter
  User <|-- ScanningOfficer
  User <|-- Evaluator
  User <|-- Scrutinizer
  User <|-- Student

  %% Academic Curriculum & Enrollment
  class Department {
    +String code
    +String name
    +String colorCode
    +String usnPrefix
  }

  class Course {
    +String courseCode
    +String title
    +Integer semester
    +Integer credits
    +String syllabusScheme
  }

  class AttendanceRegister {
    +Date date
    +String courseCode
    +String facultyId
    +List~String~ absentUSNs
  }

  class CIEAssessment {
    +String id
    +String courseCode
    +String testType
    +Float maxMarks
    +Map~String, Float~ studentScores
  }

  Department "1" *-- "*" Course : offers
  Course "1" *-- "*" AttendanceRegister : tracks
  Course "1" *-- "*" CIEAssessment : conducts
  Student "*" -- "1" Department : enrolledIn

  %% Question Bank & Vault
  class QuestionPaper {
    +String paperCode
    +String courseCode
    +Integer semester
    +String examSession
    +String ipfsCid
    +String aesHash
    +String status
  }

  class Question {
    +Integer questionNumber
    +String subDivision
    +String text
    +String bloomLevel
    +Integer marks
    +Integer moduleNumber
  }

  QuestionPaper "1" *-- "*" Question : contains
  PaperSetter "1" --> "*" QuestionPaper : authors
  ChiefSuperintendent "1" --> "*" QuestionPaper : approves

  %% SEE Scheduling & AI Allocation
  class ExamSession {
    +String sessionId
    +String sessionName
    +Date examDate
    +String timeSlot
    +String examType
  }

  class ExamHall {
    +String hallId
    +String roomNumber
    +String building
    +Integer floor
    +Integer capacity
    +Integer cols
    +Boolean isAccessiblePWD
  }

  class SeatedCandidate {
    +Integer seatIndex
    +Integer benchNumber
    +String deskPosition
    +String usn
    +String department
    +String subjectCode
    +Boolean isPWD
  }

  class InvigilationDuty {
    +String dutyId
    +String hallId
    +String facultyId
    +String role
    +Boolean isCrossPaired
  }

  ExamSession "1" *-- "*" ExamHall : utilizes
  ExamHall "1" *-- "*" SeatedCandidate : seats
  ExamHall "1" *-- "1..2" InvigilationDuty : supervisedBy
  Faculty "1" -- "*" InvigilationDuty : assignedTo
  ChiefSuperintendent "1" --> "1" ExamSession : organizes

  %% Post-Exam Scanning & Digital Valuation
  class PhysicalAnswerBooklet {
    +String barcode
    +String usn
    +String courseCode
    +Integer pageCount
  }

  class DigitizedScript {
    +String dummyNumber
    +String scriptPdfUri
    +String status
    +Float totalEvaluatorMarks
    +Float finalModeratedMarks
  }

  class EvaluationPacket {
    +String packetId
    +String courseCode
    +Integer scriptCount
    +String assignedEvaluatorId
    +String status
  }

  class QuestionScore {
    +Integer questionNumber
    +Float marksAwarded
    +String evaluatorRemarks
  }

  PhysicalAnswerBooklet "1" --> "1" DigitizedScript : convertedToByScanning
  DigitizedScript "*" --o "1" EvaluationPacket : groupedInto
  DigitizedScript "1" *-- "*" QuestionScore : gradedWith
  Evaluator "1" --> "*" EvaluationPacket : values
  Scrutinizer "1" --> "*" DigitizedScript : audits
```

---

## 4. Comprehensive System Use Case Diagram

```mermaid
flowchart LR
  %% Actors
  subgraph Actors
    CoE["👤 Controller of Examinations"]
    HOD["👤 Head of Department"]
    FAC["👤 Faculty Instructor"]
    SET["👤 Paper Setter"]
    SCN["👤 Scanning Officer"]
    EVL["👤 Evaluator"]
    SCR["👤 Scrutinizer"]
    INV["👤 Exam Invigilator"]
    STU["👤 Student / Candidate"]
    AIE["🤖 AI Allocation Engine"]
  end

  %% Subsystems
  subgraph S1["Academic Management & CIE Gateway"]
    UC1["Record Daily Batch Attendance"]
    UC2["Conduct & Grade CIE Assessments"]
    UC3["Enforce 75% Attendance Gateway"]
    UC4["Endorse Department CIE Marks"]
    UC5["Generate & Sign Hall Tickets"]
  end

  subgraph S2["Confidential Question Vault"]
    UC6["Generate AI Blueprint Questions"]
    UC7["Tag Bloom Taxonomy Levels"]
    UC8["Client-Side AES-256 Paper Encryption"]
    UC9["Approve & Release Vault Papers"]
  end

  subgraph S3["Institutional SEE Scheduling"]
    UC10["Define SEE Multi-Dept Scope"]
    UC11["Run 2D Cross-Interleaving Optimization"]
    UC12["Equalize Invigilator Workload (σ → 0)"]
    UC13["Publish Hall Seating Blueprints"]
  end

  subgraph S4["Scanning & Double-Blind Valuation"]
    UC14["Ingest Barcodes & OMR Sheets"]
    UC15["Mask USN with Fictitious Dummy ID"]
    UC16["Bundle 25-Script Evaluation Packets"]
    UC17["Perform Split-Screen On-Screen Marking"]
    UC18["Audit Recalculation & Unvalued Pages"]
  end

  subgraph S5["Exam Floor Conduct & Publishing"]
    UC19["Scan Door Hall Ticket QR"]
    UC20["Proctor Hall & Reconcile Booklets"]
    UC21["Publish Tamper-Proof Grade Ledger"]
    UC22["Download Hall Ticket & Locate Seat"]
    UC23["View Online Semester Grade Card"]
  end

  %% Associations
  FAC --> UC1
  FAC --> UC2
  HOD --> UC3
  HOD --> UC4
  HOD --> UC5

  SET --> UC6
  SET --> UC7
  SET --> UC8
  CoE --> UC9

  CoE --> UC10
  CoE --> UC13
  AIE --> UC11
  AIE --> UC12

  SCN --> UC14
  SCN --> UC15
  SCN --> UC16

  EVL --> UC17
  SCR --> UC18

  INV --> UC19
  INV --> UC20

  CoE --> UC21
  STU --> UC22
  STU --> UC23

  %% Inter-dependencies
  UC10 -.->|<<include>>| UC11
  UC10 -.->|<<include>>| UC12
  UC15 -.->|<<include>>| UC16
  UC17 -.->|<<include>>| UC18
```

---

## 5. Summary Matrix: Diagram to Feature Mapping

| Diagram Type | Core Institutional Process Represented | Primary User Benefit |
| :--- | :--- | :--- |
| **Lifecycle Flowchart** | Phases 1–5: Attendance &rarr; CIE &rarr; Vault &rarr; SEE Allocation &rarr; Scanning &rarr; Valuation &rarr; Publishing | Provides administrators with complete end-to-end operational visibility. |
| **AI Allocation Engine Flowchart** | 2D Spatial Interleaving & Greedy Invigilator Workload Balancer | Explains exact mathematical anti-cheating & duty equality mechanisms. |
| **UML Class Diagram** | Complete Domain Entity Relationships, Multiplicities & Operations | Essential technical blueprint for backend developers and database architects. |
| **UML Use Case Diagram** | Actor-to-Task Interactions across all 8 Portals & Automated AI Agents | Clarifies segregation of responsibilities and permissions across roles. |
