import 'dart:io';
import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../core/theme/app_theme.dart';
import '../../models/exam_models.dart';

class BookletDigitizationScanner extends StatefulWidget {
  final StudentDeskItem student;
  final String barcode;
  final String dummyBarcode;

  const BookletDigitizationScanner({
    super.key,
    required this.student,
    required this.barcode,
    required this.dummyBarcode,
  });

  @override
  State<BookletDigitizationScanner> createState() => _BookletDigitizationScannerState();
}

class _BookletDigitizationScannerState extends State<BookletDigitizationScanner> {
  CameraController? _cameraController;
  bool _isCameraInitialized = false;
  bool _hasCameraError = false;
  final List<XFile> _capturedPages = [];
  bool _isCapturing = false;

  @override
  void initState() {
    super.initState();
    _initializeCamera();
  }

  Future<void> _initializeCamera() async {
    try {
      final cameras = await availableCameras();
      if (cameras.isEmpty) {
        setState(() => _hasCameraError = true);
        return;
      }
      
      // Prefer back camera for document scanning
      final backCamera = cameras.firstWhere(
        (cam) => cam.lensDirection == CameraLensDirection.back,
        orElse: () => cameras.first,
      );

      final controller = CameraController(
        backCamera,
        ResolutionPreset.high,
        enableAudio: false,
      );

      await controller.initialize();
      if (mounted) {
        setState(() {
          _cameraController = controller;
          _isCameraInitialized = true;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() => _hasCameraError = true);
      }
    }
  }

  Future<void> _capturePage() async {
    if (_cameraController == null || !_cameraController!.value.isInitialized || _isCapturing) return;

    setState(() => _isCapturing = true);

    try {
      final file = await _cameraController!.takePicture();
      setState(() {
        _capturedPages.add(file);
        _isCapturing = false;
      });
    } catch (e) {
      setState(() => _isCapturing = false);
    }
  }

  void _removePage(int index) {
    setState(() {
      _capturedPages.removeAt(index);
    });
  }

  void _submitDigitalBooklet() {
    if (_capturedPages.isEmpty) return;
    Navigator.pop(context, _capturedPages.length);
  }

  @override
  void dispose() {
    _cameraController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Column(
          children: [
            // Top Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close, color: Colors.white, size: 28),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Digitize Booklet',
                          style: GoogleFonts.inter(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 16),
                        ),
                        Text(
                          'Student: ${widget.student.studentName} | ${widget.student.usn}',
                          style: const TextStyle(color: Colors.white70, fontSize: 11),
                        ),
                        Text(
                          'Barcode: ${widget.dummyBarcode}',
                          style: const TextStyle(color: AppTheme.accentGreen, fontSize: 10, fontWeight: FontWeight.w800),
                        ),
                      ],
                    ),
                  ),
                  if (_capturedPages.isNotEmpty)
                    ElevatedButton.icon(
                      onPressed: _submitDigitalBooklet,
                      icon: const Icon(Icons.cloud_upload, size: 16),
                      label: Text('Submit (${_capturedPages.length})'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      ),
                    ),
                ],
              ),
            ),

            // Camera Viewport
            Expanded(
              child: Stack(
                alignment: Alignment.center,
                children: [
                  if (_isCameraInitialized && _cameraController != null && !_hasCameraError)
                    SizedBox.expand(
                      child: CameraPreview(_cameraController!),
                    )
                  else if (_hasCameraError)
                    const Center(child: Text('Camera unavailable. Are permissions granted?', style: TextStyle(color: Colors.white)))
                  else
                    const Center(child: CircularProgressIndicator(color: AppTheme.primary)),

                  // Document Alignment Guide overlay
                  if (_isCameraInitialized)
                    Container(
                      margin: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        border: Border.all(color: AppTheme.accentGreen.withValues(alpha: 0.5), width: 2),
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),

                  // Capturing flash effect
                  if (_isCapturing)
                    Container(color: Colors.white.withValues(alpha: 0.4)),
                ],
              ),
            ),

            // Bottom Actions & Gallery
            Container(
              padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
              decoration: const BoxDecoration(
                color: Color(0xFF131C2E),
                borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              ),
              child: Column(
                children: [
                  // Thumbnails Gallery
                  if (_capturedPages.isNotEmpty)
                    SizedBox(
                      height: 90,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: _capturedPages.length,
                        itemBuilder: (context, index) {
                          return Stack(
                            children: [
                              Container(
                                width: 65,
                                margin: const EdgeInsets.only(right: 12),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(color: AppTheme.cardBorder),
                                  image: DecorationImage(
                                    image: FileImage(File(_capturedPages[index].path)),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                              Positioned(
                                top: 4,
                                right: 16,
                                child: InkWell(
                                  onTap: () => _removePage(index),
                                  child: Container(
                                    padding: const EdgeInsets.all(4),
                                    decoration: const BoxDecoration(
                                      color: Colors.black54,
                                      shape: BoxShape.circle,
                                    ),
                                    child: const Icon(Icons.close, color: Colors.white, size: 14),
                                  ),
                                ),
                              ),
                              Positioned(
                                bottom: 4,
                                left: 4,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: Colors.black87,
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text('P${index + 1}', style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.w800)),
                                ),
                              ),
                            ],
                          );
                        },
                      ),
                    )
                  else
                    const Padding(
                      padding: EdgeInsets.only(bottom: 24),
                      child: Text('Align physical page inside the green box and capture.', style: TextStyle(color: Colors.white60, fontSize: 12)),
                    ),
                  
                  if (_capturedPages.isNotEmpty) const SizedBox(height: 16),

                  // Shutter Button
                  InkWell(
                    onTap: _capturePage,
                    child: Container(
                      width: 72,
                      height: 72,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        border: Border.all(color: Colors.white, width: 4),
                        color: _isCapturing ? Colors.white54 : Colors.transparent,
                      ),
                      child: Center(
                        child: Container(
                          width: 56,
                          height: 56,
                          decoration: const BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 10),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
