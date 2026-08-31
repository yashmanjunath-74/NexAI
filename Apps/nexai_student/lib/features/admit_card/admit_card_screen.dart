import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:qr_flutter/qr_flutter.dart';
import '../../core/theme/app_theme.dart';
import '../../mock_data.dart';

class AdmitCardScreen extends StatelessWidget {
  const AdmitCardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final student = mockStudentProfile;
    final activeExam = mockExamSchedule.first;

    return Scaffold(
      backgroundColor: AppTheme.bgBase,
      appBar: AppBar(
        title: const Text('Digital Hall Ticket'),
        actions: [
          IconButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  backgroundColor: AppTheme.primaryDark,
                  content: Text('✓ Hall Ticket PDF downloaded to device storage'),
                ),
              );
            },
            icon: const Icon(Icons.download_rounded, color: AppTheme.primary),
            tooltip: 'Download PDF',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.only(left: 20, right: 20, top: 20, bottom: 96),
        child: Column(
          children: [
            // Certified Hall Ticket Card
            Container(
              width: double.infinity,
              decoration: BoxDecoration(
                color: AppTheme.bgSurface,
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: AppTheme.cardBorder, width: 1.5),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.06),
                    blurRadius: 16,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                children: [
                  // Top University Ribbon
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'NEXAI AUTONOMOUS UNIVERSITY',
                              style: GoogleFonts.inter(
                                color: Colors.white,
                                fontWeight: FontWeight.w900,
                                fontSize: 11,
                                letterSpacing: 1,
                              ),
                            ),
                            const Text(
                              'END-SEMESTER EXAM HALL TICKET',
                              style: TextStyle(color: Color(0xFF4ADE80), fontWeight: FontWeight.w700, fontSize: 11),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppTheme.accentGreen.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: AppTheme.accentGreen.withValues(alpha: 0.5)),
                          ),
                          child: const Text('VERIFIED ✓', style: TextStyle(color: Color(0xFF4ADE80), fontWeight: FontWeight.w800, fontSize: 10)),
                        ),
                      ],
                    ),
                  ),

                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        // Candidate Bio
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            CircleAvatar(
                              radius: 30,
                              backgroundColor: AppTheme.primary,
                              child: Text(
                                student.avatarInitials,
                                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 20),
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    student.fullName,
                                    style: GoogleFonts.inter(fontWeight: FontWeight.w800, fontSize: 16),
                                  ),
                                  Text(
                                    'USN: ${student.usn}',
                                    style: const TextStyle(fontWeight: FontWeight.w700, color: AppTheme.accentBlue, fontSize: 13),
                                  ),
                                  Text(
                                    '${student.program} • ${student.semester}',
                                    style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 20),
                        const Divider(height: 1),
                        const SizedBox(height: 20),

                        // High-Density QR Gate Pass
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF8FAFC),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: AppTheme.cardBorder),
                          ),
                          child: Column(
                            children: [
                              QrImageView(
                                data: activeExam.qrPayload,
                                version: QrVersions.auto,
                                size: 160.0,
                                eyeStyle: const QrEyeStyle(
                                  eyeShape: QrEyeShape.square,
                                  color: Color(0xFF0F172A),
                                ),
                              ),
                              const SizedBox(height: 8),
                              const Text(
                                'Scan at Gate for Instant Biometric Verification',
                                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: AppTheme.textSecondary),
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(height: 20),

                        // Designated Seat Radar Card
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryLight,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: AppTheme.primary.withValues(alpha: 0.3)),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Row(
                                children: [
                                  Icon(Icons.location_on, color: AppTheme.primaryDark, size: 18),
                                  SizedBox(width: 6),
                                  Text('Allocated Examination Desk:', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12, color: AppTheme.primaryDark)),
                                ],
                              ),
                              const SizedBox(height: 10),
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(activeExam.hallNumber, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13)),
                                      Text(activeExam.timeSlot, style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
                                    ],
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                    decoration: BoxDecoration(
                                      color: AppTheme.primary,
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Text(
                                      activeExam.deskNumber,
                                      style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 14),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(height: 20),

                        // Registered Courses Table
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('Registered Examination Timetable:', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12)),
                            const SizedBox(height: 10),
                            ...mockExamSchedule.map((exam) {
                              return Container(
                                margin: const EdgeInsets.only(bottom: 8),
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: AppTheme.bgBase,
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(color: AppTheme.cardBorder),
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Text('${exam.courseCode}: ${exam.courseTitle}', style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12)),
                                        Text('${exam.examDate} • ${exam.timeSlot}', style: const TextStyle(fontSize: 10, color: AppTheme.textSecondary)),
                                      ],
                                    ),
                                    Text(exam.deskNumber, style: const TextStyle(fontWeight: FontWeight.w800, color: AppTheme.accentBlue, fontSize: 11)),
                                  ],
                                ),
                              );
                            }),
                          ],
                        ),

                        const SizedBox(height: 20),

                        // Digital Signatures
                        const Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('[DIGITALLY VERIFIED]', style: TextStyle(color: AppTheme.accentGreen, fontSize: 9, fontWeight: FontWeight.w800)),
                                Text('HOD Signature', style: TextStyle(fontSize: 10, color: AppTheme.textSecondary)),
                              ],
                            ),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text('[COE APPROVED]', style: TextStyle(color: AppTheme.accentBlue, fontSize: 9, fontWeight: FontWeight.w800)),
                                Text('Controller of Exams', style: TextStyle(fontSize: 10, color: AppTheme.textSecondary)),
                              ],
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
