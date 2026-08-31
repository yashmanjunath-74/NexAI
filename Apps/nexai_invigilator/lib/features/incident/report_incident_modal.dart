import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../models/exam_models.dart';

class ReportIncidentModal extends StatefulWidget {
  final List<StudentDeskItem> presentStudents;
  final Function(IncidentReportItem incident) onIncidentReported;

  const ReportIncidentModal({
    super.key,
    required this.presentStudents,
    required this.onIncidentReported,
  });

  @override
  State<ReportIncidentModal> createState() => _ReportIncidentModalState();
}

class _ReportIncidentModalState extends State<ReportIncidentModal> {
  StudentDeskItem? _selectedStudent;
  String _selectedInfraction = 'Unauthorized Notes / Micro-chits';
  final _descriptionController = TextEditingController();
  bool _isBroadcasting = false;

  final List<String> _infractionTypes = [
    'Unauthorized Notes / Micro-chits',
    'Electronic Device / Smart Watch / Phone',
    'Impersonation / Fake ID',
    'Disruptive Behavior / Talking',
    'Tampered Answer Booklet Seal',
  ];

  @override
  void initState() {
    super.initState();
    if (widget.presentStudents.isNotEmpty) {
      _selectedStudent = widget.presentStudents.first;
    }
  }

  void _handleSubmitIncident() {
    if (_selectedStudent == null) return;

    setState(() {
      _isBroadcasting = true;
    });

    Future.delayed(const Duration(milliseconds: 1000), () {
      final newIncident = IncidentReportItem(
        id: 'INC_${DateTime.now().millisecondsSinceEpoch}',
        deskId: _selectedStudent!.deskId,
        studentUsn: _selectedStudent!.usn,
        studentName: _selectedStudent!.studentName,
        infractionType: _selectedInfraction,
        description: _descriptionController.text.trim().isEmpty
            ? 'Candidate flagged for $_selectedInfraction during invigilator hall sweep.'
            : _descriptionController.text.trim(),
        timestamp: '${TimeOfDay.now().hour}:${TimeOfDay.now().minute.toString().padLeft(2, '0')} IST',
        isBroadcastedToCoE: true,
      );

      widget.onIncidentReported(newIncident);
      if (mounted) {
        Navigator.pop(context);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: AppTheme.accentRed,
            content: Text('⚠️ Malpractice Incident Broadcasted to CoE for ${_selectedStudent!.usn}'),
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
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
                        color: AppTheme.accentRed.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(Icons.warning_amber_rounded, color: AppTheme.accentRed, size: 22),
                    ),
                    const SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Report Malpractice Incident',
                          style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w800),
                        ),
                        Text(
                          'Broadcast Incident to Chief Superintendent',
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
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Candidate Select
                  Text(
                    'Select Candidate Involved:',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 8),
                  DropdownButtonFormField<StudentDeskItem>(
                    value: _selectedStudent,
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: AppTheme.bgBase,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: AppTheme.cardBorder),
                      ),
                    ),
                    items: widget.presentStudents.map((student) {
                      return DropdownMenuItem(
                        value: student,
                        child: Text('${student.deskId}: ${student.studentName} (${student.usn})'),
                      );
                    }).toList(),
                    onChanged: (val) => setState(() => _selectedStudent = val),
                  ),

                  const SizedBox(height: 18),

                  // Infraction Category
                  Text(
                    'Infraction Classification:',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 8),
                  DropdownButtonFormField<String>(
                    value: _selectedInfraction,
                    decoration: InputDecoration(
                      filled: true,
                      fillColor: AppTheme.bgBase,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: AppTheme.cardBorder),
                      ),
                    ),
                    items: _infractionTypes.map((type) {
                      return DropdownMenuItem(
                        value: type,
                        child: Text(type),
                      );
                    }).toList(),
                    onChanged: (val) => setState(() => _selectedInfraction = val!),
                  ),

                  const SizedBox(height: 18),

                  // Photo Evidence Preview
                  Text(
                    'Photo Evidence Attachment:',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 8),
                  Container(
                    width: double.infinity,
                    height: 110,
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEF2F2),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFFFECDD3), width: 1.5),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.camera_alt, color: AppTheme.accentRed, size: 28),
                        const SizedBox(width: 12),
                        Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Evidence Snapshot Captured ✓',
                              style: TextStyle(fontWeight: FontWeight.w800, color: AppTheme.accentRed, fontSize: 13),
                            ),
                            Text(
                              'Geo-tagged & Timestamped (${TimeOfDay.now().format(context)})',
                              style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 18),

                  // Description / Notes
                  Text(
                    'Invigilator Incident Narrative:',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(fontWeight: FontWeight.w700),
                  ),
                  const SizedBox(height: 8),
                  TextFormField(
                    controller: _descriptionController,
                    maxLines: 3,
                    decoration: InputDecoration(
                      hintText: 'Describe where and how the unauthorized material was confiscated...',
                      hintStyle: const TextStyle(fontSize: 12, color: AppTheme.textMuted),
                      filled: true,
                      fillColor: AppTheme.bgBase,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: AppTheme.cardBorder),
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Submit Broadcast Button
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: (_selectedStudent == null || _isBroadcasting) ? null : _handleSubmitIncident,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.accentRed,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(_isBroadcasting ? Icons.hourglass_top : Icons.send, color: Colors.white, size: 18),
                          const SizedBox(width: 8),
                          Text(
                            _isBroadcasting ? 'Broadcasting Alert...' : 'Broadcast Alert to CoE Command Center ⚠️',
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
}
