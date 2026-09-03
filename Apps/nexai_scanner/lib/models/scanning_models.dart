class ConnectedScanningSession {
  final String sessionKey;
  final String courseCode;
  final String courseTitle;
  final String hallNumber;
  final int expectedBooklets;
  final String stationId;
  final String staffName;

  ConnectedScanningSession({
    required this.sessionKey,
    required this.courseCode,
    required this.courseTitle,
    required this.hallNumber,
    required this.expectedBooklets,
    required this.stationId,
    required this.staffName,
  });
}

class DigitizedBookletItem {
  final String id;
  final String physicalBarcode;
  final String dummyBarcode;
  final int pageCount;
  final DateTime scannedAt;
  final double ocrClarity;
  final String sha256Digest;
  final List<String> pageFilePaths;

  DigitizedBookletItem({
    required this.id,
    required this.physicalBarcode,
    required this.dummyBarcode,
    required this.pageCount,
    required this.scannedAt,
    required this.ocrClarity,
    required this.sha256Digest,
    required this.pageFilePaths,
  });
}
