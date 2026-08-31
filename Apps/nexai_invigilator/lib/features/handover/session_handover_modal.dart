import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../models/exam_models.dart';

class SessionHandoverModal extends StatefulWidget {
  final InvigilatorSession session;
  final VoidCallback onHandoverCompleted;

  const SessionHandoverModal({
    super.key,
    required this.session,
    required this.onHandoverCompleted,
  });

  @override
  State<SessionHandoverModal> createState() => _SessionHandoverModalState();
}

class _SessionHandoverModalState extends State<SessionHandoverModal> {
  bool _isSealing = false;
  bool _isSealed = false;

  void _handleSealSession() {
    setState(() => _isSealing = true);
    Future.delayed(const Duration(milliseconds: 1200), () {
      setState(() {
        _isSealing = false;
        _isSealed = true;
      });
      Future.delayed(const Duration(milliseconds: 1000), () {
        widget.onHandoverCompleted();
        if (mounted) Navigator.pop(context);
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final session = widget.session;

    return Container(
      height: MediaQuery.of(context).size.height * 0.88,
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
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryLight,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.verified_user, color: AppTheme.primary, size: 22),
                    ),
                    const SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Session Sealing & Handover',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800),
                        ),
                        Text(
                          'Reconcile Attendance & Seal Bundle',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(fontSize: 12),
                        ),
                      ],
                    ),
                  ],
                ),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(Icons.close, color: AppTheme.textSecondary),
                ),
              ],
            ),
          ),
          const Divider(height: 1),

          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  // Session Summary Header Card
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.bgDark,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${session.courseCode} — ${session.courseTitle}',
                          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 14),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '${session.hallNumber} • ${session.timeSlot}',
                          style: const TextStyle(color: Colors.white70, fontSize: 12),
                        ),
                        const SizedBox(height: 14),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            _buildStatBadge('Total', '${session.totalCount}', AppTheme.accentBlue),
                            _buildStatBadge('Present', '${session.presentCount}', AppTheme.accentGreen),
                            _buildStatBadge('Absent', '${session.absentCount}', AppTheme.accentAmber),
                            _buildStatBadge('Malpractice', '${session.malpracticeCount}', AppTheme.accentRed),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Bundle Packing Status
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppTheme.bgBase,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppTheme.cardBorder),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            const Text(
                              'Answer Booklets Ingested:',
                              style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                            ),
                            Text(
                              '${session.bookletsIngestedCount} / ${session.presentCount} Booklets',
                              style: const TextStyle(fontWeight: FontWeight.w900, color: AppTheme.primaryDark),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        ClipRRect(
                          borderRadius: BorderRadius.circular(6),
                          child: LinearProgressIndicator(
                            value: session.presentCount > 0
                                ? session.bookletsIngestedCount / session.presentCount
                                : 1.0,
                            backgroundColor: Colors.grey.shade300,
                            valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.primary),
                            minHeight: 8,
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Cryptographic Seal Notice
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: const Color(0xFFF0FDF4),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: const Color(0xFFBBF7D0)),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Row(
                          children: [
                            Icon(Icons.lock_clock, color: Color(0xFF166534), size: 20),
                            SizedBox(width: 8),
                            Text(
                              'Cryptographic Digital Handover',
                              style: TextStyle(fontWeight: FontWeight.w800, color: Color(0xFF166534), fontSize: 13),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text(
                          'Sealing digitally signs the attendance ledger with Invigilator ${session.chiefInvigilatorName}\'s private token and dispatches the bundle directly to the Central Scrutinizer.',
                          style: const TextStyle(fontSize: 11, color: Color(0xFF166534), height: 1.4),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Seal Button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: (_isSealing || _isSealed) ? null : _handleSealSession,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _isSealed ? AppTheme.accentGreen : AppTheme.primary,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(_isSealed ? Icons.check_circle : (_isSealing ? Icons.hourglass_top : Icons.lock), color: Colors.white, size: 18),
                          const SizedBox(width: 8),
                          Text(
                            _isSealed ? 'Session Sealed & Dispatched ✓' : (_isSealing ? 'Cryptographically Sealing...' : 'Cryptographically Seal & Handover →'),
                            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatBadge(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.18),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        children: [
          Text(value, style: TextStyle(color: color, fontWeight: FontWeight.w900, fontSize: 15)),
          Text(label, style: const TextStyle(color: Colors.white70, fontSize: 10)),
        ],
      ),
    );
  }
}
