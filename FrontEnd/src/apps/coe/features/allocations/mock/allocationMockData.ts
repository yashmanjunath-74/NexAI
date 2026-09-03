import { Department, SubjectExam, ExamHall, FacultyInvigilator, TimeSlot } from '../types/allocationTypes';

export const MOCK_DEPARTMENTS: Department[] = [
  { code: 'CSE', name: 'Computer Science & Engineering', color: '#8b5cf6', prefix: '1RV24CS', hodName: 'Dr. Ramesh Kumar' },
  { code: 'ECE', name: 'Electronics & Communication', color: '#14b8a6', prefix: '1RV24EC', hodName: 'Dr. Sunita Sharma' },
  { code: 'ME',  name: 'Mechanical Engineering', color: '#f59e0b', prefix: '1RV24ME', hodName: 'Dr. Anand Patil' },
  { code: 'CV',  name: 'Civil Engineering', color: '#ec4899', prefix: '1RV24CV', hodName: 'Dr. Radhika Rao' },
  { code: 'AIML', name: 'Artificial Intelligence & ML', color: '#3b82f6', prefix: '1RV24AI', hodName: 'Dr. Vikram Chandra' },
  { code: 'ISE', name: 'Information Science & Engineering', color: '#10b981', prefix: '1RV24IS', hodName: 'Dr. Deepa Nair' },
];

export const MOCK_TIME_SLOTS: TimeSlot[] = [
  {
    id: 'SLOT_M1',
    name: 'Morning Forenoon Slot (M1)',
    startTime: '09:30 AM',
    endTime: '12:30 PM',
    sessionPeriod: 'FORENOON',
  },
  {
    id: 'SLOT_A1',
    name: 'Afternoon Post-Meridiem Slot (A1)',
    startTime: '02:00 PM',
    endTime: '05:00 PM',
    sessionPeriod: 'AFTERNOON',
  },
];

export const MOCK_ALL_SUBJECTS: SubjectExam[] = [
  // Semester 3 Subjects
  { code: 'CS301', title: 'Operating Systems & System Calls', deptCode: 'CSE', semester: 3, credits: 4, eligibleStudents: 110, color: '#8b5cf6' },
  { code: 'EC301', title: 'Signals, Systems & DSP Foundation', deptCode: 'ECE', semester: 3, credits: 4, eligibleStudents: 95, color: '#14b8a6' },
  { code: 'ME301', title: 'Applied Thermodynamics & Heat Flow', deptCode: 'ME', semester: 3, credits: 4, eligibleStudents: 85, color: '#f59e0b' },
  { code: 'CV301', title: 'Structural Analysis & Mechanics', deptCode: 'CV', semester: 3, credits: 4, eligibleStudents: 75, color: '#ec4899' },
  { code: 'AI301', title: 'Deep Neural Networks & Representation', deptCode: 'AIML', semester: 3, credits: 4, eligibleStudents: 90, color: '#3b82f6' },
  { code: 'IS301', title: 'Relational Database Architecture & SQL', deptCode: 'ISE', semester: 3, credits: 4, eligibleStudents: 80, color: '#10b981' },

  // Semester 5 Subjects
  { code: 'CS501', title: 'Computer Networks & Protocols', deptCode: 'CSE', semester: 5, credits: 4, eligibleStudents: 105, color: '#8b5cf6' },
  { code: 'EC501', title: 'VLSI Design & CMOS Circuitry', deptCode: 'ECE', semester: 5, credits: 4, eligibleStudents: 90, color: '#14b8a6' },
  { code: 'ME501', title: 'Fluid Dynamics & Turbo Machinery', deptCode: 'ME', semester: 5, credits: 4, eligibleStudents: 70, color: '#f59e0b' },
  { code: 'CV501', title: 'Geotechnical Engineering & Foundations', deptCode: 'CV', semester: 5, credits: 4, eligibleStudents: 65, color: '#ec4899' },
  { code: 'AI501', title: 'Natural Language Processing & Transformers', deptCode: 'AIML', semester: 5, credits: 4, eligibleStudents: 85, color: '#3b82f6' },
  { code: 'IS501', title: 'Cloud Architecture & Distributed Systems', deptCode: 'ISE', semester: 5, credits: 4, eligibleStudents: 80, color: '#10b981' },

  // Semester 7 Subjects
  { code: 'CS701', title: 'Compiler Construction & Code Gen', deptCode: 'CSE', semester: 7, credits: 3, eligibleStudents: 100, color: '#8b5cf6' },
  { code: 'EC701', title: 'Wireless & Optical Communications', deptCode: 'ECE', semester: 7, credits: 3, eligibleStudents: 85, color: '#14b8a6' },
  { code: 'ME701', title: 'CAD/CAM Robotics & Automation', deptCode: 'ME', semester: 7, credits: 3, eligibleStudents: 60, color: '#f59e0b' },
  { code: 'CV701', title: 'Transportation & Highway Engineering', deptCode: 'CV', semester: 7, credits: 3, eligibleStudents: 60, color: '#ec4899' },
  { code: 'AI701', title: 'Reinforcement Learning & Multi-Agent AI', deptCode: 'AIML', semester: 7, credits: 3, eligibleStudents: 75, color: '#3b82f6' },
  { code: 'IS701', title: 'Information Security & Cryptography', deptCode: 'ISE', semester: 7, credits: 3, eligibleStudents: 70, color: '#10b981' },

  // Common Mathematics & Engineering Core
  { code: 'MA101', title: 'Calculus, Linear Algebra & Transforms', deptCode: 'CSE', semester: 1, credits: 4, eligibleStudents: 180, color: '#48977f' },
  { code: 'MA201', title: 'Probability, Statistics & Complex Analysis', deptCode: 'ECE', semester: 2, credits: 4, eligibleStudents: 160, color: '#f59e0b' },
];

export const MOCK_EXAM_HALLS: ExamHall[] = [
  { id: 'H1', roomNumber: 'A-101', building: 'Main Academic Block', floor: 0, capacity: 60, cols: 8, hasAisle: true, isAccessiblePWD: true, blockCode: 'MAIN' },
  { id: 'H2', roomNumber: 'A-102', building: 'Main Academic Block', floor: 0, capacity: 40, cols: 6, hasAisle: true, isAccessiblePWD: true, blockCode: 'MAIN' },
  { id: 'H3', roomNumber: 'A-201', building: 'Main Academic Block', floor: 1, capacity: 50, cols: 8, hasAisle: true, isAccessiblePWD: false, blockCode: 'MAIN' },
  { id: 'H4', roomNumber: 'B-101', building: 'Science & Tech Wing', floor: 0, capacity: 60, cols: 8, hasAisle: true, isAccessiblePWD: true, blockCode: 'SCI' },
  { id: 'H5', roomNumber: 'B-205', building: 'Science & Tech Wing', floor: 1, capacity: 40, cols: 6, hasAisle: true, isAccessiblePWD: false, blockCode: 'SCI' },
  { id: 'H6', roomNumber: 'C-301', building: 'South Academic Wing', floor: 2, capacity: 50, cols: 8, hasAisle: true, isAccessiblePWD: false, blockCode: 'SOUTH' },
  { id: 'H7', roomNumber: 'C-302', building: 'South Academic Wing', floor: 2, capacity: 40, cols: 6, hasAisle: true, isAccessiblePWD: false, blockCode: 'SOUTH' },
  { id: 'H8', roomNumber: 'LH-01', building: 'Grand Auditorium Complex', floor: 0, capacity: 80, cols: 10, hasAisle: true, isAccessiblePWD: true, blockCode: 'AUDI' },
];

export const MOCK_FACULTY_ROSTER: FacultyInvigilator[] = [
  { id: 'FAC_01', name: 'Dr. Alan Turing', department: 'CSE', designation: 'Professor', email: 'a.turing@univ.edu', phone: '+91 98451 10001', historicalDutyCount: 4, currentCycleDuties: 1, maxDutyQuota: 5, isAvailable: true },
  { id: 'FAC_02', name: 'Dr. Grace Hopper', department: 'CSE', designation: 'Associate Professor', email: 'g.hopper@univ.edu', phone: '+91 98451 10002', historicalDutyCount: 2, currentCycleDuties: 0, maxDutyQuota: 5, isAvailable: true },
  { id: 'FAC_03', name: 'Dr. Claude Shannon', department: 'ECE', designation: 'Professor', email: 'c.shannon@univ.edu', phone: '+91 98451 10003', historicalDutyCount: 5, currentCycleDuties: 1, maxDutyQuota: 5, isAvailable: true },
  { id: 'FAC_04', name: 'Dr. Nikola Tesla', department: 'ECE', designation: 'Assistant Professor', email: 'n.tesla@univ.edu', phone: '+91 98451 10004', historicalDutyCount: 1, currentCycleDuties: 0, maxDutyQuota: 5, isAvailable: true },
  { id: 'FAC_05', name: 'Dr. James Watt', department: 'ME', designation: 'Associate Professor', email: 'j.watt@univ.edu', phone: '+91 98451 10005', historicalDutyCount: 3, currentCycleDuties: 1, maxDutyQuota: 5, isAvailable: true },
  { id: 'FAC_06', name: 'Dr. Rudolf Diesel', department: 'ME', designation: 'Assistant Professor', email: 'r.diesel@univ.edu', phone: '+91 98451 10006', historicalDutyCount: 2, currentCycleDuties: 0, maxDutyQuota: 5, isAvailable: true },
  { id: 'FAC_07', name: 'Dr. M. Visvesvaraya', department: 'CV', designation: 'Professor', email: 'm.visvesvaraya@univ.edu', phone: '+91 98451 10007', historicalDutyCount: 4, currentCycleDuties: 1, maxDutyQuota: 5, isAvailable: true },
  { id: 'FAC_08', name: 'Dr. Arthur Casagrande', department: 'CV', designation: 'Associate Professor', email: 'a.casagrande@univ.edu', phone: '+91 98451 10008', historicalDutyCount: 1, currentCycleDuties: 0, maxDutyQuota: 5, isAvailable: true },
  { id: 'FAC_09', name: 'Dr. Geoffrey Hinton', department: 'AIML', designation: 'Professor', email: 'g.hinton@univ.edu', phone: '+91 98451 10009', historicalDutyCount: 3, currentCycleDuties: 1, maxDutyQuota: 5, isAvailable: true },
  { id: 'FAC_10', name: 'Dr. Yann LeCun', department: 'AIML', designation: 'Associate Professor', email: 'y.lecun@univ.edu', phone: '+91 98451 10010', historicalDutyCount: 2, currentCycleDuties: 0, maxDutyQuota: 5, isAvailable: true },
  { id: 'FAC_11', name: 'Dr. Tim Berners-Lee', department: 'ISE', designation: 'Professor', email: 't.berners@univ.edu', phone: '+91 98451 10011', historicalDutyCount: 4, currentCycleDuties: 1, maxDutyQuota: 5, isAvailable: true },
  { id: 'FAC_12', name: 'Dr. Ada Lovelace', department: 'ISE', designation: 'Assistant Professor', email: 'a.lovelace@univ.edu', phone: '+91 98451 10012', historicalDutyCount: 1, currentCycleDuties: 0, maxDutyQuota: 5, isAvailable: true },
];

export const FIRST_NAMES = [
  'Aarav', 'Priya', 'Rohan', 'Ananya', 'Vikram', 'Sneha', 'Aditya', 'Divya',
  'Kartik', 'Meera', 'Rahul', 'Pooja', 'Kiran', 'Tanvi', 'Sanjay', 'Lakshmi',
  'Vivek', 'Neha', 'Arjun', 'Isha', 'Varun', 'Swati', 'Gautam', 'Kavya',
  'Harish', 'Bhavna', 'Pranav', 'Shreya', 'Naveen', 'Ritu',
];

export const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Reddy', 'Kumar', 'Singh', 'Nair', 'Mehta',
  'Joshi', 'Iyer', 'Gupta', 'Tiwari', 'Das', 'Shah', 'Rao', 'Bhat',
  'Kulkarni', 'Deshmukh', 'Chauhan', 'Nambiar',
];
