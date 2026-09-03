import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>NexAI Examination System Architecture, Flowcharts & UML Models</title>
<style>
  @page {
    size: A4;
    margin: 16mm 14mm 18mm 14mm;
    @bottom-center {
      content: "Page " counter(page) " of " counter(pages);
      font-size: 8pt;
      color: #64748b;
    }
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    line-height: 1.55;
    font-size: 9.5pt;
    background: #fff;
    margin: 0;
    padding: 0;
  }

  .page-break {
    page-break-after: always;
    break-after: page;
  }

  .cover {
    background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%);
    color: white;
    padding: 30px 34px;
    border-radius: 12px;
    margin-bottom: 20px;
  }

  .cover-eyebrow {
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-weight: 700;
    color: #a5b4fc;
    margin-bottom: 6px;
  }

  .cover-title {
    font-size: 19pt;
    font-weight: 900;
    line-height: 1.25;
    margin: 0 0 10px 0;
  }

  .cover-desc {
    font-size: 9.5pt;
    color: #e0e7ff;
    max-width: 92%;
    margin: 0 0 14px 0;
  }

  .meta-grid {
    display: flex;
    gap: 20px;
    padding-top: 12px;
    border-top: 1px solid rgba(255,255,255,0.2);
    font-size: 8.5pt;
  }

  .meta-item strong {
    color: #fff;
    display: block;
  }

  .meta-item span {
    color: #c7d2fe;
  }

  h1 {
    font-size: 13.5pt;
    font-weight: 800;
    color: #0f172a;
    border-bottom: 2px solid #4338ca;
    padding-bottom: 4px;
    margin-top: 22px;
    margin-bottom: 12px;
  }

  h2 {
    font-size: 11pt;
    font-weight: 800;
    color: #1e293b;
    margin-top: 16px;
    margin-bottom: 8px;
  }

  .dashboard-card {
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    margin-bottom: 14px;
    overflow: hidden;
    page-break-inside: avoid;
  }

  .dashboard-header {
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    padding: 9px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .dashboard-title {
    font-size: 10.5pt;
    font-weight: 800;
    color: #0f172a;
  }

  .badge {
    font-size: 7pt;
    font-weight: 800;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 4px;
    letter-spacing: 0.5px;
  }

  .badge-purple { background: #ede9fe; color: #6d28d9; }
  .badge-blue { background: #e0f2fe; color: #0369a1; }
  .badge-emerald { background: #dcfce7; color: #15803d; }
  .badge-amber { background: #fef3c7; color: #b45309; }

  .dashboard-body {
    padding: 12px 14px;
  }

  .feature-list {
    margin: 0;
    padding-left: 18px;
  }

  .feature-list li {
    margin-bottom: 5px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0 16px 0;
    font-size: 8.5pt;
  }

  th {
    background: #f1f5f9;
    color: #334155;
    font-weight: 700;
    text-align: left;
    padding: 8px 10px;
    border: 1px solid #cbd5e1;
  }

  td {
    padding: 7px 10px;
    border: 1px solid #e2e8f0;
    vertical-align: top;
  }

  tr:nth-child(even) td {
    background: #fafafa;
  }

  .callout {
    background: #eef2ff;
    border-left: 4px solid #4f46e5;
    padding: 10px 14px;
    border-radius: 6px;
    margin: 12px 0;
    font-size: 8.5pt;
  }

  .callout-title {
    font-weight: 800;
    color: #3730a3;
    margin-bottom: 3px;
  }

  /* Visual Workflow & Diagram Components */
  .diagram-container {
    background: #f8fafc;
    border: 1.5px solid #cbd5e1;
    border-radius: 10px;
    padding: 16px;
    margin: 14px 0 18px 0;
    page-break-inside: avoid;
  }

  .flow-step-box {
    background: white;
    border: 1.5px solid #94a3b8;
    border-radius: 8px;
    padding: 10px 14px;
    margin-bottom: 8px;
    position: relative;
  }

  .flow-step-box.primary { border-left: 6px solid #4f46e5; }
  .flow-step-box.success { border-left: 6px solid #10b981; }
  .flow-step-box.warning { border-left: 6px solid #f59e0b; }
  .flow-step-box.danger  { border-left: 6px solid #ef4444; }

  .flow-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
  }

  .flow-title {
    font-weight: 800;
    color: #0f172a;
    font-size: 9.5pt;
  }

  .flow-actor {
    font-size: 7pt;
    font-weight: 800;
    background: #f1f5f9;
    padding: 2px 6px;
    border-radius: 4px;
    color: #475569;
  }

  .flow-desc {
    font-size: 8.2pt;
    color: #475569;
  }

  .arrow-down {
    text-align: center;
    color: #4f46e5;
    font-weight: 900;
    font-size: 11pt;
    line-height: 1;
    margin: 4px 0;
  }

  /* UML Class Card */
  .uml-class-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-top: 10px;
  }

  .uml-class-box {
    border: 1.5px solid #334155;
    border-radius: 8px;
    background: white;
    overflow: hidden;
    page-break-inside: avoid;
    font-size: 8pt;
  }

  .uml-class-header {
    background: #1e293b;
    color: white;
    padding: 6px 10px;
    font-weight: 800;
    text-align: center;
  }

  .uml-class-body {
    padding: 8px 10px;
    border-bottom: 1px solid #cbd5e1;
    background: #f8fafc;
    font-family: "Courier New", Courier, monospace;
    font-size: 7.5pt;
    line-height: 1.4;
  }

  .uml-class-methods {
    padding: 8px 10px;
    background: white;
    font-family: "Courier New", Courier, monospace;
    font-size: 7.5pt;
    line-height: 1.4;
  }

  .footer-sig {
    margin-top: 24px;
    display: flex;
    justify-content: space-between;
    border-top: 1.5px solid #cbd5e1;
    padding-top: 12px;
    font-size: 8pt;
    color: #64748b;
  }
</style>
</head>
<body>

  <!-- COVER BANNER -->
  <div class="cover">
    <div class="cover-eyebrow">Institutional Autonomous Examination Suite • Architecture Dossier</div>
    <h1 class="cover-title">NexAI Examination Management System</h1>
    <p class="cover-desc">Complete end-to-end lifecycle flow, multi-portal feature specifications, architectural flowcharts, UML class models, and use case diagrams.</p>
    <div class="meta-grid">
      <div class="meta-item">
        <strong>Document Version</strong>
        <span>v3.4 Production Spec</span>
      </div>
      <div class="meta-item">
        <strong>Authority</strong>
        <span>Office of Controller of Examinations (CoE)</span>
      </div>
      <div class="meta-item">
        <strong>Technical Scope</strong>
        <span>UML Diagrams, Flowcharts & Core Features</span>
      </div>
      <div class="meta-item">
        <strong>Security Classification</strong>
        <span>Official Academic Record</span>
      </div>
    </div>
  </div>

  <!-- SECTION 1: ARCHITECTURAL OVERVIEW -->
  <h1>1. Executive Architecture & Role Segregation</h1>
  <p>The NexAI Examination System enforces strict institutional segregation of duties between <strong>Continuous Internal Evaluation (CIE)</strong> managed locally by Academic Departments, and <strong>Semester End Examinations (SEE)</strong> conducted centrally across all branches by the Controller of Examinations (CoE).</p>

  <div class="callout">
    <div class="callout-title">Institutional Jurisdiction Mandate</div>
    <strong>Head of Department (HOD):</strong> Manages internal department assessments (CIE 1, 2, 3), 75% student attendance eligibility gates, internal faculty endorsements, and internal hall ticket release.<br/>
    <strong>Controller of Examinations (CoE):</strong> Exercises autonomous authority over all semester end examinations (SEE), inter-departmental student seating interleaving, question paper vault approval, centralized invigilator duty balancing, and degree ledger publication.
  </div>

  <!-- SECTION 2: END-TO-END WORKFLOW FLOWCHART -->
  <h1>2. Complete Examination Lifecycle Flowchart</h1>
  <p>The entire examination lifecycle operates as a 5-phase sequential pipeline with cryptographically enforced milestones:</p>

  <div class="diagram-container">
    <div class="flow-step-box primary">
      <div class="flow-header">
        <span class="flow-title">Phase 1: Continuous Assessment & Eligibility Gateway</span>
        <span class="flow-actor">Faculty & HOD</span>
      </div>
      <div class="flow-desc">Faculty marks daily batch attendance (1-click 'Mark All Present' with absentee toggles). Students below 75% are locked at the HOD Eligibility Gateway. Faculty evaluates CIE written tests on-screen. HOD endorses internal marks and generates barcoded hall tickets.</div>
    </div>

    <div class="arrow-down">&#9660;</div>

    <div class="flow-step-box warning">
      <div class="flow-header">
        <span class="flow-title">Phase 2: Confidential Question Paper Authoring & Vaulting</span>
        <span class="flow-actor">Paper Setter & CoE</span>
      </div>
      <div class="flow-desc">Internal/External paper setter authors questions with AI assistance, mapping questions to Bloom Taxonomy levels (L1–L6) and module blueprints. Paper is encrypted client-side with AES-256 and committed to decentralized IPFS storage. CoE decrypts and approves multi-set options.</div>
    </div>

    <div class="arrow-down">&#9660;</div>

    <div class="flow-step-box success">
      <div class="flow-header">
        <span class="flow-title">Phase 3: Institutional SEE Examination Scheduling (AI Engine)</span>
        <span class="flow-actor">CoE Autonomous Solver</span>
      </div>
      <div class="flow-desc">CoE specifies multi-department scope, semesters, exams per day, and time slots. AI Constraint Satisfaction engine generates 2D checkerboard student interleaving (zero adjacent same-subject desks) and equalizes invigilator duties (&sigma; &rarr; 0) with cross-department supervisor pairing.</div>
    </div>

    <div class="arrow-down">&#9660;</div>

    <div class="flow-step-box danger">
      <div class="flow-header">
        <span class="flow-title">Phase 4: Examination Conduct, Collection & Script Digitization</span>
        <span class="flow-actor">Invigilator & Scanning Officer</span>
      </div>
      <div class="flow-desc">Candidate hall tickets verified via door QR scan. Physical booklets collected and delivered to confidential scanning station. High-speed OMR/barcode scanners ingest booklets and mask USN with encrypted fictitious dummy numbers to enforce double-blind evaluation. Scripts bundled into 25-booklet digital packets.</div>
    </div>

    <div class="arrow-down">&#9660;</div>

    <div class="flow-step-box primary">
      <div class="flow-header">
        <span class="flow-title">Phase 5: Double-Blind Valuation, Scrutiny & Grade Ledger Publishing</span>
        <span class="flow-actor">Evaluator, Scrutinizer & CoE</span>
      </div>
      <div class="flow-desc">Valuators grade digitized scripts on-screen with automatic arithmetic summing. Chief Scrutinizer runs unvalued-question detection and recalculation audits (scripts with >15% variance routed to third valuation). CoE locks the immutable grade ledger, and students access digital grade cards.</div>
    </div>
  </div>

  <!-- SECTION 3: AI ALLOCATION ALGORITHM FLOWCHART -->
  <div class="page-break"></div>
  <h1>3. AI Seating & Equal Invigilation Engine Flowchart</h1>
  <p>The mathematical optimization model resolving 2D bench interleaving and faculty workload equalization:</p>

  <div class="diagram-container">
    <div style="font-size: 8.5pt; line-height: 1.6;">
      <div style="background: white; border: 1.5px solid #0284c7; border-radius: 8px; padding: 10px; margin-bottom: 8px;">
        <strong>Step 1: Input & Queue Aggregation</strong><br/>
        Load selected departments (e.g. CSE, ECE, ME, CV, AIML), active semesters, and room capacities. Separate students flagged with mobility accommodations (PWD) for ground-floor hall routing.
      </div>
      <div class="arrow-down">&#9660;</div>

      <div style="background: white; border: 1.5px solid #0284c7; border-radius: 8px; padding: 10px; margin-bottom: 8px;">
        <strong>Step 2: Room Capacity Allocation & 5% Emergency Buffer</strong><br/>
        Sort rooms by Floor (Floor 0 ground floor prioritized for PWD) and capacity. Deduct 5% buffer seats from each hall for emergency scribes/late admissions.
      </div>
      <div class="arrow-down">&#9660;</div>

      <div style="background: white; border: 1.5px solid #7c3aed; border-radius: 8px; padding: 10px; margin-bottom: 8px;">
        <strong>Step 3: 2D Spatial Orthogonal Interleaving (Anti-Cheating Core)</strong><br/>
        Pop candidates in round-robin sequence across departments (CSE &rarr; ECE &rarr; ME &rarr; CV &rarr; AIML). Check horizontal neighbor [Row, Col-1] and vertical neighbor [Row-1, Col]. If conflict detected, swap with candidate from alternate department queue until Interleaving Purity reaches &gt;99%.
      </div>
      <div class="arrow-down">&#9660;</div>

      <div style="background: white; border: 1.5px solid #10b981; border-radius: 8px; padding: 10px; margin-bottom: 8px;">
        <strong>Step 4: Equal-Workload Invigilator Duty Balancer</strong><br/>
        Calculate target duty quota: <em>Target = &lceil; TotalRoomSlots / ActiveFaculty &rceil;</em>. Sort faculty by cumulative duties ascending. Assign Chief Invigilator to each hall. If room capacity &gt; 35, assign a Reliever.
      </div>
      <div class="arrow-down">&#9660;</div>

      <div style="background: white; border: 1.5px solid #10b981; border-radius: 8px; padding: 10px; margin-bottom: 8px;">
        <strong>Step 5: Anti-Bias & Department Conflict Verification</strong><br/>
        Verify that no faculty member is the sole supervisor in a room dominated by their own department. Swap invigilators between rooms if conflict occurs. Verify duty variance approaches zero (&sigma; &lt; 0.5).
      </div>
      <div class="arrow-down">&#9660;</div>

      <div style="background: #f0fdf4; border: 2px solid #16a34a; border-radius: 8px; padding: 10px; text-align: center; font-weight: 800; color: #15803d;">
        Output: Interleaved Room Blueprints • Duty Roster • Official Printable Notice Board Notices
      </div>
    </div>
  </div>

  <!-- SECTION 4: UML CLASS DIAGRAMS -->
  <div class="page-break"></div>
  <h1>4. Comprehensive UML Class Model (Domain Entities & Methods)</h1>
  <p>Structural object model capturing primary domain entities, relationships, attributes, and operations:</p>

  <div class="uml-class-grid">
    <!-- User & Role Hierarchy -->
    <div class="uml-class-box">
      <div class="uml-class-header">User &lt;&lt;Abstract Base&gt;&gt;</div>
      <div class="uml-class-body">
        - id: UUID<br/>
        - fullName: String<br/>
        - email: String<br/>
        - role: RoleEnum<br/>
        - isActive: Boolean
      </div>
      <div class="uml-class-methods">
        + login(credentials): Token<br/>
        + resetPassword(): Boolean
      </div>
    </div>

    <div class="uml-class-box">
      <div class="uml-class-header">ChiefSuperintendent : User</div>
      <div class="uml-class-body">
        - officeRoom: String<br/>
        - institutionalSignature: Blob
      </div>
      <div class="uml-class-methods">
        + approveQuestionPaper(paperId)<br/>
        + runAIAllocationEngine(config)<br/>
        + publishGradeLedger(sessionId)<br/>
        + provisionOfficerAccount(data)
      </div>
    </div>

    <div class="uml-class-box">
      <div class="uml-class-header">HeadOfDepartment : User</div>
      <div class="uml-class-body">
        - departmentCode: String<br/>
        - condonationQuota: Integer
      </div>
      <div class="uml-class-methods">
        + enforceAttendanceCutoff(75%)<br/>
        + endorseCIEMarks(courseId)<br/>
        + releaseHallTickets(semester)
      </div>
    </div>

    <div class="uml-class-box">
      <div class="uml-class-header">Faculty : User</div>
      <div class="uml-class-body">
        - designation: String<br/>
        - historicalDutyCount: Integer<br/>
        - currentCycleDuties: Integer
      </div>
      <div class="uml-class-methods">
        + recordDailyAttendance(date, usns)<br/>
        + evaluateCIEScript(scriptId, rubric)<br/>
        + submitCIEMarks(courseId)
      </div>
    </div>

    <!-- SEE Scheduling & Seating -->
    <div class="uml-class-box">
      <div class="uml-class-header">ExamSession</div>
      <div class="uml-class-body">
        - sessionId: String<br/>
        - sessionName: String<br/>
        - examType: SEE_REGULAR | SUPPLE<br/>
        - examDate: Date<br/>
        - timeSlot: TimeSlot
      </div>
      <div class="uml-class-methods">
        + calculateTotalCandidates(): Int<br/>
        + lockSchedule(): Void
      </div>
    </div>

    <div class="uml-class-box">
      <div class="uml-class-header">ExamHall</div>
      <div class="uml-class-body">
        - hallId: String<br/>
        - roomNumber: String<br/>
        - building: String<br/>
        - floor: Integer (0 = PWD)<br/>
        - capacity: Integer<br/>
        - cols: Integer
      </div>
      <div class="uml-class-methods">
        + getAvailableBuffer(): Integer<br/>
        + assignInvigilatorPair(c, r)
      </div>
    </div>

    <div class="uml-class-box">
      <div class="uml-class-header">SeatedCandidate</div>
      <div class="uml-class-body">
        - seatIndex: Integer<br/>
        - benchNumber: Integer<br/>
        - usn: String<br/>
        - department: String<br/>
        - subjectCode: String<br/>
        - isSpecialAccommodated: Boolean
      </div>
      <div class="uml-class-methods">
        + verifyAdjacency(neighbor): Bool
      </div>
    </div>

    <div class="uml-class-box">
      <div class="uml-class-header">InvigilationDuty</div>
      <div class="uml-class-body">
        - dutyId: String<br/>
        - hallId: String<br/>
        - facultyId: String<br/>
        - role: CHIEF | RELIEVER<br/>
        - isCrossPaired: Boolean
      </div>
      <div class="uml-class-methods">
        + confirmReporting(): Void<br/>
        + recordIncident(details): Void
      </div>
    </div>

    <!-- Post-Exam Valuation -->
    <div class="uml-class-box">
      <div class="uml-class-header">DigitizedScript</div>
      <div class="uml-class-body">
        - dummyNumber: String (Masked)<br/>
        - scriptPdfUri: String<br/>
        - status: SCANNED | VALUED<br/>
        - totalEvaluatorMarks: Float<br/>
        - finalModeratedMarks: Float
      </div>
      <div class="uml-class-methods">
        + addAnnotation(page, coords)<br/>
        + computeBestOfChoice(): Float
      </div>
    </div>

    <div class="uml-class-box">
      <div class="uml-class-header">ScrutinyAuditLog</div>
      <div class="uml-class-body">
        - auditId: String<br/>
        - dummyNumber: String<br/>
        - unvaluedPagesDetected: Integer<br/>
        - arithmeticDiscrepancy: Float<br/>
        - status: PASSED | ESCALATED
      </div>
      <div class="uml-class-methods">
        + verifyPageIntegrity(): Bool<br/>
        + approveForLedger(): Void
      </div>
    </div>
  </div>

  <!-- SECTION 5: USE CASE DIAGRAM MATRIX -->
  <div class="page-break"></div>
  <h1>5. UML Use Case Model (Actor Interactions & Permissions)</h1>
  <p>Matrix representation of actors, subsystems, and operational use cases across the institutional platform:</p>

  <table>
    <thead>
      <tr>
        <th style="width: 22%;">Actor</th>
        <th style="width: 48%;">Primary Operational Use Cases</th>
        <th style="width: 30%;">Included / Extended Use Cases</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Controller of Examinations (CoE)</strong></td>
        <td>
          &bull; Define SEE Multi-Department Scope & Calendar<br/>
          &bull; Execute AI Seating Interleaving & Invigilator Balancer<br/>
          &bull; Approve Encrypted Question Papers from Vault<br/>
          &bull; Provision Officer Credentials (HOD, Scrutinizer, Scanning)<br/>
          &bull; Lock & Publish Immutable Grade Ledger
        </td>
        <td>
          <em>&lt;&lt;include&gt;&gt;</em> 2D Anti-Cheating Check<br/>
          <em>&lt;&lt;include&gt;&gt;</em> Duty Equalizer (&sigma; &rarr; 0)<br/>
          <em>&lt;&lt;extend&gt;&gt;</em> Emergency Re-allocation
        </td>
      </tr>
      <tr>
        <td><strong>Head of Department (HOD)</strong></td>
        <td>
          &bull; Schedule Department Internal Assessments (CIE)<br/>
          &bull; Enforce 75% Attendance Eligibility Cutoff<br/>
          &bull; Endorse Department Internal Marks<br/>
          &bull; Release Barcoded Student Hall Tickets
        </td>
        <td>
          <em>&lt;&lt;extend&gt;&gt;</em> Medical Condonation Override<br/>
          <em>&lt;&lt;include&gt;&gt;</em> Fee Clearance Validation
        </td>
      </tr>
      <tr>
        <td><strong>Faculty Instructor</strong></td>
        <td>
          &bull; Record Daily Batch Attendance (Absentee toggle)<br/>
          &bull; Conduct & Grade CIE Internal Written Tests<br/>
          &bull; Annotate Scripts on Digital Correction Studio<br/>
          &bull; Submit CIE Marks to HOD for Endorsement
        </td>
        <td>
          <em>&lt;&lt;include&gt;&gt;</em> Bloom Taxonomy Rubrics<br/>
          <em>&lt;&lt;include&gt;&gt;</em> CO-PO Attainment Calculation
        </td>
      </tr>
      <tr>
        <td><strong>Confidential Paper Setter</strong></td>
        <td>
          &bull; Generate Questions via AI Assistant<br/>
          &bull; Map Questions to Bloom Taxonomy (L1–L6)<br/>
          &bull; Validate 20-mark Module Choice Blueprint<br/>
          &bull; Encrypt with AES-256 and Commit to IPFS Vault
        </td>
        <td>
          <em>&lt;&lt;include&gt;&gt;</em> Scheme Compliance Check<br/>
          <em>&lt;&lt;include&gt;&gt;</em> Client-Side Key Generation
        </td>
      </tr>
      <tr>
        <td><strong>Scanning Officer</strong></td>
        <td>
          &bull; Ingest Physical Answer Booklets via Barcode / OMR<br/>
          &bull; Mask USN & Identity with Fictitious Dummy Number<br/>
          &bull; Split & Bundle 25-Script Evaluator Packets
        </td>
        <td>
          <em>&lt;&lt;include&gt;&gt;</em> Double-Blind Cryptographic Mask<br/>
          <em>&lt;&lt;extend&gt;&gt;</em> Rescan Corrupted Page
        </td>
      </tr>
      <tr>
        <td><strong>Evaluator (Valuator)</strong></td>
        <td>
          &bull; Perform Split-Screen On-Screen Script Valuation<br/>
          &bull; Apply Checkmarks, Crosses, Underlines & Remarks<br/>
          &bull; Enter Question-wise Scores with Automated Summation
        </td>
        <td>
          <em>&lt;&lt;include&gt;&gt;</em> Anti-Skipping Validation<br/>
          <em>&lt;&lt;include&gt;&gt;</em> Best-of-Choice Calculation
        </td>
      </tr>
      <tr>
        <td><strong>Chief Scrutinizer</strong></td>
        <td>
          &bull; Audit Completed Valuation Packets<br/>
          &bull; Run Automated Unvalued Question & Page Scan<br/>
          &bull; Verify Arithmetic Summation & Section Totals<br/>
          &bull; Escalate Valuation Variance (>15%) to 3rd Valuation
        </td>
        <td>
          <em>&lt;&lt;extend&gt;&gt;</em> Return to Valuator for Query<br/>
          <em>&lt;&lt;include&gt;&gt;</em> Audit Ledger Logging
        </td>
      </tr>
      <tr>
        <td><strong>Invigilator Proctor</strong></td>
        <td>
          &bull; Scan Candidate Hall Ticket QR Code at Door<br/>
          &bull; Verify Interleaved Seating Compliance<br/>
          &bull; Reconcile Physical Answer Booklets Count
        </td>
        <td>
          <em>&lt;&lt;extend&gt;&gt;</em> Malpractice Incident Report<br/>
          <em>&lt;&lt;include&gt;&gt;</em> Digital Attendance Lock
        </td>
      </tr>
      <tr>
        <td><strong>Student Candidate</strong></td>
        <td>
          &bull; Download Digitally Signed Hall Ticket with QR<br/>
          &bull; Locate Assigned Hall, Desk & Bench in Real-time<br/>
          &bull; View Continuous Attendance & CIE Score Cards<br/>
          &bull; Access Final Semester End Examination Grade Sheet
        </td>
        <td>
          <em>&lt;&lt;extend&gt;&gt;</em> Revaluation Application
        </td>
      </tr>
    </tbody>
  </table>

  <!-- SECTION 6: MALPRACTICE PREVENTION MATRIX -->
  <h1>6. Comprehensive Anti-Malpractice Security Matrix</h1>
  <table>
    <thead>
      <tr>
        <th style="width: 30%;">Vulnerability / Risk</th>
        <th style="width: 40%;">System Safeguard in NexAI</th>
        <th style="width: 30%;">Responsible Portal</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Copying from Adjacent Desks</td>
        <td>Multi-Department 2D Matrix Interleaved Seating</td>
        <td>CoE AI Allocation Engine</td>
      </tr>
      <tr>
        <td>Evaluator Favoritism / Bias</td>
        <td>Double-Blind Barcode Masking (Fictitious Dummy Numbering)</td>
        <td>Scanning Officer & Evaluator</td>
      </tr>
      <tr>
        <td>Un-evaluated Questions & Calculation Errors</td>
        <td>Digital On-Screen Valuation Studio with Automated Page Audit</td>
        <td>Evaluator & Scrutinizer</td>
      </tr>
      <tr>
        <td>Unequal Faculty Duty Allocation</td>
        <td>Min-Variance Workload Equalizer Algorithm (&sigma; &rarr; 0)</td>
        <td>CoE Invigilator Balancer</td>
      </tr>
      <tr>
        <td>Impersonation & Hall Ticket Fraud</td>
        <td>Encrypted QR Code Hall Ticket Verification at Exam Door</td>
        <td>HOD Gateway & Mobile App</td>
      </tr>
      <tr>
        <td>Question Paper Leaks Prior to Exam</td>
        <td>Client-Side AES-256 Encryption & Decentralized IPFS Storage</td>
        <td>Paper Setter & CoE Vault</td>
      </tr>
    </tbody>
  </table>

  <div class="footer-sig">
    <div>
      <strong>NexAI Autonomous Examination Suite</strong><br/>
      Enterprise Documentation Reference: NEXAI/SPEC/2026-27/EXAM-FULL
    </div>
    <div style="text-align: right;">
      <strong>Office of the Controller of Examinations</strong><br/>
      System Architecture & Institutional Quality Directorate
    </div>
  </div>

</body>
</html>
"""

html_path = r"c:\Users\yashy\NexAi\NexAI_Complete_Examination_System_Architecture_and_Features.html"
pdf_path = r"c:\Users\yashy\NexAi\NexAI_Complete_Examination_System_Architecture_and_Features.pdf"

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Wrote HTML to {html_path}")

# Run headless Edge to print to PDF
edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cmd = [
    edge_path,
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    "--run-all-compositor-stages-before-draw",
    f"--print-to-pdf={pdf_path}",
    html_path,
]

result = subprocess.run(cmd, capture_output=True, text=True)
print(f"Edge conversion return code: {result.returncode}")
if os.path.exists(pdf_path):
    print(f"Successfully generated PDF at: {pdf_path} (Size: {os.path.getsize(pdf_path)} bytes)")
else:
    print("PDF generation failed, check output:")
    print(result.stderr)
