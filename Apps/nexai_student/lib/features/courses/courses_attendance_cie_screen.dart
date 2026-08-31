import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../models/student_models.dart';
import '../../mock_data.dart';

class CoursesAttendanceCieScreen extends StatefulWidget {
  const CoursesAttendanceCieScreen({super.key});

  @override
  State<CoursesAttendanceCieScreen> createState() => _CoursesAttendanceCieScreenState();
}

class _CoursesAttendanceCieScreenState extends State<CoursesAttendanceCieScreen> {
  String _selectedFilter = 'ALL';
  late List<CourseAttendanceCieItem> _courses;

  @override
  void initState() {
    super.initState();
    _courses = mockRegisteredCourses;
  }

  void _openCourseDetailsModal(CourseAttendanceCieItem course) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.85,
        decoration: const BoxDecoration(
          color: AppTheme.bgSurface,
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
        child: Column(
          children: [
            Container(
              margin: const EdgeInsets.only(top: 12),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${course.courseCode}: ${course.courseTitle}',
                          style: GoogleFonts.inter(fontWeight: FontWeight.w800, fontSize: 16),
                        ),
                        Text(
                          'Instructor: ${course.facultyName}',
                          style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close),
                  ),
                ],
              ),
            ),
            const Divider(height: 1),

            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Attendance Deep Dive
                    Text('Attendance Analytics & Bunk Buffer', style: GoogleFonts.inter(fontWeight: FontWeight.w800, fontSize: 14)),
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppTheme.bgBase,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppTheme.cardBorder),
                      ),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text('Classes Attended: ${course.attendedClasses} / ${course.totalClasses}', style: const TextStyle(fontWeight: FontWeight.w700)),
                              Text('${course.attendancePercentage.toStringAsFixed(1)}%', style: const TextStyle(fontWeight: FontWeight.w900, color: AppTheme.accentGreen, fontSize: 16)),
                            ],
                          ),
                          const SizedBox(height: 10),
                          LinearProgressIndicator(
                            value: course.attendancePercentage / 100,
                            backgroundColor: Colors.grey.shade200,
                            valueColor: AlwaysStoppedAnimation<Color>(
                              course.attendancePercentage >= 85 ? AppTheme.accentGreen : (course.attendancePercentage >= 75 ? AppTheme.accentAmber : AppTheme.accentRed),
                            ),
                            minHeight: 8,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          const SizedBox(height: 12),
                          const Row(
                            children: [
                              Icon(Icons.verified, color: AppTheme.accentGreen, size: 16),
                              SizedBox(width: 6),
                              Text('Hall Ticket Clearance: ELIGIBLE (No shortage)', style: TextStyle(color: AppTheme.accentGreen, fontWeight: FontWeight.w700, fontSize: 11)),
                            ],
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // CIE Component Breakdown
                    Text('CIE Internal Assessment Breakdown (Max 50 M)', style: GoogleFonts.inter(fontWeight: FontWeight.w800, fontSize: 14)),
                    const SizedBox(height: 10),

                    _buildCieRow('Internal Assessment Test 1 (IAT-1)', '${course.cie1Marks} / 20.0 M', 'Conducted on July 10, 2026'),
                    _buildCieRow('Internal Assessment Test 2 (IAT-2)', '${course.cie2Marks} / 20.0 M', 'Conducted on August 04, 2026'),
                    _buildCieRow('Internal Assessment Test 3 (IAT-3)', '${course.cie3Marks} / 20.0 M', 'Conducted on August 22, 2026'),
                    _buildCieRow('Lab Practical / Assignment / Quiz', '${course.assignmentMarks} / 10.0 M', 'Evaluated continuously'),

                    const SizedBox(height: 14),

                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryLight,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppTheme.primary.withValues(alpha: 0.3)),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('TOTAL AGGREGATED CIE', style: TextStyle(color: AppTheme.primaryDark, fontWeight: FontWeight.w800, fontSize: 11)),
                              Text('(Best 2 Tests + Lab/Assignment)', style: TextStyle(fontSize: 10, color: AppTheme.textSecondary)),
                            ],
                          ),
                          Text('${course.totalCieMarks} / 50.0 M', style: const TextStyle(fontWeight: FontWeight.w900, color: AppTheme.primaryDark, fontSize: 18)),
                        ],
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Grade Predictor for SEE End-Semester Exam
                    Text('SEE Target Grade Calculator', style: GoogleFonts.inter(fontWeight: FontWeight.w800, fontSize: 14)),
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: const Color(0xFF0F172A),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('TARGETING GRADE S (90–100 Marks):', style: TextStyle(color: Color(0xFF4ADE80), fontWeight: FontWeight.w800, fontSize: 10)),
                          const SizedBox(height: 4),
                          Text(
                            'Need ${(90 - course.totalCieMarks).clamp(0, 50).toStringAsFixed(1)} / 50 M in SEE Theory Exam',
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 14),
                          ),
                          const SizedBox(height: 8),
                          const Divider(color: Colors.white24, height: 1),
                          const SizedBox(height: 8),
                          const Text('TARGETING GRADE A (80–89 Marks):', style: TextStyle(color: Color(0xFF93C5FD), fontWeight: FontWeight.w800, fontSize: 10)),
                          const SizedBox(height: 4),
                          Text(
                            'Need ${(80 - course.totalCieMarks).clamp(0, 50).toStringAsFixed(1)} / 50 M in SEE Theory Exam',
                            style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 14),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCieRow(String label, String marks, String subtitle) {
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
              Text(label, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12)),
              Text(subtitle, style: const TextStyle(color: AppTheme.textSecondary, fontSize: 10)),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: AppTheme.bgSurface,
              borderRadius: BorderRadius.circular(6),
              border: Border.all(color: AppTheme.cardBorder),
            ),
            child: Text(marks, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 11, color: AppTheme.accentBlue)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final filtered = _courses.where((c) {
      if (_selectedFilter == 'THEORY') return !c.courseCode.contains('L');
      if (_selectedFilter == 'LAB') return c.courseCode.contains('L');
      return true;
    }).toList();

    // Calculate aggregated attendance
    int totalAttended = 0;
    int totalConducted = 0;
    double totalCieSum = 0;

    for (var c in _courses) {
      totalAttended += c.attendedClasses;
      totalConducted += c.totalClasses;
      totalCieSum += c.totalCieMarks;
    }

    final aggregateAttendance = totalConducted > 0 ? (totalAttended / totalConducted) * 100 : 0.0;
    final averageCie = _courses.isNotEmpty ? totalCieSum / _courses.length : 0.0;

    return Scaffold(
      backgroundColor: AppTheme.bgBase,
      appBar: AppBar(
        title: const Text('Courses, Attendance & CIE'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.only(left: 16, right: 16, top: 16, bottom: 96),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Top Summary Radar Card ──
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.1),
                    blurRadius: 16,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('SEMESTER ATTENDANCE', style: TextStyle(color: Colors.white60, fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 0.5)),
                          const SizedBox(height: 4),
                          Text('${aggregateAttendance.toStringAsFixed(1)}%', style: const TextStyle(color: Color(0xFF4ADE80), fontWeight: FontWeight.w900, fontSize: 26)),
                          const SizedBox(height: 2),
                          Text('$totalAttended / $totalConducted Total Sessions', style: const TextStyle(color: Colors.white70, fontSize: 11)),
                        ],
                      ),
                      Container(
                        height: 50,
                        width: 1,
                        color: Colors.white24,
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('AVERAGE CIE INTERNAL', style: TextStyle(color: Colors.white60, fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 0.5)),
                          const SizedBox(height: 4),
                          Text('${averageCie.toStringAsFixed(1)} / 50', style: const TextStyle(color: Color(0xFF93C5FD), fontWeight: FontWeight.w900, fontSize: 26)),
                          const SizedBox(height: 2),
                          const Text('Passing: 20/50 M', style: TextStyle(color: Colors.white70, fontSize: 11)),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  const Divider(color: Colors.white12, height: 1),
                  const SizedBox(height: 10),
                  const Row(
                    children: [
                      Icon(Icons.verified_user, color: Color(0xFF4ADE80), size: 14),
                      SizedBox(width: 6),
                      Text(
                        'Exam Eligibility: 100% Cleared (All Courses Above 75%)',
                        style: TextStyle(color: Color(0xFF4ADE80), fontWeight: FontWeight.w700, fontSize: 11),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 18),

            // ── Filter Segment Buttons ──
            Row(
              children: [
                _buildFilterChip('ALL', 'All Courses (${_courses.length})'),
                const SizedBox(width: 8),
                _buildFilterChip('THEORY', 'Theory (5)'),
                const SizedBox(width: 8),
                _buildFilterChip('LAB', 'Lab (1)'),
              ],
            ),

            const SizedBox(height: 14),

            // ── Registered Courses List ──
            ...filtered.map((course) {
              final isAbove85 = course.attendancePercentage >= 85.0;
              final isAbove75 = course.attendancePercentage >= 75.0;

              return InkWell(
                onTap: () => _openCourseDetailsModal(course),
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.bgSurface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.cardBorder),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.02),
                        blurRadius: 6,
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Course Title & Credits
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '${course.courseCode}: ${course.courseTitle}',
                                  style: GoogleFonts.inter(fontWeight: FontWeight.w800, fontSize: 14),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  course.facultyName,
                                  style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppTheme.primaryLight,
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              '${course.credits} Credits',
                              style: const TextStyle(color: AppTheme.primaryDark, fontWeight: FontWeight.w800, fontSize: 11),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 12),
                      const Divider(height: 1),
                      const SizedBox(height: 12),

                      // Attendance & CIE 2-Column Info
                      Row(
                        children: [
                          // Column 1: Attendance
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    const Text('Attendance:', style: TextStyle(fontSize: 11, color: AppTheme.textSecondary, fontWeight: FontWeight.w600)),
                                    Text(
                                      '${course.attendancePercentage.toStringAsFixed(1)}%',
                                      style: TextStyle(
                                        fontWeight: FontWeight.w900,
                                        fontSize: 12,
                                        color: isAbove85 ? AppTheme.accentGreen : (isAbove75 ? AppTheme.accentAmber : AppTheme.accentRed),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                LinearProgressIndicator(
                                  value: course.attendancePercentage / 100,
                                  backgroundColor: Colors.grey.shade200,
                                  valueColor: AlwaysStoppedAnimation<Color>(
                                    isAbove85 ? AppTheme.accentGreen : (isAbove75 ? AppTheme.accentAmber : AppTheme.accentRed),
                                  ),
                                  minHeight: 6,
                                  borderRadius: BorderRadius.circular(3),
                                ),
                                const SizedBox(height: 4),
                                Text('${course.attendedClasses}/${course.totalClasses} classes attended', style: const TextStyle(fontSize: 10, color: AppTheme.textSecondary)),
                              ],
                            ),
                          ),

                          const SizedBox(width: 16),
                          Container(height: 36, width: 1, color: AppTheme.cardBorder),
                          const SizedBox(width: 16),

                          // Column 2: CIE Marks
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    const Text('CIE Score:', style: TextStyle(fontSize: 11, color: AppTheme.textSecondary, fontWeight: FontWeight.w600)),
                                    Text(
                                      '${course.totalCieMarks} / 50',
                                      style: const TextStyle(
                                        fontWeight: FontWeight.w900,
                                        fontSize: 12,
                                        color: AppTheme.accentBlue,
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 6),
                                LinearProgressIndicator(
                                  value: (course.totalCieMarks / 50.0).clamp(0.0, 1.0),
                                  backgroundColor: Colors.grey.shade200,
                                  valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.accentBlue),
                                  minHeight: 6,
                                  borderRadius: BorderRadius.circular(3),
                                ),
                                const SizedBox(height: 4),
                                const Text('Passing: 20/50 M (40%)', style: TextStyle(fontSize: 10, color: AppTheme.textSecondary)),
                              ],
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 10),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          Text('View Test-wise Breakdown →', style: TextStyle(color: AppTheme.primary, fontWeight: FontWeight.w700, fontSize: 11)),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            }),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip(String key, String label) {
    final isSelected = _selectedFilter == key;
    return InkWell(
      onTap: () => setState(() => _selectedFilter = key),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.primary : AppTheme.bgSurface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? AppTheme.primary : AppTheme.cardBorder,
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : AppTheme.textSecondary,
            fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
            fontSize: 11,
          ),
        ),
      ),
    );
  }
}
