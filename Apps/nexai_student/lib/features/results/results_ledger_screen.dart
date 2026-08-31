import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../models/student_models.dart';
import '../../mock_data.dart';

class ResultsLedgerScreen extends StatefulWidget {
  const ResultsLedgerScreen({super.key});

  @override
  State<ResultsLedgerScreen> createState() => _ResultsLedgerScreenState();
}

class _ResultsLedgerScreenState extends State<ResultsLedgerScreen> {
  late List<ExamResultItem> _results;

  @override
  void initState() {
    super.initState();
    _results = mockExamResults;
  }

  void _applyRevaluation(ExamResultItem item) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Apply for Re-evaluation (${item.courseCode})'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Course: ${item.courseTitle}'),
            const SizedBox(height: 8),
            Text('Current Marks: ${item.totalMarks} / 100 (Grade: ${item.gradeLetter})', style: const TextStyle(fontWeight: FontWeight.w700)),
            const SizedBox(height: 12),
            const Text('Official Re-evaluation & Photocopy Processing Fee: ₹500', style: TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(context);
              setState(() {
                _results = _results.map((r) => r.courseCode == item.courseCode ? r.copyWith(isRevaluationApplied: true) : r).toList();
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  backgroundColor: AppTheme.primaryDark,
                  content: Text('✓ Re-evaluation application submitted for ${item.courseCode}'),
                ),
              );
            },
            style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primary),
            child: const Text('Pay ₹500 & Apply ✓'),
          ),
        ],
      ),
    );
  }

  void _openScriptScans(ExamResultItem item) {
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
              decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(2)),
            ),
            Padding(
              padding: const EdgeInsets.all(18),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Evaluated Script: ${item.courseCode}', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                      Text('${item.courseTitle} (${item.scriptPagesCount} Scanned Pages)', style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary)),
                    ],
                  ),
                  IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.close)),
                ],
              ),
            ),
            const Divider(height: 1),

            Expanded(
              child: ListView.separated(
                padding: const EdgeInsets.all(16),
                itemCount: item.scriptPagesCount,
                separatorBuilder: (context, i) => const SizedBox(height: 12),
                itemBuilder: (context, i) {
                  return Container(
                    height: 280,
                    decoration: BoxDecoration(
                      color: AppTheme.bgBase,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.cardBorder),
                    ),
                    child: Stack(
                      children: [
                        Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.description, size: 48, color: AppTheme.textMuted),
                              const SizedBox(height: 8),
                              Text('Scanned Page ${i + 1} of ${item.scriptPagesCount}', style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
                              const SizedBox(height: 4),
                              const Text('Examiner Marks & AI Step Annotation Applied', style: TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
                            ],
                          ),
                        ),
                        Positioned(
                          top: 12,
                          right: 12,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppTheme.accentGreen.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: AppTheme.accentGreen.withValues(alpha: 0.5)),
                            ),
                            child: const Text('Q-Marks: +8/10 M ✓', style: TextStyle(color: AppTheme.accentGreen, fontWeight: FontWeight.w900, fontSize: 11)),
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final profile = mockStudentProfile;

    return Scaffold(
      backgroundColor: AppTheme.bgBase,
      appBar: AppBar(
        title: const Text('Academic Grade Ledger'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.only(left: 16, right: 16, top: 16, bottom: 96),
        child: Column(
          children: [
            // GPA Summary Cards
            Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(18),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('CUMULATIVE CGPA', style: TextStyle(color: Colors.white60, fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 0.5)),
                        const SizedBox(height: 6),
                        Text('${profile.cgpa}', style: const TextStyle(color: Color(0xFF4ADE80), fontWeight: FontWeight.w900, fontSize: 26)),
                        const SizedBox(height: 4),
                        const Text('All 6 Semesters', style: TextStyle(color: Colors.white70, fontSize: 11)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(18),
                    decoration: BoxDecoration(
                      color: AppTheme.primaryLight,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(color: AppTheme.primary.withValues(alpha: 0.3)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('LATEST SGPA', style: TextStyle(color: AppTheme.primaryDark, fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 0.5)),
                        const SizedBox(height: 6),
                        Text('${profile.latestSgpa}', style: const TextStyle(color: AppTheme.primaryDark, fontWeight: FontWeight.w900, fontSize: 26)),
                        const SizedBox(height: 4),
                        const Text('Fall Semester 2026', style: TextStyle(color: AppTheme.textSecondary, fontSize: 11)),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 20),

            // Subject Grade Cards
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Course-wise Performance (${_results.length})', style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                const Text('CIE + SEE = 100 M', style: TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
              ],
            ),
            const SizedBox(height: 12),

            ..._results.map((res) {
              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.bgSurface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.cardBorder),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('${res.courseCode}: ${res.courseTitle}', style: GoogleFonts.inter(fontWeight: FontWeight.w800, fontSize: 14)),
                              Text('${res.credits} Credits • CIE: ${res.cieMarks}/50 | SEE: ${res.seeMarks}/50', style: const TextStyle(color: AppTheme.textSecondary, fontSize: 11)),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: res.gradeLetter == 'S' ? const Color(0xFFDCFCE7) : const Color(0xFFEFF6FF),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            'Grade ${res.gradeLetter}',
                            style: TextStyle(
                              color: res.gradeLetter == 'S' ? const Color(0xFF166534) : const Color(0xFF1E40AF),
                              fontWeight: FontWeight.w900,
                              fontSize: 13,
                            ),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 12),
                    const Divider(height: 1),
                    const SizedBox(height: 12),

                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('Total: ${res.totalMarks} / 100 Marks', style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 13)),

                        Row(
                          children: [
                            OutlinedButton.icon(
                              onPressed: () => _openScriptScans(res),
                              icon: const Icon(Icons.menu_book, size: 14),
                              label: const Text('View Script'),
                              style: OutlinedButton.styleFrom(
                                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                textStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
                              ),
                            ),
                            const SizedBox(width: 8),
                            if (res.isRevaluationApplied)
                              const Chip(
                                label: Text('Reval Applied ✓', style: TextStyle(fontSize: 10, color: AppTheme.accentPurple, fontWeight: FontWeight.w800)),
                                backgroundColor: Color(0xFFF3E8FF),
                                padding: EdgeInsets.zero,
                              )
                            else
                              ElevatedButton(
                                onPressed: () => _applyRevaluation(res),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppTheme.accentBlue,
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  textStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
                                ),
                                child: const Text('Re-evaluate'),
                              ),
                          ],
                        ),
                      ],
                    ),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}
