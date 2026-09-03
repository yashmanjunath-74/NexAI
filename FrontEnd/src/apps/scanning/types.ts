export type SessionStatus = 
  | 'PENDING_KEY' 
  | 'KEY_GENERATED' 
  | 'STAFF_CONNECTED' 
  | 'SCANNING_IN_PROGRESS' 
  | 'RECONCILING' 
  | 'COMPLETED' 
  | 'VAULTED';

export interface ExamHallPacket {
  id: string;
  courseCode: string;
  courseTitle: string;
  hallNumber: string;
  slot: string;
  date: string;
  expectedBooklets: number;
  digitizedBooklets: number;
  totalScannedPages: number;
  sessionKey?: string;
  assignedStationId?: string;
  assignedStaffName?: string;
  status: SessionStatus;
  keyGeneratedAt?: string;
}

export interface ScannedBooklet {
  id: string;
  packetId: string;
  physicalBarcode: string;
  dummyBarcode: string;
  pageCount: number;
  scannedAt: string;
  scannedByStaff: string;
  stationId: string;
  ocrConfidence: number; // e.g. 98.6
  sha256Hash: string;
  status: 'VERIFIED' | 'FLAGGED_BLUR' | 'PENDING_REVIEW';
  pageUrls: string[];
}
