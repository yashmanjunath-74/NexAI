import 'dart:io';
import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import '../../core/theme/app_theme.dart';
import '../../models/scanning_models.dart';

class RapidBookletDigitizerScreen extends StatefulWidget {
  final ConnectedScanningSession session;
  final int bookletIndex;

  const RapidBookletDigitizerScreen({
    super.key,
    required this.session,
    required this.bookletIndex,
  });

  @override
  State<RapidBookletDigitizerScreen> createState() => _RapidBookletDigitizerScreenState();
}

class _RapidBookletDigitizerScreenState extends State<RapidBookletDigitizerScreen> {
  CameraController? _cameraController;
  bool _isCameraReady = false;
  bool _cameraError = false;

  final TextEditingController _barcodeController = TextEditingController();
  final List<XFile> _capturedPages = [];
  bool _isCapturing = false;
  bool _isSealing = false;

  @override
  void initState() {
    super.initState();
    // Auto-populate barcode for fast workflow or manual scan
    _barcodeController.text = 'BC-${100000 + (widget.bookletIndex * 137) % 899999}';
    _initCamera();
  }

  Future<void> _initCamera() async {
    try {
      final cameras = await availableCameras();
      if (cameras.isEmpty) {
        setState(() => _cameraError = true);
        return;
      }

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
          _isCameraReady = true;
        });
      }
    } catch (_) {
      if (mounted) setState(() => _cameraError = true);
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
    } catch (_) {
      setState(() => _isCapturing = false);
    }
  }

  void _removePage(int index) {
    setState(() {
      _capturedPages.removeAt(index);
    });
  }

  void _sealAndSubmit() {
    if (_capturedPages.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: AppTheme.accentRed,
          content: Text('Please capture at least 1 page before sealing.'),
        ),
      );
      return;
    }

    setState(() => _isSealing = true);

    Future.delayed(const Duration(milliseconds: 900), () {
      if (!mounted) return;

      final physicalBarcode = _barcodeController.text.trim();
      final dummyBarcode = 'ANON-${widget.session.courseCode}-${physicalBarcode.replaceAll('BC-', '')}';

      final booklet = DigitizedBookletItem(
        id: 'SB-${DateTime.now().millisecondsSinceEpoch}',
        physicalBarcode: physicalBarcode,
        dummyBarcode: dummyBarcode,
        pageCount: _capturedPages.length,
        scannedAt: DateTime.now(),
        ocrClarity: 98.8,
        sha256Digest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        pageFilePaths: _capturedPages.map((f) => f.path).toList(),
      );

      Navigator.pop(context, booklet);
    });
  }

  @override
  void dispose() {
    _cameraController?.dispose();
    _barcodeController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final pageNum = _capturedPages.length + 1;

    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Column(
          children: [
            // Top Bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              color: const Color(0xFF0F172A),
              child: Row(
                children: [
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close, color: Colors.white),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppTheme.primary,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                'BOOKLET #${widget.bookletIndex}',
                                style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.w900),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              '${widget.session.courseCode} • ${widget.session.hallNumber}',
                              style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w600),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            const Icon(Icons.qr_code, size: 14, color: AppTheme.accentGreen),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                _barcodeController.text,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w800,
                                  fontSize: 13,
                                  fontFamily: 'monospace',
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  if (_capturedPages.isNotEmpty)
                    ElevatedButton(
                      onPressed: _isSealing ? null : _sealAndSubmit,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.accentGreen,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      child: _isSealing
                          ? const SizedBox(
                              height: 16,
                              width: 16,
                              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                            )
                          : Text(
                              'Seal & Upload (${_capturedPages.length}p) ✓',
                              style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 11),
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
                  if (_isCameraReady && _cameraController != null && !_cameraError)
                    SizedBox.expand(
                      child: CameraPreview(_cameraController!),
                    )
                  else if (_cameraError)
                    const Center(
                      child: Text(
                        'Camera unavailable.\nPlease grant permissions.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: Colors.white),
                      ),
                    )
                  else
                    const Center(
                      child: CircularProgressIndicator(color: AppTheme.primary),
                    ),

                  // Document Bounding Reticle
                  if (_isCameraReady)
                    Container(
                      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
                      decoration: BoxDecoration(
                        border: Border.all(color: AppTheme.accentGreen.withValues(alpha: 0.8), width: 2.5),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Stack(
                        children: [
                          Positioned(
                            top: 10,
                            left: 10,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.black.withValues(alpha: 0.6),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                'READY: PAGE $pageNum',
                                style: const TextStyle(color: AppTheme.accentGreen, fontSize: 11, fontWeight: FontWeight.w900),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                  // Flash capture indicator
                  if (_isCapturing)
                    Container(color: Colors.white.withValues(alpha: 0.45)),
                ],
              ),
            ),

            // Bottom Controller Bar & Thumbnails Gallery
            Container(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 20),
              decoration: const BoxDecoration(
                color: Color(0xFF0F172A),
                borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
              ),
              child: Column(
                children: [
                  // Page Thumbnails Strip
                  if (_capturedPages.isNotEmpty)
                    Container(
                      height: 85,
                      margin: const EdgeInsets.only(bottom: 14),
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: _capturedPages.length,
                        itemBuilder: (context, idx) {
                          return Stack(
                            children: [
                              Container(
                                width: 62,
                                margin: const EdgeInsets.only(right: 10),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(color: AppTheme.primary, width: 1.5),
                                  image: DecorationImage(
                                    image: FileImage(File(_capturedPages[idx].path)),
                                    fit: BoxFit.cover,
                                  ),
                                ),
                              ),
                              Positioned(
                                top: 2,
                                right: 12,
                                child: InkWell(
                                  onTap: () => _removePage(idx),
                                  child: Container(
                                    padding: const EdgeInsets.all(3),
                                    decoration: const BoxDecoration(color: Colors.black87, shape: BoxShape.circle),
                                    child: const Icon(Icons.close, size: 12, color: Colors.white),
                                  ),
                                ),
                              ),
                              Positioned(
                                bottom: 2,
                                left: 2,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                                  decoration: BoxDecoration(
                                    color: Colors.black87,
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text('P${idx + 1}', style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.w800)),
                                ),
                              ),
                            ],
                          );
                        },
                      ),
                    )
                  else
                    const Padding(
                      padding: EdgeInsets.only(bottom: 14),
                      child: Text(
                        'Align paper inside the green frame & tap shutter to capture.',
                        style: TextStyle(color: Colors.white70, fontSize: 12),
                      ),
                    ),

                  // Giant Shutter Button
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      InkWell(
                        onTap: _capturePage,
                        borderRadius: BorderRadius.circular(40),
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
                              child: const Icon(Icons.camera_alt, color: AppTheme.primaryDark, size: 28),
                            ),
                          ),
                        ),
                      ),
                    ],
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
