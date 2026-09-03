import 'package:flutter/material.dart';
import 'core/theme/app_theme.dart';
import 'features/auth/session_key_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const NexAIScannerApp());
}

class NexAIScannerApp extends StatelessWidget {
  const NexAIScannerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NexAI Scanner Workstation',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const SessionKeyScreen(),
    );
  }
}
